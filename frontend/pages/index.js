import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import HeroSlider from '../components/HeroSlider';
import BookCard from '../components/BookCard';
import api from '../utils/api';
import { FiBook, FiShoppingCart, FiDownload, FiArrowRight } from 'react-icons/fi';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedBooks();
    }, []);

    const fetchFeaturedBooks = async () => {
        try {
            const { data } = await api.get('/books/featured');
            setFeaturedBooks(data.books);
        } catch (error) {
            console.error('Error fetching featured books:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            {/* Hero Section */}
            <HeroSlider />

            {/* Features Section */}
            <section className={styles.features}>
                <div className="container">
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FiBook />
                            </div>
                            <h3>Vast Collection</h3>
                            <p>Access thousands of books across multiple genres and categories</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FiShoppingCart />
                            </div>
                            <h3>Secure Payments</h3>
                            <p>Safe and secure UPI payment integration for hassle-free transactions</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <FiDownload />
                            </div>
                            <h3>Instant Download</h3>
                            <p>Download your purchased books immediately in PDF or EPUB format</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Books */}
            <section className={styles.featured}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Featured Books</h2>

                    {loading ? (
                        <div className="flex-center" style={{ padding: '3rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-4">
                            {featuredBooks.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}

                    <div className={styles.viewAll}>
                        <Link href="/books" className="btn btn-primary">
                            View All Books <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
