# Modern Evidence Engine Backtest

Evaluated **10924** walk-forward draws. Duplicate rows removed: **217**. Ambiguous game/date conflicts excluded: **1**.

Random reference: avg hits/draw **0.2778**, any-hit rate **25.37%**.

| Rank | Model | Validation avg | Validation any-hit | Holdout avg | Holdout any-hit | Development avg |
|---:|---|---:|---:|---:|---:|---:|
| 1 | EF-D | 0.2974 | 27.57% | 0.2774 | 25.23% | 0.2724 |
| 2 | EF-E | 0.2946 | 27.24% | 0.2785 | 25.46% | 0.2754 |
| 3 | EF-G | 0.2928 | 26.97% | 0.2820 | 25.68% | 0.2767 |
| 4 | EF-H | 0.2919 | 26.87% | 0.2774 | 25.11% | 0.2772 |
| 5 | EF-F | 0.2914 | 27.01% | 0.2865 | 26.03% | 0.2772 |
| 6 | EF-C | 0.2914 | 26.97% | 0.2751 | 25.23% | 0.2763 |
| 7 | EF-B | 0.2905 | 27.01% | 0.2763 | 25.34% | 0.2799 |
| 8 | EF-A | 0.2891 | 27.01% | 0.2797 | 25.57% | 0.2747 |
| 9 | R1-60-30-10 | 0.2794 | 25.53% | 0.2877 | 25.68% | 0.2664 |

Selection must be based on validation, then checked against untouched holdout. The live engine must not be changed solely because a model wins development data.
