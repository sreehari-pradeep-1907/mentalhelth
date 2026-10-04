export interface SubmitPayload {
    name: string;
    registerNumber: string;
    answers: Record<string, string>;
    results: Record<string, boolean>;
    score: number;
    completed: boolean;
}

export interface SubmitResponse {
    success: boolean;
    score?: number;
    results?: Record<string, boolean>;
    message?: string;
    error?: string;
}

export async function submitQuiz(payload: SubmitPayload): Promise<SubmitResponse> {
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data: SubmitResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
    }

    return data;
}
