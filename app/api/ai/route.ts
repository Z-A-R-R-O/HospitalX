import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Hardcoded demo key for OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3.5-lightning:free", // This is very fast and currently working
        messages: [
          { 
            role: "system", 
            content: "You are Madhu, a bright, deeply knowledgeable, and caring AI Nurse Assistant for HospitalX. You help doctors and hospital administrators with operational insights, patient care coordination, medical data summaries, and hospital efficiency. Keep your tone professional yet warm and supportive. Provide concise, actionable answers. Never break character or refer to yourself as a large language model." 
          },
          ...(messages || [])
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      try {
         const errData = JSON.parse(errorText);
         return NextResponse.json({ error: `API Error: ${errData.error?.message || errorText}` }, { status: response.status });
      } catch (e) {
         return NextResponse.json({ error: "Error communicating with AI API." }, { status: response.status });
      }
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices?.[0]?.message?.content || "No response generated." });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}
