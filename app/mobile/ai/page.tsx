"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Bot, FileText, Mic, Sparkles } from "lucide-react";
import { MobilePageHeader, MobileSectionHeading } from "../components";

const starterPrompts = ["What needs attention today?", "Summarize pending referrals", "Which beds are available?"];

export default function MobileAiPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Good morning. I can help you find the next approved action across today’s care work." }]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    try {
      const response = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: text }] }) });
      const data = await response.json();
      setMessages((current) => [...current, { role: "assistant", text: data.text ?? "I could not complete that request. Try a shorter operational question." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "AI is unavailable right now. Your patient and referral workflows remain available." }]);
    }
  }

  return (
    <div className="mobile-stack mobile-ai-page">
      <MobilePageHeader eyebrow="AI Co-pilot" title="A calmer next step." detail="Ask about operations. Review every suggestion before acting." action={<span className="mobile-ai-badge"><Sparkles size={14} /> Assistive</span>} />
      <div className="mobile-ai-notice"><Bot size={18} /><span>Uses current HospitalX data when available. It does not diagnose, prescribe, or approve clinical actions.</span></div>
      <section className="mobile-ai-surface">
        <div className="mobile-ai-messages">
          {messages.map((message, index) => <div className={`mobile-message mobile-message-${message.role}`} key={`${message.role}-${index}`}><span className="mobile-message-icon">{message.role === "assistant" ? <Bot size={15} /> : "AZ"}</span><p>{message.text}</p></div>)}
        </div>
        <div className="mobile-source-row"><FileText size={14} /><span>Sources: Command Center, referrals, appointments</span></div>
        <form className="mobile-ai-composer" onSubmit={sendMessage}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask HospitalX" aria-label="Ask HospitalX" />
          <button type="button" aria-label="Use voice input"><Mic size={17} /></button>
          <button type="submit" aria-label="Send message"><ArrowUp size={17} /></button>
        </form>
      </section>
      <section><MobileSectionHeading title="Try asking" /><div className="mobile-prompt-list">{starterPrompts.map((prompt) => <button key={prompt} onClick={() => setInput(prompt)}>{prompt}<ArrowUp size={14} /></button>)}</div></section>
    </div>
  );
}
