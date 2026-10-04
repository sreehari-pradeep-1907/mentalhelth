const fetch = require('node-fetch');

async function appendToSheet(rowData) {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url) {
        console.warn('GOOGLE_APPS_SCRIPT_URL not set — skipping sheet append.');
        return { skipped: true };
    }

    const body = JSON.stringify(rowData);

    // Step 1: POST to Apps Script without following redirects.
    // Google Apps Script always returns a 302 redirect to script.googleusercontent.com.
    const firstResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        redirect: 'manual',
    });

    if (firstResponse.status >= 300 && firstResponse.status < 400) {
        const redirectUrl = firstResponse.headers.get('location');
        if (!redirectUrl) {
            throw new Error('Redirect received but no Location header found.');
        }

        // Step 2: The redirect target (script.googleusercontent.com/macros/echo)
        // only accepts GET — follow it as GET to get the Apps Script response.
        const secondResponse = await fetch(redirectUrl, {
            method: 'GET',
            redirect: 'follow',
        });

        const text = await secondResponse.text();

        // Try to parse as JSON; if it fails the script ran but returned unexpected output
        try {
            const json = JSON.parse(text);
            return json;
        } catch {
            // Non-JSON response — still treat as success if HTTP 200
            if (secondResponse.ok) return { success: true };
            throw new Error(`Apps Script unexpected response (${secondResponse.status}): ${text.substring(0, 200)}`);
        }
    }

    // Non-redirect response (rare — 200 direct)
    if (!firstResponse.ok) {
        const text = await firstResponse.text();
        throw new Error(`Apps Script error ${firstResponse.status}: ${text.substring(0, 200)}`);
    }

    const json = await firstResponse.json();
    return json;
}

module.exports = { appendToSheet };
