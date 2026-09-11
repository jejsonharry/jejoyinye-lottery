import fs from 'node:fs/promises';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase server credentials');
}

await import('../modern-evidence-engine-core.js');
const evidenceEngine = globalThis.JolsModernEvidenceEngine;

if (!evidenceEngine?.predict) {
  throw new Error('Evidence Fusion core failed to load');
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

const schedule = [
  ['Powerball', ['Powerball'], 9 * 60, '9:00 AM'],
  ['Awoof', ['Awoof'], 11 * 60, '11:00 AM'],
  ['Biggest Bet', ['Biggest Bet'], 13 * 60, '1:00 PM'],
  ['Gold Rush', ['Gold Rush'], 15 * 60, '3:00 PM'],
  ['Lucky Dollar', ['Lucky Dollar'], 17 * 60, '5:00 PM'],
  ['Blessing', ['Blessing'], 18 * 60, '6:00 PM'],
  ['Owo Time', ['Owo Time'], 19 * 60, '7:00 PM'],
  ['Modern Bingo', ['Modern Bingo'], 20 * 60, '8:00 PM'],
  ['Bonus Cash', ['Bonus Cash'], 21 * 60, '9:00 PM'],
  ['Hero', ['Hero'], 22 * 60, '10:00 PM'],
  ['Golden', ['Golden', 'Golden Night'], 23 * 60, '11:00 PM'],
  ['Queen', ['Queen'], 24 * 60, '12:00 AM']
].map(([game, databaseNames, drawMinutes, drawTime]) => ({
  lottery: 'modern-billionaire',
  game,
  databaseNames,
  drawMinutes,
  drawTime
}));

const classificationCategories = [
  'counterpart','bonanza','malta','stringKey','shadow','partner','equivalent','code','turning'
];

function lagosParts(date = new Date()) {
  const values = {};
  for (const part of new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)])
  );
}

function dateString({ year, month, day }) {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function shiftDate(value, days) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`;
}

async function rest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function loadRelationshipTables() {
  const source = await fs.readFile('predictions.js', 'utf8');
  const classificationText = source.match(/const MODERN_CLASSIFICATION_ROWS = `([\s\S]*?)`;/)?.[1];
  const movingText = source.match(/const MODERN_MOVING_ROWS = `([\s\S]*?)`;/)?.[1];

  if (!classificationText || !movingText) {
    throw new Error('Could not read Modern relationship tables');
  }

  const classificationChart = {};
  for (const row of classificationText.trim().split(/\n+/)) {
    const values = row.trim().split(/\s+/).map(Number);
    const number = values.shift();
    classificationChart[number] = Object.fromEntries(
      classificationCategories.map((name, index) => [name, values[index]])
    );
  }

  const graph = Object.fromEntries(
    Array.from({ length: 90 }, (_, index) => [index + 1, new Set()])
  );

  for (const row of movingText.trim().split(/\n+/)) {
    for (const entry of row.split(';')) {
      const [headText, movesText] = entry.split(':');
      const head = Number(headText);

      for (const move of movesText.split(',').map(Number)) {
        if (
          head >= 1 && head <= 90 &&
          move >= 1 && move <= 90 &&
          move !== head
        ) {
          graph[head].add(move);
          graph[move].add(head);
        }
      }
    }
  }

  return {
    classificationChart,
    movingGraph: Object.fromEntries(
      Object.entries(graph).map(([number, related]) => [number, [...related]])
    )
  };
}

function currentGame() {
  const now = lagosParts();
  const currentMinutes = now.hour * 60 + now.minute + now.second / 60;
  const today = dateString(now);

  for (const game of schedule) {
    if (game.drawMinutes > currentMinutes) {
      return { ...game, drawDate: today };
    }
  }

  return { ...schedule[0], drawDate: shiftDate(today, 1) };
}

function encodedNames(names) {
  return names
    .map(name => `\"${name.replaceAll('"','\\"')}\"`)
    .join(',');
}

async function fetchHistory(game) {
  const names = encodedNames(game.databaseNames);
  return await rest(
    `results?select=game,lottery,draw_date,winning,machine,created_at` +
    `&lottery=eq.modern-billionaire` +
    `&game=in.(${encodeURIComponent(names)})` +
    `&draw_date=gte.${shiftDate(game.drawDate,-90)}` +
    `&draw_date=lt.${game.drawDate}` +
    `&order=draw_date.desc,created_at.desc&limit=500`
  );
}

async function fetchTodayContext(game) {
  const earlierNames = schedule
    .filter(item => item.drawMinutes < game.drawMinutes)
    .flatMap(item => item.databaseNames);

  const today = dateString(lagosParts());

  if (!earlierNames.length || game.drawDate !== today) {
    return [];
  }

  const names = encodedNames(earlierNames);
  return await rest(
    `results?select=game,lottery,draw_date,winning,machine,created_at` +
    `&lottery=eq.modern-billionaire` +
    `&draw_date=eq.${game.drawDate}` +
    `&game=in.(${encodeURIComponent(names)})` +
    `&order=created_at.asc`
  );
}

async function upsertSnapshot(game, prediction) {
  const rankedTop = prediction.rankedData.slice(0, 5);
  const allNumbers = rankedTop.map(item => item.number);
  const profile = evidenceEngine.PROFILE;

  const body = {
    lottery: 'modern-billionaire',
    game: game.game,
    draw_date: game.drawDate,
    draw_time: game.drawTime,
    generated_at: new Date().toISOString(),
    engine_version: profile.id,
    engine_profile: 'EF-F',
    sure_numbers: allNumbers.slice(0, 2),
    direct_numbers: allNumbers.slice(2, 5),
    all_numbers: allNumbers,
    score_details: rankedTop.map(item => ({
      number: item.number,
      sameGame: Number(item.sameGameScoreNormalized.toFixed(4)),
      machineConversion: Number(item.machineConversionScoreNormalized.toFixed(4)),
      crossConfirmation: Number(item.crossConfirmationScoreNormalized.toFixed(4)),
      classification: Number(item.classificationScoreNormalized.toFixed(4)),
      moving: Number(item.movingScoreNormalized.toFixed(4)),
      evidenceBreadth: item.evidenceBreadth,
      conversionRate: Number(item.conversionRate.toFixed(6)),
      totalScore: Number(item.totalScore.toFixed(4))
    })),
    weights: profile.weights,
    historical_draws: prediction.diagnostics.recentHistoryDraws,
    status: 'pending',
    evaluated_at: null,
    actual_winning: null,
    actual_machine: null,
    sure_winning_hits: [],
    direct_winning_hits: [],
    machine_support_hits: [],
    total_winning_hits: 0,
    sure_hit_count: 0,
    direct_hit_count: 0,
    machine_support_count: 0
  };

  await rest('prediction_snapshots?on_conflict=lottery,game,draw_date', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body)
  });

  console.log(
    `Saved ${profile.label} snapshot for ${game.game} ${game.drawDate}: ` +
    allNumbers.map(number => String(number).padStart(2,'0')).join('-')
  );
}

const game = currentGame();
const tables = await loadRelationshipTables();
const [history, todayResults] = await Promise.all([
  fetchHistory(game),
  fetchTodayContext(game)
]);

if (!history.length) {
  console.log(`No historical data for ${game.game}; snapshot skipped.`);
  process.exit(0);
}

const prediction = evidenceEngine.predict({
  history,
  todayResults,
  drawDate: game.drawDate,
  classificationChart: tables.classificationChart,
  movingGraph: tables.movingGraph
});

await upsertSnapshot(game, prediction);
