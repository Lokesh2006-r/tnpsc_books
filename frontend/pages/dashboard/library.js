import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiDownload, FiBook } from 'react-icons/fi';
import styles from '../../styles/Dashboard.module.css';

export default function Library() {
    const router = useRouter();
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchLibrary();
    }, []);

    const fetchLibrary = async () => {
        try {
            const { data } = await api.get('/downloads/library');
            setLibrary(data.library);
        } catch (error) {
            toast.error('Error loading library');
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

    return (
        <ProtectedRoute>
            <Layout>
                <div className={styles.dashboardPage}>
                    <div className="container">
                        <h1 className={styles.pageTitle}>My Library</h1>

                        {loading ? (
                            <div className="flex-center" style={{ padding: '3rem' }}>
                                <div className="spinner"></div>
                            </div>
                        ) : library.length > 0 ? (
                            <div className="grid grid-3">
                                {library.map((item) => {
                                    if (!item.book) return null;
                                    return (
                                        <div key={item._id} className={styles.libraryCard}>
                                            <img
                                                src={`${API_URL}/${item.book.coverImage}`}
                                                alt={item.book.title}
                                                className={styles.libraryImage}
                                            />
                                            <div className={styles.libraryInfo}>
                                                <h3>{item.book.title}</h3>
                                                <p className={styles.libraryAuthor}>by {item.book.author}</p>
                                                <p className={styles.purchaseDate}>
                                                    Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                                                </p>
                                                <button
                                                    onClick={() => handleDownload(item.book._id, item.book.title)}
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', marginTop: '1rem' }}
                                                >
                                                    <FiDownload /> Download
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <FiBook className={styles.emptyIcon} />
                                <h2>Your library is empty</h2>
                                <p>Purchase books to start building your collection</p>
                                <button onClick={() => router.push('/books')} className="btn btn-primary">
                                    Browse Books
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
