-- First, check if the role column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    END IF;

    -- Then check if the status column exists and add it if it doesn't
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;

    -- Now we can safely update any NULL values
    UPDATE users SET role = 'user' WHERE role IS NULL;
    UPDATE users SET status = 'pending' WHERE status IS NULL;
END
$$;