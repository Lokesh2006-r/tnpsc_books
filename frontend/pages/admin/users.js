import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            toast.error('Error fetching users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const { data } = await api.patch(`/admin/users/${userId}/toggle-status`);
            if (data.success) {
                toast.success('User status updated');
                // Update local state
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isActive: !user.isActive } : user
                ));
            }
        } catch (error) {
            toast.error('Error updating user status');
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <h1>Manage Users</h1>
                        </div>

                        <div className={styles.searchBar}>
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'var(--primary-light)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '1.2rem'
                                                    }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    background: user.role === 'admin' ? 'var(--secondary)' : 'var(--bg-secondary)',
                                                    color: user.role === 'admin' ? 'white' : 'var(--text-primary)'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {user.role !== 'admin' && (
                                                    <div className={styles.actionButtons}>
                                                        <button
                                                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                            className={user.isActive ? styles.btnDelete : styles.btnDownload}
                                                            title={user.isActive ? "Deactivate User" : "Activate User"}
                                                            style={{ width: '35px', height: '35px' }}
                                                        >
                                                            {user.isActive ? <FiUserX /> : <FiUserCheck />}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <div className={styles.emptyState}>
                                    No users found matching your search.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
