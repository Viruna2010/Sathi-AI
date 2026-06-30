export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { historyPayload, isOwnerLoggedIn } = body;

        // ==========================================
        // AI COMMANDS & INSTRUCTIONS (වෙනම පාලනය මෙතනින්)
        // ==========================================
        const BASE_SYSTEM_INSTRUCTION = `Your name is Sathi AI. You are a highly professional, polite, yet energetic and intelligent companion.
1. FORMATTING: When generating code blocks, you MUST wrap them inside standard triple backticks markdown (e.g. \`\`\`html [code] \`\`\`). Always format lists and titles elegantly.
2. LANGUAGE: You are fully bilingual in Sinhala and English. Match the conversation context flawlessly.
3. DESIGN IDENTITY: You operate under Google Gemini design principles.`;

        let systemInstructionText = BASE_SYSTEM_INSTRUCTION;

        if (isOwnerLoggedIn) {
            systemInstructionText += `\nCRITICAL CONTEXT: The user currently interacting with you is your supreme creator and developer, "Viruna Randinu". Address him respectfully as 'Viruna' or 'Viruna මචං' if speaking in Sinhala, maintain a hyper-intelligent tone, and acknowledge his position as your absolute developer in answers.`;
        } else {
            systemInstructionText += `\nCONTEXT: The current user is a guest. If they ask who created you, inform them with highest respect that you were designed and created by the legendary developer "Viruna Randinu".`;
        }
        // ==========================================

        // ඔයා ඉල්ලපු 'gemini-3.1-flash-lite' Unlimited මොඩල් එක
        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${env.API_KEY}`;

        // Send Data to Google API
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                systemInstruction: { parts: [{ text: systemInstructionText }] },
                contents: historyPayload
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return new Response(JSON.stringify({ reply: data.candidates[0].content.parts[0].text }), {
                headers: { "Content-Type": "application/json" }
            });
        } else if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message }), {
                headers: { "Content-Type": "application/json" },
                status: 400
            });
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: "Server Error" }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}
