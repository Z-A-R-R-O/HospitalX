import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API Key is missing. Please add OPENROUTER_API_KEY to your environment variables." }, 
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://hospitalx.vercel.app", 
        "X-Title": "HospitalX", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { 
            role: "system", 
            content: "You are HospitalX AI, an advanced, highly professional operational co-pilot for hospital administrators. You provide concise, insightful, and actionable answers to queries based on hospital management, patient care, and staff efficiency." 
          },
          ...(messages || [])
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return NextResponse.json({ error: "Error communicating with OpenRouter." }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices?.[0]?.message?.content || "No response generated." });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
