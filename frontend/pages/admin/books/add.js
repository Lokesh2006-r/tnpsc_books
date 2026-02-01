import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import AdminRoute from '../../../components/AdminRoute';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';
import styles from '../../../styles/Admin.module.css';

export default function AddBook() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        price: '',
        description: '',
        shortDescription: '',
        isAvailable: true
    });
    const [coverImage, setCoverImage] = useState(null);
    const [bookFile, setBookFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help', 'Biography', 'History', 'Other'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (e.target.name === 'coverImage') {
            setCoverImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else if (e.target.name === 'bookFile') {
            setBookFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!coverImage) {
            toast.error('Please select a cover image');
            return;
        }
        if (!bookFile) {
            toast.error('Please select a book file');
            return;
        }

        setSaving(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            data.append('coverImage', coverImage);
            data.append('bookFile', bookFile);

            await api.post('/books', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Book created successfully');
            router.push('/admin/books');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating book');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container" style={{ maxWidth: '800px' }}>
                        <button onClick={() => router.back()} className="btn btn-outline mb-3">
                            <FiArrowLeft /> Back
                        </button>

                        <div className="card">
                            <h1 className="mb-4">Add New Book</h1>

                            <form onSubmit={handleSubmit}>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-input"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter book title"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Author</label>
                                        <input
                                            type="text"
                                            name="author"
                                            className="form-input"
                                            value={formData.author}
                                            onChange={handleChange}
                                            required
                                            placeholder="Author name"
                                        />
                                    </div>
                                </div>

                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            name="category"
                                            className="form-input"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Short Description</label>
                                    <textarea
                                        name="shortDescription"
                                        className="form-input"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        rows="2"
                                        required
                                        placeholder="Brief summary used in cards..."
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Full Description</label>
                                    <textarea
                                        name="description"
                                        className="form-input"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="5"
                                        required
                                        placeholder="Detailed description of the book..."
                                    ></textarea>
                                </div>

                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Cover Image</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            )}
                                            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                                                <FiUpload /> Upload Cover
                                                <input
                                                    type="file"
                                                    name="coverImage"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Book File (PDF/EPUB)</label>
                                        <label className="btn btn-outline" style={{ cursor: 'pointer', width: '100%', marginTop: '0.5rem' }}>
                                            <FiUpload /> {bookFile ? bookFile.name : 'Upload Book File'}
                                            <input
                                                type="file"
                                                name="bookFile"
                                                onChange={handleFileChange}
                                                accept=".pdf,.epub"
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            name="isAvailable"
                                            checked={formData.isAvailable}
                                            onChange={handleChange}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <span style={{ fontWeight: 600 }}>Available for Sale</span>
                                    </label>
                                </div>

                                <div className="flex-center mt-3">
                                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
                                        {saving ? <div className="spinner-icon"></div> : <FiSave />}
                                        {saving ? 'Creating...' : 'Create Book'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
