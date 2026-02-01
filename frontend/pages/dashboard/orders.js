import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiPackage, FiDownload } from 'react-icons/fi';
import styles from '../../styles/Dashboard.module.css';

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data.orders);
        } catch (error) {
            toast.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (bookId, bookTitle) => {
        try {
            const response = await api.get(`/downloads/${bookId}`, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${bookTitle}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Download started');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error downloading book');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'var(--success)';
            case 'pending':
            case 'processing':
                return 'var(--warning)';
            case 'failed':
            case 'cancelled':
                return 'var(--error)';
            default:
                return 'var(--text-secondary)';
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className={styles.dashboardPage}>
                    <div className="container">
                        <h1 className={styles.pageTitle}>Order History</h1>

                        {loading ? (
                            <div className="flex-center" style={{ padding: '3rem' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {orders.map(order => (
                                    <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                                                    ₹{order.totalAmount}
                                                </div>
                                                <div style={{
                                                    display: 'inline-block',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    marginTop: '0.5rem',
                                                    background: getStatusColor(order.orderStatus),
                                                    color: 'white'
                                                }}>
                                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                                Books ({order.books.length})
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {order.books.map((item, index) => (
                                                    <div key={index} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '0.5rem',
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: 'var(--radius-md)'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <span>{item.title}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <span style={{ fontWeight: '600' }}>₹{item.price}</span>
                                                            {order.paymentStatus === 'completed' && (
                                                                <button
                                                                    onClick={() => handleDownload(item.book._id || item.book, item.title)}
                                                                    className="btn btn-sm btn-outline"
                                                                    title="Download Book"
                                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                                >
                                                                    <FiDownload /> Download
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid var(--border)',
                                            display: 'flex',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            <span>Payment Status:</span>
                                            <span style={{
                                                fontWeight: '600',
                                                color: getStatusColor(order.paymentStatus)
                                            }}>
                                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <FiShoppingBag className={styles.emptyIcon} />
                                <h2>No orders yet</h2>
                                <p>Start shopping to see your orders here</p>
                                <button onClick={() => router.push('/books')} className="btn btn-primary">
                                    Browse Books
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute >
    );
}
