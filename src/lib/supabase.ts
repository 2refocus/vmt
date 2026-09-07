import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SubmissionPayload {
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

export interface SubmissionResponse {
  success: boolean;
  submissionId?: string;
  partnersNotified?: number;
  mailStatus?: Record<string, boolean>;
  error?: string;
}

export async function submitRequest(payload: SubmissionPayload): Promise<SubmissionResponse> {
  if (!supabase) {
    // Fallback for development without Supabase
    console.log("Supabase not configured, simulating submission:", payload);
    return {
      success: true,
      submissionId: "mock-" + Date.now(),
      partnersNotified: payload.partnerSlugs.length,
    };
  }

  const { data, error } = await supabase.functions.invoke("submit-request", {
    body: payload,
  });

  if (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error: error.message || "Ein Fehler ist aufgetreten",
    };
  }

  return data as SubmissionResponse;
}
