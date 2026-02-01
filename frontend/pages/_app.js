import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <Component {...pageProps} />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default MyApp;
