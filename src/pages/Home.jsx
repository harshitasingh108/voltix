import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Solutions from "../components/sections/Solutions";
import About from "../components/sections/About";
import "../styles/theme.css";
function Home() {
    return (
        <main className="hero-bg">
            <Navbar />
            <Hero />
            <Solutions />
            <About />
        </main>
    );
}

export default Home;