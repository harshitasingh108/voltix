import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Solutions from "../components/sections/Solutions";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import "../styles/theme.css";
function Home() {
    return (
        <main className="hero-bg">
            <Navbar />
            <Hero />
            <Solutions />
            <About />
            <Features />
        </main>
    );
}

export default Home;