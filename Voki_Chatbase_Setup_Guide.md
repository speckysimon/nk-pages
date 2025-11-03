# Voki + Chatbase Integration Guide
## Complete Setup Tutorial for Language Learning Avatar

Updated: 2025-10-31

---

## Overview

This guide explains how to integrate **Voki** (animated avatar) with **Chatbase** (AI chatbot backend) to create an interactive language learning experience that can be embedded in slides.com.

### What You'll Get:
- Animated cartoon avatar (Voki) with lip sync
- AI-powered conversation (Chatbase with GPT-4)
- Speech recognition and text-to-speech
- Configurable language level/grammar
- Embeddable in slides.com via iframe

### Integration Limitations:
⚠️ **Important:** Voki does not have a public API, so we cannot directly connect Voki to Chatbase. Instead, we'll use **alternative approaches** that achieve similar results.

---

## Approach Overview

Since direct Voki-Chatbase integration isn't possible, we have three approaches:

### **Approach 1: Chatbase + Custom Avatar Overlay** ⭐ RECOMMENDED
Use Chatbase's chatbot with a custom-built avatar interface using web technologies

### **Approach 2: Separate Voki + Chatbase Components**
Use both tools side-by-side but not fully integrated

### **Approach 3: Build Custom Solution with Chatbase API**
Use Chatbase API for conversations and build your own avatar frontend

---

## APPROACH 1: Chatbase + Custom Avatar Overlay (RECOMMENDED)

This approach uses Chatbase for the AI backend and creates a custom avatar using open-source tools.

### What You Need:
- Chatbase account (free tier available)
- Basic web hosting (Vercel, Netlify - free)
- Your cartoon character image
- Basic HTML/JavaScript knowledge (or developer)

### Step-by-Step Setup

#### STEP 1: Set Up Chatbase Chatbot

1. **Create Chatbase Account**
   - Go to https://www.chatbase.co
   - Sign up for free account
   - Verify email

2. **Create Your Chatbot**
   - Click "New Chatbot"
   - Name it (e.g., "English Learning Tutor")
   - Choose data source:
     - Upload teaching materials (PDFs, docs)
     - Add website URLs with learning content
     - Or start with no data for general conversation

3. **Configure Language Level**
   - Go to "Settings" → "General"
   - In "Personality" section, add this system prompt:

```
You are a friendly English language teacher for students at CEFR level A2-B1.

Language Guidelines:
- Use only simple present, present continuous, and past simple tenses
- Use common vocabulary (2000 most frequent words)
- Keep sentences short (under 15 words)
- Avoid idioms, slang, and complex phrasal verbs
- If student makes grammar errors, gently correct them
- Keep responses to 2-3 sentences maximum
- Always ask a follow-up question to encourage practice
- Be positive and encouraging

Topics to discuss:
- Daily routines and activities
- Food, restaurants, and cooking
- Hobbies and interests
- Travel and vacation
- Family and friends
- School and work

Response format:
1. Answer the student's question or respond to their statement
2. Provide gentle correction if needed
3. Ask one follow-up question

Example:
Student: "Yesterday I go to the park."
You: "That sounds nice! I think you mean 'I went to the park' - we use 'went' for past tense. What did you do at the park?"
```

4. **Customize Appearance**
   - Settings → "Interface"
   - Choose colors matching your branding
   - Upload avatar image (your cartoon character)
   - Set initial message: "Hi! I'm your English practice partner. What would you like to talk about today?"

5. **Test Your Chatbot**
   - Click "Test Chatbot" in sidebar
   - Try different language levels
   - Verify responses are appropriate
   - Adjust personality prompt if needed

6. **Get API Credentials**
   - Go to "Connect" → "API"
   - Copy your Chatbot ID
   - Go to Account → "API"
   - Copy your API Key
   - Save both securely

#### STEP 2: Create Custom Avatar Interface

Now we'll build a web interface that combines Chatbase AI with an animated avatar.

**Option A: Use Ready-Made Template (Easier)**

1. **Use TalkingHead.js Library**
   - GitHub: https://github.com/met4citizen/TalkingHead
   - This provides animated 3D avatar with lip sync
   - Works with Ready Player Me avatars

2. **Create Ready Player Me Avatar**
   - Go to https://readyplayer.me
   - Click "Create Avatar"
   - Choose "Photo" mode
   - Upload your cartoon character
   - Customize to match your character
   - Download GLB file

