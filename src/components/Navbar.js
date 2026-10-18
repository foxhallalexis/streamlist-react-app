import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <img
                src={process.env.PUBLIC_URL + "/eztechmovielogo1.png"}
                alt="EZTechMovie Logo"
                className="navbar-logo-img"
            />
            <ul className="nav-links">
                <li><Link to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
                    <span className="material-symbols-rounded nav-icon">home</span>
                    Home
                </Link></li>
                <li><Link to="/movies" className={location.pathname === "/movies" ? "nav-link active" : "nav-link"}>
                    <span className="material-symbols-rounded nav-icon">movie</span>    
                    Movies
                </Link></li>
                <li><Link to="/cart" className={location.pathname === "/cart" ? "nav-link active" : "nav-link"}>
                    <span className="material-symbols-rounded nav-icon">shopping_cart</span>
                    Cart
                </Link></li>
                <li><Link to="/about" className={location.pathname === "/about" ? "nav-link active" : "nav-link"}>
                    <span className="material-symbols-rounded nav-icon">help</span>
                    About
                </Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;