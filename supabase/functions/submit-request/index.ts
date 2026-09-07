import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Edge Function: submit-request
// Receives form submissions, stores them in Supabase, and sends emails via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2";

// Partner email mapping (synced with src/app/data/partners.ts)
const PARTNER_EMAILS: Record<string, { name: string; email: string | null }> = {
  abellio: { name: "Abellio", email: "abo@abellio.de" },
  "db-regio": { name: "DB Regio", email: "jobticket-region-suedost@deutschebahn.de" },
  evag: { name: "EVAG Erfurt", email: "evag-kooperation@stadtwerke-erfurt.de" },
  gvb: { name: "GVB Gera", email: "kundenservice@gvbgera.de" },
  jnv: { name: "Jenaer Nahverkehr", email: "info@nahverkehr-jena.de" },
  kombus: { name: "KomBus", email: "mobilitaetsberater@kombus-online.de" },
  obs: { name: "OBS", email: null },
  "pvg-wl": { name: "PVG Weimarer Land", email: null },
  swg: { name: "Stadtwerke Weimar", email: "Kundendienst-verkehr@swg-weimar.de" },
  twsb: { name: "Thüringerwaldbahn und Straßenbahn Gotha", email: "info@waldbahn-gotha.de" },
  vlg: { name: "VLG Gotha", email: "job-ticket@nvg-gotha.de" },
  vmt: { name: "Verkehrsverbund Mittelthüringen (VMT)", email: "service@vmt-thueringen.de" },
};

const VMT_FALLBACK_EMAIL = Deno.env.get("VMT_FALLBACK_EMAIL") || "service@vmt-thueringen.de";
const MAIL_FROM = Deno.env.get("MAIL_FROM") || "noreply@das-kommt-gut-an.de";

interface SubmissionRequest {
  plz: string;
  partnerSlugs: string[];
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  employees: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  interestPhone: boolean;
  interestContract: boolean;
  message: string;
}

