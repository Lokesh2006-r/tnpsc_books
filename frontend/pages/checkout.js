import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FiCopy, FiCheckCircle, FiLoader } from 'react-icons/fi';
import styles from '../styles/Checkout.module.css';

export default function Checkout() {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState({
        upiId: '9150315247@axl',
        merchantName: 'BookStore'
    });

    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        if (orderId) {
            initializeCheckout();
        }
    }, [orderId]);

    const initializeCheckout = async () => {
        try {
            // Fetch order details
            const { data: orderData } = await api.get(`/orders/${orderId}`);
            setOrder(orderData.order);

            // Fetch payment settings
            const { data: settingsData } = await api.get('/payment-settings');
            if (settingsData.success && settingsData.settings) {
                setPaymentSettings({
                    upiId: settingsData.settings.upiId,
                    merchantName: settingsData.settings.merchantName
                });
            }

            // Initiate payment automatically
            const { data: paymentData } = await api.post('/payments/initiate', { orderId });
            setPayment(paymentData.payment);

        } catch (error) {
            console.error('Checkout initialization error:', error);
            toast.error('Error loading checkout');
            router.push('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async () => {
        if (!transactionId || transactionId.length !== 12) {
            toast.error('Please enter a valid 12-digit UPI Transaction ID');
            return;
        }

        setVerifying(true);

        try {
            const { data } = await api.post('/payments/verify', {
                paymentReferenceId: payment.referenceId,
                transactionId
            });

            if (data.success) {
                if (data.requiresAdminApproval) {
                    toast.info('Payment submitted. Waiting for Admin approval.');
                    setTimeout(() => {
                        router.push('/dashboard/orders');
                    }, 2000);
                } else {
                    toast.success('Payment verified successfully!');
                    setTimeout(() => {
                        router.push('/dashboard/library');
                    }, 1500);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
            setVerifying(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner"></div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!order || !payment) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2>Error loading checkout</h2>
                            <button onClick={() => router.push('/cart')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Back to Cart
                            </button>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className={styles.checkoutPage}>
                    <div className="container">
                        <h1 className={styles.pageTitle}>Complete Your Payment</h1>

                        <div className={styles.checkoutContent}>
                            {/* Order Summary */}
                            <div className={styles.orderSummary}>
                                <h2>Order Summary</h2>
                                <p className={styles.orderNumber}>Order #{order.orderNumber}</p>

                                <div className={styles.booksList}>
                                    {order.books.map((item, index) => (
                                        <div key={index} className={styles.bookItem}>
                                            <div>
                                                <h4>{item.title}</h4>
                                                <p>by {item.author}</p>
                                            </div>
                                            <span className={styles.bookPrice}>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.totalSection}>
                                    <div className={styles.totalRow}>
                                        <span>Subtotal</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>Tax</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className={styles.grandTotal}>
                                        <span>Total Amount</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Payment Section */}
                            <div className={styles.qrPaymentSection}>
                                <div className={styles.qrHeader}>
                                    <FiLoader className={styles.iconPending} />
                                    <h2>Scan QR Code to Pay</h2>
                                    <p className={styles.paymentRef}>Payment Ref: {payment.referenceId}</p>
                                </div>

                                <div className={styles.qrCodeContainer}>
                                    <div className={styles.qrWrapper}>
                                        <QRCodeSVG
                                            value={`upi://pay?pa=${paymentSettings.upiId}&pn=${paymentSettings.merchantName}&am=${order.totalAmount}&cu=INR&tn=Order ${order.orderNumber}`}
                                            size={240}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>

                                    <div className={styles.amountBadge}>
                                        <span className={styles.amountLabel}>Amount to Pay</span>
                                        <span className={styles.amountValue}>₹{order.totalAmount}</span>
                                    </div>
                                </div>

                                <div className={styles.paymentDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>UPI ID</span>
                                        <div className={styles.detailValue}>
                                            <span>{paymentSettings.upiId}</span>
                                            <button
                                                onClick={() => copyToClipboard(paymentSettings.upiId, 'UPI ID')}
                                                className={styles.copyBtn}
                                            >
                                                <FiCopy />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Merchant</span>
                                        <span className={styles.detailValue}>{paymentSettings.merchantName}</span>
                                    </div>
                                </div>

                                <div className={styles.instructions}>
                                    <h4>📱 How to Pay:</h4>
                                    <ol>
                                        <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                                        <li>Scan the QR code above</li>
                                        <li>Verify the amount: <strong>₹{order.totalAmount}</strong></li>
                                        <li>Complete the payment</li>
                                        <li>Enter the <strong>12-digit UPI Reference ID</strong> from your app below</li>
                                    </ol>
                                </div>

                                <div style={{ marginBottom: '1rem', width: '100%' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        Enter Transaction ID / UTR:
                                    </label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                        placeholder="e.g. 302819382910"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '1rem',
                                            letterSpacing: '1px'
                                        }}
                                    />
                                    <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                                        {transactionId.length}/12 digits
                                    </small>
                                </div>

                                <button
                                    onClick={handleVerifyPayment}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                    disabled={verifying || transactionId.length !== 12}
                                >
                                    {verifying ? (
                                        <>
                                            <FiLoader className="spinner-icon" /> Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle /> Submit verification
                                        </>
                                    )}
                                </button>

                                <p className={styles.secureNote}>
                                    🔒 Your payment is secure and encrypted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
