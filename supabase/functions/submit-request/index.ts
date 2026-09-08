import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Edge Function: submit-request
// Receives form submissions, stores them in Supabase, and sends emails via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2";

// Fallback partner map if DB is unavailable (keep in sync with seed / partners.ts)
const PARTNER_EMAILS_FALLBACK: Record<string, { name: string; email: string | null }> = {
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
  fuh: { name: "Frank & Haueis GmbH (Test)", email: "andy@frank-haueis.de" },
};

const VMT_FALLBACK_EMAIL = Deno.env.get("VMT_FALLBACK_EMAIL") || "service@vmt-thueringen.de";
const MAIL_FROM = Deno.env.get("MAIL_FROM") || "vmt@mail.das-kommt-gut-an.de";
const ASSET_BASE =
  Deno.env.get("MAIL_ASSET_BASE") ||
  "https://bpozoojlnsxpssrzbuob.supabase.co/storage/v1/object/public/email-assets";
const VMT_LOGO_URL = `${ASSET_BASE}/vmt-logo.png`;
const DTICKET_LOGO_URL = `${ASSET_BASE}/dticket.png`;
const SITE_URL = "https://das-kommt-gut-an.de";
const VMT_BLUE = "#003B79";
const VMT_GREEN = "#A3C410";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailShell(options: {
  preheader: string;
  headerBg: string;
  headerTitle: string;
  headerSubtitle?: string;
  headerTitleColor?: string;
  bodyHtml: string;
}): string {
  const titleColor = options.headerTitleColor || "#ffffff";
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${escapeHtml(options.headerTitle)}</title>
</head>
<body style="margin:0;padding:0;background-color:#e8eef5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${VMT_BLUE};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(options.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8eef5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d7e0ec;">
          <tr>
            <td style="background-color:#ffffff;padding:20px 28px;border-bottom:4px solid ${VMT_GREEN};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <img src="${VMT_LOGO_URL}" alt="VMT Verkehrsverbund Mittelthüringen" width="160" style="display:block;width:160px;max-width:55%;height:auto;border:0;">
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <img src="${DTICKET_LOGO_URL}" alt="Deutschlandticket Job" width="110" style="display:block;width:110px;max-width:42%;height:auto;border:0;margin-left:auto;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:${options.headerBg};padding:28px 28px;text-align:center;">
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:${titleColor};font-weight:700;">${escapeHtml(options.headerTitle)}</h1>
              ${
                options.headerSubtitle
                  ? `<p style="margin:10px 0 0;font-size:14px;color:${titleColor};opacity:0.9;"><a href="${SITE_URL}" style="color:${titleColor};text-decoration:underline;">${escapeHtml(options.headerSubtitle)}</a></p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:28px;color:#1f2937;font-size:16px;line-height:1.6;">
              ${options.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f7fb;padding:20px 28px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#64748b;">
                Verkehrsverbund Mittelthüringen (VMT)<br>
                <a href="${SITE_URL}" style="color:${VMT_BLUE};text-decoration:none;font-weight:600;">das-kommt-gut-an.de</a>
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                Diese E-Mail wurde automatisch über das Kontaktformular generiert.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPartnerEmailHtml(data: SubmissionRequest, partnerName: string): string {
  const preferences = [];
  if (data.interestPhone) preferences.push("Telefonische Beratung gewünscht");
  if (data.interestContract) preferences.push("Vertragsunterlagen gewünscht");

  const field = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;width:120px;color:#64748b;font-size:13px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#0f172a;font-size:15px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
      <tr>
        <td style="padding:0 0 10px;border-bottom:2px solid ${VMT_GREEN};">
          <h3 style="margin:0;color:${VMT_BLUE};font-size:13px;letter-spacing:0.04em;text-transform:uppercase;">${title}</h3>
        </td>
      </tr>
      <tr>
        <td style="padding-top:10px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        </td>
      </tr>
    </table>`;

  const bodyHtml = `
    <p style="margin:0 0 12px;">Hallo ${escapeHtml(partnerName)},</p>
    <p style="margin:0 0 24px;">Sie haben eine neue Anfrage zum Deutschlandticket Job erhalten:</p>
    ${section(
      "Ansprechpartner:in",
      field("Name", `${escapeHtml(data.salutation)} ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}`) +
        field("Position", escapeHtml(data.position))
    )}
    ${section(
      "Unternehmen",
      field("Firma", escapeHtml(data.company)) +
        field("Größe", `${escapeHtml(data.employees)} Mitarbeiter`) +
        field("Adresse", `${escapeHtml(data.street)}, ${escapeHtml(data.plz)} ${escapeHtml(data.city)}`)
    )}
    ${section(
      "Kontakt",
      field("E-Mail", `<a href="mailto:${escapeHtml(data.email)}" style="color:${VMT_BLUE};text-decoration:none;">${escapeHtml(data.email)}</a>`) +
        field("Telefon", escapeHtml(data.phone)) +
        (preferences.length
          ? field("Wünsche", escapeHtml(preferences.join(", ")))
          : "")
    )}
    ${
      data.message
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
            <tr>
              <td style="background-color:#f4f7fb;border-left:4px solid ${VMT_GREEN};border-radius:8px;padding:16px;color:#1f2937;font-size:15px;">
                <strong style="color:${VMT_BLUE};">Nachricht</strong><br>
                ${escapeHtml(data.message).replace(/\n/g, "<br>")}
              </td>
            </tr>
          </table>`
        : ""
    }
    <p style="margin:0;">Bitte setzen Sie sich zeitnah mit dem Interessenten in Verbindung.</p>
  `;

  return emailShell({
    preheader: `Neue Anfrage von ${data.company}`,
    headerBg: VMT_BLUE,
    headerTitle: "Neue Deutschlandticket Job Anfrage",
    headerSubtitle: "über das-kommt-gut-an.de",
    bodyHtml,
  });
}

function buildApplicantConfirmationHtml(data: SubmissionRequest, partnerNames: string[]): string {
  const partnerChips = partnerNames
    .map(
      (name) =>
        `<span style="display:inline-block;background-color:#ffffff;border:1px solid #d7e0ec;color:${VMT_BLUE};padding:8px 14px;border-radius:999px;margin:4px;font-size:14px;font-weight:600;">${escapeHtml(name)}</span>`
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 12px;">${escapeHtml(data.salutation)} ${escapeHtml(data.lastName)},</p>
    <p style="margin:0 0 18px;">vielen Dank für Ihr Interesse am Deutschlandticket Job für Ihr Unternehmen <strong style="color:${VMT_BLUE};">${escapeHtml(data.company)}</strong>.</p>
    <p style="margin:0 0 12px;">Ihre Anfrage wurde erfolgreich an ${partnerNames.length === 1 ? "folgenden Verbundpartner" : "folgende Verbundpartner"} übermittelt:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#f4f7fb;border-radius:10px;padding:16px;text-align:center;">
          ${partnerChips}
        </td>
      </tr>
    </table>
    <h3 style="margin:0 0 12px;color:${VMT_BLUE};font-size:18px;">Wie geht es weiter?</h3>
    <ol style="margin:0 0 22px;padding-left:20px;color:#334155;">
      <li style="margin-bottom:8px;">Ihr Verbundpartner wird sich innerhalb von 1–2 Werktagen bei Ihnen melden.</li>
      <li style="margin-bottom:8px;">Gemeinsam besprechen Sie die Details und erhalten die Vertragsunterlagen.</li>
      <li style="margin-bottom:8px;">Nach Vertragsabschluss können Ihre Mitarbeitenden das Deutschlandticket Job bestellen.</li>
    </ol>
    <p style="margin:0 0 18px;">Bei Fragen erreichen Sie uns unter <a href="mailto:service@vmt-thueringen.de" style="color:${VMT_BLUE};font-weight:600;text-decoration:none;">service@vmt-thueringen.de</a>.</p>
    <p style="margin:0;">Mit freundlichen Grüßen<br><strong style="color:${VMT_BLUE};">Ihr VMT-Team</strong></p>
  `;

  return emailShell({
    preheader: "Ihre Anfrage zum Deutschlandticket Job wurde übermittelt",
    headerBg: VMT_GREEN,
    headerTitle: "Vielen Dank für Ihre Anfrage!",
    headerTitleColor: VMT_BLUE,
    bodyHtml,
  });
}

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

  const requiredStrings = [
    "plz", "salutation", "firstName", "lastName", "company",
    "position", "employees", "phone", "email", "street", "city",
  ];

  for (const field of requiredStrings) {
    if (typeof d[field] !== "string" || !d[field]) {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  if (!/^[0-9]{5}$/.test(d.plz as string)) {
    throw new Error("Invalid PLZ format");
  }

  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(d.email as string)) {
    throw new Error("Invalid email format");
  }

  if (!Array.isArray(d.partnerSlugs) || d.partnerSlugs.length === 0) {
    throw new Error("At least one partner must be selected");
  }

  const validSlugs = d.partnerSlugs.filter(
    (s): s is string => typeof s === "string" && /^[a-z0-9-]+$/.test(s)
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

    // Resolve partners from DB (fallback to static map)
    const { data: partnerRows, error: partnerError } = await supabase
      .from("partners")
      .select("slug, name, email, selectable")
      .in("slug", data.partnerSlugs);

    if (partnerError) {
      console.error("Partner lookup error:", partnerError);
    }

    const partnerBySlug: Record<string, { name: string; email: string | null }> = {
      ...PARTNER_EMAILS_FALLBACK,
    };
    for (const row of partnerRows || []) {
      partnerBySlug[row.slug] = {
        name: row.name,
        email: row.selectable === false ? null : row.email,
      };
    }

    const partnerRecipients: { slug: string; name: string; email: string }[] = [];
    const partnerNames: string[] = [];

    for (const slug of data.partnerSlugs) {
      const partner = partnerBySlug[slug];
      if (partner) {
        partnerNames.push(partner.name);
        if (partner.email) {
          partnerRecipients.push({ slug, name: partner.name, email: partner.email });
        }
      }
    }

    if (partnerNames.length === 0) {
      return new Response(JSON.stringify({ error: "No valid partners selected" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
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
