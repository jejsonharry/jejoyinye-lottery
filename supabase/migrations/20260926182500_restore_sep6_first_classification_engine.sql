CREATE OR REPLACE FUNCTION public.record_modern_prediction_snapshot(p_game text, p_draw_date date, p_prediction_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    canonical_game text;
    draw_time_value text;
    game_order_value integer;
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

    game_order_value := case canonical_game
        when 'Powerball' then 1
        when 'Awoof' then 2
        when 'Biggest Bet' then 3
        when 'Gold Rush' then 4
        when 'Lucky Dollar' then 5
        when 'Blessing' then 6
        when 'Owo Time' then 7
        when 'Modern Bingo' then 8
        when 'Bonus Cash' then 9
        when 'Hero' then 10
        when 'Golden' then 11
        when 'Queen' then 12
        else null
    end;

    if canonical_game is null
       or p_draw_date is null
       or p_prediction_type not in ('main','early') then
        return false;
    end if;

    with history_base as (
        select
            r.id,
            r.draw_date,
            r.winning,
            r.machine
        from public.results r
        where r.lottery = 'modern-billionaire'
          and (
              lower(trim(r.game)) = lower(canonical_game)
              or (canonical_game = 'Golden' and lower(trim(r.game)) = 'golden night')
          )
          and r.draw_date < p_draw_date
        order by r.draw_date desc, r.id desc
        limit 500
    ),
    history as (
        select
            h.*,
            row_number() over (order by h.draw_date desc, h.id desc) as rn,
            count(*) over ()::numeric as history_total
        from history_base h
    ),
    today_base as (
        select
            r.id,
            r.game,
            r.winning,
            r.machine,
            case lower(trim(r.game))
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
            end as game_order
        from public.results r
        where r.lottery = 'modern-billionaire'
          and r.draw_date = p_draw_date
    ),
    today as (
        select *
        from today_base
        where game_order is not null
          and game_order < game_order_value
    ),
    hist_win as (
        select
            value::integer as number,
            h.rn,
            h.history_total,
            greatest(
                0.25::numeric,
                1::numeric - (((h.rn - 1)::numeric / greatest(h.history_total,1)) * 0.75::numeric)
            ) as recency_weight
        from history h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning)='array' then h.winning else '[]'::jsonb end
        ) win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    hist_machine as (
        select
            value::integer as number,
            h.rn,
            h.history_total,
            greatest(
                0.25::numeric,
                1::numeric - (((h.rn - 1)::numeric / greatest(h.history_total,1)) * 0.75::numeric)
            ) as recency_weight
        from history h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine)='array' then h.machine else '[]'::jsonb end
        ) machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    history_size as (
        select count(*)::numeric as n from history
    ),
    today_win as (
        select value::integer as number
        from today t
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(t.winning)='array' then t.winning else '[]'::jsonb end
        ) win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    today_machine as (
        select value::integer as number
        from today t
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(t.machine)='array' then t.machine else '[]'::jsonb end
        ) machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    statistical as (
        select
            n.number,
            coalesce(hw.winning_frequency,0) as winning_frequency,
            coalesce(hm.machine_frequency,0) as machine_frequency,
            coalesce(tw.today_frequency,0) + coalesce(tm.today_frequency,0) as today_frequency,
            coalesce(hw.win_recent,0)
              + coalesce(hm.machine_recent,0)
              + coalesce(tw.today_recent,0)
              + coalesce(tm.today_recent,0) as recent_score,
            (
                coalesce(hw.winning_frequency,0) * 3.5
                + coalesce(hm.machine_frequency,0) * 0.8
                + coalesce(hw.win_recent,0)
                + coalesce(hm.machine_recent,0)
                + coalesce(tw.today_recent,0)
                + coalesce(tm.today_recent,0)
            )::numeric as statistical_score
        from generate_series(1,90) n(number)
        left join (
            select
                number,
                count(*)::numeric as winning_frequency,
                sum(2.4 * recency_weight)::numeric as win_recent
            from hist_win group by number
        ) hw using(number)
        left join (
            select
                number,
                count(*)::numeric as machine_frequency,
                sum(0.7 * recency_weight)::numeric as machine_recent
            from hist_machine group by number
        ) hm using(number)
        left join (
            select
                w.number,
                count(*)::numeric as today_frequency,
                count(*)::numeric * greatest(7::numeric, hs.n * 0.09::numeric) as today_recent
            from today_win w cross join history_size hs
            group by w.number, hs.n
        ) tw using(number)
        left join (
            select
                m.number,
                count(*)::numeric * 0.35::numeric as today_frequency,
                count(*)::numeric * greatest(2::numeric, hs.n * 0.025::numeric) as today_recent
            from today_machine m cross join history_size hs
            group by m.number, hs.n
        ) tm using(number)
    ),
    relationship_sources as (
        select
            value::integer as source_number,
            2.5::numeric as source_weight
        from today t
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(t.winning)='array' then t.winning else '[]'::jsonb end
        ) win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'

        union all

        select
            value::integer,
            2.5::numeric * 0.45::numeric
        from today t
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(t.machine)='array' then t.machine else '[]'::jsonb end
        ) machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'

        union all

        select
            value::integer,
            greatest(0.35::numeric, 1::numeric - ((h.rn - 1)::numeric * 0.15::numeric))
        from history h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning)='array' then h.winning else '[]'::jsonb end
        ) win(value)
        where h.rn <= 5
          and value ~ '^([1-9]|[1-8][0-9]|90)$'

        union all

        select
            value::integer,
            greatest(0.35::numeric, 1::numeric - ((h.rn - 1)::numeric * 0.15::numeric)) * 0.45::numeric
        from history h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine)='array' then h.machine else '[]'::jsonb end
        ) machine(value)
        where h.rn <= 5
          and value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    class_events as (
        select related.number, rs.source_weight as score
        from relationship_sources rs
        cross join lateral unnest(
            prediction_private.modern_classification_links(rs.source_number)
        ) related(number)
        where related.number between 1 and 90
    ),
    moving_events as (
        select related.number, rs.source_weight as score
        from relationship_sources rs
        cross join lateral unnest(
            prediction_private.modern_moving_links(rs.source_number)
        ) related(number)
        where related.number between 1 and 90
    ),
    combined as (
        select
            s.*,
            coalesce(c.classification_score,0)::numeric as classification_score,
            coalesce(m.moving_score,0)::numeric as moving_score
        from statistical s
        left join (
            select number, sum(score)::numeric as classification_score
            from class_events group by number
        ) c using(number)
        left join (
            select number, sum(score)::numeric as moving_score
            from moving_events group by number
        ) m using(number)
    ),
    maxima as (
        select
            max(statistical_score) as stat_max,
            max(classification_score) as class_max,
            max(moving_score) as moving_max
        from combined
    ),
    normalized as (
        select
            c.*,
            coalesce((statistical_score / nullif(stat_max,0))*100,0)::numeric as statistical_normalized,
            coalesce((classification_score / nullif(class_max,0))*100,0)::numeric as classification_normalized,
            coalesce((moving_score / nullif(moving_max,0))*100,0)::numeric as moving_normalized
        from combined c cross join maxima
    ),
    ranked as (
        select
            n.*,
            (
                statistical_normalized * 0.30::numeric
                + classification_normalized * 0.50::numeric
                + moving_normalized * 0.20::numeric
            )::numeric as total_score,
            row_number() over (
                order by (
                    statistical_normalized * 0.30::numeric
                    + classification_normalized * 0.50::numeric
                    + moving_normalized * 0.20::numeric
                ) desc, number asc
            ) as rank_number
        from normalized n
    )
    select
        (select count(*)::integer from history),
        (select count(*)::integer from today),
        array_agg(number order by rank_number) filter(where rank_number <= 2),
        array_agg(number order by rank_number) filter(where rank_number between 3 and 5),
        array_agg(number order by number) filter(where rank_number <= 5),
        jsonb_agg(
            jsonb_build_object(
                'number', number,
                'rank', rank_number,
                'winningFrequency', winning_frequency,
                'machineFrequency', machine_frequency,
                'todayFrequency', round(today_frequency,4),
                'recentActivityScore', round(recent_score,4),
                'statisticalScore', round(statistical_score,4),
                'statisticalNormalized', round(statistical_normalized,4),
                'classificationScore', round(classification_score,4),
                'classificationNormalized', round(classification_normalized,4),
                'movingScore', round(moving_score,4),
                'movingNormalized', round(moving_normalized,4),

                -- compatibility fields for the current v28 UI renderer
                'weeklyGameScore', round(statistical_score,4),
                'weeklyComponent', round(statistical_normalized,4),
                'weeklyClassificationScore', round(classification_normalized,4),
                'weeklyClassificationAppliedShare', 0.50,
                'weeklyMovingScore', round(moving_normalized,4),
                'monthlySupportScore', 0,
                'monthlySupportClassificationScore', 0,
                'monthlySupportMovingScore', 0,
                'monthlySupportComponent', 0,
                'monthlyClassificationAppliedShare', 0,
                'presentDayScore', round(recent_score,4),
                'presentDayClassificationScore', round(classification_normalized,4),
                'presentDayMovingScore', round(moving_normalized,4),
                'presentDayComponent', round(statistical_normalized,4),
                'presentDayClassificationAppliedShare', 0.50,
                'totalScore', round(total_score,4)
            )
            order by rank_number
        ) filter(where rank_number <= 5)
    into
        history_count,
        today_count,
        sure_values,
        direct_values,
        all_values,
        detail_values
    from ranked;

    if history_count < 1
       or cardinality(sure_values) <> 2
       or cardinality(direct_values) <> 3
       or cardinality(all_values) <> 5 then
        return false;
    end if;

    insert into public.prediction_snapshots (
        lottery, game, draw_date, draw_time, generated_at,
        engine_version, engine_profile, range_from, range_to,
        sure_numbers, direct_numbers, all_numbers, score_details,
        weights, historical_draws, status
    )
    values (
        'modern-billionaire',
        canonical_game,
        p_draw_date,
        draw_time_value,
        now(),
        'sep6-classification',
        'sep6-classification-30-50-20',
        null,
        p_draw_date - 1,
        sure_values,
        direct_values,
        all_values,
        coalesce(detail_values,'[]'::jsonb),
        jsonb_build_object(
            'statistical', 0.30,
            'classification', 0.50,
            'moving', 0.20,
            'weeklyTargetGame', 0.30,
            'currentMonthSupport', 0.00,
            'presentDayResults', 0.00,
            'movingShare', 0.20,
            'classificationChart', true,
            'classificationMode', 'fixed-sep6',
            'classificationFixedShare', 0.50,
            'historyLimit', 500,
            'recentClassificationDraws', 5,
            'sameDayRelationshipWeight', 2.5,
            'predictionType', p_prediction_type,
            'predictionProfileMode', case when p_prediction_type='early'
                then 'stable-preview'
                else 'live-recalculated'
            end,
            'engineRevision', 'sep6-2026-first-classification-30-50-20',
            'sourceCommit', '8ecbb32ad9a0b56f0341a2d038303293c164c32c'
        ),
        history_count,
        'pending'
    )
    on conflict (lottery, game, draw_date) do update
    set
        draw_time = excluded.draw_time,
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
    where public.prediction_snapshots.status = 'pending';

    get diagnostics affected_rows = row_count;
    return affected_rows = 1;
end;
$function$


revoke execute on function public.record_modern_prediction_snapshot(text,date,text)
from public, anon, authenticated;

comment on function public.record_modern_prediction_snapshot(text,date,text)
is 'Restored Sep 6 2026 first Modern classification engine: 30% statistics, 50% classification, 20% moving. Current scheduling/audit infrastructure retained.';
