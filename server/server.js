const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, checkKYC, checkSuitability, checkConcentration, check2FA, JWT_SECRET } = require('./auth.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', (req, res) => {
    const { walletAddress, password } = req.body;
    if (!walletAddress || !password) return res.status(400).json({ message: "Wallet address and password are required." });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: "Error hashing password." });
        const id = uuidv4();
        db.run('INSERT INTO users (id, walletAddress, password) VALUES (?, ?, ?)', [id, walletAddress, hash], function(err) {
            if (err) return res.status(409).json({ message: "Wallet address already registered." });
            res.status(201).json({ message: "User registered successfully.", userId: id });
        });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { walletAddress, password } = req.body;
    db.get('SELECT * FROM users WHERE walletAddress = ?', [walletAddress], (err, user) => {
        if (err || !user) return res.status(404).json({ message: "User not found." });
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ message: "Invalid credentials." });
            const token = jwt.sign({ id: user.id, walletAddress: user.walletAddress }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        });
    });
});


// --- BOND & TOKENIZATION ROUTES ---
app.post('/api/tokenizeBond', verifyToken, (req, res) => {
    const { issuer, symbol, couponRate, maturityDate, totalSupply, initialRating, riskTier } = req.body;
    const id = `BOND-${uuidv4()}`;
    db.run(
        'INSERT INTO bonds (id, issuer, symbol, couponRate, maturityDate, totalSupply, initialRating, riskTier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, issuer, symbol.toUpperCase(), couponRate, maturityDate, totalSupply, initialRating, riskTier],
        function(err) {
            if (err) return res.status(500).json({ message: "Failed to tokenize bond.", error: err.message });
            res.status(201).json({ message: "Bond tokenized successfully.", bondId: id, totalSupply });
        }
    );
});

app.get('/api/bonds', (req, res) => {
    db.all('SELECT * FROM bonds', [], (err, bonds) => {
        if (err) return res.status(500).json({ message: "Failed to fetch bonds.", error: err.message });
        res.json(bonds);
    });
});

// --- TRADING & ORDER BOOK ROUTES ---
app.get('/api/orderBook/:bondId', (req, res) => {
    const { bondId } = req.params;
    const bidsQuery = "SELECT id, quantity, price FROM orders WHERE bondId = ? AND type = 'BID' ORDER BY price DESC";
    const asksQuery = "SELECT id, quantity, price FROM orders WHERE bondId = ? AND type = 'ASK' ORDER BY price ASC";

    db.all(bidsQuery, [bondId], (err, bids) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all(asksQuery, [bondId], (err, asks) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ bids, asks });
        });
    });
});

const matchOrders = async (bondId) => {
    // Simplified matching engine
    const findMatchingOrders = () => new Promise((resolve, reject) => {
         db.get(`
            SELECT b.id as bidId, b.userId as buyerId, b.quantity as bidQty, b.price as bidPrice,
                   a.id as askId, a.userId as sellerId, a.quantity as askQty, a.price as askPrice
            FROM orders b, orders a
            WHERE b.bondId = ? AND a.bondId = ?
            AND b.type = 'BID' AND a.type = 'ASK'
            AND b.price >= a.price
            ORDER BY b.price DESC, b.timestamp ASC, a.price ASC, a.timestamp ASC
            LIMIT 1
        `, [bondId, bondId], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });

    let match = await findMatchingOrders();
    while (match) {
        const tradeQuantity = Math.min(match.bidQty, match.askQty);
        const tradePrice = match.bidPrice; // Execute at the bid price (can be ask price or midpoint too)
        const tradeValue = tradeQuantity * tradePrice;

        db.serialize(() => {
            const tradeId = `TRD-${uuidv4()}`;
            // Begin transaction
            db.run('BEGIN TRANSACTION');

            // 1. Log the trade
            db.run('INSERT INTO trades (id, bondId, buyerId, sellerId, quantity, price, value, flags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [tradeId, bondId, match.buyerId, match.sellerId, tradeQuantity, tradePrice, tradeValue, '[]']
            );
            
            // 2. Update balances
            db.run('UPDATE balances SET amount = amount - ? WHERE userId = ? AND asset = ?', [tradeValue, match.buyerId, 'USDC']);
            db.run('UPDATE balances SET amount = amount + ? WHERE userId = ? AND asset = ?', [tradeValue, match.sellerId, 'USDC']);
            // bond asset logic here...

            // 3. Update or delete orders
            if (match.bidQty > tradeQuantity) {
                db.run('UPDATE orders SET quantity = quantity - ? WHERE id = ?', [tradeQuantity, match.bidId]);
            } else {
                db.run('DELETE FROM orders WHERE id = ?', [match.bidId]);
            }
            if (match.askQty > tradeQuantity) {
                db.run('UPDATE orders SET quantity = quantity - ? WHERE id = ?', [tradeQuantity, match.askId]);
            } else {
                db.run('DELETE FROM orders WHERE id = ?', [match.askId]);
            }

            // 4. Reward points
            const points = Math.round(tradeValue / 100); // 1 point per $100 traded
            db.run('UPDATE users SET bondPoints = bondPoints + ? WHERE id IN (?, ?)', [points, match.buyerId, match.sellerId]);
            
            // Commit transaction
            db.run('COMMIT');
        });

        console.log(`Matched trade for bond ${bondId}: ${tradeQuantity} units at $${tradePrice}`);
        match = await findMatchingOrders(); // Check for more matches
    }
};

app.post('/api/placeOrder', [verifyToken, checkKYC, checkSuitability, checkConcentration, check2FA], (req, res) => {
    const { bondId, type, quantity, price } = req.body;
    const userId = req.user.id;
    const orderId = `ORD-${uuidv4()}`;

    // Basic validation
    if (!['BID', 'ASK'].includes(type) || !(quantity > 0) || !(price > 0)) {
        return res.status(400).json({ message: "Invalid order parameters." });
    }
    
    // In a real app, you would check user balances before placing the order
    
    db.run(
        'INSERT INTO orders (id, bondId, userId, type, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, bondId, userId, type, quantity, price],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Order placed successfully.", orderId });
            
            // Trigger matching engine asynchronously
            matchOrders(bondId).catch(console.error);
        }
    );
});


