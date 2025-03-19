import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
