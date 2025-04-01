import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log Supabase configuration on initialization
console.log("Initializing Supabase client with:");
console.log("- URL:", supabaseUrl);
console.log("- Key length:", supabaseKey?.length || 0);

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration!", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
  });
}

// Create client with additional options for debugging
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      // Log all fetch requests to Supabase
      const [url, options] = args;
      console.log(`Supabase fetch: ${options?.method || "GET"} ${url}`);

      // Add timeout and retry logic for fetch requests
      return new Promise((resolve, reject) => {
        // Set a timeout for the fetch request
        const timeoutId = setTimeout(() => {
          console.warn(
            `Supabase fetch timeout: ${options?.method || "GET"} ${url}`,
          );
          reject(new Error("Request timeout"));
        }, 10000); // 10 second timeout

        fetch(...args)
          .then((response) => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            console.error(`Supabase fetch error: ${error.message}`);
            reject(error);
          });
      });
    },
  },
});
