const REGISTER_PATTERN = /^[A-Za-z0-9]{4,20}$/;

export interface ValidationResult {
    valid: boolean;
    message: string;
}

export function validateName(name: string): ValidationResult {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
        return { valid: false, message: 'Please enter your full name.' };
    }
    if (trimmed.length > 100) {
        return { valid: false, message: 'Name is too long.' };
    }
    return { valid: true, message: '' };
}

export function validateRegisterNumber(reg: string): ValidationResult {
    const trimmed = reg.trim();
    if (!trimmed) {
        return { valid: false, message: 'Please enter your register number.' };
    }
    if (!REGISTER_PATTERN.test(trimmed)) {
        return {
            valid: false,
            message: 'Please enter a valid college register number (e.g. 26UBC156).',
        };
    }
    return { valid: true, message: '' };
}
