-- Add user_id column to notes table if it doesn't exist
ALTER TABLE IF EXISTS notes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update notes table policies to include user_id
DROP POLICY IF EXISTS "Users can view notes" ON notes;
CREATE POLICY "Users can view notes"
ON notes FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       user_id = auth.uid() OR
       auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

DROP POLICY IF EXISTS "Users can insert notes" ON notes;
CREATE POLICY "Users can insert notes"
ON notes FOR INSERT
WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
            user_id = auth.uid() OR
            auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

DROP POLICY IF EXISTS "Users can update notes" ON notes;
CREATE POLICY "Users can update notes"
ON notes FOR UPDATE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       user_id = auth.uid() OR
       auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

DROP POLICY IF EXISTS "Users can delete notes" ON notes;
CREATE POLICY "Users can delete notes"
ON notes FOR DELETE
USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()) OR 
       user_id = auth.uid() OR
       auth.uid() IN (SELECT id FROM users WHERE is_admin = true));
