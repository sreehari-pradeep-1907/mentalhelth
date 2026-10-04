import React, { createContext, useContext, useState, useCallback } from 'react';

export interface QuizAnswer {
    selected: string;
    correct: boolean;
}

interface AppState {
    name: string;
    registerNumber: string;
    currentChapter: number;
    currentQuestion: number;
    answers: Record<string, string>;
    results: Record<string, boolean>;
    score: number;
    submitted: boolean;
}

interface AppContextType {
    state: AppState;
    setParticipant: (name: string, reg: string) => void;
    setCurrentChapter: (ch: number) => void;
    setCurrentQuestion: (q: number) => void;
    recordAnswer: (questionId: string, selected: string) => void;
    recordResults: (results: Record<string, boolean>, score: number) => void;
    markSubmitted: () => void;
    restart: () => void;
}

const defaultState: AppState = {
    name: '',
    registerNumber: '',
    currentChapter: 1,
    currentQuestion: 0,
    answers: {},
    results: {},
    score: 0,
    submitted: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AppState>(defaultState);

    const setParticipant = useCallback((name: string, reg: string) => {
        setState(s => ({ ...s, name: name.trim(), registerNumber: reg.trim() }));
    }, []);

    const setCurrentChapter = useCallback((ch: number) => {
        setState(s => ({ ...s, currentChapter: ch }));
    }, []);

    const setCurrentQuestion = useCallback((q: number) => {
        setState(s => ({ ...s, currentQuestion: q }));
    }, []);

    const recordAnswer = useCallback((questionId: string, selected: string) => {
        setState(s => ({ ...s, answers: { ...s.answers, [questionId]: selected } }));
    }, []);

    const recordResults = useCallback((results: Record<string, boolean>, score: number) => {
        setState(s => ({ ...s, results, score }));
    }, []);

    const markSubmitted = useCallback(() => {
        setState(s => ({ ...s, submitted: true }));
    }, []);

    const restart = useCallback(() => {
        setState({ ...defaultState });
    }, []);

    return (
        <AppContext.Provider
            value={{ state, setParticipant, setCurrentChapter, setCurrentQuestion, recordAnswer, recordResults, markSubmitted, restart }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
