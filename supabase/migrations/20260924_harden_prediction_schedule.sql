create or replace function public.evaluate_prediction_from_result()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_game_order integer;
begin
    -- A failed evaluation must never prevent the remaining games from being
    -- prepared. Keep the audit attempt isolated from schedule maintenance.
    begin
        perform public.evaluate_prediction_key(
            new.lottery,
            new.game,
            new.draw_date
        );
    exception
        when others then
            raise warning
                'Prediction evaluation failed for %, %, %: %',
                new.game,
                new.draw_date,
                new.lottery,
                sqlerrm;
    end;

    if lower(trim(coalesce(new.lottery, ''))) <> 'modern-billionaire'
        or new.draw_date is null
    then
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

    perform prediction_private.ensure_modern_prediction_schedule(
        new.draw_date,
        current_game_order
    );

    if current_game_order = 12 then
        perform prediction_private.ensure_modern_prediction_schedule(
            new.draw_date + 1,
            0
        );
    end if;

    return new;
exception
    when others then
        raise warning
            'Prediction schedule maintenance failed for %, %, %: %',
            new.game,
            new.draw_date,
            new.lottery,
            sqlerrm;
        return new;
end;
$function$;

revoke execute on function public.evaluate_prediction_from_result()
from public, anon, authenticated;

-- Prepare all twelve games just after midnight in Lagos. This makes the daily
-- schedule independent of a late or missing Queen result. The per-result
-- trigger still refreshes only games that have not yet been drawn.
do $block$
declare
    existing_job_id bigint;
begin
    select jobid
    into existing_job_id
    from cron.job
    where jobname = 'prepare-modern-daily-predictions'
    limit 1;

    if existing_job_id is not null then
        perform cron.unschedule(existing_job_id);
    end if;

    perform cron.schedule(
        'prepare-modern-daily-predictions',
        '5 23 * * *',
        $command$
            select prediction_private.ensure_modern_prediction_schedule(
                (now() at time zone 'Africa/Lagos')::date,
                0
            );
        $command$
    );
end;
$block$;

comment on function public.evaluate_prediction_from_result()
is 'Evaluates released results without blocking schedule maintenance, refreshes later Modern games, and prepares the next day after Queen.';
