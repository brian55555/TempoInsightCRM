-- Add user_id column to businesses table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'user_id') THEN
    ALTER TABLE businesses ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Enable row level security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
CREATE POLICY "Users can view their own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

DROP POLICY IF EXISTS "Users can insert their own businesses" ON businesses;
CREATE POLICY "Users can insert their own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

-- Enable realtime for businesses table
alter publication supabase_realtime add table businesses;
