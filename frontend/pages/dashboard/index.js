import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { FiBook, FiShoppingBag, FiDownload, FiArrowRight } from 'react-icons/fi';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        purchasedBooks: 0,
        totalOrders: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [libraryRes, ordersRes] = await Promise.all([
                api.get('/downloads/library'),
                api.get('/orders')
            ]);

            const completedOrders = ordersRes.data.orders.filter(
                order => order.paymentStatus === 'completed'
            );

            const totalSpent = completedOrders.reduce(
                (sum, order) => sum + order.totalAmount,
                0
            );

            setStats({
                purchasedBooks: libraryRes.data.library.length,
                totalOrders: ordersRes.data.orders.length,
                totalSpent
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className={styles.dashboardPage}>
                    <div className="container">
                        <h1 className={styles.pageTitle}>Welcome, {user?.name}!</h1>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                            Manage your books, orders, and account
                        </p>

                        {loading ? (
                            <div className="flex-center" style={{ padding: '3rem' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
                                    <div className="card">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.5rem'
                                            }}>
                                                <FiBook />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.purchasedBooks}</h3>
                                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Books Owned</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, var(--secondary), #db2777)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.5rem'
                                            }}>
                                                <FiShoppingBag />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.totalOrders}</h3>
                                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Orders</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                background: 'linear-gradient(135deg, var(--success), #059669)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '1.5rem'
                                            }}>
                                                ₹
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '2rem', margin: 0 }}>₹{stats.totalSpent}</h3>
                                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Spent</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="card" style={{ padding: '2rem' }}>
                                    <h2 style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
                                    <div className="grid grid-3">
                                        <button
                                            onClick={() => router.push('/dashboard/library')}
                                            className="btn btn-primary"
                                            style={{ width: '100%' }}
                                        >
                                            <FiBook /> My Library
                                        </button>
                                        <button
                                            onClick={() => router.push('/dashboard/orders')}
                                            className="btn btn-outline"
                                            style={{ width: '100%' }}
                                        >
                                            <FiShoppingBag /> Order History
                                        </button>
                                        <button
                                            onClick={() => router.push('/books')}
                                            className="btn btn-outline"
                                            style={{ width: '100%' }}
                                        >
                                            <FiArrowRight /> Browse Books
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
