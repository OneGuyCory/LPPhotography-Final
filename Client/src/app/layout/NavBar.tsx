import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

// Navbar component manages navigation links, responsive menu, and user session awareness
const Navbar: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false); // Track mobile menu toggle
    const [userRole, setUserRole] = useState<string | null>(null); // Track current user's role

    const location = useLocation();

    // Auto-close mobile menu when route changes
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // On component mount, pull role from localStorage (persisted from login)
    useEffect(() => {
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    // Log out function clears session and redirects
    const logout = async () => {
        await fetch("https://localhost:5001/api/users/logout", {
            method: "POST",
            credentials: "include",
        });

        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
    };

    return (
        <nav
            className="sticky top-0 text-white p-4"
            style={{
                background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
                //linear-gradient(to right, #0F0F0F 0%, #1F3540 55%, #365348 90%
            }}
        >
            <div className="flex items-center justify-between" >
                {/* Logo / Home Link */}
                <Link to="/" className="text-xl font-bold hover:underline" style={{ fontFamily: '"Rock Salt", cursive' }}>
                    LP Photography
                </Link>

                {/* Mobile menu toggle button */}
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    ☰
                </button>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-6">
                    <li className="hover:underline"><Link to="/">Home</Link></li>
                    <li className="hover:underline"><Link to="/galleries">Galleries</Link></li>
                    <li className="hover:underline"><Link to="/contact">Contact</Link></li>

                    {/* Conditional links based on user role */}
                    {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}

                    {/* Show logout or login depending on session */}
                    {userRole ? (
                        <li>
                            <button onClick={logout} className="hover:underline">
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li className="hover:underline"><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>

            {/* Mobile Navigation Dropdown */}
            {open && (
                <ul className="flex flex-col md:hidden mt-2 space-y-2">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/galleries">Galleries</Link></li>
                    <li><Link to="/contact">Contact</Link></li>

                    {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}

                    {userRole ? (
                        <li>
                            <button onClick={logout} className="hover:underline text-left">
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
