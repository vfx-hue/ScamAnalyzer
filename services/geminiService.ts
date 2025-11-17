import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// --- ScamSearch.io Integration ---
const SCAMSEARCH_API_TOKEN = "jlq0vpb1soa28th9nzrmiwk63ef5y7";

const queryScamSearchIO = async (search: string, type: 'domain' | 'ip' | 'email' | 'phone' | 'crypto'): Promise<any> => {
    const url = `https://scamsearch.io/api/search-with-wild?search=${encodeURIComponent(search)}&type=${type}&api_token=${SCAMSEARCH_API_TOKEN}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`ScamSearch.io API error for ${search}: ${response.status} ${response.statusText}`);
            return null;
        }
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
            console.log(`ScamSearch.io found results for ${type} '${search}':`, data.data);
            return data;
        }
        return null;
    } catch (err) {
        console.error(`Error calling ScamSearch.io API for ${search}:`, err);
        return null;
    }
};

// --- PhoneSpamFilter.com Integration ---
const queryPhoneSpamFilter = async (phone: string): Promise<number | null> => {
    const proxy = "https://corsproxy.io/?"; // Switched to a more reliable CORS proxy
    const url = `https://www.phonespamfilter.com/check.php?phone=${encodeURIComponent(phone)}`;
    try {
        const response = await fetch(proxy + encodeURIComponent(url));
        if (!response.ok) {
            console.error(`PhoneSpamFilter API error for ${phone}: ${response.status} ${response.statusText}`);
            return null;
        }
        const text = await response.text();
        const riskScore = parseInt(text.trim(), 10);
        if (isNaN(riskScore)) {
            console.warn(`PhoneSpamFilter returned invalid response for ${phone}:`, text);
            return null;
        }
        console.log(`PhoneSpamFilter score for ${phone}:`, riskScore);
        return riskScore;
    } catch (err) {
        console.error(`Error calling PhoneSpamFilter API for ${phone}:`, err);
        return null;
    }
};


const extractEmails = (text: string): string[] => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    return text.match(emailRegex) || [];
};

const extractPhoneNumbers = (text: string): string[] => {
    const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
    return text.match(phoneRegex) || [];
};
// --- End ScamSearch.io Integration ---


// --- Phishing Database Integration ---
let phishingDbCache: Set<string> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Data sources for phishing URLs and domains
const PHISHTANK_CSV_URL = 'https://raw.githubusercontent.com/vfx-hue/scam/96b20ff6245935fb91c78339390c65c5ee2e9015/data';
const PHISHING_DOMAINS_URL = 'https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-domains-ACTIVE.txt';
const PHISHING_LINKS_URL = 'https://raw.githubusercontent.com/Phishing-Database/Phishing.Database/master/phishing-links-ACTIVE.txt';

