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
    previous_early_numbers integer[];
    changed_from_early integer := 0;
    adaptive_recent_weight numeric := 0.60;
    adaptive_month_weight numeric := 0.30;
    adaptive_today_weight numeric := 0.10;
    adaptive_moving_share numeric := 0.10;
    daily_pattern_strength_value numeric := 0;
    daily_repeat_rate_value numeric := 0;
    daily_moving_confirmation_value numeric := 0;
    daily_classification_confirmation_value numeric := 0;
    daily_average_hits_value numeric := 0;
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
        or p_draw_date < lagos_today - 1
        or p_draw_date > lagos_today + 2
        or p_prediction_type not in ('main', 'early')
    then
        return false;
    end if;

    if p_prediction_type = 'main' then
        select snapshot.all_numbers
        into previous_early_numbers
        from public.prediction_snapshots as snapshot
        where snapshot.lottery = 'modern-billionaire'
          and snapshot.game = canonical_game
          and snapshot.draw_date = p_draw_date
          and snapshot.status = 'pending'
          and snapshot.weights->>'predictionType' = 'early'
        limit 1;
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
        select * from target_history where draw_date >= p_draw_date - 7 and draw_date < p_draw_date
    ),
    today_history_base as (
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
        from public.results as r
        where r.lottery = 'modern-billionaire'
          and r.draw_date = p_draw_date
    ),
    today_history as (
        select *
        from today_history_base
        where game_order is not null
          and game_order < game_order_value
        order by game_order
    ),
    latest_today_result as (
        select *
        from today_history
        order by game_order desc
        limit 1
    ),
    today_number_events as (
        select value::integer as number
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select value::integer as number
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    today_number_counts as (
        select number, count(*)::numeric as occurrences
        from today_number_events
        group by number
    ),
    today_distinct_numbers as (
        select number from today_number_counts
    ),
    today_pattern_relationships as (
        select
            coalesce(avg(
                case when exists (
                    select 1
                    from today_distinct_numbers as other
                    where other.number <> current.number
                      and other.number = any(
                          prediction_private.modern_moving_links(current.number)
                      )
                ) then 1.0 else 0.0 end
            ), 0)::numeric as moving_confirmation,
            coalesce(avg(
                case when exists (
                    select 1
                    from today_distinct_numbers as other
                    where other.number <> current.number
                      and other.number = any(
                          prediction_private.modern_classification_links(current.number)
                      )
                ) then 1.0 else 0.0 end
            ), 0)::numeric as classification_confirmation
        from today_distinct_numbers as current
    ),
    today_prediction_feedback as (
        select
            count(*)::numeric as evaluated_count,
            coalesce(avg(total_winning_hits::numeric), 0)::numeric as average_hits
        from public.prediction_snapshots
        where lottery = 'modern-billionaire'
          and draw_date = p_draw_date
          and status = 'evaluated'
          and game <> canonical_game
    ),
    daily_profile_base as (
        select
            (select count(*)::numeric from today_history) as completed_draws,
            coalesce(
                (
                    select
                        (sum(occurrences) - count(*)) /
                        nullif(sum(occurrences), 0)
                    from today_number_counts
                ),
                0
            )::numeric as repeat_rate,
            relationships.moving_confirmation,
            relationships.classification_confirmation,
            feedback.evaluated_count,
            feedback.average_hits
        from today_pattern_relationships as relationships
        cross join today_prediction_feedback as feedback
    ),
    daily_profile_strength as (
        select *,
            least(
                1.0,
                greatest(
                    0.0,
                    (repeat_rate * 0.45) +
                    (moving_confirmation * 0.35) +
                    (classification_confirmation * 0.20)
                )
            )::numeric as pattern_strength,
            case
                when evaluated_count < 2 then 1.00
                when average_hits >= 1.25 then 1.10
                when average_hits >= 0.75 then 1.00
                when average_hits > 0 then 0.92
                else 0.85
            end::numeric as performance_factor
        from daily_profile_base
    ),
    daily_profile_live as (
        select *,
            least(
                0.22,
                0.10 +
                least(
                    0.12,
                    greatest(0.0, completed_draws - 1.0) * 0.015
                ) *
                (0.50 + pattern_strength) *
                performance_factor
            )::numeric as today_weight,
            least(
                0.14,
                0.10 +
                (
                    moving_confirmation *
                    least(1.0, completed_draws / 5.0) *
                    0.04
                )
            )::numeric as moving_share
        from daily_profile_strength
    ),
    daily_profile as (
        select *,
            greatest(
                0.20,
                0.30 - ((today_weight - 0.10) * 0.75)
            )::numeric as month_weight
        from daily_profile_live
    ),
    daily_profile_final as (
        select *,
            (1.0 - today_weight - month_weight)::numeric as recent_weight
        from daily_profile
    ),
    prediction_profile as (
        select
            profile.*,
            case
                when p_prediction_type = 'early' then 0.67::numeric
                else profile.recent_weight
            end as effective_recent_weight,
            case
                when p_prediction_type = 'early' then 0.28::numeric
                else profile.month_weight
            end as effective_month_weight,
            case
                when p_prediction_type = 'early' then 0.05::numeric
                else profile.today_weight
            end as effective_today_weight,
            case
                when p_prediction_type = 'early' then 0.10::numeric
                else profile.moving_share
            end as effective_moving_share,
            case
                when p_prediction_type = 'early' then 0.04::numeric
                else 0.05::numeric
            end as effective_pair_share,
            case
                when p_prediction_type = 'early' then 0.00::numeric
                else 0.08::numeric
            end as effective_carryover_share,
            case
                when p_prediction_type = 'early' then 0.50::numeric
                else 1.00::numeric
            end as feedback_multiplier
        from daily_profile_final as profile
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
    month_moving_events as (
        select related.number, h.source_weight as score
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        cross join lateral unnest(
            prediction_private.modern_moving_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select related.number, h.source_weight * 0.25 as score
        from target_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        cross join lateral unnest(
            prediction_private.modern_moving_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    recent_moving_events as (
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
            prediction_private.modern_moving_links(value::integer)
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
            prediction_private.modern_moving_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
    ),
    today_moving_events as (
        select related.number, 1.0::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as win(value)
        cross join lateral unnest(
            prediction_private.modern_moving_links(value::integer)
        ) as related(number)
        where value ~ '^([1-9]|[1-8][0-9]|90)$'
        union all
        select related.number, 0.25::numeric as score
        from today_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
        ) as machine(value)
        cross join lateral unnest(
            prediction_private.modern_moving_links(value::integer)
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
    month_moving_scores as (
        select number, sum(score) as score
        from month_moving_events
        group by number
    ),
    recent_moving_scores as (
        select number, sum(score) as score
        from recent_moving_events
        group by number
    ),
    today_moving_scores as (
        select number, sum(score) as score
        from today_moving_events
        group by number
    ),
    recent_pair_counts as (
        select
            least(a.value::integer, b.value::integer) as number_a,
            greatest(a.value::integer, b.value::integer) as number_b,
            count(distinct h.draw_date)::numeric as pair_count
        from recent_history as h
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as a(value)
        cross join lateral jsonb_array_elements_text(
            case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
        ) as b(value)
        where a.value ~ '^([1-9]|[1-8][0-9]|90)$'
          and b.value ~ '^([1-9]|[1-8][0-9]|90)$'
          and a.value::integer < b.value::integer
        group by
            least(a.value::integer, b.value::integer),
            greatest(a.value::integer, b.value::integer)
    ),
    recent_pair_support as (
        select number, sum(pair_count)::numeric as score
        from (
            select number_a as number, pair_count
            from recent_pair_counts
            where pair_count >= 2
            union all
            select number_b as number, pair_count
            from recent_pair_counts
            where pair_count >= 2
        ) as repeated_pairs
        group by number
    ),
    carryover_scores as (
        select number, sum(score)::numeric as score
        from (
            select value::integer as number, 3.0::numeric as score
            from latest_today_result as h
            cross join lateral jsonb_array_elements_text(
                case when jsonb_typeof(h.winning) = 'array' then h.winning else '[]'::jsonb end
            ) as win(value)
            where value ~ '^([1-9]|[1-8][0-9]|90)$'
            union all
            select value::integer as number, 0.7::numeric as score
            from latest_today_result as h
            cross join lateral jsonb_array_elements_text(
                case when jsonb_typeof(h.machine) = 'array' then h.machine else '[]'::jsonb end
            ) as machine(value)
            where value ~ '^([1-9]|[1-8][0-9]|90)$'
        ) as carry
        group by number
    ),
    feedback_snapshots as (
        select *
        from public.prediction_snapshots
        where lottery = 'modern-billionaire'
          and game = canonical_game
          and status = 'evaluated'
          and draw_date < p_draw_date
        order by draw_date desc, generated_at desc
        limit 7
    ),
    feedback_by_number as (
        select
            predicted.number,
            sum(
                case
                    when predicted.number = any(
                        coalesce(snapshot.actual_winning, '{}'::integer[])
                    ) then 1
                    else 0
                end
            )::numeric as hit_count,
            sum(
                case
                    when predicted.number = any(
                        coalesce(snapshot.actual_winning, '{}'::integer[])
                    ) then 0
                    else 1
                end
            )::numeric as miss_count
        from feedback_snapshots as snapshot
        cross join lateral unnest(snapshot.all_numbers) as predicted(number)
        group by predicted.number
    ),
    feedback_penalties as (
        select
            number,
            hit_count,
            miss_count,
            greatest(
                0,
                miss_count - (hit_count * 2)
            )::numeric as penalty_score
        from feedback_by_number
    ),
    raw_scores as (
        select number,
            coalesce(month_scores.score, 0) as month_score,
            coalesce(recent_scores.score, 0) as recent_score,
            coalesce(today_scores.score, 0) as today_score,
            coalesce(month_classification_scores.score, 0) as month_classification_score,
            coalesce(recent_classification_scores.score, 0) as recent_classification_score,
            coalesce(today_classification_scores.score, 0) as today_classification_score,
            coalesce(month_moving_scores.score, 0) as month_moving_score,
            coalesce(recent_moving_scores.score, 0) as recent_moving_score,
            coalesce(today_moving_scores.score, 0) as today_moving_score,
            coalesce(recent_pair_support.score, 0) as pair_score,
            coalesce(carryover_scores.score, 0) as carryover_score,
            coalesce(feedback_penalties.hit_count, 0) as feedback_hit_count,
            coalesce(feedback_penalties.miss_count, 0) as feedback_miss_count,
            coalesce(feedback_penalties.penalty_score, 0) as feedback_penalty_score
        from generate_series(1, 90) as numbers(number)
        left join month_scores using (number)
        left join recent_scores using (number)
        left join today_scores using (number)
        left join month_classification_scores using (number)
        left join recent_classification_scores using (number)
        left join today_classification_scores using (number)
        left join month_moving_scores using (number)
        left join recent_moving_scores using (number)
        left join today_moving_scores using (number)
        left join recent_pair_support using (number)
        left join carryover_scores using (number)
        left join feedback_penalties using (number)
    ),
    max_scores as (
        select max(month_score) as month_max,
            max(recent_score) as recent_max,
            max(today_score) as today_max,
            max(month_classification_score) as month_classification_max,
            max(recent_classification_score) as recent_classification_max,
            max(today_classification_score) as today_classification_max,
            max(month_moving_score) as month_moving_max,
            max(recent_moving_score) as recent_moving_max,
            max(today_moving_score) as today_moving_max,
            max(pair_score) as pair_max,
            max(carryover_score) as carryover_max,
            max(feedback_penalty_score) as feedback_penalty_max
        from raw_scores
    ),
    normalized as (
        select raw_scores.*,
            coalesce((month_score / nullif(month_max, 0)) * 100, 0) as month_actual_norm,
            coalesce((recent_score / nullif(recent_max, 0)) * 100, 0) as recent_actual_norm,
            coalesce((today_score / nullif(today_max, 0)) * 100, 0) as today_actual_norm,
            coalesce((month_classification_score / nullif(month_classification_max, 0)) * 100, 0) as month_classification_norm,
            coalesce((recent_classification_score / nullif(recent_classification_max, 0)) * 100, 0) as recent_classification_norm,
            coalesce((today_classification_score / nullif(today_classification_max, 0)) * 100, 0) as today_classification_norm,
            coalesce((month_moving_score / nullif(month_moving_max, 0)) * 100, 0) as month_moving_norm,
            coalesce((recent_moving_score / nullif(recent_moving_max, 0)) * 100, 0) as recent_moving_norm,
            coalesce((today_moving_score / nullif(today_moving_max, 0)) * 100, 0) as today_moving_norm,
            coalesce((pair_score / nullif(pair_max, 0)) * 100, 0) as pair_norm,
            coalesce((carryover_score / nullif(carryover_max, 0)) * 100, 0) as carryover_norm,
            coalesce((feedback_penalty_score / nullif(feedback_penalty_max, 0)) * 100, 0) as feedback_penalty_norm
        from raw_scores
        cross join max_scores
    ),
    adaptive as (
        select normalized.*,
            case
                when month_classification_norm < 35 then 0.00
                when (
                    (month_actual_norm >= 30 and month_classification_norm >= 50)
                    or (month_moving_norm >= 50 and month_classification_norm >= 60)
                ) then 0.20
                when (
                    (month_actual_norm >= 15 and month_classification_norm >= 45)
                    or (month_moving_norm >= 30 and month_classification_norm >= 70)
                ) then 0.10
                else 0.00
            end::numeric as month_classification_share,
            case
                when recent_classification_norm < 35 then 0.00
                when (
                    (recent_actual_norm >= 30 and recent_classification_norm >= 50)
                    or (recent_moving_norm >= 50 and recent_classification_norm >= 60)
                ) then 0.20
                when (
                    (recent_actual_norm >= 15 and recent_classification_norm >= 45)
                    or (recent_moving_norm >= 30 and recent_classification_norm >= 70)
                ) then 0.10
                else 0.00
            end::numeric as recent_classification_share,
            case
                when today_classification_norm < 35 then 0.00
                when (
                    (today_actual_norm >= 30 and today_classification_norm >= 50)
                    or (today_moving_norm >= 50 and today_classification_norm >= 60)
                ) then 0.20
                when (
                    (today_actual_norm >= 15 and today_classification_norm >= 45)
                    or (today_moving_norm >= 30 and today_classification_norm >= 70)
                ) then 0.10
                else 0.00
            end::numeric as today_classification_share
        from normalized
    ),
    components as (
        select adaptive.*,
            (
                month_actual_norm * (
                    1.0 - month_classification_share - profile.effective_moving_share
                )
            )
            + (month_classification_norm * month_classification_share)
            + (month_moving_norm * profile.effective_moving_share)
            as month_component,
            (
                recent_actual_norm * (
                    1.0 - recent_classification_share
                    - profile.effective_moving_share
                    - profile.effective_pair_share
                )
            )
            + (recent_classification_norm * recent_classification_share)
            + (recent_moving_norm * profile.effective_moving_share)
            + (pair_norm * profile.effective_pair_share)
            as recent_component,
            (
                today_actual_norm * (
                    1.0 - today_classification_share
                    - profile.effective_moving_share
                    - profile.effective_carryover_share
                )
            )
            + (today_classification_norm * today_classification_share)
            + (today_moving_norm * profile.effective_moving_share)
            + (carryover_norm * profile.effective_carryover_share)
            as today_component,
            profile.completed_draws,
            profile.repeat_rate,
            profile.moving_confirmation,
            profile.classification_confirmation,
            profile.pattern_strength,
            profile.performance_factor,
            profile.average_hits,
            profile.effective_recent_weight as recent_weight,
            profile.effective_month_weight as month_weight,
            profile.effective_today_weight as today_weight,
            profile.effective_moving_share as moving_share,
            profile.effective_pair_share as pair_share,
            profile.effective_carryover_share as carryover_share,
            profile.feedback_multiplier
        from adaptive
        cross join prediction_profile as profile
    ),
    scored as (
        select components.*,
            (
                recent_component * recent_weight
                + month_component * month_weight
                + today_component * today_weight
            )
            - least(
                5.0,
                feedback_penalty_norm * 0.05 * feedback_multiplier
            )
            as total_score,
            least(
                5.0,
                feedback_penalty_norm * 0.05 * feedback_multiplier
            )
            as applied_feedback_penalty
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
                'monthlySupportScore', round(month_score, 4),
                'monthlySupportClassificationScore', round(month_classification_score, 4),
                'monthlySupportMovingScore', round(month_moving_score, 4),
                'monthlySupportComponent', round(month_component, 4),
                'monthlyClassificationAppliedShare', round(month_classification_share, 4),
                'weeklyGameScore', round(recent_score, 4),
                'weeklyClassificationScore', round(recent_classification_score, 4),
                'weeklyMovingScore', round(recent_moving_score, 4),
                'weeklyComponent', round(recent_component, 4),
                'weeklyClassificationAppliedShare', round(recent_classification_share, 4),
                'pairSupportScore', round(pair_score, 4),
                'pairSupportNormalized', round(pair_norm, 4),
                'presentDayScore', round(today_score, 4),
                'presentDayClassificationScore', round(today_classification_score, 4),
                'presentDayMovingScore', round(today_moving_score, 4),
                'presentDayComponent', round(today_component, 4),
                'presentDayClassificationAppliedShare', round(today_classification_share, 4),
                'previousGameCarryoverScore', round(carryover_score, 4),
                'previousGameCarryoverNormalized', round(carryover_norm, 4),
                'feedbackHitCount', feedback_hit_count,
                'feedbackMissCount', feedback_miss_count,
                'feedbackPenalty', round(applied_feedback_penalty, 4),
                'dailyPatternStrength', round(pattern_strength, 4),
                'dailyRepeatRate', round(repeat_rate, 4),
                'dailyMovingConfirmation', round(moving_confirmation, 4),
                'dailyClassificationConfirmation', round(classification_confirmation, 4),
                'adaptiveRecentWeight', round(recent_weight, 4),
                'adaptiveMonthWeight', round(month_weight, 4),
                'adaptiveTodayWeight', round(today_weight, 4),
                'adaptiveMovingShare', round(moving_share, 4),
                'predictionProfile', p_prediction_type,
                'pairShare', round(pair_share, 4),
                'carryoverShare', round(carryover_share, 4),
                'feedbackMultiplier', round(feedback_multiplier, 4),
                'totalScore', round(coalesce(total_score, 0), 4)
            )
            order by rank_number
        ) filter (where rank_number <= 5),
        max(recent_weight),
        max(month_weight),
        max(today_weight),
        max(moving_share),
        max(pattern_strength),
        max(repeat_rate),
        max(moving_confirmation),
        max(classification_confirmation),
        max(average_hits)
    into current_month_count, fallback_count, recent_count,
        history_count, today_count, sure_values, direct_values,
        all_values, detail_values,
        adaptive_recent_weight, adaptive_month_weight,
        adaptive_today_weight, adaptive_moving_share,
        daily_pattern_strength_value, daily_repeat_rate_value,
        daily_moving_confirmation_value,
        daily_classification_confirmation_value,
        daily_average_hits_value
    from ranked;

    if history_count < 1
        or cardinality(sure_values) <> 2
        or cardinality(direct_values) <> 3
        or cardinality(all_values) <> 5
    then
        return false;
    end if;

    if previous_early_numbers is not null then
        select count(*)::integer
        into changed_from_early
        from unnest(all_values) as current_number(number)
        where not (
            current_number.number = any(previous_early_numbers)
        );
    end if;

    insert into public.prediction_snapshots (
        lottery, game, draw_date, draw_time, generated_at,
        engine_version, engine_profile, range_from, range_to,
        sure_numbers, direct_numbers, all_numbers, score_details,
        weights, historical_draws
    )
    values (
        'modern-billionaire', canonical_game, p_draw_date, draw_time_value, now(),
        'v28',
        case when p_prediction_type = 'early'
            then 'daily-adaptive-7day-classification-moving-feedback-early'
            else 'daily-adaptive-7day-classification-moving-feedback'
        end,
        p_draw_date - 7, p_draw_date - 1, sure_values, direct_values,
        all_values, coalesce(detail_values, '[]'::jsonb),
        jsonb_build_object(
            'weeklyTargetGame', round(adaptive_recent_weight, 4),
            'currentMonthSupport', round(adaptive_month_weight, 4),
            'presentDayResults', round(adaptive_today_weight, 4),
            'weeklyIntervalDays', 7,
            'currentMonthDraws', current_month_count,
            'fallbackDraws', fallback_count,
            'recentTargetDraws', recent_count,
            'presentDayDraws', today_count,
            'dailyPatternMode', 'adaptive',
            'predictionProfileMode', case
                when p_prediction_type = 'early' then 'stable-preview'
                else 'live-adaptive'
            end,
            'previousEarlyNumbers', coalesce(to_jsonb(previous_early_numbers), '[]'::jsonb),
            'changedNumbersFromEarly', changed_from_early,
            'dailyPatternStrength', round(daily_pattern_strength_value, 4),
            'dailyRepeatRate', round(daily_repeat_rate_value, 4),
            'dailyMovingConfirmation', round(daily_moving_confirmation_value, 4),
            'dailyClassificationConfirmation', round(daily_classification_confirmation_value, 4),
            'dailyPredictionAverageHits', round(daily_average_hits_value, 4),
            'frequencyControl', 'square-root-saturation',
            'classificationChart', true,
            'classificationMode', 'adaptive',
            'classificationMaxShare', 0.20,
            'classificationMediumShare', 0.10,
            'classificationMinShare', 0.00,
            'classificationRule', 'requires-statistical-or-moving-corroboration',
            'movingNumbers', true,
            'movingShare', round(adaptive_moving_share, 4),
            'pairRelationshipShare', case
                when p_prediction_type = 'early' then 0.04
                else 0.05
            end,
            'previousGameCarryoverShare', case
                when p_prediction_type = 'early' then 0.00
                else 0.08
            end,
            'performanceFeedback', true,
            'performanceFeedbackMultiplier', case
                when p_prediction_type = 'early' then 0.50
                else 1.00
            end,
            'performanceFeedbackWindow', 7,
            'maxMissPenaltyPoints', 5.0,
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
    where public.prediction_snapshots.status = 'pending';

    get diagnostics affected_rows = row_count;
    return affected_rows = 1;
end;
$function$


revoke execute on function public.record_modern_prediction_snapshot(text, date, text)
from public, anon, authenticated;

CREATE OR REPLACE FUNCTION prediction_private.ensure_modern_prediction_schedule(p_draw_date date, p_after_order integer DEFAULT 0)
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
    early_exists boolean;
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
        if scheduled_game.game_order = first_remaining_order then
            changed := public.record_modern_prediction_snapshot(
                scheduled_game.game_name,
                p_draw_date,
                'main'
            );
        else
            select exists (
                select 1
                from public.prediction_snapshots as snapshot
                where snapshot.lottery = 'modern-billionaire'
                  and snapshot.game = scheduled_game.game_name
                  and snapshot.draw_date = p_draw_date
                  and snapshot.status = 'pending'
                  and snapshot.weights->>'predictionType' = 'early'
            )
            into early_exists;

            if early_exists then
                changed := false;
            else
                changed := public.record_modern_prediction_snapshot(
                    scheduled_game.game_name,
                    p_draw_date,
                    'early'
                );
            end if;
        end if;

        if changed then
            refreshed_count := refreshed_count + 1;
        end if;
    end loop;

    return refreshed_count;
end;
$function$


revoke execute on function prediction_private.ensure_modern_prediction_schedule(date, integer)
from public, anon, authenticated;

comment on function public.record_modern_prediction_snapshot(text, date, text)
is 'Modern v28.1 dual-profile engine: Early forecasts are stable previews; Main forecasts use live adaptive daily evidence, stronger carryover and full performance feedback.';

comment on function prediction_private.ensure_modern_prediction_schedule(date, integer)
is 'Keeps later-game Early forecasts frozen once created and recalculates only the immediate next game as the live Main prediction.';