function validateRequest(data: unknown): SubmissionRequest {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const d = data as Record<string, unknown>;

  // Required string fields
  const requiredStrings = [
    "plz", "salutation", "firstName", "lastName", "company",
    "position", "employees", "phone", "email", "street", "city"
  ];
  
  for (const field of requiredStrings) {
    if (typeof d[field] !== "string" || !d[field]) {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  // PLZ validation
  if (!/^[0-9]{5}$/.test(d.plz as string)) {
    throw new Error("Invalid PLZ format");
  }

  // Email validation
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(d.email as string)) {
    throw new Error("Invalid email format");
  }

  // Partner slugs validation
  if (!Array.isArray(d.partnerSlugs) || d.partnerSlugs.length === 0) {
    throw new Error("At least one partner must be selected");
  }

  const validSlugs = d.partnerSlugs.filter(
    (s): s is string => typeof s === "string" && s in PARTNER_EMAILS
  );
  
  if (validSlugs.length === 0) {
    throw new Error("No valid partners selected");
  }

  return {
    plz: d.plz as string,
    partnerSlugs: validSlugs,
    salutation: d.salutation as string,
    firstName: d.firstName as string,
    lastName: d.lastName as string,
    company: d.company as string,
    position: d.position as string,
    employees: d.employees as string,
    phone: d.phone as string,
    email: d.email as string,
    street: d.street as string,
    city: d.city as string,
    interestPhone: Boolean(d.interestPhone),
    interestContract: Boolean(d.interestContract),
    message: typeof d.message === "string" ? d.message : "",
  };
}

function buildPartnerEmailHtml(data: SubmissionRequest, partnerName: string): string {
  const preferences = [];
  if (data.interestPhone) preferences.push("Telefonische Beratung gewünscht");
  if (data.interestContract) preferences.push("Vertragsunterlagen gewünscht");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #003B79; color: white; padding: 24px; text-align: center; }
    .content { padding: 24px; max-width: 600px; margin: 0 auto; }
    .section { margin-bottom: 24px; }
    .section h3 { color: #003B79; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
    .field { margin-bottom: 8px; }
    .label { color: #666; font-size: 12px; }
    .value { font-weight: 500; }
    .message { background: #f5f5f5; padding: 16px; border-radius: 8px; margin-top: 16px; }
    .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 20px;">Neue Deutschlandticket Job Anfrage</h1>
    <p style="margin: 8px 0 0; opacity: 0.8;">über das-kommt-gut-an.de</p>
  </div>
  <div class="content">
    <p>Hallo ${partnerName},</p>
    <p>Sie haben eine neue Anfrage zum Deutschlandticket Job erhalten:</p>
    
    <div class="section">
      <h3>Ansprechpartner:in</h3>
      <div class="field"><span class="label">Name:</span> <span class="value">${data.salutation} ${data.firstName} ${data.lastName}</span></div>
      <div class="field"><span class="label">Position:</span> <span class="value">${data.position}</span></div>
    </div>
    
    <div class="section">
      <h3>Unternehmen</h3>
      <div class="field"><span class="label">Firma:</span> <span class="value">${data.company}</span></div>
      <div class="field"><span class="label">Größe:</span> <span class="value">${data.employees} Mitarbeiter</span></div>
      <div class="field"><span class="label">Adresse:</span> <span class="value">${data.street}, ${data.plz} ${data.city}</span></div>
    </div>
    
    <div class="section">
      <h3>Kontakt</h3>
      <div class="field"><span class="label">E-Mail:</span> <span class="value"><a href="mailto:${data.email}">${data.email}</a></span></div>
      <div class="field"><span class="label">Telefon:</span> <span class="value">${data.phone}</span></div>
      ${preferences.length > 0 ? `<div class="field"><span class="label">Wünsche:</span> <span class="value">${preferences.join(", ")}</span></div>` : ""}
    </div>
    
    ${data.message ? `<div class="message"><strong>Nachricht:</strong><br>${data.message.replace(/\n/g, "<br>")}</div>` : ""}
    
    <p style="margin-top: 24px;">Bitte setzen Sie sich zeitnah mit dem Interessenten in Verbindung.</p>
  </div>
  <div class="footer">
    Diese E-Mail wurde automatisch über das Kontaktformular auf das-kommt-gut-an.de generiert.<br>
    Verkehrsverbund Mittelthüringen (VMT)
  </div>
</body>
</html>`;
}

function buildApplicantConfirmationHtml(data: SubmissionRequest, partnerNames: string[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #A3C410; color: #003B79; padding: 24px; text-align: center; }
    .content { padding: 24px; max-width: 600px; margin: 0 auto; }
    .partners { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .partner { display: inline-block; background: white; padding: 6px 12px; border-radius: 16px; margin: 4px; font-size: 14px; }
    .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">Vielen Dank für Ihre Anfrage!</h1>
  </div>
  <div class="content">
    <p>${data.salutation} ${data.lastName},</p>
    <p>vielen Dank für Ihr Interesse am Deutschlandticket Job für Ihr Unternehmen <strong>${data.company}</strong>.</p>
    
    <p>Ihre Anfrage wurde erfolgreich an ${partnerNames.length === 1 ? "folgenden Verbundpartner" : "folgende Verbundpartner"} übermittelt:</p>
    
    <div class="partners">
      ${partnerNames.map(name => `<span class="partner">${name}</span>`).join(" ")}
    </div>
    
    <h3 style="color: #003B79;">Wie geht es weiter?</h3>
    <ol>
      <li>Ihr Verbundpartner wird sich innerhalb von 1-2 Werktagen bei Ihnen melden.</li>
      <li>Gemeinsam besprechen Sie die Details und erhalten die Vertragsunterlagen.</li>
      <li>Nach Vertragsabschluss können Ihre Mitarbeitenden das Deutschlandticket Job bestellen.</li>
    </ol>
    
    <p>Bei Fragen können Sie uns jederzeit unter <a href="mailto:service@vmt-thueringen.de">service@vmt-thueringen.de</a> erreichen.</p>
    
    <p>Mit freundlichen Grüßen<br>
    Ihr VMT-Team</p>
  </div>
  <div class="footer">
    Verkehrsverbund Mittelthüringen (VMT)<br>
    <a href="https://das-kommt-gut-an.de">das-kommt-gut-an.de</a>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const data = validateRequest(body);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

    // Prepare mail status tracking
    const mailStatus: Record<string, { sent: boolean; error?: string; messageId?: string }> = {};

    // Get partner emails and names
    const partnerRecipients: { slug: string; name: string; email: string }[] = [];
    const partnerNames: string[] = [];

    for (const slug of data.partnerSlugs) {
      const partner = PARTNER_EMAILS[slug];
      if (partner) {
        partnerNames.push(partner.name);
        if (partner.email) {
          partnerRecipients.push({ slug, name: partner.name, email: partner.email });
        }
      }
    }

    // Send emails to partners
    if (resend) {
      for (const recipient of partnerRecipients) {
        try {
          const result = await resend.emails.send({
            from: `VMT Deutschlandticket Job <${MAIL_FROM}>`,
            to: recipient.email,
            replyTo: data.email,
            subject: `Neue Deutschlandticket Job Anfrage von ${data.company}`,
            html: buildPartnerEmailHtml(data, recipient.name),
          });
          mailStatus[recipient.slug] = { sent: true, messageId: result.data?.id };
        } catch (err) {
          mailStatus[recipient.slug] = { sent: false, error: String(err) };
        }
      }

      // Send confirmation to applicant
      try {
        const result = await resend.emails.send({
          from: `VMT Deutschlandticket Job <${MAIL_FROM}>`,
          to: data.email,
          subject: "Ihre Anfrage zum Deutschlandticket Job",
          html: buildApplicantConfirmationHtml(data, partnerNames),
        });
        mailStatus["applicant"] = { sent: true, messageId: result.data?.id };
      } catch (err) {
        mailStatus["applicant"] = { sent: false, error: String(err) };
      }

      // Send copy to VMT
      try {
        const result = await resend.emails.send({
          from: `VMT Deutschlandticket Job <${MAIL_FROM}>`,
          to: VMT_FALLBACK_EMAIL,
          replyTo: data.email,
          subject: `[Kopie] Deutschlandticket Job Anfrage von ${data.company}`,
          html: buildPartnerEmailHtml(data, "VMT Team"),
        });
        mailStatus["vmt-copy"] = { sent: true, messageId: result.data?.id };
      } catch (err) {
        mailStatus["vmt-copy"] = { sent: false, error: String(err) };
      }
    } else {
      // No Resend API key - mark all as not sent (test mode)
      for (const slug of data.partnerSlugs) {
        mailStatus[slug] = { sent: false, error: "RESEND_API_KEY not configured" };
      }
      mailStatus["applicant"] = { sent: false, error: "RESEND_API_KEY not configured" };
      mailStatus["vmt-copy"] = { sent: false, error: "RESEND_API_KEY not configured" };
    }

    // Store submission in database
    const { data: submission, error: dbError } = await supabase
      .from("submissions")
      .insert({
        plz: data.plz,
        partner_slugs: data.partnerSlugs,
        salutation: data.salutation,
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        position: data.position,
        employees: data.employees,
        phone: data.phone,
        email: data.email,
        street: data.street,
        city: data.city,
        interest_phone: data.interestPhone,
        interest_contract: data.interestContract,
        message: data.message || null,
        mail_status: mailStatus,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store submission", details: dbError.message }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        submissionId: submission?.id,
        partnersNotified: partnerRecipients.length,
        mailStatus: Object.fromEntries(
          Object.entries(mailStatus).map(([k, v]) => [k, v.sent])
        ),
      }),
      {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Request error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }
});
