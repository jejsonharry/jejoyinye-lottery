from pathlib import Path

html_path = Path('predictions.html')
css_path = Path('predictions-premium-v4.css')

html = html_path.read_text(encoding='utf-8')

modern_old = '''            <!-- COUNTDOWN -->

            <div class="prediction-countdown-box">

                <p>
                    Time Remaining Until Draw
                </p>

                <div id="countdown-timer">
                    00:00:00
                </div>

            </div>


            <!-- PREDICTED BALLS -->

            <div class="prediction-number-area">

                <span class="prediction-number-label">
                    5-NUMBER CONFIDENCE FORECAST
                </span>
'''

modern_new = '''            <!-- PREDICTED BALLS -->

            <div class="prediction-number-area">

                <div class="prediction-countdown-box forecast-countdown">

                    <p>
                        Time Remaining Until Draw
                    </p>

                    <div id="countdown-timer">
                        00:00:00
                    </div>

                </div>
'''

if modern_old in html:
    html = html.replace(modern_old, modern_new, 1)
elif 'class="prediction-countdown-box forecast-countdown"' not in html:
    raise SystemExit('Modern countdown block not found')

ghana_old = '''            <div class="prediction-countdown-box">

                <p>Time Remaining Until Draw</p>

                <div id="ghana-countdown-timer">
                    00:00:00
                </div>

            </div>

            <div class="prediction-number-area">

                <div class="ghana-prediction-group">
                    <span class="prediction-number-label">
                        5-NUMBER CONFIDENCE FORECAST
                    </span>
'''

ghana_new = '''            <div class="prediction-number-area">

                <div class="prediction-countdown-box forecast-countdown">

                    <p>Time Remaining Until Draw</p>

                    <div id="ghana-countdown-timer">
                        00:00:00
                    </div>

                </div>

                <div class="ghana-prediction-group">
'''

if ghana_old in html:
    html = html.replace(ghana_old, ghana_new, 1)
elif html.count('class="prediction-countdown-box forecast-countdown"') < 2:
    raise SystemExit('Ghana countdown block not found')

old_ref = 'predictions-premium-v4.css?v=3'
new_ref = 'predictions-premium-v4.css?v=4'
if old_ref in html:
    html = html.replace(old_ref, new_ref, 1)
elif new_ref not in html:
    raise SystemExit('Premium stylesheet version reference not found')

html_path.write_text(html, encoding='utf-8')

marker = '/* Forecast countdown replaces confidence heading */'
css_patch = r'''

/* Forecast countdown replaces confidence heading */
body .prediction-number-area > .forecast-countdown {
    width: min(560px, 100%) !important;
    min-height: 84px !important;
    margin: 0 auto 20px !important;
    padding: 11px 18px !important;
    border: 1px solid rgba(74, 144, 196, .34) !important;
    border-radius: 17px !important;
    background: linear-gradient(135deg,#06192b 0%,#0b3658 100%) !important;
    box-shadow: 0 14px 30px rgba(7,25,45,.18) !important;
}
body .prediction-number-area > .forecast-countdown p {
    margin: 0 0 4px !important;
    color: #bcd7ec !important;
    font-size: 9px !important;
    font-weight: 950 !important;
    letter-spacing: .12em !important;
    text-transform: uppercase !important;
}
body .prediction-number-area > .forecast-countdown #countdown-timer,
body .prediction-number-area > .forecast-countdown #ghana-countdown-timer {
    color: #fff !important;
    font-size: clamp(27px, 4vw, 36px) !important;
    font-weight: 950 !important;
    line-height: 1.05 !important;
    letter-spacing: .05em !important;
    text-shadow: 0 7px 18px rgba(0,0,0,.28) !important;
}
body .prediction-number-area > .forecast-countdown + .prediction-balls,
body .prediction-number-area > .forecast-countdown + .ghana-prediction-group {
    margin-top: 0 !important;
}
body .ghana-prediction-group .prediction-balls {
    margin-top: 0 !important;
}
@media (max-width: 700px) {
    body .prediction-number-area > .forecast-countdown {
        min-height: 74px !important;
        margin-bottom: 16px !important;
        padding: 9px 12px !important;
        border-radius: 14px !important;
    }
    body .prediction-number-area > .forecast-countdown #countdown-timer,
    body .prediction-number-area > .forecast-countdown #ghana-countdown-timer {
        font-size: clamp(24px, 8vw, 31px) !important;
    }
}
'''

css = css_path.read_text(encoding='utf-8')
if marker not in css:
    css_path.write_text(css.rstrip() + css_patch + '\n', encoding='utf-8')

print('Countdown moved into forecast and confidence heading removed.')
