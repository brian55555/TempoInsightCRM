-- Add role and status columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    END IF;

    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;

    -- Update existing users without a role or status
    UPDATE users SET role = 'user' WHERE role IS NULL;
    UPDATE users SET status = 'pending' WHERE status IS NULL;
END
$$;

-- Enable realtime for users table
alter publication supabase_realtime add table users;
