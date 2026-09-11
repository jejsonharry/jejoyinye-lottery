alter table public.agent_applications
add column if not exists onboarding_status text not null default 'pending';

alter table public.agent_applications
drop constraint if exists agent_applications_onboarding_status_check;

alter table public.agent_applications
add constraint agent_applications_onboarding_status_check
check (onboarding_status in ('pending','onboarded'));

comment on column public.agent_applications.onboarding_status is
'Separate onboarding state for approved agents. Pending until the agent has been fully onboarded.';

create or replace function public.protect_onboarded_agent_records()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    if coalesce(old.onboarding_status, 'pending') = 'onboarded' then
      raise exception 'Onboarded agents cannot be permanently deleted while their agent status is Onboarded.';
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if coalesce(new.onboarding_status, 'pending') = 'onboarded'
       and lower(coalesce(new.status, 'pending')) = 'rejected' then
      raise exception 'Onboarded agents cannot be rejected while their agent status is Onboarded.';
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_onboarded_agent_records_trigger
on public.agent_applications;

create trigger protect_onboarded_agent_records_trigger
before update or delete on public.agent_applications
for each row
execute function public.protect_onboarded_agent_records();

revoke all on function public.protect_onboarded_agent_records() from public, anon, authenticated;
grant execute on function public.protect_onboarded_agent_records() to service_role;
