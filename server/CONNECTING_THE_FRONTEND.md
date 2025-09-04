# Connecting the LiquidiBond Frontend to the Backend

This guide provides `axios` examples to help you connect your existing React components to the new Node.js backend. You'll need to install axios (`npm install axios`) in your frontend project first.

**Base API URL:** `http://localhost:3001`

---

## 1. Authentication (`App.tsx`)

Your `handleConnectWallet` function needs to be updated to log the user in and store the JWT.

```typescript
// You'll need a state to store the auth token
const [authToken, setAuthToken] = useState<string | null>(null);

const handleConnectWallet = async () => {
    // This is a MOCK login. Replace with actual wallet connection and signing.
    const walletAddress = '0x1A2bc3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0';
    const password = 'password123'; // In a real app, you'd get a signed message, not a password.

    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', { walletAddress, password });
        const { token, user } = response.data;
        
        setAuthToken(token);
        // Store token in localStorage to persist login
        localStorage.setItem('authToken', token);

        // Update user profile from server response
        setUserProfile({
            walletAddress: user.walletAddress,
            balance: { eth: 10.5, usdc: 25000, bondPoints: user.bondPoints, lbt: { APXI: 50, QSL: 100 } }, // Keep mock balances for now
            kyc: { status: user.kycStatus },
            riskProfile: user.riskProfile,
        });

        if (user.kycStatus === 'Unverified') {
            setTimeout(() => setIsKycModalOpen(true), 500);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Failed to connect wallet. See console for details.");
    }
};

const handleDisconnectWallet = () => {
    setUserProfile(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
};
```

---

## 2. Fetching Data (`App.tsx`)

Replace the `MOCK_BONDS` with a `useEffect` hook to fetch from the API.

```typescript
import axios from 'axios';

// Inside App component
const [bonds, setBonds] = useState<Bond[]>([]);
// ... other states

useEffect(() => {
    // Fetch bonds when the component mounts
    const fetchBonds = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/bonds');
            // We need to fetch order book data for each bond
            const bondsWithOrders = await Promise.all(response.data.map(async (bond) => {
                const orderBookRes = await axios.get(`http://localhost:3001/api/orderBook/${bond.id}`);
                return { ...bond, ...orderBookRes.data };
            }));
            setBonds(bondsWithOrders);
        } catch (error) {
            console.error("Failed to fetch bonds:", error);
        }
    };

    fetchBonds();
}, []); // Empty dependency array means this runs once on mount
```

---

## 3. Tokenize Bond (`TokenizeBondModal.tsx`)

Update the `onTokenize` prop to call the backend. You'll need to pass the auth token.

```typescript
// In App.tsx, update the handleTokenizeBond function
const handleTokenizeBond = async (newBondData: Omit<Bond, 'id' | 'bids' | 'asks'>) => {
    if (!authToken) {
        alert("You must be logged in to tokenize a bond.");
        return;
    }
    try {
        await axios.post('http://localhost:3001/api/tokenizeBond', newBondData, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        // Refresh bond list after tokenizing
        // You would typically refetch the bonds list here.
        alert("Bond tokenized successfully!");
        setIsTokenizeModalOpen(false);
    } catch (error) {
        console.error("Tokenization failed:", error);
        alert("Failed to tokenize bond.");
    }
};
```

---

## 4. Place Order (`App.tsx`)

Update `handlePlaceOrder` to send the order to the backend.

```typescript
// In App.tsx
const handlePlaceOrder = async (bondId: string, order: Omit<Order, 'id'>) => {
    if (!authToken) {
        alert("Please connect your wallet to place an order.");
        return;
    }

    try {
        const orderPayload = {
            bondId: bondId,
            type: order.type,
            quantity: order.amount,
            price: order.price,
            // For 2FA, you would collect OTP if needed and include it here
            // otp: '123456' 
        };

        await axios.post('http://localhost:3001/api/placeOrder', orderPayload, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        alert("Order placed successfully!");
        // You should refetch the order book for the specific bond to see the update
    } catch (error) {
        console.error("Failed to place order:", error);
        // Handle specific error codes from the backend
        if (error.response?.data?.errorCode === 'KYC_REQUIRED') {
            setIsKycModalOpen(true);
        } else {
            alert(`Error: ${error.response?.data?.message || "Could not place order."}`);
        }
    }
};
```

---

## 5. KYC Verification (`KYCModal.tsx`)

Update the `onSuccess` handler to call the backend.

```typescript
// In App.tsx, which passes the handler down
const handleKycSuccess = async () => {
    if (!authToken) return;

    try {
        await axios.post('http://localhost:3001/api/verifyKYC', 
            { pan: 'ABCDE1234F' }, // Mock PAN
            { headers: { 'Authorization': `Bearer ${authToken}` } }
        );

        setUserProfile(prev => prev ? { ...prev, kyc: { ...prev.kyc, status: 'Verified' } } : null);
        setIsKycModalOpen(false);
        setTimeout(() => setIsSuitabilityModalOpen(true), 500);
    } catch (error) {
        console.error("KYC verification failed:", error);
        alert("KYC verification failed.");
    }
};
```

---

## 6. Compliance Dashboard (`ComplianceDashboard.tsx`)

This component needs to fetch data from the `/api/complianceLog` endpoint.

```typescript
// In App.tsx
useEffect(() => {
    const fetchTradeLog = async () => {
        if (currentPage === 'compliance' && authToken) {
            try {
                const response = await axios.get('http://localhost:3001/api/complianceLog', {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                // Note: The backend response structure might be different from your 'TradeLogEntry' type.
                // You may need to map the response data to fit your frontend type.
                setTradeLog(response.data); 
            } catch (error) {
                console.error("Failed to fetch compliance log:", error);
            }
        }
    };

    fetchTradeLog();
}, [currentPage, authToken]);

// The CSV export button in ComplianceDashboard.tsx can be simplified:
const exportCSV = () => {
    // The backend now handles CSV generation.
    const token = localStorage.getItem('authToken'); // Assuming you store it
    window.open(`http://localhost:3001/api/complianceLog?format=csv&token=${token}`, '_blank');
    // Note: Passing token as a query param is less secure, but simpler for a GET request.
    // The backend would need to be adapted to read the token from the query param for this link to work.
};
```
