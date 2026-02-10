import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://cglfvxmyyxpigcrhtkyy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbGZ2eG15eXhwaWdjcmh0a3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDc2OTcsImV4cCI6MjA4NjIyMzY5N30.dJtxRuY5_2gDt2l8T6cD0OVw20GJwKmmoicDvhhxCyY"
);
