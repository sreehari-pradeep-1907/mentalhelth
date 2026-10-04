const REGISTER_PATTERN = /^[A-Za-z0-9]{4,20}$/;
const VALID_OPTIONS = ['A', 'B', 'C', 'D'];
const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'];

function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '').substring(0, 200);
}

function validateSubmit(req, res, next) {
    const { name, registerNumber, answers } = req.body;

    const cleanName = sanitizeString(name);
    if (!cleanName || cleanName.length < 2) {
        return res.status(400).json({ error: 'A valid full name is required.' });
    }

    const cleanRegister = sanitizeString(registerNumber);
    if (!cleanRegister || !REGISTER_PATTERN.test(cleanRegister)) {
        return res.status(400).json({ error: 'Please enter a valid college register number.' });
    }

    if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'Answers are required.' });
    }

    for (const key of QUESTION_KEYS) {
        const ans = answers[key];
        if (!ans || !VALID_OPTIONS.includes(ans.toUpperCase())) {
            return res.status(400).json({ error: `Invalid or missing answer for ${key}.` });
        }
    }

    // Attach sanitised values
    req.body.name = cleanName;
    req.body.registerNumber = cleanRegister;
    for (const key of QUESTION_KEYS) {
        req.body.answers[key] = answers[key].toUpperCase();
    }

    next();
}

module.exports = { validateSubmit };
