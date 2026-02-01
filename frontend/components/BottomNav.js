import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBook, FiUser, FiShoppingCart, FiSettings } from 'react-icons/fi';
import styles from '../styles/BottomNav.module.css';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const router = useRouter();
    const { isAuthenticated, isAdmin } = useAuth();

    const isActive = (path) => router.pathname === path;

    return (
        <div className={styles.bottomNav}>
            <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                <FiHome size={24} />
                <span>Home</span>
            </Link>

            <Link href="/books" className={`${styles.navItem} ${isActive('/books') ? styles.active : ''}`}>
                <FiBook size={24} />
                <span>Books</span>
            </Link>

            <Link href="/cart" className={`${styles.navItem} ${isActive('/cart') ? styles.active : ''}`}>
                <FiShoppingCart size={24} />
                <span>Cart</span>
            </Link>

            {isAuthenticated ? (
                <>
                    {isAdmin ? (
                        <Link href="/admin" className={`${styles.navItem} ${isActive('/admin') ? styles.active : ''}`}>
                            <FiSettings size={24} />
                            <span>Admin</span>
                        </Link>
                    ) : (
                        <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                            <FiUser size={24} />
                            <span>Profile</span>
                        </Link>
                    )}
                </>
            ) : (
                <Link href="/login" className={`${styles.navItem} ${isActive('/login') ? styles.active : ''}`}>
                    <FiUser size={24} />
                    <span>Login</span>
                </Link>
            )}
        </div>
    );
}
