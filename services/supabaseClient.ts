import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqerfxqmwrzoaftmprfa.supabase.co';
const supabaseKey = 'sb_publishable_TlYhdcGeC1kHfUpVv2AE3w_P4T84THX';

export const supabase = createClient(supabaseUrl, supabaseKey);