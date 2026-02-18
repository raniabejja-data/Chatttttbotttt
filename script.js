const apiKey = "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";
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (isUser) msgDiv.classList.add('user-message');
    const img = isUser ? 'IMG_7006.jpeg' : 'IMG_7004.jpeg';
    msgDiv.innerHTML = `<img src="${img}" class="avatar"><div class="text ${isUser ? 'user-text' : 'bot-text'}">${text}</div>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message');
    loadingDiv.innerHTML = `<img src="IMG_7004.jpeg" class="avatar"><div class="text bot-text">...</div>`;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", 
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, false);
        } else {
            addMessage("Erreur API : " + (data.error ? data.error.message : "Vérifiez vos crédits OpenRouter"), false);
        }
    } catch (e) {
        loadingDiv.remove();
        addMessage("Erreur de connexion.", false);
    }
}

sendBtn.addEventListener('click', () => {
    const val = userInput.value.trim();
    if (val) { addMessage(val, true); userInput.value = ""; askAI(val); }
});

userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });

document.getElementById('color-picker').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--user-bg', e.target.value);
});
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
