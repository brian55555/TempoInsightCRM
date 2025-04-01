-- First update all policies that depend on the role column
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
CREATE POLICY "Users can view their own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE "isAdmin" = true));

DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE "isAdmin" = true));

DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE "isAdmin" = true));

-- Now we can safely remove the role column
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Make sure isAdmin exists and is a boolean with default false
DO $ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isAdmin') THEN
    ALTER TABLE users ADD COLUMN "isAdmin" BOOLEAN DEFAULT false;
  END IF;
END $;

-- Update policies to use isAdmin instead of role
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (auth.uid() = id OR "isAdmin" = true);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id OR "isAdmin" = true);

-- Enable realtime for users table
alter publication supabase_realtime add table users;
