import { NextRequest, NextResponse } from 'next/server';

// Coach IA via NVIDIA NIM (API compatible OpenAI) — GLM-5.3 de Z.ai.
// Clé : build.nvidia.com → « Get API Key » (format nvapi-…), variable AI_API_KEY.
export async function POST(req: NextRequest) {
  const apiKey = process.env.AI_API_KEY;
  const endpoint = process.env.AI_ENDPOINT || 'https://integrate.api.nvidia.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'z-ai/glm-5.3';

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
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        // GLM-5.3 est un modèle de raisonnement : budget de réflexion réduit
        // pour garder un coach réactif (low | high | max, défaut NIM = max).
        reasoning_effort: 'low',
        ...body,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