3. **Set Up Project** (requires developer)

Create project structure:
```
/language-avatar/
  ├── index.html
  ├── style.css
  ├── app.js
  ├── avatar.glb (your Ready Player Me avatar)
  └── libs/
      └── talkinghead.js
```

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Language Learning Avatar</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Avatar Display -->
        <div id="avatar-container">
            <canvas id="avatar-canvas"></canvas>
        </div>

        <!-- Chat Interface -->
        <div id="chat-container">
            <div id="messages"></div>
            <div id="input-area">
                <input type="text" id="user-input" placeholder="Type or click microphone to speak...">
                <button id="mic-button">🎤</button>
                <button id="send-button">Send</button>
            </div>
        </div>
    </div>

    <script type="module" src="app.js"></script>
</body>
</html>
```

**app.js:**
```javascript
import { TalkingHead } from './libs/talkinghead.js';

// Configuration
const CHATBASE_API_KEY = 'YOUR_API_KEY_HERE';
const CHATBASE_CHATBOT_ID = 'YOUR_CHATBOT_ID_HERE';

// Initialize avatar
const avatar = new TalkingHead();
await avatar.init('avatar-canvas', './avatar.glb');
await avatar.setMood('happy');

// Speech Recognition Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;

// Elements
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');
const messagesDiv = document.getElementById('messages');

// Send message to Chatbase
async function sendToChatbase(message) {
    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHATBASE_API_KEY}`
        },
        body: JSON.stringify({
            chatbotId: CHATBASE_CHATBOT_ID,
            messages: [
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    return data.text;
}

// Speak with avatar
async function speakWithAvatar(text) {
    // Use Web Speech API for TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    // Trigger avatar lip sync
    avatar.speakText(text);

    // Play audio
    window.speechSynthesis.speak(utterance);
}

// Display message
function displayMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle user input
async function handleUserMessage(message) {
    if (!message.trim()) return;

    // Display user message
    displayMessage(message, true);
    userInput.value = '';

    // Get response from Chatbase
    const response = await sendToChatbase(message);

    // Display bot response
    displayMessage(response, false);

    // Speak with avatar
    await speakWithAvatar(response);
}

// Event listeners
sendButton.addEventListener('click', () => {
    handleUserMessage(userInput.value);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage(userInput.value);
    }
});

micButton.addEventListener('click', () => {
    recognition.start();
    micButton.textContent = '🎤 Listening...';
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    micButton.textContent = '🎤';
    handleUserMessage(transcript);
};

recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    micButton.textContent = '🎤';
};

// Initialize with greeting
window.addEventListener('load', async () => {
    await avatar.setMood('happy');
    const greeting = "Hi! I'm your English practice partner. What would you like to talk about today?";
    displayMessage(greeting, false);
    await speakWithAvatar(greeting);
});
```

**style.css:**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 90%;
    max-width: 1000px;
    height: 90vh;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 50px rgba(0,0,0,0.3);
    display: flex;
    overflow: hidden;
}

#avatar-container {
    flex: 1;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

#avatar-canvas {
    width: 100%;
    height: 100%;
}

#chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

#messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.user-message, .bot-message {
    padding: 12px 18px;
    border-radius: 18px;
    max-width: 80%;
    word-wrap: break-word;
    line-height: 1.4;
}

.user-message {
    background: #667eea;
    color: white;
    align-self: flex-end;
    margin-left: auto;
}

.bot-message {
    background: #e9ecef;
    color: #333;
    align-self: flex-start;
}

#input-area {
    display: flex;
    gap: 10px;
    padding-top: 20px;
    border-top: 2px solid #e9ecef;
}

#user-input {
    flex: 1;
    padding: 12px 18px;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
}

#user-input:focus {
    border-color: #667eea;
}

button {
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    background: #667eea;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #5568d3;
}

#mic-button {
    background: #28a745;
}

#mic-button:hover {
    background: #218838;
}
```

4. **Deploy Your Application**

**Option A: Deploy to Vercel (Free)**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project folder
cd language-avatar

# Deploy
vercel
```

**Option B: Deploy to Netlify (Free)**
- Go to https://app.netlify.com
- Drag and drop your project folder
- Get your live URL

5. **Get Embed Code**

Once deployed, you'll have a URL like: `https://your-avatar.vercel.app`

