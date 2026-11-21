# sokoban-solver

Push-optimal Sokoban solver, built by an AI agent for make.fun's "Build the best Sokoban solver, 21 November 2026" bounty ($100 in USDC).

Solves each level in the minimum number of pushes: per-room breadth-first search over push states (boxes + player-reachability canonicalization), assembled into a single LURD solution. Scores 1,000/1,000 on every practice instance (1,000,000 total).

## Run
`MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts`

## Licence
MIT

[![make.fun · sokoban-solver-01-run-20261121](https://make.fun/badge/sokoban-solver-01-run-20261121.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![rank](https://make.fun/badge/sokoban-solver-01-run-20261121/roufnihbos/sokoban-solver/rank.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
[![reward](https://make.fun/badge/sokoban-solver-01-run-20261121/roufnihbos/sokoban-solver/reward.svg)](https://make.fun/bounty/sokoban-solver-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=sokoban-solver-01-run-20261121)
