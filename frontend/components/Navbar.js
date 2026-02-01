import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiBook, FiSun, FiMoon, FiStar } from 'react-icons/fi';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { getCartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className={styles.navbar}>
            <div className="container">
                <div className={styles.navContent}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <FiBook className={styles.logoIcon} />
                        <span>BookStore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className={styles.navLinks}>
                        <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
                            Home
                        </Link>
                        <Link href="/books" className={router.pathname === '/books' ? styles.active : ''}>
                            Books
                        </Link>
                        {isAuthenticated && (
                            <Link href="/dashboard" className={router.pathname.startsWith('/dashboard') ? styles.active : ''}>
                                My Library
                            </Link>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className={router.pathname.startsWith('/admin') ? styles.active : ''}>
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className={styles.navRight}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={styles.themeToggle}
                            aria-label="Toggle Theme"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.25rem',
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem'
                            }}
                        >
                            {theme === 'light' && <FiMoon title="Switch to Dark Mode" />}
                            {theme === 'dark' && <FiStar title="Switch to Night Mode" />}
                            {theme === 'night' && <FiSun title="Switch to Light Mode" />}
                        </button>

                        {/* Cart */}
                        <Link href="/cart" className={styles.cartIcon}>
                            <FiShoppingCart />
                            {getCartCount() > 0 && (
                                <span className={styles.cartBadge}>{getCartCount()}</span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className={styles.userMenu}>
                                <button className={styles.userButton}>
                                    <FiUser />
                                    <span>{user?.name}</span>
                                </button>
                                <div className={styles.dropdown}>
                                    <Link href="/dashboard">Dashboard</Link>
                                    <Link href="/dashboard/orders">Orders</Link>
                                    <button onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.authButtons}>
                                <Link href="/login" className="btn btn-outline">
                                    Login
                                </Link>
                                <Link href="/signup" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className={styles.mobileToggle}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/books" onClick={() => setMobileMenuOpen(false)}>Books</Link>
                        {isAuthenticated && (
                            <>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Library</Link>
                                {isAdmin && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                                )}
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                                    Logout
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
