import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/AdminRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiDownload } from 'react-icons/fi';
import styles from '../../styles/Admin.module.css';

export default function ManageBooks() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/books?limit=100');
            setBooks(data.books);
        } catch (error) {
            toast.error('Error loading books');
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
            window.URL.revokeObjectURL(url);

            toast.success('Download started');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error downloading book');
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await api.delete(`/books/${id}`);
            toast.success('Book deleted successfully');
            fetchBooks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting book');
        }
    };

    const handleToggleAvailability = async (id, currentStatus) => {
        try {
            await api.patch(`/books/${id}/availability`, {
                isAvailable: !currentStatus
            });
            toast.success(`Book ${!currentStatus ? 'enabled' : 'disabled'}`);
            fetchBooks();
        } catch (error) {
            toast.error('Error updating book');
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminRoute>
            <Layout>
                <div className={styles.adminPage}>
                    <div className="container">
                        <div className={styles.adminHeader}>
                            <h1>Manage Books</h1>
                            <button onClick={() => router.push('/admin/books/add')} className="btn btn-primary">
                                <FiPlus /> Add New Book
                            </button>
                        </div>

                        {/* Search */}
                        <div className={styles.searchBar}>
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Search books by title or author..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="flex-center" style={{ padding: '3rem' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.dataTable}>
                                    <thead>
                                        <tr>
                                            <th>Cover</th>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Format</th>
                                            <th>Sales</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBooks.map(book => (
                                            <tr key={book._id}>
                                                <td>
                                                    <img
                                                        src={`${API_URL}/${book.coverImage}`}
                                                        alt={book.title}
                                                        className={styles.bookThumb}
                                                    />
                                                </td>
                                                <td><strong>{book.title}</strong></td>
                                                <td>{book.author}</td>
                                                <td>{book.category}</td>
                                                <td>₹{book.price}</td>
                                                <td>
                                                    <span className={styles.formatBadge}>
                                                        {book.fileFormat?.toUpperCase() || 'PDF'}
                                                    </span>
                                                </td>
                                                <td>{book.totalSales || 0}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleToggleAvailability(book._id, book.isAvailable)}
                                                        className={`${styles.statusBadge} ${book.isAvailable ? styles.active : styles.inactive}`}
                                                    >
                                                        {book.isAvailable ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className={styles.actionButtons}>
                                                        <button
                                                            onClick={() => handleDownload(book._id, book.title)}
                                                            className={styles.btnDownload}
                                                            title="Download PDF"
                                                        >
                                                            <FiDownload />
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/admin/books/edit/${book._id}`)}
                                                            className={styles.btnEdit}
                                                            title="Edit"
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(book._id, book.title)}
                                                            className={styles.btnDelete}
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {filteredBooks.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p>No books found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </AdminRoute>
    );
}
