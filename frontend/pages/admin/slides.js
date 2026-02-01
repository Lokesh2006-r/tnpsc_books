import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { FiPlus, FiEdit3, FiTrash2, FiSave, FiX, FiImage, FiCheck } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function AdminSlides() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: null,
        link: '/books',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        if (!user) return; // Wait for auth
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchSlides();
    }, [user, isAdmin, router]);

    const fetchSlides = async () => {
        try {
            const { data } = await api.get('/slides/admin');
            setSlides(data.slides);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching slides:', error);
            toast.error('Failed to load slides');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({
                ...prev,
                image: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('link', formData.link);
            data.append('order', formData.order);
            data.append('isActive', formData.isActive);
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (currentSlide) {
                await api.put(`/slides/${currentSlide._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Slide updated successfully');
            } else {
                await api.post('/slides', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Slide created successfully');
            }

            resetForm();
            fetchSlides();
        } catch (error) {
            console.error('Error saving slide:', error);
            toast.error(error.response?.data?.message || 'Failed to save slide');
        }
    };

    const handleEdit = (slide) => {
        setCurrentSlide(slide);
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle || '',
            image: null,
            link: slide.link || '/books',
            order: slide.order || 0,
            isActive: slide.isActive
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            try {
                await api.delete(`/slides/${id}`);
                toast.success('Slide deleted successfully');
                fetchSlides();
            } catch (error) {
                console.error('Error deleting slide:', error);
                toast.error('Failed to delete slide');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentSlide(null);
        setFormData({
            title: '',
            subtitle: '',
            image: null,
            link: '/books',
            order: 0,
            isActive: true
        });
    };

    if (loading) return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="spinner"></div>
                </div>
            </Layout>
        </AdminRoute>
    );

    return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.adminHeader}>
                            <div>
                                <h1>Manage Slides</h1>
                            </div>
                            <button
                                onClick={() => { resetForm(); setIsEditing(true); }}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <FiPlus />
                                <span>Add New Slide</span>
                            </button>
                        </div>

                        {/* Modal Overlay */}
                        {isEditing && (
                            <div style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 100,
                                display: 'grid',
                                placeItems: 'center',
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)',
                                padding: '1rem'
                            }}>
                                <div style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    width: '100%',
                                    maxWidth: '800px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: '1.5rem',
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {currentSlide ? 'Edit Slide Details' : 'Create New Slide'}
                                        </h2>
                                        <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Title</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleInputChange}
                                                        required
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                                                        placeholder="e.g., Summer Book Sale"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Subtitle</label>
                                                    <input
                                                        type="text"
                                                        name="subtitle"
                                                        value={formData.subtitle}
                                                        onChange={handleInputChange}
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                                                        placeholder="e.g., Up to 50% off"
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Order</label>
                                                        <input
                                                            type="number"
                                                            name="order"
                                                            value={formData.order}
                                                            onChange={handleInputChange}
                                                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.75rem' }}>
                                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                            <input
                                                                type="checkbox"
                                                                name="isActive"
                                                                checked={formData.isActive}
                                                                onChange={handleInputChange}
                                                                style={{ width: '1.25rem', height: '1.25rem' }}
                                                            />
                                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Active</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Image</label>
                                                    <div style={{
                                                        border: '2px dashed var(--border)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        padding: '2rem',
                                                        textAlign: 'center',
                                                        background: 'var(--bg-secondary)'
                                                    }}>
                                                        <FiImage size={32} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            onChange={handleInputChange}
                                                            accept="image/*"
                                                            required={!currentSlide}
                                                            style={{ width: '100%' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Link URL</label>
                                                    <input
                                                        type="text"
                                                        name="link"
                                                        value={formData.link}
                                                        onChange={handleInputChange}
                                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
                                                        placeholder="/books"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <FiSave />
                                                <span>{currentSlide ? 'Save Changes' : 'Create Slide'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>Order</th>
                                        <th>Content Details</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slides.map((slide) => (
                                        <tr key={slide._id}>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    width: '30px',
                                                    height: '30px',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'var(--bg-secondary)',
                                                    borderRadius: '50%',
                                                    fontWeight: 'bold',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    {slide.order}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{slide.title}</span>
                                                    {slide.subtitle && (
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{slide.subtitle}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`${styles.statusBadge} ${slide.isActive ? styles.active : styles.inactive}`}>
                                                    {slide.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons} style={{ justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleEdit(slide)}
                                                        className={styles.btnEdit}
                                                        title="Edit Slide"
                                                    >
                                                        <FiEdit3 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slide._id)}
                                                        className={styles.btnDelete}
                                                        title="Delete Slide"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {slides.length === 0 && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className={styles.emptyState}>
                                                    <FiImage size={48} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }} />
                                                    <p>No slides found. Create your first slide to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
