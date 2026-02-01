import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import BookCard from '../../components/BookCard';
import api from '../../utils/api';
import { FiSearch, FiFilter } from 'react-icons/fi';
import styles from '../../styles/Books.module.css';

export default function Books() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help', 'Biography', 'History', 'Other'];

    useEffect(() => {
        fetchBooks();
    }, [page, category]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 12,
                ...(category !== 'All' && { category }),
                ...(search && { search })
            };

            console.log('Fetching books with params:', params);
            const { data } = await api.get('/books', { params });
            console.log('Books API response:', data);

            if (data && data.books) {
                setBooks(data.books);
                setTotalPages(data.pages || 1);
                console.log(`Loaded ${data.books.length} books`);
            } else {
                console.error('Unexpected data structure:', data);
                setBooks([]);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            console.error('Error response:', error.response);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBooks();
    };

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setPage(1);
    };

    return (
        <Layout>
            <div className={styles.booksPage}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Browse Books</h1>

                    {/* Search and Filters */}
                    <div className={styles.filters}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="Search books by title, author..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className="btn btn-primary">
                                <FiSearch /> Search
                            </button>
                        </form>

                        <div className={styles.categories}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`${styles.categoryBtn} ${category === cat ? styles.active : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Books Grid */}
                    {loading ? (
                        <div className="flex-center" style={{ padding: '3rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : books.length > 0 ? (
                        <>
                            <div className="grid grid-4">
                                {books.map(book => (
                                    <BookCard key={book._id} book={book} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="btn btn-outline"
                                    >
                                        Previous
                                    </button>
                                    <span className={styles.pageInfo}>
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="btn btn-outline"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.noBooks}>
                            <p>No books found. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
