-- Fix businesses table if it doesn't exist
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make sure user_id column exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'user_id') THEN
    ALTER TABLE businesses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make sure RLS is enabled
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Fix policies for businesses table
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
CREATE POLICY "Users can view their own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert their own businesses" ON businesses;
CREATE POLICY "Users can insert their own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Enable realtime
alter publication supabase_realtime add table businesses;