-- Add role and status fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'::text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'::text;

-- Enable realtime for users table
alter publication supabase_realtime add table users;