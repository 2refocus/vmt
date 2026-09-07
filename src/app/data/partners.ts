/**
 * Verbundpartner data module
 * Source: PLZ-Gebiete nach Verkehrsunternehmen.xlsx (Blatt "Übersicht Kontakte")
 */

// Logo imports
import logoAbellio from "../../imports/partner-logos/abellio.svg";
import logoDbRegio from "../../imports/partner-logos/db-regio.svg";
import logoEvag from "../../imports/partner-logos/evag.svg";
import logoGvb from "../../imports/partner-logos/gvb.svg";
import logoJnv from "../../imports/partner-logos/jnv.svg";
import logoKombus from "../../imports/partner-logos/kombus.svg";
import logoSwg from "../../imports/partner-logos/swg.png";
import logoTwsb from "../../imports/partner-logos/twsb.svg";
import logoVlg from "../../imports/partner-logos/vlg.jpg";

export type PartnerSlug =
  | "abellio"
  | "db-regio"
  | "evag"
  | "gvb"
  | "jnv"
  | "kombus"
  | "obs"
  | "pvg-wl"
  | "swg"
  | "twsb"
  | "vlg"
  | "vmt";

export type Partner = {
  slug: PartnerSlug;
  name: string;
  email: string | null; // null = Kontakt läuft über VMT
  phone?: string;
  address?: string;
  website?: string;
  coordinates?: [number, number];
  logo?: string;
};

export const PARTNERS: Record<PartnerSlug, Partner> = {
  abellio: {
    slug: "abellio",
    name: "Abellio",
    email: "abo@abellio.de",
    logo: logoAbellio,
  },
  "db-regio": {
    slug: "db-regio",
    name: "DB Regio",
    email: "jobticket-region-suedost@deutschebahn.de",
    logo: logoDbRegio,
  },
  evag: {
    slug: "evag",
    name: "EVAG Erfurt",
    email: "evag-kooperation@stadtwerke-erfurt.de",
    phone: "0361 5644647",
    logo: logoEvag,
  },
  gvb: {
    slug: "gvb",
    name: "GVB Gera",
    email: "kundenservice@gvbgera.de",
    logo: logoGvb,
  },
  jnv: {
    slug: "jnv",
    name: "Jenaer Nahverkehr",
    email: "info@nahverkehr-jena.de",
    logo: logoJnv,
  },
  kombus: {
    slug: "kombus",
    name: "KomBus",
    email: "mobilitaetsberater@kombus-online.de",
    phone: "036651 170 262",
    logo: logoKombus,
  },
  obs: {
    slug: "obs",
    name: "OBS",
    email: null, // E-Mail wird nachgeliefert
    // Logo fehlt noch
  },
  "pvg-wl": {
    slug: "pvg-wl",
    name: "PVG Weimarer Land",
    email: null, // E-Mail wird nachgeliefert
    // Logo fehlt noch
  },
  swg: {
    slug: "swg",
    name: "Stadtwerke Weimar",
    email: "Kundendienst-verkehr@swg-weimar.de",
    phone: "03643 4341-147",
    logo: logoSwg,
  },
  twsb: {
    slug: "twsb",
    name: "Thüringerwaldbahn und Straßenbahn Gotha",
    email: "info@waldbahn-gotha.de",
    phone: "03621 398270",
    logo: logoTwsb,
  },
  vlg: {
    slug: "vlg",
    name: "VLG Gotha",
    email: "job-ticket@nvg-gotha.de",
    phone: "03621 3982710",
    logo: logoVlg,
  },
  vmt: {
    slug: "vmt",
    name: "Verkehrsverbund Mittelthüringen (VMT)",
    email: "service@vmt-thueringen.de",
    phone: "0361 19449",
  },
};

/**
 * PLZ to partner slugs mapping
 * 128 unique postal codes, each mapped to 1-4 partners
 */
