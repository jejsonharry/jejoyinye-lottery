create schema if not exists prediction_private;
revoke all on schema prediction_private from public, anon, authenticated;

create or replace function prediction_private.modern_classification_links(p_number integer)
returns integer[]
language sql
immutable
set search_path = ''
as $links$
    select coalesce(
        array(
            select item.value::integer
            from jsonb_array_elements_text(
                coalesce(
                    ('{"1":[46,74,89,58,4,3,8,10],"2":[47,8,88,65,8,9,7,9,20],"3":[48,17,87,57,1,6,8,30],"4":[49,36,86,76,1,2,5,7,40],"5":[50,35,85,19,7,10,4,6,50],"6":[51,65,84,90,9,8,3,5,60],"7":[52,57,83,54,5,6,2,4,70],"8":[53,2,82,43,2,5,1,3,80],"9":[54,81,23,26,6,10,2,9,90],"10":[55,85,80,63,3,9,1],"11":[56,59,79,32,44,7,88,11],"12":[57,48,78,75,40,12,87,9,21],"13":[58,78,78,69,18,11,86,8,31],"14":[59,30,76,26,41,18,85,7,41],"15":[60,51,75,68,21,10,84,6,51],"16":[61,54,74,59,49,17,83,5,61],"17":[62,3,73,81,45,14,82,4,71],"18":[63,24,72,47,46,15,81,3,81],"19":[64,22,71,25,46,16,80,2],"20":[65,86,70,66,83,22,79,1,2],"21":[66,61,69,85,84,25,78,90,12],"22":[67,42,68,67,88,20,77,22],"23":[68,19,87,80,24,12,76,32],"24":[69,18,66,45,81,23,75,42],"25":[70,80,65,51,87,21,74,52],"26":[71,62,64,14,89,28,73,62],"27":[72,32,63,63,85,29,72,72],"28":[73,71,62,52,82,26,71,82],"29":[74,72,61,38,86,27,70],"30":[75,14,60,78,3,38,69,3],"31":[76,37,59,88,4,35,68,90,13],"32":[77,27,58,71,8,34,67,89,23],"33":[78,5,57,80,33,36,66,88,33],"34":[79,73,56,67,1,32,65,87,43],"35":[80,88,55,53,7,31,64,86,53],"36":[81,4,54,9,39,33,63,85,63],"37":[82,53,72,5,39,62,84,73],"38":[83,35,52,29,6,30,61,83,83],"39":[84,58,51,69,6,30,60,82],"40":[85,43,50,86,8,41,59,81,4],"41":[86,79,49,77,14,40,58,80,14],"42":[87,22,48,55,18,48,57,79,24],"43":[88,40,47,60,10,46,56,78,34],"44":[89,76,46,61,11,47,55,77,44],"45":[90,47,45,24,17,49,54,76,54],"46":[1,90,44,62,19,43,53,75,64],"47":[2,45,43,18,15,52,74,74,74],"48":[3,12,42,16,42,51,73,84,84],"49":[4,68,41,16,50,50,72,49,49],"50":[5,83,40,89,73,49,61,5,5],"51":[6,16,39,25,74,48,60,15,15],"52":[7,66,38,28,78,47,69,25,25],"53":[8,70,37,36,70,58,68,35,35],"54":[9,16,36,7,71,57,67,45,45],"55":[10,58,35,42,77,44,66,55,55],"56":[11,60,34,79,79,34,65,65,65],"57":[12,7,33,3,75,55,64,75,75],"58":[13,55,32,1,72,54,63,85,85],"59":[14,11,31,16,76,53,62,59,59],"60":[15,56,30,44,63,39,51,6],"61":[16,21,29,22,50,50,16,16],"62":[17,29,28,46,61,37,59,26],"63":[18,28,27,27,90,60,36,58,36],"64":[19,67,26,16,35,57,46,46],"65":[20,6,25,65,2,33,56,56,56],"66":[21,24,24,50,68,55,66,66],"67":[22,63,23,24,67,54,76,76],"68":[23,49,22,14,66,53,86,86],"69":[24,31,21,6,65,52],"70":[25,20,20,26,88,64,51,7,7],"71":[26,82,19,18,84,75,50,17,17],"72":[27,23,18,37,58,74,49,27,27],"73":[28,34,17,61,85,73,48,37,37],"74":[29,1,16,49,51,72,47,47,47],"75":[30,77,15,12,57,71,46,57,57],"76":[31,44,14,4,59,70,45,67,67],"77":[32,75,13,41,55,72,22,44,77],"78":[33,18,12,30,52,70,21,43,57],"79":[34,41,11,56,76,20,42,77,79],"80":[35,25,10,33,23,89,19,31,8],"81":[36,9,9,10,28,85,18,30,18],"82":[37,84,8,70,28,88,17,29,28],"83":[38,50,7,10,20,15,16,28,38],"84":[39,23,6,7,21,14,37,48,48],"85":[40,10,5,64,27,81,14,36,58],"86":[41,20,4,40,29,87,13,35,68],"87":[42,64,3,29,25,86,12,34,78],"88":[43,9,2,31,22,82,11,33,88],"89":[44,9,1,50,26,80,10,32,89],"90":[45,46,6,63,9,69,21,9,9]}'::jsonb -> p_number::text),
                    '[]'::jsonb
                )
            ) as item(value)
            where item.value ~ '^([1-9]|[1-8][0-9]|90)$'
        ),
        '{}'::integer[]
    );
