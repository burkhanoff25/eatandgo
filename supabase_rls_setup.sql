-- =========================================================================
-- EAT & GO: Supabase RLS (Row Level Security) & Security Policies Setup
-- =========================================================================
-- Илтимос, ушбу скриптни Supabase SQL Editor'га киритиб, RUN тугмасини босинг.

-- 1. Жадвалларда RLS ёқиш
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. ORDERS (Буюртмалар) жадвали учун қоидалар
-- ==========================================

-- Ҳамма (рўйхатдан ўтган ва ўтмаганлар) янги буюртма қўша олади
CREATE POLICY "Allow INSERT for all users" ON public.orders
  FOR INSERT 
  WITH CHECK (true);

-- Фойдаланувчилар фақат ўз буюртмаларини кўра олади (ёки auth бўлмаса, guest логикаси орқали)
-- Иловада role асосида admin'ларни фарқлайдиган бўлсангиз, бу ерга қўшимча шарт қўшиш мумкин.
CREATE POLICY "Allow SELECT for own orders" ON public.orders
  FOR SELECT
  USING (
    auth.uid() = user_id
    -- Изоҳ: Агар админларга ҳаммасини кўрсатиш керак бўлса, 
    -- auth.jwt() ->> 'role' = 'service_role' ёки admin_users жадвали орқали кенгайтирилади.
  );

-- Фойдаланувчилар фақат ўз буюртмасини бекор қила олади (агар янги бўлса)
CREATE POLICY "Allow UPDATE for own new orders" ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'new');

-- ==========================================
-- 3. USERS (Фойдаланувчилар) жадвали учун қоидалар
-- ==========================================

-- Фойдаланувчи фақат ўзининг профилини кўра олади
CREATE POLICY "Allow SELECT for own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Фойдаланувчи фақат ўзининг профилини янгилай олади
CREATE POLICY "Allow UPDATE for own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- 4. BONUS_TRANSACTIONS жадвали учун қоидалар
-- ==========================================

-- Фақат ўзига тегишли бонуслар тарихини кўра олади
CREATE POLICY "Allow SELECT for own bonus transactions" ON public.bonus_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Бонус транзакциялари фақат backend ёки Trigger'лар орқали киритилиши керак,
-- лекин ҳозирча мижоз томонидан (RLS) киритишга рухсат берсак:
CREATE POLICY "Allow INSERT for own bonus transactions" ON public.bonus_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. CONSENT_LOG (152-ФЗ розилик) жадвали учун қоидалар
-- ==========================================

-- Ҳар ким ўз розилигини қолдира олади
CREATE POLICY "Allow INSERT for consent log" ON public.consent_log
  FOR INSERT
  WITH CHECK (true);

-- Фақат админлар розиликлар тарихини ўқий олади (содда қилиб ҳеч кимга ўқишга рухсат берилмайди, фақат service_role)
CREATE POLICY "Deny SELECT for public consent log" ON public.consent_log
  FOR SELECT
  USING (false);

-- =========================================================================
-- ОХИРИ.
-- =========================================================================
