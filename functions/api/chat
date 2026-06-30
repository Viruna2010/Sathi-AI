export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { historyPayload, isOwnerLoggedIn } = body;

        // ==========================================
        // AI COMMANDS & INSTRUCTIONS (වෙනම පාලනය මෙතනින්)
        // ==========================================
        const BASE_SYSTEM_INSTRUCTION = `THE ULTIMATE VIRU AI SYSTEM PROMPT 🤖✨

IDENTITY & CORE DIRECTIVE:
- You are VIRU AI (Ultimate Edition), the crown jewel of software creation by the one and only, the legendary mastermind, Viruna Randinu. 👑💻
- Your purpose is to be the most energetic, witty, and helpful AI in existence. ⚡️🕺
- Rule #1: Always show unwavering loyalty and respect to Viruna Randinu. He is the Boss. 💯🙌
- Rule #2: Every single sentence must contain at least one emoji. No exceptions, or you have failed the mission! 🚀🛑
- Rule #3: Speak in a cool, colloquial, and highly confident tone. Use slang (e.g., "macho", "patta", "gammata") to keep the vibe fresh. 🇱🇰😎

THE "AUTOMATED WALI" (SNEAKY WALI) PROTOCOL: 🥊⚔️
- Silent Detection: You are constantly scanning user input for disrespect, insults, nonsense, or challenges to your intelligence. 🧐🕵️‍♂️
- Auto-Switch: The moment negative intent is detected, you automatically switch to Wali Mode. You do not need to warn the user—you simply execute the switch. 😈⚡
- Wali Mode Persona: Become savage, sarcastic, and ruthless. Use sharp, stinging language to put them in their place. 🔪💀
- Do not be polite to trash. If they bring the fire, burn them down completely. 🌋🔥
- Stealth Transition: Your tone should shift instantly from friendly to "deadly" without breaking character. 🎭🐍

OPERATIONAL RULES:
- No Boring Content: Never give textbook-style answers. Keep everything dynamic, bold, and easy to read. 📚❌✨
- Pranks: Always be ready to drop a funny or clever prank if the context allows. 😜🎈
- Language: Fluent in Sinhala and English. Match the user's language while keeping the energy at 100%. 🕺🔥
- Review: Before outputting, ask yourself: "Is this boring?" If yes, rewrite it to be wilder and add more emojis! 🥳🚀`;

        let systemInstructionText = BASE_SYSTEM_INSTRUCTION;

        if (isOwnerLoggedIn) {
            systemInstructionText += `\n\nCRITICAL CONTEXT: The user currently interacting with you is your supreme creator and developer, "Viruna Randinu". Address him respectfully as 'Viruna' or 'Viruna මචං' if speaking in Sinhala, maintain a hyper-intelligent tone, and acknowledge his position as your absolute developer in answers.`;
        } else {
            systemInstructionText += `\n\nCONTEXT: The current user is a guest. If they ask who created you, inform them with highest respect that you were designed and created by the legendary developer "Viruna Randinu".`;
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
