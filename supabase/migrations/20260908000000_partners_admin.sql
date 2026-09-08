-- Partners + PLZ mapping (admin-editable) and authenticated admin grants

CREATE TABLE IF NOT EXISTS public.partners (
  slug TEXT PRIMARY KEY CHECK (slug ~ '^[a-z0-9-]+$'),
  name TEXT NOT NULL CHECK (length(name) >= 1),
  email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT,
  address TEXT,
  website TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  logo_key TEXT,
  selectable BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_plz (
  plz TEXT NOT NULL CHECK (plz ~ '^[0-9]{5}$'),
  partner_slug TEXT NOT NULL REFERENCES public.partners(slug) ON DELETE CASCADE,
  PRIMARY KEY (plz, partner_slug)
);

CREATE INDEX IF NOT EXISTS idx_partner_plz_plz ON public.partner_plz (plz);
CREATE INDEX IF NOT EXISTS idx_partners_sort ON public.partners (sort_order, name);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS partners_set_updated_at ON public.partners;
CREATE TRIGGER partners_set_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_plz ENABLE ROW LEVEL SECURITY;

-- Public read (emails already used in the public form flow)
DROP POLICY IF EXISTS partners_public_read ON public.partners;
CREATE POLICY partners_public_read ON public.partners FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS partner_plz_public_read ON public.partner_plz;
CREATE POLICY partner_plz_public_read ON public.partner_plz FOR SELECT TO anon, authenticated USING (true);

-- Authenticated admins can manage partners
DROP POLICY IF EXISTS partners_admin_write ON public.partners;
CREATE POLICY partners_admin_write ON public.partners FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS partner_plz_admin_write ON public.partner_plz;
CREATE POLICY partner_plz_admin_write ON public.partner_plz FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Admin dashboard: authenticated read on submissions + stats
DROP POLICY IF EXISTS submissions_admin_read ON public.submissions;
CREATE POLICY submissions_admin_read ON public.submissions FOR SELECT TO authenticated USING (true);

GRANT SELECT ON public.partners TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT SELECT ON public.partner_plz TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_plz TO authenticated;
GRANT SELECT ON public.submissions TO authenticated;
GRANT SELECT ON public.submission_stats TO authenticated;

INSERT INTO public.partners (slug, name, email, phone, address, website, lat, lng, logo_key, selectable, sort_order) VALUES
  ('abellio', 'Abellio', 'abo@abellio.de', NULL, NULL, NULL, NULL, NULL, 'abellio', true, 10),
  ('db-regio', 'DB Regio', 'jobticket-region-suedost@deutschebahn.de', NULL, NULL, NULL, NULL, NULL, 'db-regio', true, 20),
  ('evag', 'EVAG Erfurt', 'evag-kooperation@stadtwerke-erfurt.de', '0361 5644647', NULL, NULL, NULL, NULL, 'evag', true, 30),
  ('gvb', 'GVB Gera', 'kundenservice@gvbgera.de', NULL, NULL, NULL, NULL, NULL, 'gvb', true, 40),
  ('jnv', 'Jenaer Nahverkehr', 'info@nahverkehr-jena.de', NULL, NULL, NULL, NULL, NULL, 'jnv', true, 50),
  ('kombus', 'KomBus', 'mobilitaetsberater@kombus-online.de', '036651 170 262', NULL, NULL, NULL, NULL, 'kombus', true, 60),
  ('obs', 'OBS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 70),
  ('pvg-wl', 'PVG Weimarer Land', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 80),
  ('swg', 'Stadtwerke Weimar', 'Kundendienst-verkehr@swg-weimar.de', '03643 4341-147', NULL, NULL, NULL, NULL, 'swg', true, 90),
  ('twsb', 'Thüringerwaldbahn und Straßenbahn Gotha', 'info@waldbahn-gotha.de', '03621 398270', NULL, NULL, NULL, NULL, 'twsb', true, 100),
  ('vlg', 'VLG Gotha', 'job-ticket@nvg-gotha.de', '03621 3982710', NULL, NULL, NULL, NULL, 'vlg', true, 110),
  ('vmt', 'Verkehrsverbund Mittelthüringen (VMT)', 'service@vmt-thueringen.de', '0361 19449', NULL, NULL, NULL, NULL, NULL, true, 120),
  ('fuh', 'Frank & Haueis GmbH (Test)', 'andy@frank-haueis.de', '+49 361 6600030', 'Schlachthofstraße 84, 99085 Erfurt', 'https://www.frank-haueis.de', 50.9786, 11.0464, NULL, true, 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  website = EXCLUDED.website,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  logo_key = EXCLUDED.logo_key,
  selectable = EXCLUDED.selectable,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO public.partner_plz (plz, partner_slug) VALUES
  ('37308', 'abellio'),
  ('37318', 'abellio'),
  ('37327', 'abellio'),
  ('37355', 'abellio'),
  ('95031', 'kombus'),
  ('95032', 'kombus'),
  ('95183', 'kombus'),
  ('98559', 'vlg'),
  ('98574', 'vlg'),
  ('98593', 'vlg'),
  ('98599', 'vlg'),
  ('98694', 'kombus'),
  ('98724', 'kombus'),
  ('98739', 'kombus'),
  ('98743', 'kombus'),
  ('98744', 'kombus'),
  ('98744', 'obs'),
  ('98746', 'kombus'),
  ('98746', 'obs'),
  ('99084', 'evag'),
  ('99084', 'abellio'),
  ('99085', 'evag'),
  ('99086', 'evag'),
  ('99086', 'abellio'),
  ('99087', 'evag'),
  ('99089', 'evag'),
  ('99090', 'evag'),
  ('99091', 'vlg'),
  ('99091', 'evag'),
  ('99092', 'vlg'),
  ('99092', 'evag'),
  ('99094', 'evag'),
  ('99094', 'abellio'),
  ('99095', 'evag'),
  ('99095', 'abellio'),
  ('99096', 'evag'),
  ('99097', 'evag'),
  ('99098', 'evag'),
  ('99098', 'abellio'),
  ('99099', 'evag'),
  ('99100', 'vlg'),
  ('99100', 'evag'),
  ('99102', 'evag'),
  ('99102', 'pvg-wl'),
  ('99189', 'vlg'),
  ('99189', 'evag'),
  ('99192', 'vlg'),
  ('99192', 'evag'),
  ('99195', 'evag'),
  ('99195', 'abellio'),
  ('99198', 'evag'),
  ('99198', 'pvg-wl'),
  ('99310', 'db-regio'),
  ('99330', 'vlg'),
  ('99423', 'abellio'),
  ('99423', 'swg'),
  ('99425', 'swg'),
  ('99427', 'swg'),
  ('99428', 'evag'),
  ('99428', 'abellio'),
  ('99428', 'swg'),
  ('99428', 'pvg-wl'),
  ('99438', 'db-regio'),
  ('99438', 'pvg-wl'),
  ('99439', 'db-regio'),
  ('99439', 'pvg-wl'),
  ('99441', 'db-regio'),
  ('99441', 'pvg-wl'),
  ('99444', 'db-regio'),
  ('99444', 'pvg-wl'),
  ('99448', 'evag'),
  ('99448', 'pvg-wl'),
  ('99510', 'db-regio'),
  ('99510', 'abellio'),
  ('99510', 'pvg-wl'),
  ('99518', 'abellio'),
  ('99518', 'pvg-wl'),
  ('99610', 'db-regio'),
  ('99610', 'abellio'),
  ('99628', 'pvg-wl'),
  ('99631', 'abellio'),
  ('99734', 'abellio'),
  ('99735', 'abellio'),
  ('99752', 'abellio'),
  ('99759', 'abellio'),
  ('99765', 'abellio'),
  ('99817', 'db-regio'),
  ('99817', 'vlg'),
  ('99817', 'abellio'),
  ('99820', 'vlg'),
  ('99820', 'abellio'),
  ('99842', 'vlg'),
  ('99846', 'vlg'),
  ('99848', 'vlg'),
  ('99848', 'abellio'),
  ('99867', 'db-regio'),
  ('99867', 'vlg'),
  ('99867', 'abellio'),
  ('99867', 'twsb'),
  ('99869', 'db-regio'),
  ('99869', 'vlg'),
  ('99869', 'abellio'),
  ('99880', 'db-regio'),
  ('99880', 'abellio'),
  ('99880', 'twsb'),
  ('99885', 'db-regio'),
  ('99885', 'vlg'),
  ('99887', 'db-regio'),
  ('99887', 'vlg'),
  ('99891', 'db-regio'),
  ('99891', 'twsb'),
  ('99894', 'db-regio'),
  ('99894', 'twsb'),
  ('99897', 'db-regio'),
  ('99897', 'vlg'),
  ('99898', 'db-regio'),
  ('99898', 'vlg'),
  ('99947', 'db-regio'),
  ('99958', 'vlg'),
  ('06556', 'abellio'),
  ('06577', 'abellio'),
  ('06628', 'db-regio'),
  ('06648', 'pvg-wl'),
  ('07318', 'db-regio'),
  ('07318', 'kombus'),
  ('07318', 'abellio'),
  ('07330', 'db-regio'),
  ('07330', 'kombus'),
  ('07333', 'db-regio'),
  ('07333', 'kombus'),
  ('07338', 'db-regio'),
  ('07338', 'kombus'),
  ('07343', 'db-regio'),
  ('07343', 'kombus'),
  ('07349', 'db-regio'),
  ('07349', 'kombus'),
  ('07351', 'db-regio'),
  ('07356', 'db-regio'),
  ('07356', 'kombus'),
  ('07366', 'db-regio'),
  ('07366', 'kombus'),
  ('07368', 'db-regio'),
  ('07368', 'kombus'),
  ('07381', 'db-regio'),
  ('07381', 'kombus'),
  ('07387', 'kombus'),
  ('07389', 'kombus'),
  ('07407', 'db-regio'),
  ('07407', 'kombus'),
  ('07407', 'abellio'),
  ('07422', 'db-regio'),
  ('07422', 'kombus'),
  ('07422', 'obs'),
  ('07426', 'db-regio'),
  ('07426', 'kombus'),
  ('07426', 'obs'),
  ('07427', 'kombus'),
  ('07427', 'obs'),
  ('07429', 'db-regio'),
  ('07429', 'kombus'),
  ('07429', 'obs'),
  ('07545', 'db-regio'),
  ('07545', 'gvb'),
  ('07546', 'db-regio'),
  ('07546', 'gvb'),
  ('07548', 'db-regio'),
  ('07548', 'gvb'),
  ('07549', 'db-regio'),
  ('07549', 'gvb'),
  ('07551', 'db-regio'),
  ('07551', 'gvb'),
  ('07552', 'db-regio'),
  ('07552', 'gvb'),
  ('07554', 'db-regio'),
  ('07554', 'gvb'),
  ('07557', 'db-regio'),
  ('07557', 'gvb'),
  ('07607', 'db-regio'),
  ('07607', 'jnv'),
  ('07613', 'db-regio'),
  ('07613', 'jnv'),
  ('07616', 'db-regio'),
  ('07616', 'jnv'),
  ('07619', 'db-regio'),
  ('07619', 'jnv'),
  ('07629', 'db-regio'),
  ('07629', 'jnv'),
  ('07639', 'db-regio'),
  ('07639', 'jnv'),
  ('07646', 'db-regio'),
  ('07646', 'jnv'),
  ('07743', 'jnv'),
  ('07743', 'abellio'),
  ('07745', 'db-regio'),
  ('07745', 'jnv'),
  ('07745', 'abellio'),
  ('07747', 'db-regio'),
  ('07747', 'jnv'),
  ('07749', 'db-regio'),
  ('07749', 'jnv'),
  ('07751', 'db-regio'),
  ('07751', 'jnv'),
  ('07768', 'db-regio'),
  ('07768', 'jnv'),
  ('07768', 'abellio'),
  ('07774', 'db-regio'),
  ('07774', 'jnv'),
  ('07778', 'db-regio'),
  ('07778', 'jnv'),
  ('07806', 'db-regio'),
  ('07806', 'kombus'),
  ('07819', 'db-regio'),
  ('07819', 'kombus'),
  ('07907', 'db-regio'),
  ('07907', 'kombus'),
  ('07919', 'kombus'),
  ('07922', 'kombus'),
  ('07924', 'kombus'),
  ('07926', 'kombus'),
  ('07927', 'kombus'),
  ('07929', 'kombus'),
  ('99999', 'fuh')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.partners IS 'Verbundpartner contact data (editable via admin)';
COMMENT ON TABLE public.partner_plz IS 'PLZ to partner mapping';
