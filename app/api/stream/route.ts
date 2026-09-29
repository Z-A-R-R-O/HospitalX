/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export const runtime = "nodejs";
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: "connected" })}\n\n`));
      
      // Simulate live hospital events pushing to the dashboard
      const interval = setInterval(() => {
        const events = [
          { type: 'bed_status_change', data: { bed: 'ICU-01', status: 'occupied' } },
          { type: 'new_referral', data: { specialty: 'neurology', urgency: 'urgent' } },
          { type: 'sync_conflict', data: { resource: 'patient_record', id: 'P-102' } }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(randomEvent)}\n\n`));
      }, 15000); // Push an event every 15 seconds
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
