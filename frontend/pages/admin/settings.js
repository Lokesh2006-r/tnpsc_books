import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import { toast } from 'react-toastify';
import { FiSave, FiSettings } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function PaymentSettings() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        upiId: '9150315247@axl',
        merchantName: 'BookStore',
        upiProvider: 'Google Pay'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        // Load from localStorage
        const savedSettings = localStorage.getItem('paymentSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Validate UPI ID format
            if (!settings.upiId.includes('@')) {
                toast.error('Invalid UPI ID format. Must include @');
                setSaving(false);
                return;
            }

            // Save to localStorage
            localStorage.setItem('paymentSettings', JSON.stringify(settings));

            // In a real app, you would save this to the backend
            // await api.post('/admin/settings/payment', settings);

            toast.success('Payment settings saved successfully!');

            // Optionally redirect back to admin dashboard
            setTimeout(() => {
                router.push('/admin');
            }, 1500);
        } catch (error) {
            toast.error('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
            upiId: '9150315247@axl',
            merchantName: 'BookStore',
            upiProvider: 'Google Pay'
        });
    };

    return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.adminHeader}>
                            <h1>Payment Settings</h1>
                            <button onClick={() => router.push('/admin')} className="btn btn-outline">
                                Back to Dashboard
                            </button>
                        </div>

                        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <FiSettings style={{ fontSize: '2rem', color: 'var(--primary)' }} />
                                <div>
                                    <h2 style={{ margin: 0 }}>UPI Payment Configuration</h2>
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                                        Configure your UPI details for QR code payments
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSave}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* UPI ID */}
                                    <div>
                                        <label htmlFor="upiId" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            UPI ID *
                                        </label>
                                        <input
                                            type="text"
                                            id="upiId"
                                            name="upiId"
                                            value={settings.upiId}
                                            onChange={handleChange}
                                            placeholder="yourname@paytm"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                                            Examples: 9876543210@paytm, yourname@ybl, 9876543210@okaxis
                                        </small>
                                    </div>

                                    {/* Merchant Name */}
                                    <div>
                                        <label htmlFor="merchantName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            Merchant Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="merchantName"
                                            name="merchantName"
                                            value={settings.merchantName}
                                            onChange={handleChange}
                                            placeholder="Your Business Name"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                                            This will appear on the payment page
                                        </small>
                                    </div>

                                    {/* UPI Provider */}
                                    <div>
                                        <label htmlFor="upiProvider" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            UPI Provider
                                        </label>
                                        <select
                                            id="upiProvider"
                                            name="upiProvider"
                                            value={settings.upiProvider}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <option value="Google Pay">Google Pay</option>
                                            <option value="PhonePe">PhonePe</option>
                                            <option value="Paytm">Paytm</option>
                                            <option value="BHIM">BHIM</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Preview */}
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '2px dashed var(--border)'
                                    }}>
                                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Preview</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div>
                                                <strong>UPI ID:</strong> {settings.upiId}
                                            </div>
                                            <div>
                                                <strong>Merchant:</strong> {settings.merchantName}
                                            </div>
                                            <div>
                                                <strong>Provider:</strong> {settings.upiProvider}
                                            </div>
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                <strong>QR Code Link:</strong><br />
                                                <code style={{ fontSize: '0.85rem' }}>
                                                    upi://pay?pa={settings.upiId}&pn={settings.merchantName}&am=AMOUNT&cu=INR
                                                </code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                            style={{ flex: 1 }}
                                        >
                                            <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="btn btn-outline"
                                            disabled={saving}
                                        >
                                            Reset to Default
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Info Box */}
                            <div style={{
                                marginTop: '2rem',
                                padding: '1rem',
                                background: '#e0f2fe',
                                borderLeft: '4px solid var(--info)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--info)' }}>ℹ️ Important Notes</h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Changes will apply to all new payment QR codes</li>
                                    <li>Make sure your UPI ID is active and can receive payments</li>
                                    <li>Test the QR code after saving to ensure it works</li>
                                    <li>Settings are saved locally in your browser</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
