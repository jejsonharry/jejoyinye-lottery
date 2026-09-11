import fs from 'node:fs/promises';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase server credentials');
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
  lottery: 'modern-billionaire', game, databaseNames, drawMinutes, drawTime
}));

const weights = Object.freeze({ statistical: 0.60, classification: 0.30, moving: 0.10 });
const recentBoosts = [1.45, 1.30, 1.15];
const todayBudget = { statisticalWinning: 1.20, statisticalMachine: 0.36, relationship: 0.90 };
const categories = ['counterpart','bonanza','malta','stringKey','shadow','partner','equivalent','code','turning'];

function lagosParts(date = new Date()) {
  const values = {};
  for (const part of new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(date)) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return Object.fromEntries(Object.entries(values).map(([k,v]) => [k, Number(v)]));
}

function dateString({ year, month, day }) {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function shiftDate(value, days) {
  const [y,m,d] = value.split('-').map(Number);
  const x = new Date(Date.UTC(y,m-1,d));
  x.setUTCDate(x.getUTCDate() + days);
  return `${x.getUTCFullYear()}-${String(x.getUTCMonth()+1).padStart(2,'0')}-${String(x.getUTCDate()).padStart(2,'0')}`;
}

function parseNumbers(value) {
  if (Array.isArray(value)) return value.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 90);
  if (typeof value === 'string') return (value.match(/\b\d{1,2}\b/g) || []).map(Number).filter(n => n >= 1 && n <= 90);
  return [];
}

async function rest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function loadRelationshipTables() {
  const source = await fs.readFile('predictions.js', 'utf8');
  const classificationText = source.match(/const MODERN_CLASSIFICATION_ROWS = `([\s\S]*?)`;/)?.[1];
  const movingText = source.match(/const MODERN_MOVING_ROWS = `([\s\S]*?)`;/)?.[1];
  if (!classificationText || !movingText) throw new Error('Could not read Modern relationship tables');

  const classification = {};
  for (const row of classificationText.trim().split(/\n+/)) {
    const values = row.trim().split(/\s+/).map(Number);
    const number = values.shift();
    classification[number] = Object.fromEntries(categories.map((name, i) => [name, values[i]]));
  }

  const graph = Object.fromEntries(Array.from({ length: 90 }, (_, i) => [i+1, new Set()]));
  for (const row of movingText.trim().split(/\n+/)) {
    for (const entry of row.split(';')) {
      const [headText, movesText] = entry.split(':');
      const head = Number(headText);
      for (const move of movesText.split(',').map(Number)) {
        if (head >= 1 && head <= 90 && move >= 1 && move <= 90 && move !== head) {
          graph[head].add(move); graph[move].add(head);
        }
      }
    }
  }
  return { classification, moving: Object.fromEntries(Object.entries(graph).map(([k,v]) => [k, [...v]])) };
}

function normalize(scoreMap, property) {
  const max = Math.max(0, ...Object.values(scoreMap).map(x => x[property] || 0));
  for (const item of Object.values(scoreMap)) item[`${property}Normalized`] = max > 0 ? ((item[property] || 0) / max) * 100 : 0;
}

function addRelationships(scoreMap, tables, source, weight) {
  const relationships = tables.classification[source];
  if (relationships) {
    for (const target of new Set(Object.values(relationships))) {
      if (target >= 1 && target <= 90) scoreMap[target].classificationScore += weight;
    }
  }
  for (const target of new Set(tables.moving[source] || [])) scoreMap[target].movingScore += weight;
}