$links$;


create or replace function public.record_modern_prediction_snapshot(
    p_game text,
    p_draw_date date,
    p_prediction_type text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
    canonical_game text;
    draw_time_value text;
    lagos_today date := (now() at time zone 'Africa/Lagos')::date;
    month_start date := date_trunc('month', p_draw_date)::date;
    current_month_count integer := 0;
    fallback_count integer := 0;
    recent_count integer := 0;
    history_count integer := 0;
    today_count integer := 0;
    sure_values integer[];
    direct_values integer[];
    all_values integer[];
    detail_values jsonb;
    affected_rows integer := 0;
begin
    canonical_game := case lower(trim(p_game))
        when 'powerball' then 'Powerball'
        when 'awoof' then 'Awoof'
        when 'biggest bet' then 'Biggest Bet'
        when 'gold rush' then 'Gold Rush'
        when 'lucky dollar' then 'Lucky Dollar'
        when 'blessing' then 'Blessing'
        when 'owo time' then 'Owo Time'
        when 'modern bingo' then 'Modern Bingo'
        when 'bonus cash' then 'Bonus Cash'
        when 'hero' then 'Hero'
        when 'golden' then 'Golden'
        when 'golden night' then 'Golden'
        when 'queen' then 'Queen'
        else null
    end;

    draw_time_value := case canonical_game
        when 'Powerball' then '9:00 AM'
        when 'Awoof' then '11:00 AM'
        when 'Biggest Bet' then '1:00 PM'
        when 'Gold Rush' then '3:00 PM'
        when 'Lucky Dollar' then '5:00 PM'
        when 'Blessing' then '6:00 PM'
        when 'Owo Time' then '7:00 PM'
        when 'Modern Bingo' then '8:00 PM'
        when 'Bonus Cash' then '9:00 PM'
        when 'Hero' then '10:00 PM'
        when 'Golden' then '11:00 PM'
        when 'Queen' then '12:00 AM'
        else null
    end;

    if canonical_game is null
        or p_draw_date is null
        or p_draw_date < lagos_today - 1
        or p_draw_date > lagos_today + 2
        or p_prediction_type not in ('main', 'early')
    then
        return false;
    end if;

    with current_month_base as (
        select r.id, r.draw_date, r.winning, r.machine, 1.0::numeric as source_weight
        from public.results as r
        where r.lottery = 'modern-billionaire'
          and (
              lower(trim(r.game)) = lower(canonical_game)
              or (canonical_game = 'Golden' and lower(trim(r.game)) = 'golden night')
          )
          and r.draw_date >= month_start
          and r.draw_date < p_draw_date
    ),
    current_month_stats as (
        select count(*)::integer as draw_count from current_month_base
    ),
    fallback_base as (
        select r.id, r.draw_date, r.winning, r.machine, 0.35::numeric as source_weight
        from public.results as r
        cross join current_month_stats as stats
        where stats.draw_count < 7
          and r.lottery = 'modern-billionaire'
          and (
              lower(trim(r.game)) = lower(canonical_game)
              or (canonical_game = 'Golden' and lower(trim(r.game)) = 'golden night')
          )
          and r.draw_date < month_start
        order by r.draw_date desc, r.id desc
        limit 7
    ),
    target_pool as (
        select * from current_month_base
        union all
        select * from fallback_base
    ),
    target_history as (
        select p.*,
            row_number() over (order by p.draw_date desc, p.id desc) as rn
        from target_pool as p
    ),
    recent_history as (
        select * from target_history where rn <= 7
    ),
    today_history as (
        select r.winning, r.machine
        from public.results as r
        where r.lottery = 'modern-billionaire'
          and r.draw_date = lagos_today
    ),
    month_events as (
        select value::integer as number,
            h.source_weight as winning_evidence,
            0::numeric as machine_evidence
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select value::integer as number,
            0::numeric as winning_evidence,
            h.source_weight as machine_evidence
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    recent_events as (
        select value::integer as number,
            3.5 * case h.rn
                when 1 then 1.60 when 2 then 1.45 when 3 then 1.30
                when 4 then 1.15 when 5 then 1.00 when 6 then 0.85
                else 0.70
            end as score
        from recent_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select value::integer as number,
            0.8 * case h.rn
                when 1 then 1.60 when 2 then 1.45 when 3 then 1.30
                when 4 then 1.15 when 5 then 1.00 when 6 then 0.85
                else 0.70
            end as score
        from recent_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    today_events as (
        select value::integer as number, 3.0::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select value::integer as number, 0.7::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    month_classification_events as (
        select related.number, h.source_weight as score
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select related.number, h.source_weight * 0.25 as score
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    recent_classification_events as (
        select related.number,
            case h.rn
                when 1 then 1.60 when 2 then 1.45 when 3 then 1.30
                when 4 then 1.15 when 5 then 1.00 when 6 then 0.85
                else 0.70
            end as score
        from recent_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select related.number,
            0.25 * case h.rn
                when 1 then 1.60 when 2 then 1.45 when 3 then 1.30
                when 4 then 1.15 when 5 then 1.00 when 6 then 0.85
                else 0.70
            end as score
        from recent_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    today_classification_events as (
        select related.number, 1.0::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select related.number, 0.25::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        cross join lateral unnest(
            prediction_private.modern_classification_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    month_scores as (
        select number,
            3.5 * sqrt(sum(winning_evidence))
            + 0.8 * sqrt(sum(machine_evidence)) as score
        from month_events
        group by number
    ),
    recent_scores as (
        select number, sum(score) as score from recent_events group by number
    ),
    today_scores as (
        select number, sum(score) as score from today_events group by number
    ),
    month_classification_scores as (
        select number, sum(score) as score
        from month_classification_events
        group by number
    ),
    recent_classification_scores as (
        select number, sum(score) as score
        from recent_classification_events
        group by number
    ),
    today_classification_scores as (
        select number, sum(score) as score
        from today_classification_events
        group by number
    ),
    raw_scores as (
        select number,
            coalesce(month_scores.score, 0) as month_score,
            coalesce(recent_scores.score, 0) as recent_score,
            coalesce(today_scores.score, 0) as today_score,
            coalesce(month_classification_scores.score, 0) as month_classification_score,
            coalesce(recent_classification_scores.score, 0) as recent_classification_score,
            coalesce(today_classification_scores.score, 0) as today_classification_score
        from generate_series(1, 90) as numbers(number)
        left join month_scores using (number)
        left join recent_scores using (number)
        left join today_scores using (number)
        left join month_classification_scores using (number)
        left join recent_classification_scores using (number)
        left join today_classification_scores using (number)
    ),
    max_scores as (
        select max(month_score) as month_max,
            max(recent_score) as recent_max,
            max(today_score) as today_max,
            max(month_classification_score) as month_classification_max,
            max(recent_classification_score) as recent_classification_max,
            max(today_classification_score) as today_classification_max
        from raw_scores
    ),
    components as (
        select raw_scores.*,
            coalesce((month_score / nullif(month_max, 0)) * 100, 0) * 0.80
            + coalesce((month_classification_score / nullif(month_classification_max, 0)) * 100, 0) * 0.20
            as month_component,
            coalesce((recent_score / nullif(recent_max, 0)) * 100, 0) * 0.80
            + coalesce((recent_classification_score / nullif(recent_classification_max, 0)) * 100, 0) * 0.20
            as recent_component,
            coalesce((today_score / nullif(today_max, 0)) * 100, 0) * 0.80
            + coalesce((today_classification_score / nullif(today_classification_max, 0)) * 100, 0) * 0.20
            as today_component
        from raw_scores
        cross join max_scores
    ),
    scored as (
        select components.*,
            month_component * 0.60
            + recent_component * 0.30
            + today_component * 0.10 as total_score
        from components
    ),
    ranked as (
        select scored.*,
            row_number() over (order by total_score desc nulls last, number asc) as rank_number
        from scored
    )
    select
        (select draw_count from current_month_stats),
        (select count(*)::integer from fallback_base),
        (select count(*)::integer from recent_history),
        (select count(*)::integer from target_history),
        (select count(*)::integer from today_history),
        array_agg(number order by rank_number) filter (where rank_number <= 2),
        array_agg(number order by rank_number) filter (where rank_number between 3 and 5),
        array_agg(number order by number) filter (where rank_number <= 5),
        jsonb_agg(
            jsonb_build_object(
                'number', number,
                'rank', rank_number,
                'currentMonthScore', round(month_score, 4),
                'currentMonthClassificationScore', round(month_classification_score, 4),
                'currentMonthComponent', round(month_component, 4),
                'recentGameScore', round(recent_score, 4),
                'recentClassificationScore', round(recent_classification_score, 4),
                'recentComponent', round(recent_component, 4),
                'presentDayScore', round(today_score, 4),
                'presentDayClassificationScore', round(today_classification_score, 4),
                'presentDayComponent', round(today_component, 4),
                'totalScore', round(coalesce(total_score, 0), 4)
            )
            order by rank_number
        ) filter (where rank_number <= 5)
    into current_month_count, fallback_count, recent_count,
        history_count, today_count, sure_values, direct_values,
        all_values, detail_values
    from ranked;

    if history_count < 1
        or cardinality(sure_values) <> 2
        or cardinality(direct_values) <> 3
        or cardinality(all_values) <> 5
    then
        return false;
    end if;

    insert into public.prediction_snapshots (
        lottery, game, draw_date, draw_time, generated_at,
        engine_version, engine_profile, range_from, range_to,
        sure_numbers, direct_numbers, all_numbers, score_details,
        weights, historical_draws
    )
    values (
        'modern-billionaire', canonical_game, p_draw_date, draw_time_value, now(),
        'v24',
        case when p_prediction_type = 'early'
            then 'monthly-60-recent-30-today-10-classification-early'
            else 'monthly-60-recent-30-today-10-classification'
        end,
        month_start, p_draw_date - 1, sure_values, direct_values,
        all_values, coalesce(detail_values, '[]'::jsonb),
        jsonb_build_object(
            'currentMonthResults', 0.60,
            'recentTargetGame', 0.30,
            'presentDayResults', 0.10,
            'currentMonthDraws', current_month_count,
            'fallbackDraws', fallback_count,
            'recentTargetDraws', recent_count,
            'presentDayDraws', today_count,
            'frequencyControl', 'square-root-saturation',
            'classificationChart', true,
            'classificationShare', 0.20,
            'actualResultsShare', 0.80,
            'validationMethod', 'walk-forward',
            'predictionType', p_prediction_type
        ),
        history_count
    )
    on conflict (lottery, game, draw_date) do update
    set draw_time = excluded.draw_time,
        generated_at = excluded.generated_at,
        engine_version = excluded.engine_version,
        engine_profile = excluded.engine_profile,
        range_from = excluded.range_from,
        range_to = excluded.range_to,
        sure_numbers = excluded.sure_numbers,
        direct_numbers = excluded.direct_numbers,
        all_numbers = excluded.all_numbers,
        score_details = excluded.score_details,
        weights = excluded.weights,
        historical_draws = excluded.historical_draws
    where public.prediction_snapshots.status = 'pending'
      and (
          public.prediction_snapshots.engine_version is distinct from excluded.engine_version
          or public.prediction_snapshots.weights->>'presentDayDraws'
              is distinct from excluded.weights->>'presentDayDraws'
          or public.prediction_snapshots.all_numbers is distinct from excluded.all_numbers
      );

    get diagnostics affected_rows = row_count;
    return affected_rows = 1;
end;
$function$;

comment on function public.record_modern_prediction_snapshot(text, date, text)
is 'Modern v24: retains 60/30/10 source weighting, keeps actual results at 80% inside each component, and activates the Modern classification chart at 20%.';
