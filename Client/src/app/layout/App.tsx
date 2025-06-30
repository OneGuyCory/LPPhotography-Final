import NavBar from "./NavBar"
import Footer from "./Footer"
import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "../../features/HomePage"
import ContactPage from "../../features/ContactPage"
import GalleryPage from "../../features/GalleryPage"
import GalleryDetailPage from "../../features/GalleryDetailPage"
import LoginPage from "../../features/LoginPage"
import AdminPage from "../../features/AdminPage"
import ClientGalleryPage from "../../features/ClientGalleryPage"

const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <main className="min-h-screen ">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/galleries" element={<GalleryPage />} />
                    <Route path="/galleries/:id" element={<GalleryDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/client-gallery" element={<ClientGalleryPage />} />

                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