function calculate(history, todayResults, tables) {
  const scoreMap = {};
  for (let number = 1; number <= 90; number++) scoreMap[number] = {
    number, winningFrequency: 0, machineFrequency: 0, todayFrequency: 0,
    recentScore: 0, statisticalScore: 0, classificationScore: 0, movingScore: 0, totalScore: 0
  };

  history.forEach((result, index) => {
    const base = Math.max(0.25, 1 - (index / Math.max(history.length, 1)) * 0.75);
    const recency = base * (recentBoosts[index] || 1);
    for (const number of parseNumbers(result.winning)) {
      scoreMap[number].winningFrequency += 1;
      scoreMap[number].recentScore += 2.4 * recency;
    }
    for (const number of parseNumbers(result.machine)) {
      scoreMap[number].machineFrequency += 1;
      scoreMap[number].recentScore += 0.7 * recency;
    }
  });

  const todayWinningWeight = todayResults.length ? todayBudget.statisticalWinning / todayResults.length : 0;
  const todayMachineWeight = todayResults.length ? todayBudget.statisticalMachine / todayResults.length : 0;
  for (const result of todayResults) {
    for (const number of parseNumbers(result.winning)) {
      scoreMap[number].todayFrequency += 1;
      scoreMap[number].recentScore += todayWinningWeight;
    }
    for (const number of parseNumbers(result.machine)) {
      scoreMap[number].todayFrequency += 0.35;
      scoreMap[number].recentScore += todayMachineWeight;
    }
  }

  for (const item of Object.values(scoreMap)) {
    item.totalScore = item.winningFrequency * 3.5 + item.machineFrequency * 0.8 + item.recentScore;
  }

  const signals = [
    ...history.slice(0,5).map((result,index) => ({ result, weight: recentBoosts[index] || Math.max(0.60, 0.90 - ((index - 3) * 0.15)) })),
    ...todayResults.map(result => ({ result, weight: todayResults.length ? todayBudget.relationship / todayResults.length : 0 }))
  ];
  for (const { result, weight } of signals) {
    for (const number of parseNumbers(result.winning)) addRelationships(scoreMap, tables, number, weight);
    for (const number of parseNumbers(result.machine)) addRelationships(scoreMap, tables, number, weight * 0.45);
  }

  for (const item of Object.values(scoreMap)) item.statisticalScore = item.totalScore;
  normalize(scoreMap, 'statisticalScore'); normalize(scoreMap, 'classificationScore'); normalize(scoreMap, 'movingScore');
  for (const item of Object.values(scoreMap)) {
    item.totalScore = item.statisticalScoreNormalized * weights.statistical + item.classificationScoreNormalized * weights.classification + item.movingScoreNormalized * weights.moving;
  }

  const ranked = Object.values(scoreMap).sort((a,b) => b.totalScore !== a.totalScore ? b.totalScore - a.totalScore : a.number - b.number);
  return { ranked, top: ranked.slice(0,5) };
}

function currentGame() {
  const now = lagosParts();
  const currentMinutes = now.hour * 60 + now.minute + now.second / 60;
  const today = dateString(now);
  for (const game of schedule) if (game.drawMinutes > currentMinutes) return { ...game, drawDate: today };
  return { ...schedule[0], drawDate: shiftDate(today, 1) };
}

async function fetchHistory(game) {
  const names = game.databaseNames.map(name => `\"${name.replaceAll('"','\\"')}\"`).join(',');
  return await rest(`results?select=game,lottery,draw_date,winning,machine&lottery=eq.modern-billionaire&game=in.(${encodeURIComponent(names)})&draw_date=gte.${shiftDate(game.drawDate,-7)}&draw_date=lt.${game.drawDate}&order=draw_date.desc&limit=500`);
}

async function fetchTodayContext(game) {
  const earlierNames = schedule.filter(x => x.drawMinutes < game.drawMinutes).flatMap(x => x.databaseNames);
  if (!earlierNames.length || game.drawDate !== dateString(lagosParts())) return [];
  const names = earlierNames.map(name => `\"${name.replaceAll('"','\\"')}\"`).join(',');
  return await rest(`results?select=game,lottery,draw_date,winning,machine,created_at&lottery=eq.modern-billionaire&draw_date=eq.${game.drawDate}&game=in.(${encodeURIComponent(names)})&order=created_at.asc`);
}

async function upsertSnapshot(game, prediction, historyCount) {
  const all = prediction.top.map(x => x.number);
  const body = {
    lottery: 'modern-billionaire', game: game.game, draw_date: game.drawDate, draw_time: game.drawTime,
    generated_at: new Date().toISOString(), engine_version: 'strict-60-30-10-r1', engine_profile: 'rolling-7-day',
    sure_numbers: all.slice(0,2), direct_numbers: all.slice(2,5), all_numbers: all,
    score_details: prediction.top.map(x => ({
      number: x.number,
      statistical: Number(x.statisticalScoreNormalized.toFixed(4)),
      classification: Number(x.classificationScoreNormalized.toFixed(4)),
      moving: Number(x.movingScoreNormalized.toFixed(4)),
      totalScore: Number(x.totalScore.toFixed(4))
    })),
    weights, historical_draws: historyCount, status: 'pending', evaluated_at: null,
    actual_winning: null, actual_machine: null, sure_winning_hits: null, direct_winning_hits: null,
    machine_support_hits: null, total_winning_hits: null, sure_hit_count: null, direct_hit_count: null,
    machine_support_count: null
  };
  await rest('prediction_snapshots?on_conflict=lottery,game,draw_date', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body)
  });
  console.log(`Saved ${game.game} ${game.drawDate}: ${all.map(n => String(n).padStart(2,'0')).join('-')}`);
}

const game = currentGame();
const tables = await loadRelationshipTables();
const [history, todayResults] = await Promise.all([fetchHistory(game), fetchTodayContext(game)]);
if (!history.length) {
  console.log(`No historical data for ${game.game}; snapshot skipped.`);
  process.exit(0);
}
const prediction = calculate(history, todayResults, tables);
await upsertSnapshot(game, prediction, history.length);
