-- Fix policies for businesses table to use role instead of is_admin

-- Update view policy
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
CREATE POLICY "Users can view their own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Update insert policy
DROP POLICY IF EXISTS "Users can insert their own businesses" ON businesses;
CREATE POLICY "Users can insert their own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update update policy
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Update delete policy
DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
