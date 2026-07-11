import { useEffect, useState } from "react";

const CursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", moveCursor);

        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <div
            className="pointer-events-none fixed z-[9999] h-8 w-8 rounded-full bg-cyan-400/30 blur-sm transition-transform duration-75"
            style={{
                left: position.x - 16,
                top: position.y - 16,
            }}
        />
    );
};

export default CursorGlow;