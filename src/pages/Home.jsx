import Hero from "../components/sections/Hero";
import Solutions from "../components/sections/Solutions";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import About from "../components/sections/About";
import "../styles/theme.css";

function Home() {
    return (
        <main className="hero-bg">
            <Hero />
            <Solutions />
            <Features />
            <HowItWorks />
            <About />
        </main>
    );
}

export default Home;