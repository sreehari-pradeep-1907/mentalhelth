import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { quizQuestions } from '../data/quizData';
import './Quiz.css';

const TOTAL = quizQuestions.length;

export default function Quiz() {
    const navigate = useNavigate();
    const { state, recordAnswer, recordResults } = useApp();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [phase, setPhase] = useState<'question' | 'feedback'>('question');
    // Track all answers locally until quiz done, then submit to server
    const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});

    // Guard
    useEffect(() => {
        if (!state.name) navigate('/register', { replace: true });
    }, [state.name, navigate]);

    const question = quizQuestions[currentIndex];
    const progress = ((currentIndex) / TOTAL) * 100;

    const handleSelect = useCallback((key: string) => {
        if (phase === 'feedback') return;
        setSelectedOption(key);
        setShowError(false);
    }, [phase]);

    const handleSubmitAnswer = useCallback(() => {
        if (!selectedOption) {
            setShowError(true);
            return;
        }
        recordAnswer(question.id, selectedOption);
        setLocalAnswers(prev => ({ ...prev, [question.id]: selectedOption }));
        setSubmitted(true);
        setPhase('feedback');
    }, [selectedOption, question.id, recordAnswer]);

    const handleNext = useCallback(async () => {
        const isLast = currentIndex === TOTAL - 1;
        if (isLast) {
            // All answers collected — send to server for scoring
            const finalAnswers = { ...localAnswers, [question.id]: selectedOption! };
            try {
                const { submitQuiz } = await import('../services/api');
                const response = await submitQuiz({
                    name: state.name,
                    registerNumber: state.registerNumber,
                    answers: finalAnswers,
                    results: {}, // server calculates
                    score: 0,    // server calculates
                    completed: true,
                });
                // Use server score & results
                recordResults(response.results ?? {}, response.score ?? 0);
            } catch {
                // Even if submission fails here, navigate to result; Result page retries
                recordResults({}, 0);
            }
            navigate('/result', { state: { answers: localAnswers } });
        } else {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setSubmitted(false);
            setPhase('question');
            setShowError(false);
        }
    }, [currentIndex, localAnswers, question.id, selectedOption, state, recordResults, navigate]);

    return (
        <div className="quiz-page page">
            {/* Header progress */}
            <header className="quiz-header" role="banner">
                <div className="quiz-header-inner">
                    <span className="quiz-q-label">Question {currentIndex + 1} of {TOTAL}</span>
                    <div className="progress-bar-track" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemax={TOTAL}>
                        <div className="progress-bar-fill" style={{ width: `${progress + (100 / TOTAL)}%` }} />
                    </div>
                </div>
            </header>

            <main className="quiz-main container" role="main">
                {/* Quiz intro text (first question only) */}
                {currentIndex === 0 && (
                    <div className="quiz-intro stagger">
                        <h1 className="quiz-intro-title animate-fadeInUp">How closely did you listen?</h1>
                        <p className="quiz-intro-sub animate-fadeInUp text-muted">The answers are all hidden inside the story.</p>
                    </div>
                )}

                <div className="card quiz-card animate-scaleIn" key={question.id}>
                    <p className="quiz-question-number">Question {question.number}</p>
                    <h2 className="quiz-question-text">{question.question}</h2>

                    <div className="quiz-options" role="radiogroup" aria-label="Answer options">
                        {question.options.map(opt => {
                            const isSelected = selectedOption === opt.key;
                            let cls = 'quiz-option';
                            if (isSelected) cls += ' quiz-option--selected';
                            if (submitted && isSelected) cls += ' quiz-option--submitted';

                            return (
                                <button
                                    key={opt.key}
                                    className={cls}
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() => handleSelect(opt.key)}
                                    disabled={phase === 'feedback'}
                                    aria-label={`Option ${opt.key}: ${opt.text}`}
                                >
                                    <span className="quiz-option-key">{opt.key}</span>
                                    <span className="quiz-option-text">{opt.text}</span>
                                </button>
                            );
                        })}
                    </div>

                    {showError && (
                        <p className="quiz-error" role="alert">Please select an answer before continuing.</p>
                    )}

                    {phase === 'feedback' && (
                        <div className="quiz-feedback animate-fadeIn">
                            <p className="quiz-feedback-text">
                                Answer recorded. Click below to continue.
                            </p>
                        </div>
                    )}

                    <div className="quiz-actions">
                        {phase === 'question' ? (
                            <button className="btn btn-primary quiz-btn" onClick={handleSubmitAnswer}>
                                Submit Answer →
                            </button>
                        ) : (
                            <button className="btn btn-primary quiz-btn" onClick={handleNext}>
                                {currentIndex === TOTAL - 1 ? 'See Your Results →' : 'Next Question →'}
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <footer className="site-footer">
                <p>An interactive mental-health awareness project.</p>
            </footer>
        </div>
    );
}
