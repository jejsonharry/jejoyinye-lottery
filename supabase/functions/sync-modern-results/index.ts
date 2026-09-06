const OFFICIAL_RESULTS_API =
  "https://api.modernlotterynigeria.com/9999/third/gameissue/getIssues";
const LOTTERY = "modern-billionaire";

const GAME_BY_MERCHANT_ID: Record<string, string> = {
  "21": "Powerball",
  "22": "Awoof",
  "23": "Biggest Bet",
  "24": "Gold Rush",
  "25": "Lucky Dollar",
  "31": "Blessing",
  "32": "Owo Time",
  "26": "Modern Bingo",
  "27": "Bonus Cash",
  "28": "Hero",
  "29": "Golden",
  "30": "Queen",
};

const GAME_BY_SPIN_TIME: Record<string, string> = {
  "09:00:00": "Powerball",
  "11:00:00": "Awoof",
  "13:00:00": "Biggest Bet",
  "15:00:00": "Gold Rush",
  "17:00:00": "Lucky Dollar",
  "18:00:00": "Blessing",
  "19:00:00": "Owo Time",
  "20:00:00": "Modern Bingo",
  "21:00:00": "Bonus Cash",
  "22:00:00": "Hero",
  "23:00:00": "Golden",
  "23:59:59": "Queen",
  "00:00:00": "Queen",
};

type OfficialRecord = {
  merchantId?: string | number;
  spinTime?: string;
  issueDate?: string;
  statusFlag?: string;
  result?: string;
  mach?: string;
};

type ResultRecord = {
  lottery: string;
  game: string;
  draw_date: string;
  winning: number[];
  machine: number[];
};

function getSecretKey(): string {
  const currentKeys = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (currentKeys) {
    try {
      const keys = JSON.parse(currentKeys);
      if (keys?.default) return String(keys.default);
    } catch {
      // Fall through to the legacy key supplied by hosted projects.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

function lagosDate(date = new Date()): string {
  return new Date(date.getTime() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function parseNumbers(value: unknown): number[] {
  const numbers = String(value || "")
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);

  if (
    numbers.length !== 5 ||
    numbers.some((number) =>
      !Number.isInteger(number) || number < 1 || number > 90
    ) ||
    new Set(numbers).size !== numbers.length
  ) {
    return [];
  }

  return numbers;
}

function gameForRecord(record: OfficialRecord): string {
  const currentGame = GAME_BY_MERCHANT_ID[String(record.merchantId || "")];
  if (currentGame) return currentGame;

  const time = String(record.spinTime || "")
    .match(/(\d{2}:\d{2}:\d{2})$/)?.[1] || "";
  return GAME_BY_SPIN_TIME[time] || "";
}

function normaliseNumbers(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(Number);
    } catch {
      return parseNumbers(value);
    }
  }

  return [];
}

function sameNumbers(left: unknown, right: unknown): boolean {
  return JSON.stringify(normaliseNumbers(left)) ===
    JSON.stringify(normaliseNumbers(right));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  attempts = 3,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(25_000),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw lastError;
}

async function fetchOfficialResults(drawDate: string): Promise<ResultRecord[]> {
  const query = new URLSearchParams({
    issueDate: drawDate,
    current: "1",
    size: "20",
    merchantId: "21",
  });

  const response = await fetchWithRetry(`${OFFICIAL_RESULTS_API}?${query}`, {
    headers: { Authorization: "Bearer", Accept: "application/json" },
  });
  const payload = await response.json();

  if (payload?.code !== 0 || !Array.isArray(payload?.data?.records)) {
    throw new Error(
      payload?.msg || `Unexpected official API response for ${drawDate}`,
    );
  }

  return payload.data.records
    .filter((record: OfficialRecord) =>
      record.statusFlag === "F" && record.result
    )
    .map((record: OfficialRecord): ResultRecord => ({
      lottery: LOTTERY,
      game: gameForRecord(record),
      draw_date: String(record.issueDate || drawDate).slice(0, 10),
      winning: parseNumbers(record.result),
      machine: parseNumbers(record.mach),
    }))
    .filter((record: ResultRecord) =>
      record.game && record.winning.length === 5 && record.machine.length === 5
    );
}

function databaseHeaders(secretKey: string, extra: HeadersInit = {}): HeadersInit {
  const headers: Record<string, string> = {
    apikey: secretKey,
    "Content-Type": "application/json",
    ...(extra as Record<string, string>),
  };

  if (secretKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${secretKey}`;
  }

  return headers;
}

async function syncDate(
  projectUrl: string,
  secretKey: string,
  drawDate: string,
) {
  const officialResults = await fetchOfficialResults(drawDate);
  const existingQuery = new URLSearchParams({
    lottery: `eq.${LOTTERY}`,
    draw_date: `eq.${drawDate}`,
    select: "game,winning,machine",
  });
  const existingResponse = await fetchWithRetry(
    `${projectUrl}/rest/v1/results?${existingQuery}`,
    { headers: databaseHeaders(secretKey) },
  );
  const existingRows = await existingResponse.json();
  const existingByGame = new Map(
    (Array.isArray(existingRows) ? existingRows : [])
      .map((row) => [String(row.game || ""), row]),
  );
  const totals = { found: officialResults.length, inserted: 0, updated: 0, skipped: 0 };

  for (const result of officialResults) {
    const existing = existingByGame.get(result.game);

    if (
      existing && sameNumbers(existing.winning, result.winning) &&
      sameNumbers(existing.machine, result.machine)
    ) {
      totals.skipped += 1;
      continue;
    }

    const filter = new URLSearchParams({
      lottery: `eq.${result.lottery}`,
      game: `eq.${result.game}`,
      draw_date: `eq.${result.draw_date}`,
    });
    const url = existing
      ? `${projectUrl}/rest/v1/results?${filter}`
      : `${projectUrl}/rest/v1/results`;
    const body = existing
      ? { winning: result.winning, machine: result.machine }
      : result;

    await fetchWithRetry(url, {
      method: existing ? "PATCH" : "POST",
      headers: databaseHeaders(secretKey, { Prefer: "return=minimal" }),
      body: JSON.stringify(body),
    });

    totals[existing ? "updated" : "inserted"] += 1;
  }

  return { drawDate, ...totals };
}

Deno.serve(async (request) => {
  if (request.method !== "POST" && request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const projectUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
    const secretKey = getSecretKey();

    if (!projectUrl || !secretKey) {
      throw new Error("Supabase function credentials are unavailable.");
    }

    const today = lagosDate();
    const dates = [addDays(today, -1), today];
    const results = [];

    for (const date of dates) {
      results.push(await syncDate(projectUrl, secretKey, date));
    }

    return Response.json({ ok: true, checkedAt: new Date().toISOString(), results });
  } catch (error) {
    console.error("Modern results sync failed", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
});
