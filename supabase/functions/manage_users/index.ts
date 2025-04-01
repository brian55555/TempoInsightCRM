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
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check if the user is an admin
    const { data: userData, error: adminError } = await supabaseClient
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (adminError || userData?.is_admin !== true) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        },
      );
    }

    // Parse the request body
    const { action, userId, userData: userUpdateData } = await req.json();

    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    let result;

    switch (action) {
      case "approve":
        // Update user status to active and is_approved to true
        const { data: approveData, error: approveError } = await supabaseAdmin
          .from("users")
          .update({ status: "active", is_approved: true })
          .eq("id", userId)
          .select()
          .single();

        if (approveError) throw approveError;
        result = { success: true, data: approveData };
        break;

      case "reject":
        // Update user status to inactive and is_approved to false
        const { data: rejectData, error: rejectError } = await supabaseAdmin
          .from("users")
          .update({ status: "inactive", is_approved: false })
          .eq("id", userId)
          .select()
          .single();

        if (rejectError) throw rejectError;
        result = { success: true, data: rejectData };
        break;

      case "update":
        // Update user data
        // If toggling admin status, ensure we're updating is_admin field
        if (userUpdateData.role) {
          userUpdateData.is_admin = userUpdateData.role === "admin";
          delete userUpdateData.role;
        }

        const { data: updateData, error: updateError } = await supabaseAdmin
          .from("users")
          .update(userUpdateData)
          .eq("id", userId)
          .select()
          .single();

        if (updateError) throw updateError;
        result = { success: true, data: updateData };
        break;

      case "delete":
        // Delete user from auth and the users table will cascade
        const { error: deleteError } =
          await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) throw deleteError;
        result = { success: true };
        break;

      case "list":
        // List all users
        const { data: listData, error: listError } = await supabaseAdmin
          .from("users")
          .select("*");

        if (listError) throw listError;
        result = { success: true, data: listData };
        break;

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
