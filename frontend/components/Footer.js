import Link from 'next/link';
import { FiGithub, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi';
import styles from '../styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    {/* About Section */}
                    <div className={styles.footerSection}>
                        <h3>About BookStore</h3>
                        <p>
                            Your trusted destination for digital books. Discover, purchase, and download
                            thousands of books instantly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerSection}>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link href="/books">Browse Books</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className={styles.footerSection}>
                        <h3>Legal</h3>
                        <ul>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/terms">Terms of Service</Link></li>
                            <li><Link href="/refund">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className={styles.footerSection}>
                        <h3>Connect With Us</h3>
                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Facebook"><FiFacebook /></a>
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="GitHub"><FiGithub /></a>
                            <a href="mailto:support@bookstore.com" aria-label="Email"><FiMail /></a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
