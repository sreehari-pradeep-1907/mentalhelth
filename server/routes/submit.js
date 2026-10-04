const express = require('express');
const { submitLimiter } = require('../middleware/rateLimiter');
const { validateSubmit } = require('../middleware/validateSubmit');
const { CORRECT_ANSWERS } = require('../config/answers');
const { appendToSheet } = require('../services/sheets');

const router = express.Router();

router.post('/submit', submitLimiter, validateSubmit, async (req, res) => {
    try {
        const { name, registerNumber, answers } = req.body;

        // Server-side scoring — never trust the client score
        const results = {};
        let score = 0;
        const keys = ['q1', 'q2', 'q3', 'q4', 'q5'];
        for (const key of keys) {
            const correct = answers[key].toUpperCase() === CORRECT_ANSWERS[key].toUpperCase();
            results[key] = correct;
            if (correct) score++;
        }

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const rowData = {
            timestamp,
            name,
            registerNumber,
            q1Answer: answers.q1,
            q1Result: results.q1 ? 'Correct' : 'Wrong',
            q2Answer: answers.q2,
            q2Result: results.q2 ? 'Correct' : 'Wrong',
            q3Answer: answers.q3,
            q3Result: results.q3 ? 'Correct' : 'Wrong',
            q4Answer: answers.q4,
            q4Result: results.q4 ? 'Correct' : 'Wrong',
            q5Answer: answers.q5,
            q5Result: results.q5 ? 'Correct' : 'Wrong',
            totalScore: `${score}/5`,
            completed: 'Yes',
        };

        await appendToSheet(rowData);

        return res.status(200).json({
            success: true,
            score,
            results,
            message: 'Response recorded successfully.',
        });
    } catch (err) {
        console.error('Submit error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'We couldn\'t save your response right now. Please try again.',
        });
    }
});

module.exports = router;
