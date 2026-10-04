export interface QuizOption {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
}

export interface QuizQuestion {
    id: string;
    number: number;
    question: string;
    options: QuizOption[];
    // NOTE: correct answer is NOT stored here — it lives only on the server.
}

export const quizQuestions: QuizQuestion[] = [
    {
        id: 'q1',
        number: 1,
        question: "What was one of the first noticeable changes in Aarav's behaviour?",
        options: [
            { key: 'A', text: 'He became louder and more competitive in class.' },
            { key: 'B', text: 'He started withdrawing from conversations and arriving later.' },
            { key: 'C', text: 'He moved to a different hostel building.' },
            { key: 'D', text: 'He dropped his cricket membership officially.' },
        ],
    },
    {
        id: 'q2',
        number: 2,
        question: 'How did Priya respond when she noticed Aarav seemed quieter than usual?',
        options: [
            { key: 'A', text: 'She asked gently and then gave him space without pressure.' },
            { key: 'B', text: 'She reported the issue to his professor immediately.' },
            { key: 'C', text: 'She organised a group intervention with their friends.' },
            { key: 'D', text: 'She stopped talking to him to avoid making things awkward.' },
        ],
    },
    {
        id: 'q3',
        number: 3,
        question: 'What did Dr. Meera Pillai do when she noticed the change in Aarav?',
        options: [
            { key: 'A', text: 'She announced it to the class as a warning to others.' },
            { key: 'B', text: 'She deducted marks from his assignment as a wake-up call.' },
            { key: 'C', text: 'She privately checked in with him and gave him the counselling centre card.' },
            { key: 'D', text: "She contacted Aarav's parents about the situation." },
        ],
    },
    {
        id: 'q4',
        number: 4,
        question: 'Which of the following actions did Aarav take when he began asking for help?',
        options: [
            { key: 'A', text: 'He immediately transferred to a different college.' },
            { key: 'B', text: 'He rebuilt small routines — fixed wake times, breakfast, and returning to cricket gradually.' },
            { key: 'C', text: 'He disconnected from all his friends to focus on himself.' },
            { key: 'D', text: 'He decided professional support was unnecessary.' },
        ],
    },
    {
        id: 'q5',
        number: 5,
        question: 'What does the story suggest healing looks like?',
        options: [
            { key: 'A', text: 'A quick and complete return to how things were before.' },
            { key: 'B', text: 'Something that only works if others solve your problems for you.' },
            { key: 'C', text: 'A dramatic single moment where everything changes.' },
            { key: 'D', text: 'A gradual, non-linear process with both easier and harder days.' },
        ],
    },
];
