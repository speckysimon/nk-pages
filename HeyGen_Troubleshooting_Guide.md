# HeyGen Troubleshooting Guide for Slides.com Embedding

## Problem
HeyGen embed codes don't work properly in slides.com

## Root Causes & Solutions

### Issue 1: Slides.com iframe Restrictions
Slides.com has specific requirements for iframe embeds.

**Solution A: Use Streaming Avatar SDK (Not Pre-recorded Videos)**
1. HeyGen has two products:
   - **Video Creator** (pre-recorded) - Limited embed support
   - **Streaming Avatar SDK** (real-time) - Better for interactive use

2. For slides.com, use Streaming Avatar SDK:
   - Create interactive web app with HeyGen SDK
   - Host on your own domain or Vercel/Netlify
   - Embed your hosted app into slides.com

**Solution B: Proper iframe Configuration**
```html
<iframe
    src="YOUR_HEYGEN_URL"
    width="400"
    height="600"
    frameborder="0"
    allowfullscreen
    allow="camera; microphone; autoplay; encrypted-media; fullscreen;"
    sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups">
</iframe>
```

### Issue 2: CORS and Security Policies

**Solution: Host Your Own HeyGen Integration**

1. Create a simple web app using HeyGen Streaming Avatar SDK:

```javascript
// Example integration (simplified)
import StreamingAvatar from '@heygen/streaming-avatar';

const avatar = new StreamingAvatar({
  apiKey: 'YOUR_API_KEY',
  avatarId: 'YOUR_CARTOON_AVATAR_ID'
});

await avatar.init();
await avatar.speak('Hello, ready to practice English?');
```

2. Host this on:
   - Vercel (free tier)
   - Netlify (free tier)
   - GitHub Pages
   - Your own server

3. Embed your hosted URL in slides.com

### Method 1: Create Custom Cartoon Avatar in HeyGen

**Steps:**
1. In HeyGen Studio:
   - Go to "Instant Avatar" or "Studio Avatar"
   - Upload your cartoon character image (high-res PNG)
   - Use "Photo Avatar" feature for 2D characters

2. For better cartoon support:
   - Use HeyGen API with custom avatar creation
   - Submit your character for custom rigging (requires Business plan)
   - Alternative: Use their cartoon-style preset avatars and customize

3. API endpoint for custom avatars:
   ```
   POST https://api.heygen.com/v1/avatar.create
   ```

### Method 2: Build Custom Integration

**Recommended Architecture:**

```
[Your Cartoon Character]
         ↓
[HeyGen Streaming SDK] ← Real-time animation & lip sync
         ↓
[Your Web App] ← Hosted on your domain
         ↓
[ChatGPT/GPT-4 API] ← Conversation AI
         ↓
[Slides.com via iframe] ← Embedded in lesson
```

**Implementation Steps:**

1. Create Next.js/React app with HeyGen SDK
2. Add speech recognition (Web Speech API)
3. Connect to ChatGPT API for responses
4. Configure language level in system prompt
5. Host app and embed in slides.com

**Sample embed code for slides.com:**
```html
<iframe
    src="https://your-domain.vercel.app/avatar-lesson"
    width="100%"
    height="700px"
    frameborder="0"
    allow="microphone; camera">
</iframe>
```

### Method 3: Use HeyGen API + Custom Frontend

If HeyGen's built-in embed continues failing:

1. Use HeyGen only for avatar animation generation
2. Build your own iframe-friendly frontend
3. Stream HeyGen avatar video into your interface
4. Ensures full control over embed compatibility

**Tech Stack:**
- Frontend: React/Vue.js with responsive design
- Avatar: HeyGen Streaming API
- AI Backend: OpenAI GPT-4 API
- Speech: Web Speech API (browser native)
- Hosting: Vercel (free tier) or similar

## Slides.com Specific Embed Requirements

### Option 1: Direct iframe (if allowed)
Add in slides.com HTML block:
```html
<div style="width: 400px; height: 600px; margin: auto;">
    <iframe src="YOUR_URL"
            width="100%"
            height="100%"
            frameborder="0"
            allow="microphone">
    </iframe>
</div>
```

### Option 2: Use Slides.com's embed feature
1. Go to slide edit mode
2. Click "Insert" → "Embed"
3. Paste your HeyGen URL or iframe code
4. Adjust dimensions

### Option 3: Use button/link to open in modal
If iframe restrictions persist:
- Create "Talk to Avatar" button in slides.com
- Opens avatar in modal/popup window
- Avoids iframe restrictions entirely

## Testing Checklist

- [ ] Verify HeyGen SDK vs Video product (use SDK for real-time)
- [ ] Test custom hosted integration
- [ ] Verify microphone permissions in iframe
- [ ] Test in slides.com preview mode
- [ ] Test in actual presentation mode
- [ ] Verify audio works (autoplay policy)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Confirm CORS headers on hosted app
- [ ] Test speech recognition activation
- [ ] Verify lip sync quality with cartoon character

## HeyGen Resources

- Streaming Avatar SDK Docs: https://docs.heygen.com/docs/streaming-avatar-sdk
- API Reference: https://docs.heygen.com/reference/api-overview
- Support: support@heygen.com

## Pricing Considerations

- Streaming Avatar SDK requires Business plan (~$120+/month)
- API usage billed per minute of avatar streaming
- May need developer plan for custom avatar creation
- Consider cost vs. alternatives if budget is tight

## Alternative if HeyGen Remains Problematic

If HeyGen embedding issues persist even with custom hosting:
- Use HeyGen to generate avatar video clips
- Use different platform for real-time interaction
- Combine pre-recorded HeyGen clips with live audio (less ideal)
