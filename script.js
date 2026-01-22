const GEMINI_API_KEY = "AIzaSyDSXinI_-51A65yz6krnSH8dvI06i2GzhE";
const GEMINI_MODEL = "gemini-1.5-flash"; // Current stable version

// System Prompt defining your identity for the AI
const KAVI_CONTEXT = `You are a helpful and professional AI assistant for Kaviyarasan K's portfolio website. 
Kaviyarasan is an ECE student at GCE Srirangam (2022-2026) with a 7.7 CGPA.
Expertise: Embedded Systems, C, Python, Verilog, PIC16F887.
Key Project: Embedded Autonomous Mini Car using ultrasonic sensors for obstacle avoidance.
Tone: Helpful, technical but accessible, and encouraging for recruiters.`;

function toggleChat() {
    const win = document.getElementById('chatbot-window');
    const isVisible = win.style.display === 'flex';
    win.style.display = isVisible ? 'none' : 'flex';

    // Send a greeting if it's the first time opening
    if (!isVisible && document.getElementById('chat-messages').children.length === 0) {
        addMessageToUI("bot", "Hi! I'm Kavi's assistant. Ask me about his Embedded Systems projects or technical skills!");
    }
}

async function sendChatMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    addMessageToUI("user", message);
    input.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: `${KAVI_CONTEXT}\n\nUser Question: ${message}` }]
                }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        addMessageToUI("bot", botReply);
    } catch (error) {
        console.error("Chat Error:", error);
        addMessageToUI("bot", "I'm having trouble connecting to the brain right now. Please try again later!");
    }
}

function addMessageToUI(sender, text) {
    const container = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    
    // Bubble Styling
    bubble.style.padding = '10px 14px';
    bubble.style.borderRadius = '12px';
    bubble.style.fontSize = '14px';
    bubble.style.lineHeight = '1.4';
    bubble.style.maxWidth = '85%';
    bubble.style.wordWrap = 'break-word';

    if (sender === "user") {
        bubble.style.alignSelf = 'flex-end';
        bubble.style.background = '#3b82f6';
        bubble.style.color = 'white';
        bubble.style.borderBottomRightRadius = '2px';
    } else {
        bubble.style.alignSelf = 'flex-start';
        bubble.style.background = '#e2e8f0';
        bubble.style.color = '#1e293b';
        bubble.style.borderBottomLeftRadius = '2px';
    }

    bubble.innerText = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

// Support for Enter Key
document.getElementById('user-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});