import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiUsers, FiBook, FiShoppingBag, FiDollarSign, FiPlus, FiSettings, FiImage } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data.stats);
        } catch (error) {
            toast.error('Error loading dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminRoute>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner"></div>
                    </div>
                </Layout>
            </AdminRoute>
        );
    }

    if (!stats) {
        return (
            <AdminRoute>
                <Layout>
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2>Error loading dashboard</h2>
                            <p>Unable to fetch admin statistics</p>
                            <button onClick={fetchStats} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Retry
                            </button>
                        </div>
                    </div>
                </Layout>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.adminHeader}>
                            <h1>Admin Dashboard</h1>
                            <button onClick={() => router.push('/admin/books')} className="btn btn-primary">
                                <FiPlus /> Add New Book
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'var(--primary)' }}>
                                    <FiUsers />
                                </div>
                                <div className={styles.statInfo}>
                                    <h3>{stats.totalUsers}</h3>
                                    <p>Total Users</p>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'var(--secondary)' }}>
                                    <FiBook />
                                </div>
                                <div className={styles.statInfo}>
                                    <h3>{stats.totalBooks}</h3>
                                    <p>Total Books</p>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'var(--success)' }}>
                                    <FiShoppingBag />
                                </div>
                                <div className={styles.statInfo}>
                                    <h3>{stats.completedOrders}</h3>
                                    <p>Completed Orders</p>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: 'var(--warning)' }}>
                                    <FiDollarSign />
                                </div>
                                <div className={styles.statInfo}>
                                    <h3>₹{stats.totalRevenue}</h3>
                                    <p>Total Revenue</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className={styles.quickLinks}>
                            <h2>Quick Actions</h2>
                            <div className={styles.linksGrid}>
                                <button onClick={() => router.push('/admin/books')} className={styles.linkCard}>
                                    <FiBook />
                                    <span>Manage Books</span>
                                </button>
                                <button onClick={() => router.push('/admin/users')} className={styles.linkCard}>
                                    <FiUsers />
                                    <span>Manage Users</span>
                                </button>
                                <button onClick={() => router.push('/admin/orders')} className={styles.linkCard}>
                                    <FiShoppingBag />
                                    <span>View Orders</span>
                                </button>
                                <button onClick={() => router.push('/admin/settings/payment')} className={styles.linkCard}>
                                    <FiSettings />
                                    <span>Payment Settings</span>
                                </button>
                                <button onClick={() => router.push('/admin/slides')} className={styles.linkCard}>
                                    <FiImage />
                                    <span>Home Slider</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className={styles.recentSection}>
                            <h2>Recent Orders</h2>
                            <div className={styles.ordersTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.slice(0, 5).map(order => (
                                            <tr key={order._id}>
                                                <td>{order.orderNumber}</td>
                                                <td>{order.user?.name || 'N/A'}</td>
                                                <td>₹{order.totalAmount}</td>
                                                <td>
                                                    <span className={`${styles.badge} ${styles[order.orderStatus]}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
