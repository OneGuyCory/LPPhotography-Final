import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    const logout = async () => {
        await fetch("https://localhost:5001/api/users/logout", {
            method: "POST",
            credentials: "include",
        });
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
    };

    //pink gradient
    
    // green gradient
    //background: linear-gradient(to right, #0F0F0F 0%, #1F3540 55%, #365348 90%);

    return (        
        <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-md shadow-lg " style={{
            background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`
        }}>
            <div className="w-full px-6 py-4 flex items-center justify-between text-white">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-bold tracking-wider hover:underline"
                >
                    LP Photography
                </Link>

                {/* Hamburger for Mobile */}
                <button
                    className="md:hidden text-2xl focus:outline-none"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide">
                    <li className="hover:underline"><Link to="/">Home</Link></li>
                    <li className="hover:underline"><Link to="/galleries">Galleries</Link></li>
                    <li className="hover:underline"><Link to="/contact">Contact</Link></li>
                    {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}
                    {userRole ? (
                        <li>
                            <button
                                onClick={logout}
                                className="hover:underline hover:text-red-300 transition"
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li className="hover:underline"><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden px-6 pb-4 text-sm font-semibold animate-slideDown text-white">
                    <ul className="space-y-3 mt-2">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/galleries">Galleries</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                        {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}
                        {userRole ? (
                            <li>
                                <button onClick={logout} className="hover:underline hover:text-red-300">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
