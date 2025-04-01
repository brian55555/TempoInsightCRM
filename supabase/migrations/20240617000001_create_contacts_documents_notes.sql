-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT,
  category TEXT,
  size TEXT,
  url TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Create change_logs table
CREATE TABLE IF NOT EXISTS change_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
DROP POLICY IF EXISTS "Users can view contacts" ON contacts;
CREATE POLICY "Users can view contacts"
ON contacts FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert contacts" ON contacts;
CREATE POLICY "Users can insert contacts"
ON contacts FOR INSERT
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
            auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can update contacts" ON contacts;
CREATE POLICY "Users can update contacts"
ON contacts FOR UPDATE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can delete contacts" ON contacts;
CREATE POLICY "Users can delete contacts"
ON contacts FOR DELETE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for documents
DROP POLICY IF EXISTS "Users can view documents" ON documents;
CREATE POLICY "Users can view documents"
ON documents FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert documents" ON documents;
CREATE POLICY "Users can insert documents"
ON documents FOR INSERT
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
            auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can update documents" ON documents;
CREATE POLICY "Users can update documents"
ON documents FOR UPDATE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can delete documents" ON documents;
CREATE POLICY "Users can delete documents"
ON documents FOR DELETE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for notes
DROP POLICY IF EXISTS "Users can view notes" ON notes;
CREATE POLICY "Users can view notes"
ON notes FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert notes" ON notes;
CREATE POLICY "Users can insert notes"
ON notes FOR INSERT
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
            auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can update notes" ON notes;
CREATE POLICY "Users can update notes"
ON notes FOR UPDATE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can delete notes" ON notes;
CREATE POLICY "Users can delete notes"
ON notes FOR DELETE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for favorites
DROP POLICY IF EXISTS "Users can view their favorites" ON favorites;
CREATE POLICY "Users can view their favorites"
ON favorites FOR SELECT
USING (user_id = auth.uid() OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert their favorites" ON favorites;
CREATE POLICY "Users can insert their favorites"
ON favorites FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their favorites" ON favorites;
CREATE POLICY "Users can delete their favorites"
ON favorites FOR DELETE
USING (user_id = auth.uid());

-- Create policies for change_logs
DROP POLICY IF EXISTS "Users can view change logs" ON change_logs;
CREATE POLICY "Users can view change logs"
ON change_logs FOR SELECT
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can insert change logs" ON change_logs;
CREATE POLICY "Users can insert change logs"
ON change_logs FOR INSERT
WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table favorites;
alter publication supabase_realtime add table change_logs;