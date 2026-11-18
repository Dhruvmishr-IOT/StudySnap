
import { BookOpen } from "lucide-react";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="brand">
                <BookOpen size={28} />
                <h2>StudySnap</h2>
            </div>

            <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#upload">Upload Notes</a>
                <a href="#about">About</a>
            </div>
        </nav>
    );
}

export default Navbar;