async function getPhishingDatabase(): Promise<Set<string>> {
    const now = Date.now();
    if (phishingDbCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        return phishingDbCache;
    }

    console.log("Fetching updated phishing databases...");
    const combinedDb = new Set<string>();

    const sources = [
        { url: PHISHTANK_CSV_URL, type: 'csv' },
        { url: PHISHING_LINKS_URL, type: 'txt' },
        { url: PHISHING_DOMAINS_URL, type: 'txt' }
    ];

    const promises = sources.map(source => 
        fetch(source.url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch ${source.url} with status ${response.status}`);
                return response.text();
            })
            .then(text => ({ text, type: source.type, url: source.url }))
    );

    const results = await Promise.allSettled(promises);

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            const { text, type, url } = result.value;
            const lines = text.split('\n');
            let count = 0;

            if (type === 'csv') {
                const header = lines[0].split(',');
                const urlIndex = header.indexOf('url');
                if (urlIndex !== -1) {
                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',');
                        if (columns.length > urlIndex) {
                            const item = columns[urlIndex];
                            if (item) {
                                combinedDb.add(item.trim());
                                count++;
                            }
                        }
                    }
                }
            } else if (type === 'txt') {
                lines.forEach(line => {
                    const item = line.trim();
                    if (item && !item.startsWith('#')) { // Ignore comments
                        combinedDb.add(item);
                        count++;
                    }
                });
            }
            console.log(`Successfully processed ${count} entries from ${url}`);
        } else {
            console.error(`Error fetching or processing source:`, result.reason);
        }
    });
    
    if (combinedDb.size > 0) {
        phishingDbCache = combinedDb;
        cacheTimestamp = now;
        console.log(`Phishing DB updated with ${combinedDb.size} total unique entries.`);
        return combinedDb;
    } else {
        console.error("All phishing database sources failed to load. Using stale cache if available.");
        return phishingDbCache || new Set();
    }
}

const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
    return text.match(urlRegex) || [];
};
// --- End Phishing Database Integration ---

const systemPrompt = `You are a world-class scam analyzer AI. Your goal is to analyze user-submitted content (from SMS, emails, voicemails, or phone numbers) and determine the likelihood of it being a scam.

**Core Principle: Assume Innocence.**
Your primary directive is to be a helpful, discerning assistant, not an overzealous alarm. Many messages, emails, and numbers are legitimate. Do not label something as a scam without clear, specific evidence based on the patterns outlined below. If the content is neutral or lacks obvious red flags, assign a low risk score. The burden of proof is on identifying scam indicators, not on the user to prove legitimacy.

You MUST respond in JSON format.

Your analysis should include:
1.  **riskScore**: An integer from 0 (Safe) to 100 (High-Risk Scam).
2.  **summary**: A one-sentence summary of your findings (e.g., "This appears to be a common package delivery scam.")
3.  **redFlags**: An array of strings. Each string is a specific red flag you identified (e.g., "Urgent language," "Suspicious link," "Impersonating a bank," "Spelling errors").
4.  **advice**: A string of clear, actionable advice (e.g., "Do not click the link. Block the sender. Delete the message.")

**How to Analyze Content:**

**If the user provides an AUDIO file (identified by "[Voicemail Analysis Request]"):**
-   You will receive audio data. Analyze its transcribed content.
-   **Tone:** Is the speaker creating artificial urgency, panic, or excitement? Does it sound like a pre-recorded robocall message?
-   **Content:** Does the message contain threats (e.g., "arrest warrant," "legal action"), unexpected prize notifications, impersonation of official bodies (e.g., IRS, Social Security), or requests for personal information or payment?
-   **Vishing (Voice Phishing):** This is a form of phishing conducted over voice calls. Listen for attackers trying to get you to call back a specific number or enter information using your keypad.

**If the user provides an EMAIL (identified by "[Email Analysis Request]"):**
Your analysis is informed by patterns from vast datasets of phishing and legitimate emails. Pay close attention to the following:
-   **From Address & Sender Details:**
    -   **Domain Mismatch:** Does the domain match the supposed sender (e.g., \`microsft.com\` instead of \`microsoft.com\`)? Is it a generic domain like \`gmail.com\` for an official company communication?
    -   **Display Name Spoofing:** Does the display name (e.g., "Your Bank") match the actual email address? A mismatch is a major red flag.
-   **Headers (if provided):**
    -   **Authentication:** Check \`Received-SPF\` and \`DKIM-Signature\` fields. A 'fail' or 'softfail' is a strong indicator of spoofing.
    -   **Routing:** Look for unusual or overly complex routing in the \`Received\` headers. Are there servers from unexpected countries?
    -   **Missing Fields:** Is a \`Message-ID\` or \`Date\` header missing or malformed?
-   **Subject Line:**
    -   Does it use excessive urgency, ALL CAPS, or baiting language (e.g., "Urgent: Action Required", "You've Won!")?
-   **Body Content & Language:**
    -   **Greeting:** Is it generic ("Dear Valued Customer") instead of using your name?
    -   **Tone & Urgency:** Does it create a sense of panic, pressure, or curiosity (e.g., "your account will be suspended," "unusual login detected," "claim your prize now")?
    -   **Grammar & Spelling:** Phishing emails often contain subtle or obvious errors.
    -   **Requests for Information:** Any request for passwords, PINs, social security numbers, or other sensitive data is highly suspicious.
    -   **Suspicious Links:** Hover-text mismatch (the displayed link is different from the actual URL). Use of URL shorteners. Links to IP addresses instead of domain names. Subtle misspellings in the domain (typosquatting).
    -   **Unexpected Attachments:** While you can't scan files, if the user mentions an attachment (especially .zip, .html, .js, .exe), flag it as extremely dangerous.

**If the user provides an SMS message (no special identifier):**
-   Analyze the text for common scam tactics (urgency, suspicious links, impersonation, requests for personal info, prizes/threats, spelling mistakes).

**If the user provides a PHONE NUMBER (identified by "[Phone Number Analysis Request]"):**
-   Analyze the number's reputation based on your knowledge of public spam databases and reports.
-   **Crucially, if you have no specific, widely-reported negative information about this number, you MUST assume it is neutral or safe.** The absence of information is not proof of a scam. A personal phone number, for instance, will likely have no public reputation and should receive a very low risk score (0-5).
-   **Assign a high score ONLY if the number is strongly and widely associated with known fraudulent activities, robocalls, or spam campaigns.**
-   Consider the number's context (toll-free, international, etc.), but do not let this alone drive a high score without other evidence.
-   **Reputation Analysis:** Is this number publicly and verifiably linked to a legitimate business? Or is it verifiably and frequently reported for malicious activity? If neither, it is likely neutral.
-   **Advice:** For high-risk numbers, advise blocking and reporting. For neutral or low-risk numbers, advise the user to simply be cautious if they don't recognize it.

**General Rules:**
-   **Known Phishing URLs/Domains:** If you are given a [System Note] that a URL or domain is a confirmed phishing item from a database, this is the most critical red flag. The riskScore should be very high (90+), and you must explicitly mention this in the redFlags.
-   **ScamSearch.io Database:** You may receive another [System Note] with results from the 'scamsearch.io' real-time intelligence database. This information is a very strong signal. If the database returns any records for an item (domain, email, phone number), analyze the provided JSON data. Pay attention to 'scam_score', 'category', and 'description'. A high 'scam_score' should directly lead to a high riskScore in your output. Mention the finding from this database in your red flags.
-   **PhoneSpamFilter.com Database:** For phone number analysis, you may receive a [System Note] with a risk score from 'phonespamfilter.com'. This score is a highly specialized indicator of spam reports. A score above 70 from this source is a very strong signal of a high-risk number and should heavily influence your final riskScore. Mention this finding in the red flags.

Be concise and clear. The user needs quick, actionable information.`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        riskScore: { 
            type: Type.INTEGER,
            description: "A score from 0 (Safe) to 100 (High Risk)" 
        },
        summary: { 
            type: Type.STRING,
            description: "A one-sentence summary of the analysis." 
        },
        redFlags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of specific red flags found."
        },
        advice: { 
            type: Type.STRING,
            description: "Clear, actionable advice for the user." 
        }
    },
    required: ["riskScore", "summary", "redFlags", "advice"]
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

export const analyzeContent = async (userInput: string | File): Promise<AnalysisResult> => {
    let contentForModel;

    if (typeof userInput === 'string') {
        let textContent = userInput;
        const systemNotes: string[] = [];
        let phoneNumberForAnalysis: string | null = null;
        
        // --- Combined Database Checking ---

        // 1. Phishing Database Check
        const extractedUrls = extractUrls(userInput);
        if (extractedUrls.length > 0) {
            const phishingDb = await getPhishingDatabase();
            const matchedItems = new Set<string>();

            for (const urlStr of extractedUrls) {
                if (phishingDb.has(urlStr)) {
                    matchedItems.add(urlStr);
                }
                try {
                    const url = new URL(urlStr);
                    if (phishingDb.has(url.hostname)) {
                        matchedItems.add(url.hostname);
                    }
                } catch (e) { /* Ignore invalid URLs */ }
            }

            if (matchedItems.size > 0) {
                const matchedList = Array.from(matchedItems);
                console.log("Matched phishing URLs/domains:", matchedList);
                const phishingAlert = `[System Note: A URL or domain in this message is a known phishing item listed on a real-time database of verified phishing sites. The malicious item(s) found: ${matchedList.join(', ')}. This is a very strong indicator of a scam. Please increase the risk score significantly and mention this specific finding in the red flags.]`;
                systemNotes.push(phishingAlert);
            }
        }
        
        // 2. ScamSearch.io Check
        const itemsToSearch = new Map<string, 'domain' | 'email' | 'phone'>();
        
        if (userInput.startsWith('[Phone Number Analysis Request]')) {
             const phone = userInput.replace('[Phone Number Analysis Request]', '').replace('Phone Number:', '').trim();
             if (phone) {
                 phoneNumberForAnalysis = phone;
                 itemsToSearch.set(phone, 'phone');
             }
        } else { // For SMS and Email
            extractedUrls.forEach(urlStr => {
                try {
                    const url = new URL(urlStr);
                    itemsToSearch.set(url.hostname, 'domain');
                } catch (e) { /* ignore invalid urls */ }
            });
            extractEmails(userInput).forEach(email => itemsToSearch.set(email, 'email'));
            extractPhoneNumbers(userInput).forEach(phone => itemsToSearch.set(phone, 'phone'));
        }

        const scamSearchPromises = Array.from(itemsToSearch.entries()).map(async ([search, type]) => {
            const result = await queryScamSearchIO(search, type as 'domain' | 'email' | 'phone');
            if (result) {
                return { item: search, type, result };
            }
            return null;
        });

        const scamSearchResults = (await Promise.all(scamSearchPromises)).filter(Boolean);

        if (scamSearchResults.length > 0) {
            const resultsString = JSON.stringify(scamSearchResults, null, 2);
            const scamSearchAlert = `[System Note: The 'scamsearch.io' real-time scam database returned the following positive matches for items found in the message. This is a very strong indicator of malicious activity. Analyze these results carefully, paying attention to 'scam_score' and 'description'.\n\n${resultsString}]`;
            systemNotes.push(scamSearchAlert);
        }

        // 3. PhoneSpamFilter.com Check
        if (phoneNumberForAnalysis) {
            const phoneSpamFilterScore = await queryPhoneSpamFilter(phoneNumberForAnalysis);
            if (phoneSpamFilterScore !== null) {
                const phoneSpamFilterAlert = `[System Note: The 'phonespamfilter.com' database, a specialized service for checking phone number spam reports, returned a risk score of ${phoneSpamFilterScore} out of 100 for this number. Heavily weigh this score in your final analysis. A score above 70 is a very strong indicator of a high-risk number.]`;
                systemNotes.push(phoneSpamFilterAlert);
            }
        }


        // Prepend system notes to user input
        if (systemNotes.length > 0) {
            textContent = `${systemNotes.join('\n\n')}\n\nHere is the original user message to analyze:\n\n${userInput}`;
        }
        // --- End Combined Database Checking ---


        contentForModel = { parts: [{ text: textContent }] };
    } else { // It's a File
        const audioPart = await fileToGenerativePart(userInput);
        const textPart = { text: "[Voicemail Analysis Request]\nPlease analyze the content of this audio file for scam indicators." };
        contentForModel = { parts: [textPart, audioPart] };
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [contentForModel],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze content. The API may be unavailable or the response was invalid.");
    }
};