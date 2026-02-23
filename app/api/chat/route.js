import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, history } = await request.json();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // Fallback responses
        const fallbackResponses = {
            'help me choose problem': `Based on your domain "${user.domain}", here are some suggestions:\n\n🏥 **Healthcare AI**: Patient diagnosis assistant, Medical image analysis, Drug interaction checker\n🌾 **Agriculture AI**: Crop disease detection, Yield prediction, Smart irrigation\n🏙️ **Smart Cities**: Traffic optimization, Energy management, Waste management\n📚 **Education Tech**: Personalized learning paths, Automated grading, Student engagement analytics\n\nPick one that interests your team!`,
            'fix my error': 'Please share your error message and I\'ll help you debug it! Common issues:\n\n1. **Import errors**: Check your file paths\n2. **API errors**: Verify your endpoints\n3. **Build errors**: Check for syntax issues\n4. **Runtime errors**: Add console.log for debugging',
            'explain ai model usage': 'Here\'s how to integrate AI models:\n\n1. **OpenAI API**: Use `fetch()` to call the API with your prompt\n2. **Hugging Face**: Use their Inference API for pre-trained models\n3. **TensorFlow.js**: Run models directly in the browser\n\nStart with OpenAI for the quickest results!',
            'how to deploy': 'Deployment options:\n\n1. **Vercel** (Recommended for Next.js):\n   - Push to GitHub\n   - Connect repo on vercel.com\n   - Auto-deploys on push\n\n2. **Netlify**: Similar to Vercel\n3. **Railway**: Great for backend services',
            'suggest tech stack': `For your "${user.domain}" domain, I recommend:\n\n**Frontend**: Next.js + Tailwind CSS\n**Backend**: Next.js API Routes\n**Database**: MongoDB\n**AI**: OpenAI API or Hugging Face\n**Deployment**: Vercel\n\nThis stack is fast to build with and scales well!`,
        };

        if (!apiKey) {
            const lowerMessage = message.toLowerCase();
            let reply = fallbackResponses[lowerMessage] || null;

            if (!reply) {
                if (lowerMessage.includes('problem') || lowerMessage.includes('choose')) reply = fallbackResponses['help me choose problem'];
                else if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('fix')) reply = fallbackResponses['fix my error'];
                else if (lowerMessage.includes('deploy')) reply = fallbackResponses['how to deploy'];
                else if (lowerMessage.includes('tech') || lowerMessage.includes('stack')) reply = fallbackResponses['suggest tech stack'];
                else if (lowerMessage.includes('ai') || lowerMessage.includes('model')) reply = fallbackResponses['explain ai model usage'];
                else reply = `I'm VibeBuild AI Assistant! I can help you with:\n\n🎯 **Choose a problem statement** for your domain\n🔧 **Debug errors** in your code\n🤖 **Explain AI model usage**\n🚀 **Deployment guidance**\n💻 **Tech stack suggestions**\n📝 **Prompt engineering tips**\n\nWhat would you like help with?`;
            }

            return NextResponse.json({ reply });
        }

        const systemPrompt = `You are VibeBuild AI Assistant, helping workshop participants build AI-driven solutions. The user is from team "${user.name}" working on the "${user.domain}" domain. Help them with choosing problem statements, tech stack recommendations, AI model integration, debugging code, GitHub setup, deployment, and prompt engineering. Keep responses concise, friendly, and actionable. Use emojis and markdown formatting.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []).slice(-6),
            { role: 'user', content: message },
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: 'gpt-3.5-turbo', messages, max_tokens: 500, temperature: 0.7 }),
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again!' }, { status: 200 });
    }
}
