create or replace function prediction_private.refresh_modern_schedule_from_result()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
    current_game_order integer;
begin
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
            'Independent prediction schedule refresh failed for %, %, %: %',
            new.game,
            new.draw_date,
            new.lottery,
            sqlerrm;
        return new;
end;
$function$;

revoke execute on function prediction_private.refresh_modern_schedule_from_result()
from public, anon, authenticated;

drop trigger if exists results_refresh_modern_prediction_schedule_v2
on public.results;

create trigger results_refresh_modern_prediction_schedule_v2
after insert or update of winning, machine on public.results
for each row
execute function prediction_private.refresh_modern_schedule_from_result();

comment on function prediction_private.refresh_modern_schedule_from_result()
is 'Independent result trigger that refreshes only undrawn Modern games and prepares the next day after Queen.';
