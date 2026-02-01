# QR Code Payment System

## Overview
Your Digital Book Store now features a **QR Code-based UPI payment system**. When customers click "Pay", they will see a QR code that they can scan with any UPI app (Google Pay, PhonePe, Paytm, etc.) to complete the payment.

## How It Works

### For Customers:
1. **Add books to cart** and proceed to checkout
2. **Click "Pay"** button on the checkout page
3. **Scan the QR code** displayed on the payment page using any UPI app
4. **Complete the payment** in their UPI app
5. **Click "I Have Completed Payment"** to verify and complete the order

### For Admin (You):
1. **Configure your UPI ID** in the admin panel
2. **Receive payments** directly to your UPI account
3. **Customers verify** their payment on the website

## Admin Configuration

### Setting Up Your UPI ID

1. **Login as Admin**
2. Go to **Admin Dashboard** → **Payment Settings**
3. Enter your **UPI ID** (e.g., `yourname@paytm`, `9876543210@ybl`)
4. Enter your **Merchant Name** (displayed to customers)
5. **Preview the QR code** to ensure it's correct
6. Click **Save Settings**

### Accessing Payment Settings
- **URL**: `/admin/settings/payment`
- **From Dashboard**: Click "Payment Settings" in Quick Actions

## Features

✅ **Dynamic QR Code Generation** - QR codes are generated with the exact payment amount
✅ **Multiple UPI Apps Supported** - Works with Google Pay, PhonePe, Paytm, and all UPI apps
✅ **Real-time Preview** - See how your QR code looks before saving
✅ **Copy UPI ID** - Customers can copy your UPI ID for manual payment
✅ **Secure** - Payments go directly to your UPI account
✅ **No Third-party Gateway** - No transaction fees or commissions

## Payment Flow

```
Customer adds books to cart
        ↓
Clicks "Proceed to Checkout"
        ↓
Reviews order and clicks "Pay"
        ↓
QR Code displayed with payment details
        ↓
Customer scans QR with UPI app
        ↓
Customer completes payment in UPI app
        ↓
Customer clicks "I Have Completed Payment"
        ↓
Order is verified and completed
        ↓
Books added to customer's library
```

## Technical Details

### Backend Endpoints
- `GET /api/payment-settings` - Fetch payment configuration (Public)
- `PUT /api/payment-settings` - Update payment configuration (Admin only)
- `POST /api/payments/initiate` - Create payment record
- `POST /api/payments/verify` - Verify payment completion

### QR Code Format
The QR code uses the standard UPI payment URL format:
```
upi://pay?pa=<UPI_ID>&pn=<MERCHANT_NAME>&am=<AMOUNT>&cu=INR&tn=Order Payment
```

### Database Models
- **PaymentSettings** - Stores UPI configuration
- **Payment** - Stores payment records with reference IDs
- **Order** - Links to payment records

## Important Notes

⚠️ **Payment Verification**: Currently, the system uses a simulated verification. In production, you should:
- Manually verify payments in your UPI app
- Or integrate with a payment gateway API for automatic verification

⚠️ **Security**: Only admin users can modify payment settings

⚠️ **UPI ID Format**: Must be in format `username@bankname` (e.g., `9876543210@paytm`)

## Customization

### Changing Default UPI ID
Edit the default UPI ID in:
- **File**: `backend/controllers/paymentSettings.controller.js`
- **Line**: 14
- **Default**: `9150315247@axl`

### Styling the Payment Page
Edit the CSS file:
- **File**: `frontend/styles/Payment.module.css`

## Troubleshooting

### QR Code Not Displaying
- Check if UPI ID is configured in admin settings
- Verify payment settings API is accessible
- Check browser console for errors

### Payment Not Verifying
- Ensure customer clicked "I Have Completed Payment"
- Check if payment was actually completed in UPI app
- Verify backend logs for errors

## Future Enhancements

🔮 **Planned Features**:
- Automatic payment verification via webhook
- Payment gateway integration (Razorpay, PhonePe Business)
- Payment history and analytics
- Refund management
- Multiple payment methods (Cards, Net Banking)

---

**Need Help?** Check the backend logs for detailed error messages and payment flow tracking.
