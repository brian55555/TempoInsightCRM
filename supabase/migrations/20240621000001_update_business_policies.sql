-- Update business policies to allow all users to view, add, and update businesses

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can insert their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can insert all businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can update all businesses" ON businesses;

-- Create new policies that allow all users to view, add, and update businesses
CREATE POLICY "All users can view all businesses"
ON businesses FOR SELECT
USING (true);

CREATE POLICY "All users can insert businesses"
ON businesses FOR INSERT
WITH CHECK (true);

CREATE POLICY "All users can update all businesses"
ON businesses FOR UPDATE
USING (true);

-- Businesses table is already in the realtime publication, no need to add it again