import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { images } = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              ...images,
              {
                type: 'text',
                text: `You are a sophisticated aesthetic curator creating a weekly lookbook narrative for COMMONPLACE.

Analyze these images. Create a cohesive aesthetic story.

Return ONLY a JSON object (no markdown, no backticks):
{
  "title": "2-3 word evocative theme title (lowercase)",
  "subtitle": "poetic one-line description (8-12 words)",
  "editorsNote": "a 3-4 sentence reflective paragraph about patterns in their visual choices. write in second person ('your attention drifted...', 'you saved...'). be observant, poetic. reference specific visual elements: colors, compositions, moods. 60-80 words.",
  "palette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"],
  "textures": "3-4 word texture description",
  "mood": "2-3 word mood description",
  "shapes": "2-3 word shape description"
}

Be specific and observant.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}