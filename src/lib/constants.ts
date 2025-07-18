export const ENV_VARS = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
};

export const ENV_VARS_SERVER = {
  SUPABASE_KEY: process.env.SUPABASE_ANON_KEY ?? "",
  SUPABASE_SECRET: process.env.SUPABASE_SERVICE_ROLE ?? "",
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET ?? "",
};

export const CHAR_LIMIT = {
  PROFILE_NAME: 20,
  PROFILE_BIO: 160,
  QUESTION_TITLE: 100,
  QUESTION_CONTENT: 1000,
  ANSWER_CONTENT: 500,
};

export const MAIN_BORDERS = "1px solid";
export const EXPLORE_PAGE_SEARCH_SIZE = 20;
