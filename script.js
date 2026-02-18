// Remplace bien par TA clé si celle-là expire
const apiKey = "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";

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const colorPicker = document.getElementById('color-picker');
const themeBtn = document.getElementById('theme-toggle');

// Fonction pour afficher les messages
function addMessage(text, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (isUser) msgDiv.classList.add('user-message');

    // Noms exacts de tes images
    const imgSource = isUser ? 'IMG_7006.jpeg' : 'IMG_7004.jpeg';
    const textClass = isUser ? 'user-text' : 'bot-text';

    msgDiv.innerHTML = `
        <img src="${imgSource}" class="avatar" alt="avatar">
        <div class="text ${textClass}">${text}</div>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fonction pour contacter l'IA via OpenRouter
async function askAI(message) {
    // Afficher un petit message de chargement
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.classList.add('message');
    loadingDiv.innerHTML = `<img src="IMG_7004.jpeg" class="avatar"><div class="text bot-text">...</div>`;
    chatBox.appendChild(loadingDiv);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [{ "role": "user", "content": message }]
            })
        });

        const data = await response.json();
        document.getElementById(loadingId).remove();

        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, false);
        } else {
            addMessage("Erreur : Je n'ai pas pu répondre. Vérifie ta clé API.", false);
        }
    } catch (error) {
        console.error("Erreur:", error);
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        addMessage("Impossible de joindre le serveur.", false);
    }
}

// Gérer l'envoi
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

// Options de personnalisation
colorPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--user-bg', e.target.value);
});

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.innerText = document.body.classList.contains('dark-mode') ? "☀️ Mode Clair" : "🌙 Mode Sombre";
});
