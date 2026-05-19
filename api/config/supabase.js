const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const tables = {
  users: process.env.SUPABASE_USERS_TABLE || "user",
  posts: process.env.SUPABASE_POSTS_TABLE || "post",
  settings: process.env.SUPABASE_SETTINGS_TABLE || "site_settings",
};

module.exports = {
  supabase,
  tables,
};
