import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { validateName, validateRegisterNumber } from '../utils/validation';
import './Registration.css';

export default function Registration() {
    const navigate = useNavigate();
    const { setParticipant } = useApp();

    const [name, setName] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [nameError, setNameError] = useState('');
    const [regError, setRegError] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const nv = validateName(name);
        const rv = validateRegisterNumber(registerNumber);

        setNameError(nv.message);
        setRegError(rv.message);

        if (!nv.valid || !rv.valid) return;

        setParticipant(name, registerNumber);
        navigate('/story');
    }

    return (
        <div className="page reg-page">
            <main className="container reg-container" role="main">
                <div className="card reg-card animate-scaleIn">
                    <div className="reg-back">
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')} aria-label="Go back">
                            ← Back
                        </button>
                    </div>

                    <div className="reg-header stagger">
                        <p className="landing-label animate-fadeInUp">Step 1 of 3</p>
                        <h1 className="reg-title animate-fadeInUp">Before we begin…</h1>
                        <p className="reg-sub animate-fadeInUp text-muted">
                            We'll need a couple of details to identify your participation in this project.
                        </p>
                    </div>

                    <form className="reg-form" onSubmit={handleSubmit} noValidate>
                        <div className="input-group animate-fadeInUp">
                            <label htmlFor="name" className="input-label">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                className={`input-field${nameError ? ' error' : ''}`}
                                placeholder="Enter your full name"
                                value={name}
                                maxLength={100}
                                autoComplete="name"
                                onChange={e => { setName(e.target.value); if (nameError) setNameError(''); }}
                                aria-describedby="name-error"
                                aria-invalid={!!nameError}
                            />
                            <span id="name-error" className="input-error" role="alert">{nameError}</span>
                        </div>

                        <div className="input-group animate-fadeInUp">
                            <label htmlFor="reg" className="input-label">College Register Number</label>
                            <input
                                id="reg"
                                type="text"
                                className={`input-field${regError ? ' error' : ''}`}
                                placeholder="e.g. 26UBC156"
                                value={registerNumber}
                                maxLength={20}
                                autoComplete="off"
                                autoCapitalize="characters"
                                onChange={e => { setRegisterNumber(e.target.value); if (regError) setRegError(''); }}
                                aria-describedby="reg-error"
                                aria-invalid={!!regError}
                            />
                            <span id="reg-error" className="input-error" role="alert">{regError}</span>
                        </div>

                        <button type="submit" className="btn btn-primary reg-btn">
                            Continue →
                        </button>

                        <p className="reg-privacy">
                            Your name and register number are collected only for academic project participation and response identification.
                        </p>
                    </form>
                </div>
            </main>

            <footer className="site-footer">
                <p>An interactive mental-health awareness project.</p>
                <p>This experience is intended for awareness and education. It is not a substitute for professional mental-health care.</p>
            </footer>
        </div>
    );
}
