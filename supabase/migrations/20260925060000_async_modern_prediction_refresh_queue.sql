-- Protect result publishing from prediction-engine timeouts.
-- Official results commit immediately; prediction regeneration is queued separately.

create table if not exists prediction_private.modern_prediction_refresh_queue (
    draw_date date primary key,
    after_game_order integer not null default 0,
    queued_at timestamptz not null default now(),
    last_error text
);

revoke all on prediction_private.modern_prediction_refresh_queue
from public, anon, authenticated;

create or replace function prediction_private.queue_modern_prediction_refresh()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
    current_game_order integer;
begin
    if lower(trim(coalesce(new.lottery, ''))) <> 'modern-billionaire'
       or new.draw_date is null then
        return new;
    end if;

    current_game_order := case lower(trim(new.game))
        when 'powerball' then 1
        when 'awoof' then 2
        when 'biggest bet' then 3
        when 'gold rush' then 4
        when 'lucky dollar' then 5
        when 'blessing' then 6
        when 'owo time' then 7
        when 'modern bingo' then 8
        when 'bonus cash' then 9
        when 'hero' then 10
        when 'golden' then 11
        when 'golden night' then 11
        when 'queen' then 12
        else null
    end;

    if current_game_order is null then
        return new;
    end if;

    insert into prediction_private.modern_prediction_refresh_queue (
        draw_date, after_game_order, queued_at, last_error
    )
    values (new.draw_date, current_game_order, now(), null)
    on conflict (draw_date) do update
    set after_game_order = greatest(
            prediction_private.modern_prediction_refresh_queue.after_game_order,
            excluded.after_game_order
        ),
        queued_at = now(),
        last_error = null;

    return new;
end;
$function$;

revoke execute on function prediction_private.queue_modern_prediction_refresh()
from public, anon, authenticated;

drop trigger if exists results_refresh_modern_prediction_schedule_v2
on public.results;

drop trigger if exists results_queue_modern_prediction_refresh
on public.results;

create trigger results_queue_modern_prediction_refresh
after insert or update of winning, machine
on public.results
for each row
execute function prediction_private.queue_modern_prediction_refresh();

create or replace function prediction_private.process_modern_prediction_refresh_queue(
    p_limit integer default 2
)
returns integer
language plpgsql
security definer
set search_path to ''
as $function$
declare
    queued record;
    processed integer := 0;
begin
    for queued in
        select draw_date, after_game_order
        from prediction_private.modern_prediction_refresh_queue
        order by queued_at
        limit greatest(1, least(coalesce(p_limit, 2), 5))
        for update skip locked
    loop
        begin
            if queued.after_game_order < 12 then
                perform prediction_private.ensure_modern_prediction_schedule(
                    queued.draw_date,
                    queued.after_game_order
                );
            else
                perform prediction_private.ensure_modern_prediction_schedule(
                    queued.draw_date + 1,
                    0
                );
            end if;

            delete from prediction_private.modern_prediction_refresh_queue
            where draw_date = queued.draw_date;

            processed := processed + 1;
        exception
            when query_canceled then
                update prediction_private.modern_prediction_refresh_queue
                set last_error = 'prediction refresh query canceled',
                    queued_at = now()
                where draw_date = queued.draw_date;
            when others then
                update prediction_private.modern_prediction_refresh_queue
                set last_error = sqlerrm,
                    queued_at = now()
                where draw_date = queued.draw_date;
        end;
    end loop;

    return processed;
end;
$function$;

revoke execute on function prediction_private.process_modern_prediction_refresh_queue(integer)
from public, anon, authenticated;

do $$
declare
    existing_job bigint;
begin
    select jobid into existing_job
    from cron.job
    where jobname = 'process-modern-prediction-refresh-queue'
    limit 1;

    if existing_job is not null then
        perform cron.unschedule(existing_job);
    end if;

    perform cron.schedule(
        'process-modern-prediction-refresh-queue',
        '* * * * *',
        'select prediction_private.process_modern_prediction_refresh_queue(2);'
    );
end $$;