// --- COMPLIANCE & SEBI OVERSIGHT ---
app.get('/api/complianceLog', verifyToken, (req, res) => {
    // In a real app, this route would be restricted to regulator roles
    const query = `
        SELECT t.id, t.timestamp, b.symbol as bondSymbol, u_buyer.walletAddress as buyerWallet, u_seller.walletAddress as sellerWallet, t.quantity, t.price, t.value, b.riskTier
        FROM trades t
        JOIN bonds b ON t.bondId = b.id
        JOIN users u_buyer ON t.buyerId = u_buyer.id
        JOIN users u_seller ON t.sellerId = u_seller.id
        ORDER BY t.timestamp DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const HIGH_VALUE_TRADE_USD = 5000000 / 83; // 50 Lakh INR in USD

        const logWithFlags = rows.map(row => {
            const flags = [];
            if (row.value > HIGH_VALUE_TRADE_USD) {
                flags.push('Large Value Trade');
            }
            if (row.riskTier === 'High') {
                flags.push('High-Risk Asset');
            }
            return { ...row, flags, alert: flags.length > 0 };
        });

        if (req.query.format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment('compliance_report.csv');
            const headers = "ID,Timestamp,Bond,Value(USD),Flags\n";
            const csvRows = logWithFlags.map(log => `${log.id},${log.timestamp},${log.bondSymbol},${log.value},"${log.flags.join(', ')}"`).join('\n');
            return res.send(headers + csvRows);
        }

        res.json(logWithFlags);
    });
});

// --- KYC & SUITABILITY ROUTES ---
app.post('/api/verifyKYC', verifyToken, (req, res) => {
    // Mock verification
    const { pan } = req.body;
    if (!pan) return res.status(400).json({ message: "PAN details are required." });

    db.run("UPDATE users SET kycStatus = 'Verified' WHERE id = ?", [req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "KYC status updated to Verified." });
    });
});

app.post('/api/updateSuitability', verifyToken, (req, res) => {
    const { riskProfile } = req.body;
     if (!['Conservative', 'Moderate', 'Aggressive'].includes(riskProfile)) {
        return res.status(400).json({ message: "Invalid risk profile." });
    }
    db.run("UPDATE users SET riskProfile = ? WHERE id = ?", [riskProfile, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Risk profile updated to ${riskProfile}.` });
    });
});

// --- ANALYTICS & REWARDS ---
app.get('/api/analytics', (req, res) => {
    // Mock analytics for demonstration
     const MOCK_ANALYTICS = {
        totalVolume24h: 1250000,
        totalValueLocked: 78000000,
        activeBonds: 4,
    };
    res.json(MOCK_ANALYTICS);
});

app.get('/api/rewards', verifyToken, (req, res) => {
    const leaderboardQuery = "SELECT walletAddress, bondPoints FROM users ORDER BY bondPoints DESC LIMIT 10";
    db.all(leaderboardQuery, [], (err, leaderboard) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.get("SELECT bondPoints FROM users WHERE id = ?", [req.user.id], (err, user) => {
            if (err || !user) return res.status(500).json({ error: err.message });
            res.json({
                userPoints: user.bondPoints,
                leaderboard
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
