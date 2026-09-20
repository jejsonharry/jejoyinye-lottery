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
    raw_scores as (
        select number,
            coalesce(month_scores.score, 0) as month_score,
            coalesce(recent_scores.score, 0) as recent_score,
            coalesce(today_scores.score, 0) as today_score
        from generate_series(1, 90) as numbers(number)
        left join month_scores using (number)
        left join recent_scores using (number)
        left join today_scores using (number)
    ),
    max_scores as (
        select max(month_score) as month_max,
            max(recent_score) as recent_max,
            max(today_score) as today_max
        from raw_scores
    ),
    scored as (
        select number, month_score, recent_score, today_score,
            coalesce((month_score / nullif(month_max, 0)) * 100, 0) * 0.60
            + coalesce((recent_score / nullif(recent_max, 0)) * 100, 0) * 0.30
            + coalesce((today_score / nullif(today_max, 0)) * 100, 0) * 0.10
            as total_score
        from raw_scores
        cross join max_scores
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
                'recentGameScore', round(recent_score, 4),
                'presentDayScore', round(today_score, 4),
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
        'v23',
        case when p_prediction_type = 'early'
            then 'monthly-60-recent-30-today-10-saturation-early'
            else 'monthly-60-recent-30-today-10-saturation'
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
is 'Modern v23: retains 60/30/10 results-only weighting and uses walk-forward-validated square-root frequency saturation to reduce repeated hot-number dominance.';
