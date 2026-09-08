-- Allow authenticated admins to delete submissions (dashboard reset)
DROP POLICY IF EXISTS submissions_admin_delete ON public.submissions;
CREATE POLICY submissions_admin_delete ON public.submissions
  FOR DELETE TO authenticated
  USING (true);

GRANT DELETE ON public.submissions TO authenticated;