export const PLZ_TO_PARTNERS: Record<string, PartnerSlug[]> = {
  "06556": ["abellio"],
  "06577": ["abellio"],
  "06628": ["db-regio"],
  "06648": ["pvg-wl"],
  "07318": ["db-regio", "kombus", "abellio"],
  "07330": ["db-regio", "kombus"],
  "07333": ["db-regio", "kombus"],
  "07338": ["db-regio", "kombus"],
  "07343": ["db-regio", "kombus"],
  "07349": ["db-regio", "kombus"],
  "07351": ["db-regio"],
  "07356": ["db-regio", "kombus"],
  "07366": ["db-regio", "kombus"],
  "07368": ["db-regio", "kombus"],
  "07381": ["db-regio", "kombus"],
  "07387": ["kombus"],
  "07389": ["kombus"],
  "07407": ["db-regio", "kombus", "abellio"],
  "07422": ["db-regio", "kombus", "obs"],
  "07426": ["db-regio", "kombus", "obs"],
  "07427": ["kombus", "obs"],
  "07429": ["db-regio", "kombus", "obs"],
  "07545": ["db-regio", "gvb"],
  "07546": ["db-regio", "gvb"],
  "07548": ["db-regio", "gvb"],
  "07549": ["db-regio", "gvb"],
  "07551": ["db-regio", "gvb"],
  "07552": ["db-regio", "gvb"],
  "07554": ["db-regio", "gvb"],
  "07557": ["db-regio", "gvb"],
  "07607": ["db-regio", "jnv"],
  "07613": ["db-regio", "jnv"],
  "07616": ["db-regio", "jnv"],
  "07619": ["db-regio", "jnv"],
  "07629": ["db-regio", "jnv"],
  "07639": ["db-regio", "jnv"],
  "07646": ["db-regio", "jnv"],
  "07743": ["jnv", "abellio"],
  "07745": ["db-regio", "jnv", "abellio"],
  "07747": ["db-regio", "jnv"],
  "07749": ["db-regio", "jnv"],
  "07751": ["db-regio", "jnv"],
  "07768": ["db-regio", "jnv", "abellio"],
  "07774": ["db-regio", "jnv"],
  "07778": ["db-regio", "jnv"],
  "07806": ["db-regio", "kombus"],
  "07819": ["db-regio", "kombus"],
  "07907": ["db-regio", "kombus"],
  "07919": ["kombus"],
  "07922": ["kombus"],
  "07924": ["kombus"],
  "07926": ["kombus"],
  "07927": ["kombus"],
  "07929": ["kombus"],
  "37308": ["abellio"],
  "37318": ["abellio"],
  "37327": ["abellio"],
  "37355": ["abellio"],
  "95031": ["kombus"],
  "95032": ["kombus"],
  "95183": ["kombus"],
  "98559": ["vlg"],
  "98574": ["vlg"],
  "98593": ["vlg"],
  "98599": ["vlg"],
  "98694": ["kombus"],
  "98724": ["kombus"],
  "98739": ["kombus"],
  "98743": ["kombus"],
  "98744": ["kombus", "obs"],
  "98746": ["kombus", "obs"],
  "99084": ["evag", "abellio"],
  "99085": ["evag"],
  "99086": ["evag", "abellio"],
  "99087": ["evag"],
  "99089": ["evag"],
  "99090": ["evag"],
  "99091": ["vlg", "evag"],
  "99092": ["vlg", "evag"],
  "99094": ["evag", "abellio"],
  "99095": ["evag", "abellio"],
  "99096": ["evag"],
  "99097": ["evag"],
  "99098": ["evag", "abellio"],
  "99099": ["evag"],
  "99100": ["vlg", "evag"],
  "99102": ["evag", "pvg-wl"],
  "99189": ["vlg", "evag"],
  "99192": ["vlg", "evag"],
  "99195": ["evag", "abellio"],
  "99198": ["evag", "pvg-wl"],
  "99310": ["db-regio"],
  "99330": ["vlg"],
  "99423": ["abellio", "swg"],
  "99425": ["swg"],
  "99427": ["swg"],
  "99428": ["evag", "abellio", "swg", "pvg-wl"],
  "99438": ["db-regio", "pvg-wl"],
  "99439": ["db-regio", "pvg-wl"],
  "99441": ["db-regio", "pvg-wl"],
  "99444": ["db-regio", "pvg-wl"],
  "99448": ["evag", "pvg-wl"],
  "99510": ["db-regio", "abellio", "pvg-wl"],
  "99518": ["abellio", "pvg-wl"],
  "99610": ["db-regio", "abellio"],
  "99628": ["pvg-wl"],
  "99631": ["abellio"],
  "99734": ["abellio"],
  "99735": ["abellio"],
  "99752": ["abellio"],
  "99759": ["abellio"],
  "99765": ["abellio"],
  "99817": ["db-regio", "vlg", "abellio"],
  "99820": ["vlg", "abellio"],
  "99842": ["vlg"],
  "99846": ["vlg"],
  "99848": ["vlg", "abellio"],
  "99867": ["db-regio", "vlg", "abellio", "twsb"],
  "99869": ["db-regio", "vlg", "abellio"],
  "99880": ["db-regio", "abellio", "twsb"],
  "99885": ["db-regio", "vlg"],
  "99887": ["db-regio", "vlg"],
  "99891": ["db-regio", "twsb"],
  "99894": ["db-regio", "twsb"],
  "99897": ["db-regio", "vlg"],
  "99898": ["db-regio", "vlg"],
  "99947": ["db-regio"],
  "99958": ["vlg"],
};

/**
 * Find partners by exact PLZ match
 */
export function findPartnersByPlz(plz: string): Partner[] {
  const normalized = plz.padStart(5, "0");
  const slugs = PLZ_TO_PARTNERS[normalized];
  if (!slugs) return [];
  return slugs.map((slug) => PARTNERS[slug]);
}

/**
 * Check if a partner can be selected (has email address)
 */
export function isSelectable(partner: Partner): boolean {
  return partner.email !== null;
}

/**
 * Get partner by slug
 */
export function getPartner(slug: PartnerSlug): Partner | undefined {
  return PARTNERS[slug];
}

/**
 * Get multiple partners by slugs
 */
export function getPartnersBySlugs(slugs: PartnerSlug[]): Partner[] {
  return slugs.map((slug) => PARTNERS[slug]).filter(Boolean);
}
