# Modern Evidence Engine Backtest

Evaluated **10924** walk-forward draws. Duplicate rows removed: **217**. Ambiguous game/date conflicts excluded: **1**.

Random reference: avg hits/draw **0.2778**, any-hit rate **25.37%**.

| Rank | Model | Validation avg | Validation any-hit | Holdout avg | Holdout any-hit | Development avg |
|---:|---|---:|---:|---:|---:|---:|
| 1 | EF-D | 0.2993 | 27.66% | 0.2785 | 25.34% | 0.2734 |
| 2 | EF-E | 0.2974 | 27.57% | 0.2751 | 24.77% | 0.2734 |
| 3 | EF-H | 0.2969 | 27.29% | 0.2842 | 25.46% | 0.2720 |
| 4 | EF-G | 0.2942 | 26.92% | 0.2877 | 25.91% | 0.2764 |
| 5 | EF-C | 0.2937 | 27.15% | 0.2785 | 25.23% | 0.2748 |
| 6 | EF-F | 0.2923 | 26.92% | 0.2877 | 25.68% | 0.2738 |
| 7 | EF-A | 0.2895 | 26.73% | 0.2740 | 24.77% | 0.2716 |
| 8 | EF-B | 0.2854 | 26.32% | 0.2820 | 25.23% | 0.2747 |
| 9 | R1-60-30-10 | 0.2794 | 25.53% | 0.2877 | 25.68% | 0.2664 |

Selection must be based on validation, then checked against untouched holdout. The live engine must not be changed solely because a model wins development data.
