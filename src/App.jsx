import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CursorGlow from "./components/common/CursorGlow";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import SmartCharge from "./pages/SmartCharge";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Solutions from "./pages/Solutions";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

/**
 * ScrollToTop helper component to reset scroll position on route navigation.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <CursorGlow />
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/smart-charge" element={<SmartCharge />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;