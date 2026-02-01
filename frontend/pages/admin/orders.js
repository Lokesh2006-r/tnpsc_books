import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/admin/orders');
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error('Error fetching orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
            if (data.success) {
                toast.success('Order status updated');
                // Update local state
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                ));
            }
        } catch (error) {
            toast.error('Error updating order status');
            console.error(error);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return styles.success; // We'll map to badge classes
            case 'pending': return styles.warning;
            case 'failed': return styles.error;
            default: return '';
        }
    };

    if (loading) {
        return (
            <AdminRoute>
                <Layout>
                    <div className={styles.adminPage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="spinner"></div>
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
                            <h1>Manage Orders</h1>
                        </div>

                        <div className={styles.searchBar}>
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search by Order ID, User Name or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                                <FiFilter color="var(--text-secondary)" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                                                #{order.orderNumber}
                                            </td>
                                            <td>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.user?.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.user?.email || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.9rem' }} title={order.books?.map(b => b.book?.title).join(', ')}>
                                                    {order.books?.length} Items
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700 }}>
                                                ₹{order.totalAmount}
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className={`${styles.badge} ${styles[order.orderStatus]}`}
                                                    style={{
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        outline: 'none',
                                                        // appearance: 'none' // Optional: remove arrow
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredOrders.length === 0 && (
                                <div className={styles.emptyState}>
                                    No orders found matching your criteria.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