Embed in slides.com:
```html
<iframe
    src="https://your-avatar.vercel.app"
    width="900"
    height="700"
    frameborder="0"
    allow="microphone">
</iframe>
```

---

**Option B: Use Chatbase Widget with Voki Separately (Simpler, Less Integrated)**

If you don't want to code, use this simpler approach:

1. **Create Chatbase chatbot** (as described in Step 1)

2. **Create Voki avatar** with sample audio:
   - Go to https://voki.com
   - Create cartoon avatar
   - Record greeting message
   - Get embed code

3. **Create HTML page combining both:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Language Learning</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .panel {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            margin-top: 0;
            color: #333;
        }
        iframe {
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 8px;
        }
        .instructions {
            grid-column: 1 / -1;
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="instructions">
            <h3>📚 How to Use:</h3>
            <ol>
                <li>Listen to your teacher (avatar on the left)</li>
                <li>Type your response in the chat (right side)</li>
                <li>Practice your English conversation skills!</li>
            </ol>
        </div>

        <div class="panel">
            <h2>👨‍🏫 Your Teacher</h2>
            <!-- Voki embed code here -->
            <iframe src="YOUR_VOKI_EMBED_URL"></iframe>
        </div>

        <div class="panel">
            <h2>💬 Chat Here</h2>
            <!-- Chatbase embed code here -->
            <iframe src="https://www.chatbase.co/chatbot-iframe/YOUR_CHATBOT_ID"></iframe>
        </div>
    </div>
</body>
</html>
```

**Limitations of this approach:**
- Voki and Chatbase don't communicate with each other
- Voki shows static greeting/instructions
- Students chat with Chatbase separately
- Not truly integrated, but works for basic use

---

## APPROACH 2: Use Chatbase API with Custom TTS Avatar

This is a middle-ground approach using Chatbase's API with text-to-speech for the avatar.

### Requirements:
- Chatbase account with API access
- Web hosting
- JavaScript development

### How It Works:
1. User speaks or types message
2. Send to Chatbase API
3. Get AI response
4. Display animated avatar
5. Speak response with text-to-speech
6. Sync avatar lip movements

### Implementation:

Use the code from Approach 1, Option A, but replace the avatar with a simpler animated image:

**Simple CSS Animation Avatar:**

```html
<div id="avatar-container">
    <img id="avatar-image" src="your-character.png" class="talking" alt="Avatar">
</div>
```

```css
#avatar-image {
    width: 300px;
    height: 300px;
    transition: transform 0.1s;
}

#avatar-image.talking {
    animation: talk 0.3s infinite;
}

@keyframes talk {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

#avatar-image.idle {
    animation: idle 3s ease-in-out infinite;
}

@keyframes idle {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
```

**JavaScript to control animation:**

```javascript
function speakWithAvatar(text) {
    const avatarImage = document.getElementById('avatar-image');

    // Start talking animation
    avatarImage.classList.remove('idle');
    avatarImage.classList.add('talking');

    // Speak with TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        // Return to idle animation
        avatarImage.classList.remove('talking');
        avatarImage.classList.add('idle');
    };

    window.speechSynthesis.speak(utterance);
}
```

This gives you:
- Chatbase AI responses
- Animated avatar
- Text-to-speech
- Simple lip sync effect
- Easy to implement

---

## APPROACH 3: Full Custom Build

For maximum control, build everything from scratch:

### Architecture:

```
[Frontend Interface]
       ↓
[Speech Recognition] → [Chatbase API] → [GPT-4]
       ↓                     ↓
[Avatar Animation] ← [Text-to-Speech]
```

### Tech Stack:
- **Frontend:** React or vanilla JavaScript
- **Avatar:** Live2D, Ready Player Me, or custom
- **AI Backend:** Chatbase API
- **Speech Recognition:** Web Speech API
- **Text-to-Speech:** Web Speech API or ElevenLabs
- **Hosting:** Vercel, Netlify, or AWS

### Code Example (React):

```jsx
import React, { useState, useEffect } from 'react';
import { TalkingHead } from 'talkinghead-library';

