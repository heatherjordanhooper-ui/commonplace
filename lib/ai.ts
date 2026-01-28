import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeImage(imageUrl: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl,
            },
          },
          {
            type: 'text',
            text: `Analyze this image and provide:
1. Dominant colors (hex codes, up to 5)
2. Visual tags (3-5 words like: minimal, organic, brutalist)
3. Mood tags (2-3 words like: calm, energetic)

Return as JSON only:
{
  "colors": ["#hex1", "#hex2"],
  "dominant_color": "#hex",
  "tags": ["tag1", "tag2"],
  "mood": ["mood1", "mood2"]
}`
          }
        ],
      },
    ],
  });

  const response = message.content[0];
  if (response.type === 'text') {
    return JSON.parse(response.text);
  }
  throw new Error('Unexpected response type');
}