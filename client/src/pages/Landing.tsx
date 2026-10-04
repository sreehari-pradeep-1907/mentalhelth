import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing">
            {/* Background texture */}
            <div className="landing-bg" aria-hidden="true">
                <div className="landing-bg-gradient" />
                <div className="landing-bg-noise" />
            </div>

            <main className="landing-main" role="main">
                <div className="landing-content stagger">
                    <p className="landing-label animate-fadeInUp">An interactive mental-health awareness experience</p>

                    <h1 className="landing-headline animate-fadeInUp">
                        Sometimes, you don't&nbsp;know<br />
                        <span className="landing-headline-em">what someone is going through.</span>
                    </h1>

                    <p className="landing-sub animate-fadeInUp">
                        One story. Five questions.<br />
                        A different way to understand what someone may be carrying silently.
                    </p>

                    <button
                        className="btn btn-primary landing-cta animate-fadeInUp"
                        onClick={() => navigate('/register')}
                        aria-label="Begin the experience"
                    >
                        Begin the Experience
                        <span className="cta-arrow" aria-hidden="true">→</span>
                    </button>

                    <p className="landing-disclaimer animate-fadeInUp">
                        Not a diagnostic tool. Not a survey.<br />
                        A story worth paying attention to.
                    </p>
                </div>

                <div className="landing-scroll-hint animate-fadeIn" aria-hidden="true">
                    <span />
                </div>
            </main>

            <footer className="site-footer landing-footer">
                <p>An interactive mental-health awareness project.</p>
                <p>This experience is intended for awareness and education. It is not a substitute for professional mental-health care.</p>
            </footer>
        </div>
    );
}