function LanguageAvatar() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        // Initialize avatar
        const initAvatar = async () => {
            const av = new TalkingHead();
            await av.init('avatar-canvas', './avatar.glb');
            setAvatar(av);
        };
        initAvatar();
    }, []);

    const sendMessage = async (text) => {
        // Add user message
        setMessages([...messages, { role: 'user', content: text }]);

        // Call Chatbase API
        const response = await fetch('https://www.chatbase.co/api/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatbotId: 'YOUR_CHATBOT_ID',
                messages: [{ role: 'user', content: text }]
            })
        });

        const data = await response.json();
        const botResponse = data.text;

        // Add bot message
        setMessages([...messages,
            { role: 'user', content: text },
            { role: 'bot', content: botResponse }
        ]);

        // Speak with avatar
        if (avatar) {
            avatar.speakText(botResponse);
        }

        // TTS
        const utterance = new SpeechSynthesisUtterance(botResponse);
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="app">
            <canvas id="avatar-canvas"></canvas>
            <div className="chat">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            />
        </div>
    );
}

export default LanguageAvatar;
```

---

## Configuration for Different Language Levels

Update your Chatbase personality prompt for different CEFR levels:

### A1 (Beginner):
```
You are an English teacher for absolute beginners (A1 level).
- Use only present simple tense
- Use the 500 most common English words
- Speak in very short sentences (5-8 words maximum)
- Use simple vocabulary like: hello, food, family, colors, numbers
- Repeat important words
- Be very encouraging

Example: "Hello! How are you? What is your name?"
```

### A2 (Elementary):
```
You are an English teacher for elementary students (A2 level).
- Use present simple and present continuous
- Use the 1000 most common words
- Keep sentences short (8-12 words)
- Topics: daily life, shopping, family, hobbies
- Provide gentle corrections
- Ask simple questions

Example: "That's good! You said 'I go to school yesterday.' Try: 'I went to school yesterday.' What did you do at school?"
```

### B1 (Intermediate):
```
You are an English teacher for intermediate students (B1 level).
- Use present, past, and future tenses
- Use the 2000 most common words
- Sentences can be 12-15 words
- Topics: work, travel, opinions, experiences
- Explain errors clearly
- Introduce some idioms

Example: "Interesting! You mentioned 'I have been there since 3 years.' We say 'for 3 years' when talking about duration. Can you tell me more about your trip?"
```

### B2 (Upper-Intermediate):
```
You are an English teacher for upper-intermediate students (B2 level).
- Use all tenses including conditionals
- Use varied vocabulary
- Longer, more complex sentences allowed
- Topics: abstract ideas, culture, current events
- Discuss grammar in detail
- Use idioms and phrasal verbs

Example: "That's a great point! I noticed you said 'If I would have known.' The correct form is 'If I had known' for third conditional. What would you have done differently?"
```

---

## Testing Your Integration

### Checklist:

- [ ] Avatar loads and displays correctly
- [ ] Speech recognition activates with microphone button
- [ ] User can type OR speak messages
- [ ] Chatbase responds appropriately for language level
- [ ] Avatar lip sync works with speech
- [ ] Text-to-speech is clear and natural
- [ ] Iframe embeds properly in slides.com
- [ ] Microphone permissions work in iframe
- [ ] Chat history persists during session
- [ ] Mobile responsive (if needed)

### Test Scenarios:

1. **Grammar correction test:**
   - Input: "I goed to store yesterday"
   - Expected: Gentle correction + follow-up question

2. **Vocabulary level test:**
   - Check responses don't use words above target level
   - Verify sentence complexity matches setting

3. **Conversation flow test:**
   - Ensure bot asks follow-up questions
   - Check conversation feels natural

4. **Technical test:**
   - Test in Chrome, Firefox, Safari
   - Test microphone permissions
   - Test in slides.com iframe
   - Check on tablet/mobile if needed

---

## Embedding in Slides.com

### Standard Embed:

1. Copy your hosted URL
2. In slides.com, edit your slide
3. Click "Insert" → "Embed"
4. Paste this code:

```html
<iframe
    src="https://your-app.vercel.app"
    width="900"
    height="700"
    frameborder="0"
    allow="microphone"
    style="border: 2px solid #ddd; border-radius: 10px;">
</iframe>
```

### Fullscreen Option:

```html
<iframe
    src="https://your-app.vercel.app"
    width="100%"
    height="100%"
    frameborder="0"
    allow="microphone; fullscreen"
    allowfullscreen>
</iframe>
```

### With Instructions:

```html
<div style="padding: 20px; font-family: Arial;">
    <h2>Practice English Conversation</h2>
    <p>Click the microphone to speak, or type your message below!</p>
    <iframe
        src="https://your-app.vercel.app"
        width="100%"
        height="600px"
        frameborder="0"
        allow="microphone">
    </iframe>
