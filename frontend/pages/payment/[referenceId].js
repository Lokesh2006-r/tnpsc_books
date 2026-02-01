import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiLoader, FiCopy } from 'react-icons/fi';
import styles from '../../styles/Payment.module.css';

export default function Payment() {
    const router = useRouter();
    const { referenceId } = router.query;
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState('pending'); // pending, success, failed
    const [paymentSettings, setPaymentSettings] = useState({
        upiId: '9150315247@axl',
        merchantName: 'BookStore'
    });

    useEffect(() => {
        // Fetch payment settings from backend
        const fetchPaymentSettings = async () => {
            try {
                const { data } = await api.get('/payment-settings');
                if (data.success && data.settings) {
                    setPaymentSettings({
                        upiId: data.settings.upiId,
                        merchantName: data.settings.merchantName
                    });
                }
            } catch (error) {
                console.error('Error fetching payment settings:', error);
                // Keep default settings if fetch fails
            }
        };

        fetchPaymentSettings();
    }, []);

    useEffect(() => {
        if (referenceId && referenceId !== 'undefined') {
            fetchPayment();
        } else {
            setLoading(false);
        }
    }, [referenceId]);

    const fetchPayment = async () => {
        try {
            console.log('Fetching payment for referenceId:', referenceId);
            const { data } = await api.get(`/payments/${referenceId}`);
            console.log('Payment data received:', data);
            setPayment(data.payment);

            if (data.payment.verificationStatus === 'verified') {
                setStatus('success');
            }
        } catch (error) {
            console.error('Error fetching payment:', error);
            // Only show error toast for actual errors, not for missing referenceId
            if (error.response?.status !== 404) {
                toast.error('Error loading payment');
            }
            setPayment(null);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async () => {
        setVerifying(true);

        try {
            // Simulate UPI transaction ID (in production, user would enter this)
            const transactionId = `UPI${Date.now()}`;

            const { data } = await api.post('/payments/verify', {
                paymentReferenceId: referenceId,
                transactionId
            });

            if (data.success) {
                setStatus('success');
                toast.success('Payment verified successfully!');

                // Redirect to library after 2 seconds
                setTimeout(() => {
                    router.push('/dashboard/library');
                }, 2000);
            }
        } catch (error) {
            setStatus('failed');
            toast.error(error.response?.data?.message || 'Payment verification failed');
        } finally {
            setVerifying(false);
        }
    };

    const handleRetry = () => {
        setStatus('pending');
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

    if (!payment) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2>Payment not found</h2>
                            <p>The payment reference is invalid or has expired.</p>
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
                <div className={styles.paymentPage}>
                    <div className="container">
                        <div className={styles.paymentCard}>
                            {status === 'pending' && (
                                <>
                                    <div className={styles.paymentHeader}>
                                        <FiLoader className={styles.iconPending} />
                                        <h1>Complete Payment</h1>
                                        <p>Payment Reference: {referenceId}</p>
                                    </div>

                                    <div className={styles.paymentInfo}>
                                        <div className={styles.infoRow}>
                                            <span>Amount:</span>
                                            <span className={styles.amount}>₹{payment.amount}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span>Payment Method:</span>
                                            <span>UPI</span>
                                        </div>
                                    </div>

                                    <div className={styles.upiSection}>
                                        <h3>Scan QR Code to Pay</h3>
                                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                            Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                                        </p>

                                        <div className={styles.qrContainer}>
                                            <QRCodeSVG
                                                value={`upi://pay?pa=${paymentSettings.upiId}&pn=${paymentSettings.merchantName}&am=${payment.amount}&cu=INR&tn=Order Payment`}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>

                                        <div className={styles.upiDetails}>
                                            <div className={styles.upiIdContainer}>
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                        UPI ID
                                                    </p>
                                                    <p className={styles.upiId}>{paymentSettings.upiId}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(paymentSettings.upiId);
                                                        toast.success('UPI ID copied!');
                                                    }}
                                                    className={styles.copyBtn}
                                                    title="Copy UPI ID"
                                                >
                                                    <FiCopy />
                                                </button>
                                            </div>

                                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                                    <strong>Merchant Name:</strong> {paymentSettings.merchantName}<br />
                                                    <strong>Amount:</strong> ₹{payment.amount}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={styles.paymentSteps}>
                                            <h4>How to Pay:</h4>
                                            <ol>
                                                <li>Open any UPI app on your phone</li>
                                                <li>Scan the QR code above or enter UPI ID manually</li>
                                                <li>Verify the amount (₹{payment.amount})</li>
                                                <li>Complete the payment</li>
                                                <li>Click "I Have Completed Payment" below</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleVerifyPayment}
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={verifying}
                                    >
                                        {verifying ? 'Verifying Payment...' : 'I Have Completed Payment'}
                                    </button>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className={styles.paymentHeader}>
                                        <FiCheckCircle className={styles.iconSuccess} />
                                        <h1>Payment Successful!</h1>
                                        <p>Your order has been confirmed</p>
                                    </div>

                                    <div className={styles.successMessage}>
                                        <p>Thank you for your purchase. Your books are now available in your library.</p>
                                        <button
                                            onClick={() => router.push('/dashboard/library')}
                                            className="btn btn-primary"
                                            style={{ marginTop: '2rem' }}
                                        >
                                            Go to My Library
                                        </button>
                                    </div>
                                </>
                            )}

                            {status === 'failed' && (
                                <>
                                    <div className={styles.paymentHeader}>
                                        <FiXCircle className={styles.iconError} />
                                        <h1>Payment Failed</h1>
                                        <p>We couldn't verify your payment</p>
                                    </div>

                                    <div className={styles.errorMessage}>
                                        <p>Please try again or contact support if the issue persists.</p>
                                        <div className={styles.actionButtons}>
                                            <button onClick={handleRetry} className="btn btn-primary">
                                                Retry Payment
                                            </button>
                                            <button onClick={() => router.push('/cart')} className="btn btn-outline">
                                                Back to Cart
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
