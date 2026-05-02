import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const reportsDir = resolve(process.cwd(), "reports");
const textReportPath = resolve(reportsDir, "all-tests-report.txt");
const htmlReportPath = resolve(reportsDir, "all-tests-report.html");

mkdirSync(reportsDir, { recursive: true });

let raw = "";
try {
  raw = readFileSync(textReportPath, "utf8");
} catch {
  console.error("Kon reports/all-tests-report.txt niet lezen. Draai eerst: npm run test:all:report");
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripAnsi(str) {
  return str
    .replace(/\x1B\[[0-9;]*[A-Za-z]/g, "")   // ESC[ sequences
    .replace(/\x1B[()][0-9A-Za-z]/g, "")       // other ESC sequences
    .replace(/\[[0-9;]+[A-Za-z]/g, "")          // bare bracket codes without ESC (e.g. [1A[2K[36m)
    .replace(/\r/g, "");
}

function shortPath(p) {
  return p.replace(/^src\/tests\//, "").replace(/^src\//, "");
}

// ── Parse ──────────────────────────────────────────────────────────────────

const lines = stripAnsi(raw).split("\n");

const tsMatch = lines[0]?.match(/Test run:\s*(.+)/);
const timestamp = tsMatch ? tsMatch[1].trim() : new Date().toString();

let vitestStart = -1, playwrightStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === "=== Vitest ===")     vitestStart     = i;
  if (lines[i].trim() === "=== Playwright ===") playwrightStart = i;
}

const vitestLines     = vitestStart     >= 0 ? lines.slice(vitestStart,     playwrightStart > 0 ? playwrightStart : undefined) : [];
const playwrightLines = playwrightStart >= 0 ? lines.slice(playwrightStart) : [];

// ── Vitest parser ──────────────────────────────────────────────────────────

function parseVitest(lines) {
  const files    = [];
  const warnings = [];
  const summary  = { files: null, tests: null, duration: null };

  let currentWarn = null;
  let warnLines   = [];

  const flushWarn = () => {
    if (currentWarn) { warnings.push({ ...currentWarn, msg: warnLines.join("\n").trim() }); }
    currentWarn = null; warnLines = [];
  };

  for (const line of lines) {
    const t = line.trim();

    // File result  ✓ path/to/file.ts (N tests) Xms
    const fm = t.match(/^([✓✗×⊙])\s+(.+?)\s+\((\d+)\s+tests?\)\s+(\S+)$/);
    if (fm) { flushWarn(); files.push({ pass: fm[1] === "✓", path: fm[2], count: +fm[3], dur: fm[4] }); continue; }

    // stderr header  stderr | file > suite > test
    if (t.startsWith("stderr |")) {
      flushWarn();
      const rest  = t.replace(/^stderr \|\s*/, "");
      const parts = rest.split(" > ");
      currentWarn = { file: parts[0]?.trim() ?? "", suite: parts[1]?.trim() ?? "", test: parts.slice(2).join(" > ").trim() };
      warnLines   = [];
      continue;
    }

    // Summary lines
    const fsm = t.match(/Test Files\s+(\d+)\s+passed.*\((\d+)\)/);
    if (fsm) { flushWarn(); summary.files = { passed: +fsm[1], total: +fsm[2] }; continue; }
    const tsm = t.match(/^Tests\s+(\d+)\s+passed.*\((\d+)\)/);
    if (tsm) { summary.tests = { passed: +tsm[1], total: +tsm[2] }; continue; }
    const dm  = t.match(/^Duration\s+(.+)/);
    if (dm)  { summary.duration = dm[1].split("(")[0].trim(); continue; }

    if (currentWarn) warnLines.push(line);
  }
  flushWarn();
  return { files, warnings, summary };
}

// ── Playwright parser ──────────────────────────────────────────────────────

function parsePlaywright(lines) {
  const suites = {};
  const summary = { passed: 0, failed: 0, duration: null };

  for (const line of lines) {
    const t = line.trim();

    // Summary:  "15 passed (4.1s)"
    const ps = t.match(/^(\d+)\s+passed\s+\((\S+)\)/);
    if (ps) { summary.passed = +ps[1]; summary.duration = ps[2]; }
    const fs = t.match(/(\d+)\s+failed/);
    if (fs) { summary.failed = +fs[1]; }

    // Test result line after stripping looks like:
    // [n/N] [browser] › file:line:col › Suite › test name
    if (!/^\[\d+\/\d+\]/.test(t)) continue;
    if (!t.includes(" › ")) continue;

    const parts = t.split(" › ");
    if (parts.length < 3) continue;

    // browser from first segment: "[n/N] [browser]"
    const browserM = parts[0].match(/\[(\w+)\]\s*$/);
    const browser  = browserM ? browserM[1] : "chromium";

    const pass     = !t.startsWith("✗") && !t.startsWith("×");
    const suite    = parts[parts.length - 2]?.trim();
    const testName = parts[parts.length - 1]?.trim();

    if (!suite || !testName) continue;
    if (!suites[suite]) suites[suite] = [];
    suites[suite].push({ testName, browser, pass });
  }

  return { suites, summary };
}

// ── Run parsers ────────────────────────────────────────────────────────────

const vitest     = parseVitest(vitestLines);
const playwright = parsePlaywright(playwrightLines);

const totalTests  = (vitest.summary.tests?.total   ?? 0) + playwright.summary.passed + playwright.summary.failed;
const totalPassed = (vitest.summary.tests?.passed  ?? 0) + playwright.summary.passed;
const totalFailed = (vitest.summary.tests ? vitest.summary.tests.total - vitest.summary.tests.passed : 0) + playwright.summary.failed;
const allPassed   = totalFailed === 0;

// ── HTML building blocks ───────────────────────────────────────────────────

const vitestRowsHtml = vitest.files.map(f => `
      <div class="row ${f.pass ? "pass" : "fail"}">
        <span class="badge ${f.pass ? "pass" : "fail"}">${f.pass ? "✓" : "✗"}</span>
        <span class="row-label">${escapeHtml(shortPath(f.path))}</span>
        <span class="row-meta">${f.count} tests</span>
        <span class="row-dur">${escapeHtml(f.dur)}</span>
      </div>`).join("");

const playwrightSuitesHtml = Object.entries(playwright.suites).map(([suite, tests]) => `
      <div class="suite">
        <div class="suite-name">${escapeHtml(suite)}</div>
        ${tests.map(t => `
        <div class="row ${t.pass ? "pass" : "fail"}">
          <span class="badge ${t.pass ? "pass" : "fail"}">${t.pass ? "✓" : "✗"}</span>
          <span class="row-label">${escapeHtml(t.testName)}</span>
          <span class="row-meta chip">${escapeHtml(t.browser)}</span>
          <span class="row-dur"></span>
        </div>`).join("")}
      </div>`).join("");

const warningsHtml = vitest.warnings.length === 0 ? "" : `
    <details class="warn-card">
      <summary>⚠&nbsp; ${vitest.warnings.length} console waarschuwing${vitest.warnings.length > 1 ? "en" : ""} (act)</summary>
      <div class="warn-list">
        ${vitest.warnings.map(w => `
        <div class="warn-row">
          <span class="warn-file">${escapeHtml(shortPath(w.file))}</span>
          <span class="warn-sep">›</span>
          <span class="warn-suite">${escapeHtml(w.suite)}</span>
          <span class="warn-sep">›</span>
          <span class="warn-test">${escapeHtml(w.test)}</span>
        </div>`).join("")}
      </div>
    </details>`;

// ── Full HTML ──────────────────────────────────────────────────────────────

const html = `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SimMagic — Test Rapport</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:      #060d18;
      --surface: #0b1625;
      --panel:   #0d1c2e;
      --border:  rgba(6,182,212,.16);
      --border2: rgba(6,182,212,.08);
      --fg:      #d9f7ff;
      --muted:   #6fa3b0;
      --accent:  #06b6d4;
      --cyan2:   #22d3ee;
      --pass:    #22c55e;
      --fail:    #ef4444;
      --warn:    #f59e0b;
    }

    body {
      background:
        radial-gradient(ellipse 120% 50% at 50% -5%, #0c2540 0%, var(--bg) 55%),
        var(--bg);
      color: var(--fg);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                   "Liberation Mono", monospace;
      font-size: 13px;
      line-height: 1.5;
      min-height: 100vh;
      padding: 36px 16px 72px;
    }

    .wrap { max-width: 860px; margin: 0 auto; }

    /* ── Header ── */
    .header {
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-wrap: wrap; gap: 16px; margin-bottom: 28px;
    }
    .logo       { font-size: 22px; font-weight: 700; color: var(--cyan2); letter-spacing: .04em; }
    .logo small { display: block; color: var(--muted); font-size: 11px; font-weight: 400;
                  letter-spacing: 0; margin-top: 3px; }
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 999px;
      font-size: 12px; font-weight: 600; white-space: nowrap;
      margin-top: 4px;
    }
    .pill.pass { background: rgba(34,197,94,.10); color: var(--pass); border: 1px solid rgba(34,197,94,.28); }
    .pill.fail { background: rgba(239,68,68,.10); color: var(--fail); border: 1px solid rgba(239,68,68,.28); }

    /* ── Stat cards ── */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px; margin-bottom: 24px;
    }
    .stat {
      background: var(--panel); border: 1px solid var(--border);
      border-radius: 10px; padding: 16px 18px;
    }
    .stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase;
                  letter-spacing: .1em; margin-bottom: 8px; }
    .stat-value { font-size: 30px; font-weight: 700; line-height: 1; }
    .stat-value.pass { color: var(--pass); }
    .stat-value.fail { color: var(--fail); }
    .stat-value.neu  { color: var(--cyan2); }

    /* ── Section card ── */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow: hidden; margin-bottom: 20px;
    }
    .card-head {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 8px;
      padding: 13px 20px;
      border-bottom: 1px solid var(--border2);
      background: linear-gradient(90deg, rgba(6,182,212,.06) 0%, transparent 70%);
    }
    .card-title { font-size: 13px; font-weight: 700; color: var(--cyan2); letter-spacing: .03em; }
    .card-sum   { font-size: 11px; color: var(--muted); }

    /* ── Test rows ── */
    .row {
      display: grid;
      grid-template-columns: 26px 1fr auto auto;
      align-items: center; gap: 10px;
      padding: 9px 20px;
      border-bottom: 1px solid var(--border2);
      transition: background .1s;
    }
    .row:last-child  { border-bottom: none; }
    .row:hover       { background: rgba(6,182,212,.04); }
    .row.fail        { background: rgba(239,68,68,.03); }

    .badge {
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0;
    }
    .badge.pass { background: rgba(34,197,94,.14); color: var(--pass); }
    .badge.fail { background: rgba(239,68,68,.14); color: var(--fail); }

    .row-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .row-meta  { color: var(--muted); font-size: 11px; white-space: nowrap; }
    .row-dur   { color: var(--accent); font-size: 11px; white-space: nowrap; text-align: right; min-width: 36px; }

    .chip {
      background: rgba(6,182,212,.10); color: var(--accent);
      border: 1px solid rgba(6,182,212,.18);
      border-radius: 4px; padding: 1px 7px; font-size: 10px;
    }

    /* ── Suite grouping (Playwright) ── */
    .suite { border-bottom: 1px solid var(--border2); }
    .suite:last-child { border-bottom: none; }
    .suite-name {
      padding: 7px 20px 4px;
      font-size: 10px; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: .12em;
      background: rgba(6,182,212,.03);
    }

    /* ── Warnings ── */
    .warn-card {
      background: rgba(245,158,11,.04);
      border: 1px solid rgba(245,158,11,.22);
      border-radius: 10px; padding: 12px 18px;
      margin-bottom: 20px; cursor: pointer;
    }
    .warn-card summary {
      color: var(--warn); font-size: 12px; font-weight: 600;
      list-style: none; outline: none;
      display: flex; align-items: center; gap: 4px;
    }
    .warn-card summary::-webkit-details-marker { display: none; }
    .warn-list { margin-top: 10px; }
    .warn-row  {
      display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
      padding: 5px 0; border-top: 1px solid rgba(245,158,11,.1); font-size: 11px;
    }
    .warn-file  { color: var(--muted); }
    .warn-sep   { color: rgba(245,158,11,.4); }
    .warn-suite { color: var(--muted); }
    .warn-test  { color: var(--fg); }

    /* ── Footer ── */
    .footer { text-align: center; margin-top: 36px; color: var(--muted); font-size: 11px; }
    .footer a { color: var(--accent); }

    /* ── Progress bar ── */
    .progress-wrap { height: 3px; background: var(--border2); border-radius: 2px; overflow: hidden; margin-bottom: 28px; }
    .progress-bar  { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--accent) 0%, var(--cyan2) 100%); transition: width .4s; }
  </style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <header class="header">
    <div>
      <div class="logo">SimMagic<small>${escapeHtml(timestamp)}</small></div>
    </div>
    <span class="pill ${allPassed ? "pass" : "fail"}">
      ${allPassed ? "✓ Alle tests geslaagd" : "✗ " + totalFailed + " test" + (totalFailed > 1 ? "s" : "") + " gefaald"}
    </span>
  </header>

  <!-- Progress bar -->
  <div class="progress-wrap">
    <div class="progress-bar" style="width:${totalTests > 0 ? Math.round(totalPassed / totalTests * 100) : 0}%"></div>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <div class="stat-label">Vitest</div>
      <div class="stat-value ${(vitest.summary.tests?.total ?? 0) - (vitest.summary.tests?.passed ?? 0) === 0 ? "pass" : "fail"}">${vitest.summary.tests?.passed ?? "—"}<span style="font-size:14px;font-weight:400;color:var(--muted)"> / ${vitest.summary.tests?.total ?? "—"}</span></div>
    </div>
    <div class="stat">
      <div class="stat-label">Playwright</div>
      <div class="stat-value ${playwright.summary.failed === 0 ? "pass" : "fail"}">${playwright.summary.passed}<span style="font-size:14px;font-weight:400;color:var(--muted)"> / ${playwright.summary.passed + playwright.summary.failed}</span></div>
    </div>
    <div class="stat">
      <div class="stat-label">Bestanden</div>
      <div class="stat-value neu">${vitest.summary.files?.total ?? "—"}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Duur Vitest</div>
      <div class="stat-value neu" style="font-size:18px">${vitest.summary.duration ?? "—"}</div>
    </div>
  </div>

  ${warningsHtml}

  <!-- Vitest -->
  <section class="card">
    <div class="card-head">
      <span class="card-title">⚡ Vitest &nbsp;—&nbsp; unit &amp; integratie</span>
      <span class="card-sum">${vitest.summary.tests?.passed ?? 0} / ${vitest.summary.tests?.total ?? 0} geslaagd</span>
    </div>
    ${vitestRowsHtml}
  </section>

  <!-- Playwright -->
  <section class="card">
    <div class="card-head">
      <span class="card-title">🎭 Playwright &nbsp;—&nbsp; end-to-end</span>
      <span class="card-sum">${playwright.summary.passed} / ${playwright.summary.passed + playwright.summary.failed} geslaagd &nbsp;·&nbsp; ${playwright.summary.duration ?? ""}</span>
    </div>
    ${playwrightSuitesHtml}
  </section>

  <footer class="footer">Gegenereerd op ${new Date().toISOString()} &nbsp;·&nbsp; SimMagic</footer>

</div>
</body>
</html>`;

writeFileSync(htmlReportPath, html, "utf8");
console.log(`HTML rapport geschreven naar: ${htmlReportPath}`);
