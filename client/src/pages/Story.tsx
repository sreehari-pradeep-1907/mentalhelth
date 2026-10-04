import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { storyChapters } from '../data/storyData';
import './Story.css';

const TOTAL = storyChapters.length;

// Hue shifts per chapter for subtle warm→cool progression
const chapterHues = [220, 215, 210, 205, 200, 195, 185, 170, 150];

export default function Story() {
    const navigate = useNavigate();
    const { state, setCurrentChapter } = useApp();
    const [activeChapter, setActiveChapter] = useState(0); // 0-indexed
    const [showIntro, setShowIntro] = useState(true);
    const chapterRefs = useRef<(HTMLElement | null)[]>([]);

    // Guard: if no name registered, go back
    useEffect(() => {
        if (!state.name) navigate('/register', { replace: true });
    }, [state.name, navigate]);

    // IntersectionObserver to track which chapter is in view
    useEffect(() => {
        if (showIntro) return;
        const observers: IntersectionObserver[] = [];
        chapterRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveChapter(i);
                        setCurrentChapter(i + 1);
                    }
                },
                { threshold: 0.4 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, [showIntro, setCurrentChapter]);

    const progress = ((activeChapter + 1) / TOTAL) * 100;

    const handleContinue = useCallback(() => {
        setShowIntro(false);
        setTimeout(() => {
            chapterRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, []);

    const handleQuizStart = useCallback(() => navigate('/quiz'), [navigate]);

    if (showIntro) {
        return (
            <div className="story-intro-screen">
                <div className="story-intro-content stagger">
                    <p className="landing-label animate-fadeInUp">{state.name}</p>
                    <h1 className="story-intro-title animate-fadeInUp">Meet Aarav.</h1>
                    <p className="story-intro-sub animate-fadeInUp">Everyone thought they knew him.</p>
                    <p className="story-intro-hint animate-fadeInUp">Scroll to read his story.</p>
                    <button
                        className="btn btn-primary animate-fadeInUp"
                        onClick={handleContinue}
                        aria-label="Begin reading"
                    >
                        Begin Reading →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="story-page">
            {/* Fixed progress header */}
            <header className="story-header" role="banner">
                <div className="story-header-inner">
                    <span className="story-chapter-label">Chapter {activeChapter + 1} / {TOTAL}</span>
                    <div className="progress-bar-track" role="progressbar" aria-valuenow={activeChapter + 1} aria-valuemax={TOTAL}>
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="story-chapter-sub">{storyChapters[activeChapter]?.subtitle}</span>
                </div>
            </header>

            {/* Chapters */}
            <main id="story-content">
                {storyChapters.map((ch, i) => {
                    const hue = chapterHues[i] ?? 200;
                    const isActive = i === activeChapter;
                    return (
                        <section
                            key={ch.id}
                            ref={el => { chapterRefs.current[i] = el; }}
                            className={`story-chapter${isActive ? ' story-chapter--active' : ''}`}
                            style={{ '--chapter-hue': hue } as React.CSSProperties}
                            aria-label={`${ch.title}: ${ch.subtitle}`}
                        >
                            <div className="story-chapter-inner container">
                                <div className="story-chapter-tag">{ch.title}</div>
                                <h2 className="story-chapter-title">{ch.subtitle}</h2>
                                <div className="story-chapter-body">
                                    {ch.content.map((para, j) => (
                                        <p key={j} className="story-para">{para}</p>
                                    ))}
                                </div>

                                {/* CTA on last chapter */}
                                {i === TOTAL - 1 && (
                                    <div className="story-final-cta">
                                        <div className="story-final-rule" />
                                        <p className="story-final-prompt">You've reached the end of Aarav's story.</p>
                                        <button className="btn btn-primary" onClick={handleQuizStart} aria-label="Start quiz">
                                            See What You Remember →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })}
            </main>
        </div>
    );
}
