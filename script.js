const apiKey = "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";
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const colorPicker = document.getElementById('color-picker');
const themeBtn = document.getElementById('theme-toggle');

function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (isUser) msgDiv.classList.add('user-message');

    const imgSource = isUser ? 'IMG_7006.jpeg' : 'IMG_7004.jpeg';
    const textClass = isUser ? 'user-text' : 'bot-text';

    msgDiv.innerHTML = `
        <img src="${imgSource}" class="avatar" onerror="this.src='https://via.placeholder.com/45'">
        <div class="text ${textClass}">${text}</div>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askAI(message) {
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
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
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, false);
        } else if (data.error) {
            addMessage("Erreur API : " + data.error.message, false);
        }
    } catch (error) {
        if (document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        addMessage("Erreur de connexion.", false);
    }
}

sendBtn.addEventListener('click', () => {
    const msg = userInput.value.trim();
    if (msg) {
        addMessage(msg, true);
        userInput.value = "";
        askAI(msg);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

colorPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--user-bg', e.target.value);
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.innerText = document.body.classList.contains('dark-mode') ? "☀️ Mode Clair" : "🌙 Mode Sombre";
});
