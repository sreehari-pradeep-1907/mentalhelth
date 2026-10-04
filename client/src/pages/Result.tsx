import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { submitQuiz } from '../services/api';
import './Result.css';

export default function Result() {
    const navigate = useNavigate();
    const { state, markSubmitted, restart } = useApp();

    const [displayScore, setDisplayScore] = useState(0);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const hasSubmitted = useRef(false);

    // Guard
    useEffect(() => {
        if (!state.name) {
            navigate('/register', { replace: true });
        }
    }, [state.name, navigate]);

    // Animate score counter
    useEffect(() => {
        const target = state.score;
        if (target === 0) { setDisplayScore(0); return; }
        let current = 0;
        const step = () => {
            current++;
            setDisplayScore(current);
            if (current < target) setTimeout(step, 220);
        };
        const t = setTimeout(step, 600);
        return () => clearTimeout(t);
    }, [state.score]);

    // Auto-submit if not yet submitted (retry case / direct nav)
    useEffect(() => {
        if (hasSubmitted.current || state.submitted) return;
        if (!state.name || Object.keys(state.answers).length < 5) return;

        async function doSubmit() {
            hasSubmitted.current = true;
            setSubmitStatus('loading');
            try {
                const response = await submitQuiz({
                    name: state.name,
                    registerNumber: state.registerNumber,
                    answers: state.answers,
                    results: state.results,
                    score: state.score,
                    completed: true,
                });
                if (response.success) {
                    markSubmitted();
                    setSubmitStatus('success');
                } else {
                    throw new Error(response.error);
                }
            } catch (err: unknown) {
                setSubmitStatus('error');
                setErrorMsg(err instanceof Error ? err.message : 'Unexpected error.');
                hasSubmitted.current = false; // allow retry
            }
        }

        doSubmit();
    }, []); // run once on mount

    async function handleRetry() {
        hasSubmitted.current = false;
        setSubmitStatus('loading');
        setErrorMsg('');
        try {
            const response = await submitQuiz({
                name: state.name,
                registerNumber: state.registerNumber,
                answers: state.answers,
                results: state.results,
                score: state.score,
                completed: true,
            });
            if (response.success) {
                hasSubmitted.current = true;
                markSubmitted();
                setSubmitStatus('success');
            } else throw new Error(response.error);
        } catch (err: unknown) {
            setSubmitStatus('error');
            setErrorMsg(err instanceof Error ? err.message : 'Unexpected error.');
        }
    }

    function handleRestart() {
        restart();
        navigate('/register', { replace: true });
    }

    const scoreLabel = `${state.score} / 5`;

    return (
        <div className="result-page page">
            <main className="container result-main" role="main">
                {/* Title */}
                <div className="result-header stagger">
                    <p className="landing-label animate-fadeInUp">Complete</p>
                    <h1 className="result-title animate-fadeInUp">Your Journey Through the Story</h1>
                </div>

                {/* Participant info */}
                <div className="card result-card animate-scaleIn">
                    <div className="result-participant">
                        <div className="result-participant-name">{state.name}</div>
                        <div className="result-participant-reg text-muted">Register No: {state.registerNumber}</div>
                    </div>

                    {/* Score */}
                    <div className="result-score-section">
                        <div className="result-score-label">Score</div>
                        <div className="result-score-display" aria-live="polite" aria-label={`Your score is ${scoreLabel}`}>
                            <span className="result-score-number">{displayScore}</span>
                            <span className="result-score-denom"> / 5</span>
                        </div>
                        <div className="result-score-dots" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map(n => (
                                <span key={n} className={`result-dot${n <= state.score ? ' result-dot--filled' : ''}`} />
                            ))}
                        </div>
                    </div>

                    {/* Save status */}
                    <div className="result-save-status">
                        {submitStatus === 'loading' && (
                            <p className="result-status-msg result-status--loading">
                                <span className="spinner" aria-hidden="true" /> Saving your response…
                            </p>
                        )}
                        {submitStatus === 'success' && (
                            <p className="result-status-msg result-status--success">
                                ✓ Response recorded successfully.
                            </p>
                        )}
                        {submitStatus === 'error' && (
                            <div className="result-error-block">
                                <p className="result-status-msg result-status--error">
                                    We couldn't save your response right now.
                                </p>
                                <p className="result-status-sub">{errorMsg}</p>
                                <button className="btn btn-ghost" onClick={handleRetry}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div className="result-message stagger">
                    <p className="result-msg-line animate-fadeInUp">
                        The goal wasn't simply to remember the answers.
                    </p>
                    <p className="result-msg-line animate-fadeInUp">
                        The important part was understanding how listening, patience, and support can make a difference.
                    </p>
                    <p className="result-tagline animate-fadeInUp">Listen. Notice. Support.</p>
                </div>

                {/* Actions */}
                <div className="result-actions animate-fadeIn">
                    <button className="btn btn-ghost" onClick={handleRestart}>
                        ↺ Experience Again
                    </button>
                </div>
            </main>

            <footer className="site-footer">
                <p>An interactive mental-health awareness project.</p>
                <p>This experience is intended for awareness and education. It is not a substitute for professional mental-health care.</p>
            </footer>
        </div>
    );
}
