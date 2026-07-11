import { BrowserRouter, Routes, Route } from "react-router-dom";
import CursorGlow from "./components/common/CursorGlow";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import Solutions from "./pages/Solutions";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>

      <CursorGlow />
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

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