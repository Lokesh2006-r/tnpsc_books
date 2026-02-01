import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { FiSave, FiSettings } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import styles from '../../../styles/AdminSettings.module.css';

export default function PaymentSettings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        upiId: '',
        merchantName: '',
        qrCodeEnabled: true
    });
    const [previewAmount, setPreviewAmount] = useState(100);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/payment-settings');
            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            toast.error('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data } = await api.put('/payment-settings', settings);

            if (data.success) {
                toast.success('Payment settings updated successfully!');
                setSettings(data.settings);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <ProtectedRoute adminOnly>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner"></div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <Layout>
                <div className={styles.settingsPage}>
                    <div className="container">
                        <div className={styles.header}>
                            <div>
                                <h1><FiSettings /> Payment Settings</h1>
                                <p>Configure your UPI payment details for QR code generation</p>
                            </div>
                        </div>

                        <div className={styles.settingsGrid}>
                            {/* Settings Form */}
                            <div className={styles.settingsCard}>
                                <h2>UPI Configuration</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="upiId">
                                            UPI ID *
                                            <span className={styles.hint}>Your UPI ID (e.g., yourname@paytm)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="upiId"
                                            name="upiId"
                                            value={settings.upiId}
                                            onChange={handleChange}
                                            placeholder="yourname@paytm"
                                            required
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="merchantName">
                                            Merchant Name *
                                            <span className={styles.hint}>Name shown on payment screen</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="merchantName"
                                            name="merchantName"
                                            value={settings.merchantName}
                                            onChange={handleChange}
                                            placeholder="BookStore"
                                            required
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                name="qrCodeEnabled"
                                                checked={settings.qrCodeEnabled}
                                                onChange={handleChange}
                                            />
                                            <span>Enable QR Code Payments</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                        style={{ width: '100%', marginTop: '1rem' }}
                                    >
                                        <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </form>
                            </div>

                            {/* QR Code Preview */}
                            <div className={styles.previewCard}>
                                <h2>QR Code Preview</h2>
                                <p className={styles.previewHint}>
                                    This is how your QR code will appear to customers
                                </p>

                                <div className={styles.qrPreview}>
                                    {settings.upiId ? (
                                        <>
                                            <QRCodeSVG
                                                value={`upi://pay?pa=${settings.upiId}&pn=${settings.merchantName}&am=${previewAmount}&cu=INR&tn=Order Payment`}
                                                size={220}
                                                level="H"
                                                includeMargin={true}
                                            />

                                            <div className={styles.previewDetails}>
                                                <div className={styles.detailRow}>
                                                    <span>UPI ID:</span>
                                                    <strong>{settings.upiId}</strong>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span>Merchant:</span>
                                                    <strong>{settings.merchantName}</strong>
                                                </div>
                                                <div className={styles.detailRow}>
                                                    <span>Preview Amount:</span>
                                                    <strong>₹{previewAmount}</strong>
                                                </div>
                                            </div>

                                            <div className={styles.amountSlider}>
                                                <label>Preview Amount: ₹{previewAmount}</label>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="1000"
                                                    step="10"
                                                    value={previewAmount}
                                                    onChange={(e) => setPreviewAmount(Number(e.target.value))}
                                                    className={styles.slider}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.emptyPreview}>
                                            <p>Enter UPI ID to see preview</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.infoBox}>
                                    <h4>💡 How it works</h4>
                                    <ul>
                                        <li>Customers scan the QR code with any UPI app</li>
                                        <li>Amount is pre-filled automatically</li>
                                        <li>Payment goes directly to your UPI ID</li>
                                        <li>Customers confirm payment on the website</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
