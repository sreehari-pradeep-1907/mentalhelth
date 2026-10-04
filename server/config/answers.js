// Correct answers are defined here server-side only.
// These must match the quiz option keys in client/src/data/quizData.ts.
// Override via CORRECT_ANSWERS env var (JSON string) if needed.

const defaults = {
    q1: 'B', // He started withdrawing from conversations
    q2: 'A', // "Are you okay?" / Not pressuring him
    q3: 'C', // Privately spoke to him / didn't embarrass him
    q4: 'B', // Talking to trusted people / rebuilding routine
    q5: 'D', // Healing is gradual, some days harder than others
};

let CORRECT_ANSWERS = defaults;

if (process.env.CORRECT_ANSWERS) {
    try {
        const parsed = JSON.parse(process.env.CORRECT_ANSWERS);
        CORRECT_ANSWERS = { ...defaults, ...parsed };
    } catch (e) {
        console.warn('CORRECT_ANSWERS env var could not be parsed; using defaults.');
    }
}

module.exports = { CORRECT_ANSWERS };
