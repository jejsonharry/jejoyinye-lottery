create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select
        coalesce((select auth.jwt()->>'aal'), 'aal1') = 'aal2'
        and exists (
            select 1
            from public.admin_users
            where user_id = auth.uid()
              and is_active = true
        );
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;
