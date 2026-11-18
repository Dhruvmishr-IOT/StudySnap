
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-brand">

                    <Link to="/dashboard" className="footer-logo">
                        📚 <span>StudySnap</span>
                    </Link>

                    <p>
                        Transform your study images into digital
                        notes and organized PDFs. Make learning
                        simple, smart and productive.
                    </p>

                    <div >
                        <a href="https://github.com/"><i class="fa-brands fa-github"></i></a>
                        <a href="https://linkedin.com/"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="mailto:support@studysnap.com"><i class="fa-solid fa-envelope"></i></a>
                    </div>

                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <Link to="/dashboard">Dashboard</Link>
                    <a href="/dashboard#upload">Upload Notes</a>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>

                <div className="footer-links">
                    <h3>Features</h3>
                    <a href="/dashboard#upload">Image Upload</a>
                    <a href="/dashboard#upload">Text Extraction</a>
                    <a href="/dashboard#upload">PDF Generation</a>
                    <a href="/dashboard#home">Study Tools</a>
                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} StudySnap.
                    All rights reserved.
                </p>

                <p>Made with Dhruv  for students</p>

                <a href="#home" className="footer-top">
                    Back to Top ↑
                </a>

            </div>

        </footer>
    );
}

export default Footer;
