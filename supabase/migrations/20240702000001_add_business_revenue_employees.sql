-- Add revenue and number_of_employees columns to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS revenue numeric;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS number_of_employees integer;

-- Skip adding to publication if already a member
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'businesses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE businesses;
  END IF;
END
$$;