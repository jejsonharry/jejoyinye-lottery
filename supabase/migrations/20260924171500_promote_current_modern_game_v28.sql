CREATE OR REPLACE FUNCTION prediction_private.ensure_modern_prediction_schedule(
    p_draw_date date,
    p_after_order integer default 0
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
declare
    scheduled_game record;
    refreshed_count integer := 0;
    changed boolean;
    first_remaining_order integer := greatest(coalesce(p_after_order, 0), 0) + 1;
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
        changed := public.record_modern_prediction_snapshot(
            scheduled_game.game_name,
            p_draw_date,
            case
                when scheduled_game.game_order = first_remaining_order
                    then 'main'
                else 'early'
            end
        );

        if scheduled_game.game_order = first_remaining_order then
            update public.prediction_snapshots
            set engine_profile = replace(engine_profile, '-early', ''),
                weights = jsonb_set(
                    weights,
                    '{predictionType}',
                    '"main"'::jsonb,
                    true
                ),
                generated_at = now()
            where lottery = 'modern-billionaire'
              and game = scheduled_game.game_name
              and draw_date = p_draw_date
              and status = 'pending';
        end if;

        if changed then
            refreshed_count := refreshed_count + 1;
        end if;
    end loop;

    return refreshed_count;
end;
$function$;

revoke execute on function prediction_private.ensure_modern_prediction_schedule(date, integer)
from public, anon, authenticated;

comment on function prediction_private.ensure_modern_prediction_schedule(date, integer)
is 'Promotes the immediate next Modern game to main/current prediction and keeps later games as early predictions.';
