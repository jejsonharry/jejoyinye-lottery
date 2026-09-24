create schema if not exists prediction_private;
revoke all on schema prediction_private from public, anon, authenticated;

create or replace function prediction_private.ensure_modern_prediction_schedule(
    p_draw_date date,
    p_after_order integer default 0
)
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
    scheduled_game record;
    refreshed_count integer := 0;
    changed boolean;
begin
    if p_draw_date is null then
        return 0;
    end if;

    for scheduled_game in
        select schedule.game_name, schedule.game_order
        from (
            values
                ('Powerball'::text, 1),
                ('Awoof'::text, 2),
                ('Biggest Bet'::text, 3),
                ('Gold Rush'::text, 4),
                ('Lucky Dollar'::text, 5),
                ('Blessing'::text, 6),
                ('Owo Time'::text, 7),
                ('Modern Bingo'::text, 8),
                ('Bonus Cash'::text, 9),
                ('Hero'::text, 10),
                ('Golden'::text, 11),
                ('Queen'::text, 12)
        ) as schedule(game_name, game_order)
        where schedule.game_order > greatest(coalesce(p_after_order, 0), 0)
        order by schedule.game_order
    loop
        begin
            changed := public.record_modern_prediction_snapshot(
                scheduled_game.game_name,
                p_draw_date,
                'early'
            );

            if changed then
                refreshed_count := refreshed_count + 1;
            end if;
        exception
            when others then
                raise warning
                    'Prediction schedule refresh failed for %, %: %',
                    scheduled_game.game_name,
                    p_draw_date,
                    sqlerrm;
        end;
    end loop;

    return refreshed_count;
end;
$function$;

revoke execute on function prediction_private.ensure_modern_prediction_schedule(date, integer)
from public, anon, authenticated;

create or replace function public.evaluate_prediction_from_result()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_game_order integer;
begin
    perform public.evaluate_prediction_key(
        new.lottery,
        new.game,
        new.draw_date
    );

    if new.lottery is distinct from 'modern-billionaire'
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
            'Prediction result automation failed for %, %, %: %',
            new.game,
            new.draw_date,
            new.lottery,
            sqlerrm;
        return new;
end;
$function$;

revoke execute on function public.evaluate_prediction_from_result()
from public, anon, authenticated;

drop trigger if exists evaluate_modern_prediction_snapshot_trigger
on public.results;

comment on function prediction_private.ensure_modern_prediction_schedule(date, integer)
is 'Creates or refreshes only future Modern games after the supplied schedule position; used by the result trigger and next-day Queen rollover.';

comment on function public.evaluate_prediction_from_result()
is 'Evaluates the released result, refreshes every later Modern prediction, and after Queen prepares all twelve predictions for the next draw date.';
