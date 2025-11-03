# SitePal Cartoon Avatar Troubleshooting Guide

## Problem
Cartoon avatar created from our character looks "meh" - quality/appearance not satisfactory

## Improved Methods to Test

### Method 1: Use Custom Character Upload with Optimized Image
**Steps:**
1. Prepare your cartoon character image:
   - Use high-resolution PNG (at least 1024x1024px)
   - Ensure transparent background
   - Character should be facing forward, neutral expression
   - Clean, vector-style artwork works best
   - Eyes should be clearly visible and symmetrical

2. In SitePal:
   - Go to "Create Custom Avatar" option
   - Upload your optimized character image
   - Use the "Advanced Editor" to fine-tune:
     - Mouth position markers (critical for lip sync)
     - Eye position markers
     - Head movement pivot points

3. Test different SitePal character templates:
   - Try "Cartoon" category templates as base
   - Clone a template, then replace face/body with your character
   - This preserves better animation rigging

### Method 2: Use SitePal API for Custom Integration
**Steps:**
1. Create basic avatar in SitePal studio
2. Use SitePal API to:
   - Control animation parameters programmatically
   - Layer your cartoon character over SitePal's animation skeleton
   - Customize lip sync timing/intensity

3. API documentation: https://www.sitepal.com/api

### Method 3: Hybrid Approach - Use SitePal Voice Only
**Alternative if avatar quality remains poor:**
1. Use SitePal only for voice/speech synthesis
2. Combine with separate animation tool (Adobe Character Animator, Live2D)
3. Sync animations using SitePal's audio callback events

## Embedding in Slides.com

### Standard Embed Code
```html
<iframe src="https://www.sitepal.com/avatar/YOURAVATARCODE"
        width="400"
        height="600"
        frameborder="0"
        allow="microphone">
</iframe>
```

### Chatbot Integration for AI Conversations
1. Set up SitePal with AI backend:
   - Connect to ChatGPT API (via SitePal's chatbot integration)
   - Configure language level/grammar in ChatGPT system prompt
   - Set conversation context for language learning

2. System prompt example for language level control:
```
You are a friendly language tutor teaching at A2/B1 CEFR level.
Use simple present and past tenses. Avoid complex grammar.
Provide corrections gently and encourage practice.
```

## Testing Checklist
- [ ] Test with high-res transparent PNG
- [ ] Verify mouth markers are properly positioned
- [ ] Test lip sync with sample audio
- [ ] Verify idle animations work smoothly
- [ ] Test embed in slides.com (check microphone permissions)
- [ ] Test speech recognition functionality
- [ ] Verify AI responses match language level

## Contact Support
If quality issues persist:
- Email: support@oddcast.com
- Request custom character rigging assistance (may require premium plan)