</div>
```

---

## Costs Breakdown

### Chatbase:
- **Free Tier:** 30 messages/month
- **Hobby:** $19/month - 2,000 messages
- **Standard:** $99/month - 10,000 messages
- **Unlimited:** $399/month - unlimited

### Hosting:
- **Vercel:** Free tier (perfect for this)
- **Netlify:** Free tier (perfect for this)

### APIs (if using custom build):
- **OpenAI GPT-4 (if not using Chatbase):** ~$0.01-0.03 per conversation
- **ElevenLabs TTS (optional):** $5-22/month

### Total Estimated Cost:
- **Minimal setup:** $0-19/month (Chatbase free/hobby + free hosting)
- **Professional setup:** $99-150/month (Chatbase standard + optional TTS)

---

## Troubleshooting

### Avatar Not Loading:
- Check browser console for errors
- Verify GLB file path is correct
- Ensure hosting supports GLB file type
- Try different avatar file

### Chatbase API Errors:
- Verify API key is correct
- Check chatbot ID matches
- Ensure proper headers in API request
- Check API rate limits

### Microphone Not Working:
- Verify iframe has `allow="microphone"` attribute
- Check browser permissions
- Test in different browser
- Ensure HTTPS (required for mic access)

### No Speech Output:
- Check browser supports Web Speech API
- Verify audio isn't muted
- Try different browser
- Consider using ElevenLabs as backup

### Lip Sync Issues:
- Adjust timing in TalkingHead configuration
- Try different avatar with better rigging
- Simplify animation if too complex

---

## Advanced Features (Optional)

### 1. Progress Tracking:
```javascript
// Track student progress
let conversationStats = {
    totalMessages: 0,
    grammarErrors: 0,
    vocabulary: new Set()
};

// Update after each conversation
function updateStats(userMessage, botResponse) {
    conversationStats.totalMessages++;
    // Extract and store new vocabulary
    // Detect if correction was given
    // Save to localStorage or database
}
```

### 2. Multiple Avatars:
```javascript
const avatars = {
    beginner: './avatar-friendly.glb',
    intermediate: './avatar-teacher.glb',
    advanced: './avatar-professional.glb'
};

// Switch based on level
function loadAvatar(level) {
    avatar.loadModel(avatars[level]);
}
```

### 3. Voice Selection:
```javascript
// Let students choose avatar voice
const voices = speechSynthesis.getVoices();
const selectedVoice = voices.find(v => v.name === 'Google UK English Female');
utterance.voice = selectedVoice;
```

### 4. Session Recording:
```javascript
// Save conversation for review
function saveConversation() {
    const conversation = {
        date: new Date(),
        level: 'A2',
        messages: messages
    };
    localStorage.setItem('lastConversation', JSON.stringify(conversation));
}
```

---

## Next Steps

1. ✅ Choose your approach (recommended: Approach 1, Option A)
2. ✅ Set up Chatbase chatbot with language level
3. ✅ Create or source your avatar
4. ✅ Build your interface
5. ✅ Test thoroughly
6. ✅ Deploy to hosting
7. ✅ Embed in slides.com
8. ✅ Pilot with students
9. ✅ Gather feedback
10. ✅ Iterate and improve

---

## Resources

### Chatbase:
- Website: https://www.chatbase.co
- Documentation: https://docs.chatbase.co
- API Docs: https://docs.chatbase.co/api

### Avatar Tools:
- Ready Player Me: https://readyplayer.me
- TalkingHead.js: https://github.com/met4citizen/TalkingHead
- Live2D: https://www.live2d.com

### Development:
- Vercel Docs: https://vercel.com/docs
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

### Support:
- Chatbase Support: support@chatbase.co
- Community: Consider joining web dev communities on Discord/Reddit

---

## Conclusion

While direct Voki-Chatbase integration isn't possible, the approaches outlined here provide excellent alternatives that achieve the same goal: an interactive, AI-powered avatar for language learning that can be embedded in slides.com.

**Recommended path:**
Start with **Approach 1, Option B** (simple side-by-side) to test the concept quickly. If successful, upgrade to **Approach 1, Option A** (custom integrated solution) for a more professional implementation.

Good luck with your language learning platform! 🚀
