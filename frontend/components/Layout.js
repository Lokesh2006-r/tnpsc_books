import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
                {children}
            </main>
            <Footer />
            <BottomNav />
            {/* Spacer for bottom nav on mobile */}
            <div className="mobile-nav-spacer"></div>
        </div>
    );
}
