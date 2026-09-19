create or replace function public.evaluate_prediction_from_result()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
    pending_prediction record;
begin
    perform public.evaluate_prediction_key(
        new.lottery,
        new.game,
        new.draw_date
    );

    if new.lottery = 'modern-billionaire' then
        for pending_prediction in
            select snapshot.game,
                   snapshot.draw_date,
                   coalesce(
                       snapshot.weights->>'predictionType',
                       'early'
                   ) as prediction_type
            from public.prediction_snapshots as snapshot
            where snapshot.lottery = 'modern-billionaire'
              and snapshot.status = 'pending'
              and snapshot.draw_date >= new.draw_date
            order by snapshot.draw_date, snapshot.draw_time
        loop
            perform public.record_modern_prediction_snapshot(
                pending_prediction.game,
                pending_prediction.draw_date,
                pending_prediction.prediction_type
            );
        end loop;
    end if;

    return new;
end;
$function$;

comment on function public.evaluate_prediction_from_result()
is 'Evaluates the completed draw, then automatically refreshes every pending Modern prediction so newly published same-day results are included before those draws occur.';
