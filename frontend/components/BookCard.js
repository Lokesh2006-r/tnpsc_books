import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import styles from '../styles/BookCard.module.css';

export default function BookCard({ book }) {
    const { addToCart, isInCart } = useCart();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(book);
    };

    return (
        <Link href={`/books/${book._id}`} className={styles.bookCard}>
            <div className={styles.imageContainer}>
                <img
                    src={`${API_URL}/${book.coverImage}`}
                    alt={book.title}
                    className={styles.bookImage}
                />
                <div className={styles.overlay}>
                    <button
                        onClick={handleAddToCart}
                        className={`btn ${isInCart(book._id) ? 'btn-secondary' : 'btn-primary'}`}
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
                </div>
            </div>

            <div className={styles.bookInfo}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>by {book.author}</p>
                <p className={styles.bookDescription}>{book.shortDescription}</p>

                <div className={styles.bookFooter}>
                    <span className={styles.bookPrice}>₹{book.price}</span>
                    <span className={styles.bookCategory}>{book.category}</span>
                </div>
            </div>
        </Link>
    );
}
