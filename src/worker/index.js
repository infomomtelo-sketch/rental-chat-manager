// src/worker/index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // === 1. Send a message (text or photo) ===
    if (path === "/api/messages" && request.method === "POST") {
      try {
        const { conversationId, senderId, text, imageUrl, imageUrls } = await request.json();

        await env.DB.prepare(`
          INSERT INTO messages 
          (conversation_id, sender_id, text, image_url, image_urls, message_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(
          conversationId,
          senderId,
          text || null,
          imageUrl || null,
          imageUrls ? JSON.stringify(imageUrls) : null,
          imageUrls ? 'image' : 'text'
        ).run();

        return Response.json({ success: true }, { headers: corsHeaders });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
      }
    }

    // === 2. Update rental status (Inquiry → Showing Scheduled → Approved) ===
    if (path.match(/^\/api\/conversations\/(.+)\/status$/) && request.method === "PATCH") {
      try {
        const conversationId = path.match(/^\/api\/conversations\/(.+)\/status$/)[1];
        const { status, showingTime, notes } = await request.json();

        await env.DB.prepare(`
          UPDATE conversations 
          SET status = ?, 
              showing_time = ?, 
              notes = ?,
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).bind(status, showingTime || null, notes || null, conversationId).run();

        return Response.json({ success: true, status }, { headers: corsHeaders });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
      }
    }

    // Default response
    return new Response("Rental Chat Worker is running ✅", { 
      status: 200, 
      headers: corsHeaders 
    });
  }
};
