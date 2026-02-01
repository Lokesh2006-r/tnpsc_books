# UPI Payment Configuration Guide

## How to Configure Your Own UPI ID

To use your own UPI ID for receiving payments, follow these steps:

### 1. Update the Payment Page

Edit `frontend/pages/payment/[referenceId].js`:

**Line 117** - Update the QR code UPI link:
```javascript
value={`upi://pay?pa=YOUR_UPI_ID@upi&pn=YourBusinessName&am=${payment.amount}&cu=INR&tn=Order Payment`}
```

**Line 133** - Update the displayed UPI ID:
```javascript
<p className={styles.upiId}>YOUR_UPI_ID@upi</p>
```

**Line 135** - Update the copy function:
```javascript
navigator.clipboard.writeText('YOUR_UPI_ID@upi');
```

**Line 147** - Update merchant name:
```javascript
<strong>Merchant Name:</strong> YourBusinessName<br />
```

### 2. Example Configuration

Replace:
- `merchant@upi` with your actual UPI ID (e.g., `yourname@paytm`, `9876543210@ybl`)
- `BookStore` with your business name

### 3. UPI ID Format Examples

- **Google Pay**: `mobilenumber@okaxis` or `mobilenumber@okhdfcbank`
- **PhonePe**: `mobilenumber@ybl`
- **Paytm**: `mobilenumber@paytm`
- **BHIM**: `username@upi`

### 4. Testing the QR Code

1. Complete a test purchase
2. Go to the payment page
3. Scan the QR code with your UPI app
4. Verify that:
   - Correct UPI ID appears
   - Correct amount is shown
   - Merchant name is correct

### 5. Production Recommendations

For production use:
1. **Use a real payment gateway** (Razorpay, PayU, Stripe)
2. **Implement webhook verification** for automatic payment confirmation
3. **Add transaction ID validation**
4. **Store payment receipts**
5. **Send email confirmations**

### Current Implementation

The current setup is a **simulation** for development:
- QR code is scannable and will work with real UPI apps
- Payment verification is automatic (no actual verification)
- For production, integrate with a payment gateway API

### Quick Configuration

**Option 1: Environment Variables (Recommended)**

Add to `.env.local`:
```env
NEXT_PUBLIC_UPI_ID=yourname@paytm
NEXT_PUBLIC_MERCHANT_NAME=Your Business Name
```

Then update the code to use:
```javascript
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || 'merchant@upi';
const MERCHANT_NAME = process.env.NEXT_PUBLIC_MERCHANT_NAME || 'BookStore';
```

**Option 2: Direct Edit**

Simply replace the hardcoded values in the payment page as shown in step 1.

---

## Current Default Values

- **UPI ID**: `merchant@upi`
- **Merchant Name**: `BookStore`
- **Payment Method**: UPI QR Code Scanner

Replace these with your actual business details!
