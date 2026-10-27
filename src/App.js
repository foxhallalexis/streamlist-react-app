import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";

function AppContent() {
    const location = useLocation();

    const isLoginPage = location.pathname === "/";

    return (
        <>
            {!isLoginPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/streamlist" element={<StreamList />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
