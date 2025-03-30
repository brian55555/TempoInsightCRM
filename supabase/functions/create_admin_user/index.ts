import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // This function should only be called once during initial setup
    // or by another admin user

    // Parse the request body
    const { email, password, name, adminKey } = await req.json();

    // Validate required fields
    if (!email || !password || !name || !adminKey) {
      throw new Error("Missing required fields");
    }

    // Check admin key for security (this should be a secure environment variable in production)
    const expectedAdminKey = Deno.env.get("ADMIN_SETUP_KEY");
    if (!expectedAdminKey || adminKey !== expectedAdminKey) {
      return new Response(JSON.stringify({ error: "Invalid admin key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Create the user in Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Create the user record in the users table with admin role
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: "admin",
          status: "active",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (userError) {
      // If there was an error creating the user record, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw userError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        user: userData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
