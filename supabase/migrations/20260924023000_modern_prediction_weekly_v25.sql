do $migration$
declare
    function_sql text;
begin
    select pg_get_functiondef(
        'public.record_modern_prediction_snapshot(text,date,text)'::regprocedure
    ) into function_sql;

    if position('''v25''' in function_sql) > 0
       and position('draw_date >= p_draw_date - 7' in function_sql) > 0
       and position('recent_component * 0.60' in function_sql) > 0
    then
        return;
    end if;

    if position('from target_history where rn <= 7' in function_sql) = 0
       or position('month_component * 0.60' in function_sql) = 0
       or position('recent_component * 0.30' in function_sql) = 0
       or position('''v24''' in function_sql) = 0
    then
        raise exception 'Expected Modern v24 prediction function was not found';
    end if;

    function_sql := replace(
        function_sql,
        'from target_history where rn <= 7',
        'from target_history where draw_date >= p_draw_date - 7 and draw_date < p_draw_date'
    );

    function_sql := regexp_replace(
        function_sql,
        'month_component \* 0\.60[[:space:]]+\+ recent_component \* 0\.30',
        E'recent_component * 0.60\n            + month_component * 0.30'
    );

    function_sql := replace(function_sql, '''v24''', '''v25''');
    function_sql := replace(
        function_sql,
        '''monthly-60-recent-30-today-10-classification-early''',
        '''weekly-7day-60-month-30-today-10-classification-early'''
    );
    function_sql := replace(
        function_sql,
        '''monthly-60-recent-30-today-10-classification''',
        '''weekly-7day-60-month-30-today-10-classification'''
    );
    function_sql := replace(
        function_sql,
        'month_start, p_draw_date - 1',
        'p_draw_date - 7, p_draw_date - 1'
    );

    function_sql := replace(function_sql, '''currentMonthScore''', '''monthlySupportScore''');
    function_sql := replace(function_sql, '''currentMonthClassificationScore''', '''monthlySupportClassificationScore''');
    function_sql := replace(function_sql, '''currentMonthComponent''', '''monthlySupportComponent''');
    function_sql := replace(function_sql, '''recentGameScore''', '''weeklyGameScore''');
    function_sql := replace(function_sql, '''recentClassificationScore''', '''weeklyClassificationScore''');
    function_sql := replace(function_sql, '''recentComponent''', '''weeklyComponent''');

    function_sql := replace(
        function_sql,
        '''currentMonthResults'', 0.60,
            ''recentTargetGame'', 0.30,
            ''presentDayResults'', 0.10,',
        '''weeklyTargetGame'', 0.60,
            ''currentMonthSupport'', 0.30,
            ''presentDayResults'', 0.10,
            ''weeklyIntervalDays'', 7,'
    );

    execute function_sql;
end;
$migration$;

comment on function public.record_modern_prediction_snapshot(text, date, text)
is 'Modern v25: 60% same-game results from the previous seven calendar days, 30% wider current-month support, and 10% present-day results; actual evidence remains 80% and the classification chart 20% inside each component.';

select prediction_private.ensure_modern_prediction_schedule(
    (now() at time zone 'Africa/Lagos')::date,
    0
);
