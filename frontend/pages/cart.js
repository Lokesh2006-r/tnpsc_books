import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../utils/api';
import styles from '../styles/Cart.module.css';

export default function Cart() {
    const router = useRouter();
    const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to checkout');
            router.push('/login?redirect=/cart');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        try {
            const bookIds = cartItems.map(item => item._id);
            const { data } = await api.post('/orders', { books: bookIds });

            clearCart();
            router.push(`/checkout?orderId=${data.order._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating order');
        }
    };

    return (
        <Layout>
            <div className={styles.cartPage}>
                <div className="container">
                    <h1 className={styles.pageTitle}>Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <FiShoppingBag className={styles.emptyIcon} />
                            <h2>Your cart is empty</h2>
                            <p>Add some books to get started!</p>
                            <button onClick={() => router.push('/books')} className="btn btn-primary">
                                Browse Books
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cartContent}>
                            <div className={styles.cartItems}>
                                {cartItems.map(book => (
                                    <div key={book._id} className={styles.cartItem}>
                                        <img
                                            src={`${API_URL}/${book.coverImage}`}
                                            alt={book.title}
                                            className={styles.itemImage}
                                        />

                                        <div className={styles.itemInfo}>
                                            <h3>{book.title}</h3>
                                            <p className={styles.itemAuthor}>by {book.author}</p>
                                            <p className={styles.itemCategory}>{book.category}</p>
                                        </div>

                                        <div className={styles.itemPrice}>₹{book.price}</div>

                                        <button
                                            onClick={() => removeFromCart(book._id)}
                                            className={styles.removeBtn}
                                            aria-label="Remove from cart"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.cartSummary}>
                                <h2>Order Summary</h2>

                                <div className={styles.summaryRow}>
                                    <span>Items ({cartItems.length})</span>
                                    <span>₹{getCartTotal()}</span>
                                </div>

                                <div className={styles.summaryTotal}>
                                    <span>Total</span>
                                    <span>₹{getCartTotal()}</span>
                                </div>

                                <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%' }}>
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="btn btn-outline"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
