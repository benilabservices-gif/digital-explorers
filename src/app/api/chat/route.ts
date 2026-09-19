import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.AI_API_KEY;
  const endpoint = process.env.AI_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.AI_MODEL || 'anthropic/claude-3.5-haiku';

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.get('origin') || '',
        'X-Title': 'Digital Explorers',
      },
      body: JSON.stringify({
        model,
        ...body,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
