-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    
    -- Update existing users to have a role and status if they don't already
    UPDATE users SET role = 'user' WHERE role IS NULL;
    UPDATE users SET status = 'active' WHERE status IS NULL AND is_approved = true;
    UPDATE users SET status = 'pending' WHERE status IS NULL AND is_approved = false;
    
    -- Enable realtime for users table
    ALTER PUBLICATION supabase_realtime ADD TABLE users;
END $$;