-- Create users table that extends auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own data";
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users";
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update users";
CREATE POLICY "Admins can update users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Researching' CHECK (status IN ('Researching', 'Contacting', 'Negotiating', 'Partner', 'Inactive')),
  website TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable row level security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table
DROP POLICY IF EXISTS "All authenticated users can view businesses";
CREATE POLICY "All authenticated users can view businesses"
  ON public.businesses
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can insert businesses";
CREATE POLICY "All authenticated users can insert businesses"
  ON public.businesses
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can update businesses";
CREATE POLICY "All authenticated users can update businesses"
  ON public.businesses
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable row level security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts table
DROP POLICY IF EXISTS "All authenticated users can view contacts";
CREATE POLICY "All authenticated users can view contacts"
  ON public.contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can insert contacts";
CREATE POLICY "All authenticated users can insert contacts"
  ON public.contacts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can update contacts";
CREATE POLICY "All authenticated users can update contacts"
  ON public.contacts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable row level security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
DROP POLICY IF EXISTS "All authenticated users can view tasks";
CREATE POLICY "All authenticated users can view tasks"
  ON public.tasks
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can insert tasks";
CREATE POLICY "All authenticated users can insert tasks"
  ON public.tasks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can update tasks";
CREATE POLICY "All authenticated users can update tasks"
  ON public.tasks
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable row level security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
DROP POLICY IF EXISTS "All authenticated users can view documents";
CREATE POLICY "All authenticated users can view documents"
  ON public.documents
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can insert documents";
CREATE POLICY "All authenticated users can insert documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can update documents";
CREATE POLICY "All authenticated users can update documents"
  ON public.documents
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Enable row level security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes table
DROP POLICY IF EXISTS "All authenticated users can view notes";
CREATE POLICY "All authenticated users can view notes"
  ON public.notes
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can insert notes";
CREATE POLICY "All authenticated users can insert notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "All authenticated users can update notes";
CREATE POLICY "All authenticated users can update notes"
  ON public.notes
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create change_logs table
CREATE TABLE IF NOT EXISTS public.change_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.change_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for change_logs table
DROP POLICY IF EXISTS "Admins can view all change logs";
CREATE POLICY "Admins can view all change logs"
  ON public.change_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_change()
RETURNS TRIGGER AS $$
DECLARE
  changed_field TEXT;
  old_value TEXT;
  new_value TEXT;
BEGIN
  -- Loop through each column in the record
  FOR changed_field IN SELECT column_name FROM information_schema.columns WHERE table_name = TG_TABLE_NAME AND table_schema = 'public' LOOP
    -- Get the old and new values
    EXECUTE format('SELECT $1.%I::TEXT, $2.%I::TEXT', changed_field, changed_field)
    INTO old_value, new_value
    USING OLD, NEW;
    
    -- If the values are different, log the change
    IF old_value IS DISTINCT FROM new_value THEN
      INSERT INTO public.change_logs (table_name, record_id, field, previous_value, new_value, changed_by)
      VALUES (TG_TABLE_NAME, NEW.id, changed_field, old_value, new_value, auth.uid());
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for change logging
CREATE TRIGGER log_business_changes
AFTER UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION log_change();

CREATE TRIGGER log_contact_changes
AFTER UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION log_change();

CREATE TRIGGER log_task_changes
AFTER UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION log_change();

CREATE TRIGGER log_document_changes
AFTER UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION log_change();

CREATE TRIGGER log_note_changes
AFTER UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION log_change();

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, business_id)
);

-- Enable row level security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites table
DROP POLICY IF EXISTS "Users can view their own favorites";
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites";
CREATE POLICY "Users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites";
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table businesses;
alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table change_logs;
alter publication supabase_realtime add table favorites;
