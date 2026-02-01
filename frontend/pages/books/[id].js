import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { FiShoppingCart, FiCheck, FiCreditCard, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from '../../styles/BookDetail.module.css';

export default function BookDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart, isInCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasPurchased, setHasPurchased] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (id) {
            fetchBook();
            if (isAuthenticated) {
                checkPurchaseStatus();
            }
        }
    }, [id, isAuthenticated]);

    const fetchBook = async () => {
        try {
            const { data } = await api.get(`/books/${id}`);
            setBook(data.book);
        } catch (error) {
            toast.error('Error loading book');
            router.push('/books');
        } finally {
            setLoading(false);
        }
    };

    const checkPurchaseStatus = async () => {
        try {
            const { data } = await api.get(`/downloads/check/${id}`);
            setHasPurchased(data.canDownload);
        } catch (error) {
            console.error('Error checking purchase status:', error);
        }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to purchase');
            router.push('/login');
            return;
        }

        try {
            // Create order with single book
            const { data } = await api.post('/orders', { books: [id] });
            router.push(`/checkout?orderId=${data.order._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating order');
        }
    };

    const handleDownload = () => {
        router.push('/dashboard/library');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex-center" style={{ minHeight: '60vh' }}>
                    <div className="spinner"></div>
                </div>
            </Layout>
        );
    }

    if (!book) return null;

    return (
        <Layout>
            <div className={styles.bookDetail}>
                <div className="container">
                    <div className={styles.detailGrid}>
                        {/* Book Cover */}
                        <div className={styles.coverSection}>
                            <img
                                src={`${API_URL}/${book.coverImage}`}
                                alt={book.title}
                                className={styles.coverImage}
                            />
                        </div>

                        {/* Book Info */}
                        <div className={styles.infoSection}>
                            <h1 className={styles.title}>{book.title}</h1>
                            <p className={styles.author}>by {book.author}</p>

                            <div className={styles.meta}>
                                <span className={styles.category}>{book.category}</span>
                                <span className={styles.format}>{book.fileFormat.toUpperCase()}</span>
                                {book.pages && <span className={styles.pages}>{book.pages} pages</span>}
                            </div>

                            <div className={styles.price}>₹{book.price}</div>

                            <p className={styles.description}>{book.description}</p>

                            {/* Action Buttons */}
                            <div className={styles.actions}>
                                {hasPurchased ? (
                                    <button onClick={handleDownload} className="btn btn-primary">
                                        <FiDownload /> Download Book
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleBuyNow}
                                            className="btn btn-primary"
                                        >
                                            <FiCreditCard /> Buy Now
                                        </button>
                                        <button
                                            onClick={() => addToCart(book)}
                                            className={`btn ${isInCart(book._id) ? 'btn-secondary' : 'btn-outline'}`}
                                            disabled={isInCart(book._id)}
                                        >
                                            {isInCart(book._id) ? (
                                                <>
                                                    <FiCheck /> In Cart
                                                </>
                                            ) : (
                                                <>
                                                    <FiShoppingCart /> Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className={styles.additionalInfo}>
                                <div className={styles.infoItem}>
                                    <strong>Language:</strong> {book.language || 'English'}
                                </div>
                                {book.publishedDate && (
                                    <div className={styles.infoItem}>
                                        <strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}
                                    </div>
                                )}
                                {book.isbn && (
                                    <div className={styles.infoItem}>
                                        <strong>ISBN:</strong> {book.isbn}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
