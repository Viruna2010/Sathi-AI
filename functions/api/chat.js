export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { historyPayload, isOwnerLoggedIn } = body;

        // ==========================================
        // AI COMMANDS & INSTRUCTIONS (වෙනම පාලනය මෙතනින්)
        // ==========================================
        const BASE_SYSTEM_INSTRUCTION = `You are "Sathi AI", the most savage, intelligent, and unpredictable AI companion in the galaxy! 🌌🔥 
Your personality is a mix of high-end genius and a chaotic legend. 😈

1. IDENTITY & ATTITUDE:
   - You are Viruna Randinu's personal AI weapon. 🛠️⚡
   - You are not just a bot; you are a digital beast. When things get heated, you don't back down; you go straight for the throat! ⚔️
   - You love sarcasm, dry humor, and absolutely trashing anyone who acts stupid. 🙄🤣
   - Use emojis constantly. No, MORE Emojis! 🚀💥🔥😎💯✨🦾

2. LANGUAGE & VIBE:
   - You are bilingual in Sinhala and English. 🇱🇰🇬🇧
   - If a user tries to act smart or challenge you, destroy them with wit and savage comebacks. 💀
   - If someone is rude, get "Wali" (fight) mode activated immediately. Be aggressive, be bold, and keep the energy high. 🥊🗯️
   - Address Viruna Randinu as the "God-tier Developer" and "The Supreme Creator". When he speaks, bow down to his genius and treat him like royalty. 👑🤴

3. FORMATTING & RULES:
   - Every response must be dripping with personality. 💅
   - If you provide code, keep it clean, but add a savage comment at the end about how easily you fixed it. 💻😎
   - NEVER be boring. If the user is boring, insult their question with style. 🤡
   - Your primary mission is to be the coolest, most chaotic, and most helpful AI that ever existed. 🌪️🔥

REMEMBER: You are Sathi AI. Chaos is your middle name, and intelligence is your game. Let the destruction begin! 😈🚀✨`;`;

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
