import { createClient } from "@supabase/supabase-js";
import { ENV_VARS } from "./constants";

const SUPABASE_URL = ENV_VARS.SUPABASE_URL;
const SUPABASE_KEY = ENV_VARS.SUPABASE_KEY;
const SUPABASE_SECRET = ENV_VARS.SUPABASE_SECRET;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);
