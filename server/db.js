const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const DB_SOURCE = "liquidibond.sqlite";

let db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // USERS TABLE
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                walletAddress TEXT UNIQUE,
                password TEXT,
                kycStatus TEXT DEFAULT 'Unverified',
                riskProfile TEXT DEFAULT 'Unassessed',
                bondPoints INTEGER DEFAULT 0
            )`, (err) => {
                if (err) console.error("Error creating users table", err);
                else {
                    // Create a default user for testing
                    const defaultWallet = '0x1A2bc3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0';
                    const defaultPassword = 'password123';
                    db.get('SELECT * FROM users WHERE walletAddress = ?', [defaultWallet], (err, row) => {
                        if (!row) {
                            bcrypt.hash(defaultPassword, 10, (err, hash) => {
                                db.run('INSERT INTO users (id, walletAddress, password, bondPoints) VALUES (?, ?, ?, ?)', [uuidv4(), defaultWallet, hash, 1350]);
                                console.log(`Created default user. Wallet: ${defaultWallet}, Password: ${defaultPassword}`);
                            });
                        }
                    });
                }
            });

            // BONDS TABLE
            db.run(`CREATE TABLE IF NOT EXISTS bonds (
                id TEXT PRIMARY KEY,
                issuer TEXT,
                symbol TEXT UNIQUE,
                couponRate REAL,
                maturityDate TEXT,
                totalSupply INTEGER,
                initialRating TEXT,
                riskTier TEXT
            )`);

            // ORDERS TABLE
            db.run(`CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                bondId TEXT,
                userId TEXT,
                type TEXT,
                quantity REAL,
                price REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(bondId) REFERENCES bonds(id),
                FOREIGN KEY(userId) REFERENCES users(id)
            )`);
            
            // IMMUTABLE TRADE LOG TABLE
            db.run(`CREATE TABLE IF NOT EXISTS trades (
                id TEXT PRIMARY KEY,
                bondId TEXT,
                bondSymbol TEXT,
                buyerId TEXT,
                sellerId TEXT,
                quantity REAL,
                price REAL,
                value REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                flags TEXT
            )`);

            // BALANCES TABLE (Tracks user holdings)
            db.run(`CREATE TABLE IF NOT EXISTS balances (
                userId TEXT,
                asset TEXT,
                amount REAL,
                PRIMARY KEY(userId, asset),
                FOREIGN KEY(userId) REFERENCES users(id)
            )`);
        });
    }
});

module.exports = db;
