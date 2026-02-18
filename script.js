// script.js

// Fonction pour générer une couleur aléatoire harmonieuse
function updateTheme() {
    const hue = Math.floor(Math.random() * 360); // Choisit une teinte sur le cercle chromatique
    const newColor = `hsl(${hue}, 70%, 50%)`;
    const lightBg = `hsl(${hue}, 30%, 95%)`;

    // Appliquer les nouvelles couleurs aux variables CSS
    document.documentElement.style.setProperty('--primary-color', newColor);
    document.documentElement.style.setProperty('--bg-chat', lightBg);
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    if (input.value.trim() === "") return;

    // Message Utilisateur (Photo IMG_7006.jpeg)
    appendMessage('user', input.value, 'IMG_7006.jpeg');
    
    const userText = input.value;
    input.value = "";

    // Simulation de réponse avec changement de couleur
    setTimeout(() => {
        const responses = [
            "Quelle couleur préfères-tu maintenant ?",
            "Je me sens très créatif aujourd'hui !",
            "Regarde, j'ai changé d'ambiance !",
            "C'est magnifique cette nouvelle teinte, non ?"
        ];
        const randomText = responses[Math.floor(Math.random() * responses.length)];
        
        // On change la couleur JUSTE AVANT que le bot réponde
        updateTheme();
        
        appendMessage('bot', randomText, 'IMG_7004.jpeg');
    }, 800);
}

function appendMessage(role, text, imgSrc) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-message`;
    msgDiv.innerHTML = `
        <img src="${imgSrc}" class="avatar">
        <div class="text">${text}</div>
    `;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
