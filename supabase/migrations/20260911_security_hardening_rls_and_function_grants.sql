-- JOLS security hardening: least privilege, protected submissions, safer function grants.

-- Public forms now submit only through protected Edge Functions.
drop policy if exists "Public can submit agent applications" on public.agent_applications;
drop policy if exists "Public can submit contact messages" on public.messages;

-- Lock the unused legacy mixed-case Messages table from browser roles.
drop policy if exists "Public submit messages" on public."Messages";
drop policy if exists "Admin read messages" on public."Messages";

-- Replace broad default table grants with least-privilege grants.
revoke all privileges on table public."Messages" from anon, authenticated;

revoke all privileges on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

revoke all privileges on table public.agent_applications from anon, authenticated;
grant select, update on table public.agent_applications to authenticated;

revoke all privileges on table public.messages from anon, authenticated;
grant select, update on table public.messages to authenticated;

revoke all privileges on table public.results from anon, authenticated;
grant select on table public.results to anon;
grant select, insert, update, delete on table public.results to authenticated;

revoke all privileges on table public.prediction_snapshots from anon, authenticated;
grant select on table public.prediction_snapshots to anon, authenticated;
grant insert, update, delete on table public.prediction_snapshots to authenticated;

-- Optimize/clarify admin-only RLS policies.
drop policy if exists "Admins can view own admin profile" on public.admin_users;
create policy "Admins can view own admin profile"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Admins can read agent applications" on public.agent_applications;
create policy "Admins can read agent applications"
on public.agent_applications
for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can update agent applications" on public.agent_applications;
create policy "Admins can update agent applications"
on public.agent_applications
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages"
on public.messages
for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can update messages" on public.messages;
create policy "Admins can update messages"
on public.messages
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete messages" on public.messages;
-- Browser-side deletes are intentionally disabled; secure admin-delete Edge Function performs deletion.

drop policy if exists "Admins can insert lottery results" on public.results;
create policy "Admins can insert lottery results"
on public.results
for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins can update lottery results" on public.results;
create policy "Admins can update lottery results"
on public.results
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete lottery results" on public.results;
create policy "Admins can delete lottery results"
on public.results
for delete
to authenticated
using ((select public.is_admin()));

-- Split prediction admin management into write-only policies so it does not overlap public SELECT.
drop policy if exists "Admins can manage prediction snapshots" on public.prediction_snapshots;
create policy "Admins can insert prediction snapshots"
on public.prediction_snapshots
for insert
to authenticated
with check ((select public.is_admin()));
create policy "Admins can update prediction snapshots"
on public.prediction_snapshots
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
create policy "Admins can delete prediction snapshots"
on public.prediction_snapshots
for delete
to authenticated
using ((select public.is_admin()));

-- Restrict SECURITY DEFINER helpers from public/anonymous execution.
revoke all on function public.evaluate_prediction_from_result() from public, anon, authenticated;
revoke all on function public.evaluate_prediction_from_snapshot() from public, anon, authenticated;
revoke all on function public.evaluate_prediction_key(text, text, date) from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

grant execute on function public.evaluate_prediction_from_result() to service_role;
grant execute on function public.evaluate_prediction_from_snapshot() to service_role;
grant execute on function public.evaluate_prediction_key(text, text, date) to service_role;
grant execute on function public.rls_auto_enable() to service_role;

-- is_admin is intentionally callable only by signed-in users and service role.
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;
