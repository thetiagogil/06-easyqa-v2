import { createClient } from "@supabase/supabase-js";
import { ENV_VARS, ENV_VARS_SERVER } from "./constants";

const SUPABASE_URL = ENV_VARS.SUPABASE_URL;
const SUPABASE_SECRET = ENV_VARS_SERVER.SUPABASE_SECRET;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);
