-- Allow users to delete their own account.
-- Runs as the database owner so it can touch auth.users.
-- ON DELETE CASCADE on profiles & visits handles cleanup.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
