-- G4-SEC-001-CORR-001: the signup trigger remains installed and owned by
-- postgres, but its definer function is not a callable API capability.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
