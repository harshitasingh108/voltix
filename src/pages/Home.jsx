import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Solutions from "../components/sections/Solutions";
import "../styles/theme.css";
function Home() {
    return (
        <main className="hero-bg">
            <Navbar />
            <Hero />
            <Solutions />
        </main>
    );
}

export default Home;