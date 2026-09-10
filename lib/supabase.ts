import { createClient } from '../utils/supabase/client';

// Real Supabase client instance using the SSR browser helper
export const supabase = createClient();
