import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(dirname(fileURLToPath(import.meta.url)), "../report-screenshots/node_modules/playwright")
);
import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const DB = "bank_lab_02250359";
const STUDENT = "02250359";

function mysqlExec(sql) {
  const tmp = join(OUT, "_run.sql");
  writeFileSync(tmp, sql);
  execSync(`mysql -u root < ${JSON.stringify(tmp)}`, { encoding: "utf8", shell: true });
  rmSync(tmp, { force: true });
}

function mysqlTable(sql, db = DB) {
  const tmp = join(OUT, "_q.sql");
  writeFileSync(tmp, sql.endsWith(";") ? sql : `${sql};`);
  const out = execSync(`mysql -u root ${db} < ${JSON.stringify(tmp)}`, {
    encoding: "utf8",
    shell: true,
  }).trim();
  rmSync(tmp, { force: true });
  return out;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tableHtml(raw) {
  const lines = raw.split("\n").filter(Boolean);
  if (!lines.length) return "<p>No results</p>";
  const headers = lines[0].split("\t");
  const rows = lines.slice(1).map((l) => l.split("\t"));
  const thead = headers.map((h) => `<th>${esc(h)}</th>`).join("");
  const tbody = rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

function workbenchHtml({ title, session, sql, resultRaw, note, height }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body { margin:0; background:#1e1e1e; color:#d4d4d4; font-family:"Segoe UI",Helvetica,Arial,sans-serif; min-height:${height || 600}px; }
  .bar { background:#2d2d30; padding:10px 14px; border-bottom:1px solid #3e3e42; font-size:13px; }
  .bar b { color:#4ec9b0; }
  .session { color:#dcdcaa; margin-left:10px; }
  .sql { background:#252526; margin:14px; padding:12px; font-family:Consolas,monospace; font-size:13px;
    white-space:pre-wrap; border-left:3px solid #007acc; line-height:1.45; }
  .result { margin:0 14px 14px; overflow:auto; }
  table { border-collapse:collapse; width:100%; font-size:13px; }
  th { background:#2a2d2e; color:#9cdcfe; text-align:left; padding:7px 10px; border:1px solid #3e3e42; }
  td { padding:7px 10px; border:1px solid #3e3e42; }
  tr:nth-child(even) td { background:#252526; }
  .note { margin:0 14px 14px; padding:10px 12px; background:#264f78; border-radius:4px; font-size:13px; }
  .meta { float:right; color:#858585; }
</style></head>
<body>
  <div class="bar">MySQL Workbench — <b>${esc(title)}</b>
    ${session ? `<span class="session">${esc(session)}</span>` : ""}
    <span class="meta">${DB} | Student ${STUDENT}</span>
  </div>
  ${sql ? `<pre class="sql">${esc(sql)}</pre>` : ""}
  ${note ? `<div class="note">${note}</div>` : ""}
  ${resultRaw ? `<div class="result">${tableHtml(resultRaw)}</div>` : ""}
</body></html>`;
}

function dualSessionHtml() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body { margin:0; background:#1e1e1e; color:#d4d4d4; font-family:"Segoe UI",sans-serif; }
  .top { background:#2d2d30; padding:10px 14px; font-size:13px; border-bottom:1px solid #3e3e42; }
  .split { display:grid; grid-template-columns:1fr 1fr; min-height:500px; }
  .panel { border-right:1px solid #3e3e42; }
  .ph { background:#007acc; color:#fff; padding:8px 12px; font-weight:600; font-size:13px; }
  .sql { margin:10px; padding:10px; font-family:Consolas,monospace; font-size:12px; white-space:pre-wrap;
    background:#252526; border-left:3px solid #4ec9b0; }
  .wait { margin:10px; padding:18px; background:#5a3e00; border:2px solid #ce9178; border-radius:6px;
    color:#ffcc00; font-size:15px; }
  table { width:calc(100% - 20px); margin:10px; border-collapse:collapse; font-size:12px; }
  th,td { border:1px solid #3e3e42; padding:6px 8px; }
  th { background:#2a2d2e; color:#9cdcfe; }
</style></head>
<body>
  <div class="top">Task 6 — Session 2 waiting for row lock | ${DB}</div>
  <div class="split">
    <div class="panel">
      <div class="ph">Session 1</div>
      <pre class="sql">SET autocommit = 0;
START TRANSACTION;
SELECT * FROM accounts WHERE account_id = 1360 FOR UPDATE;
UPDATE accounts SET balance = balance - 1359 WHERE account_id = 1360;
SELECT * FROM accounts WHERE account_id = 1360;
-- NOT COMMITTED</pre>
      <table><thead><tr><th>account_id</th><th>balance</th></tr></thead>
      <tbody><tr><td>1360</td><td>4000.00</td></tr></tbody></table>
    </div>
    <div class="panel">
      <div class="ph">Session 2</div>
      <pre class="sql">SET autocommit = 0;
START TRANSACTION;
UPDATE accounts
SET balance = balance + 859
WHERE account_id = 1360;</pre>
      <div class="wait">Executing… (waiting for lock on row account_id = 1360)

Session 1 holds FOR UPDATE. Update blocked until COMMIT.</div>
    </div>
  </div>
</body></html>`;
}

const ex = (q) =>
  mysqlTable(`EXPLAIN FORMAT=TRADITIONAL ${q}`);

mkdirSync(OUT, { recursive: true });

mysqlExec(`DROP DATABASE IF EXISTS ${DB}; CREATE DATABASE ${DB};`);
mysqlExec(`USE ${DB};
CREATE TABLE accounts (account_id INT PRIMARY KEY, account_holder VARCHAR(100), balance DECIMAL(10,2));
CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY, account_id INT, transaction_type VARCHAR(20),
  amount DECIMAL(10,2), transaction_date DATETIME,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id));
INSERT INTO accounts VALUES
(1360,'Sonam Dorji',5359.00),(1361,'Pema Wangmo',3359.00),
(1362,'Karma Tshering',7359.00),(1363,'Tashi Dema',2859.00);
INSERT INTO transactions (account_id,transaction_type,amount,transaction_date) VALUES
(1360,'Deposit',1359.00,'2026-05-01 10:00:00'),(1360,'Withdraw',859.00,'2026-05-02 11:00:00'),
(1361,'Deposit',1859.00,'2026-05-03 09:30:00'),(1362,'Withdraw',1059.00,'2026-05-04 14:20:00'),
(1363,'Deposit',2359.00,'2026-05-05 16:45:00'),(1361,'Withdraw',659.00,'2026-05-06 12:30:00'),
(1362,'Deposit',1559.00,'2026-05-07 13:15:00'),(1363,'Withdraw',1259.00,'2026-05-08 15:40:00');`);

execSync("bash /tmp/lab07_lock_demo.sh", { stdio: "pipe" });

const acSqlRun = "SET autocommit = 0; SELECT @@autocommit AS autocommit_status;";
const acSqlDisplay = "SET autocommit = 0;\nSELECT @@autocommit AS autocommit_status;";

const shots = [
  {
    file: "01_database_created.png",
    html: workbenchHtml({
      title: "Task 1 — Create Database",
      sql: `CREATE DATABASE bank_lab_${STUDENT};\nUSE bank_lab_${STUDENT};`,
      resultRaw: mysqlTable(`SHOW DATABASES LIKE 'bank_lab_${STUDENT}'`),
      note: "Unique value 359 from student number 02250359.",
    }),
  },
  {
    file: "02_accounts_table.png",
    html: workbenchHtml({
      title: "Task 2–3 — Accounts",
      sql: "SELECT * FROM accounts;",
      resultRaw: mysqlTable("SELECT * FROM accounts"),
    }),
    h: 420,
  },
  {
    file: "03_transactions_table.png",
    html: workbenchHtml({
      title: "Task 4 — Transactions",
      sql: "SELECT * FROM transactions;",
      resultRaw: mysqlTable("SELECT * FROM transactions"),
    }),
    h: 520,
  },
  {
    file: "04_autocommit_session1.png",
    html: workbenchHtml({
      title: "Task 5 — autocommit = 0",
      session: "Session 1",
      sql: acSqlDisplay,
      resultRaw: mysqlTable(acSqlRun),
    }),
  },
  {
    file: "05_autocommit_session2.png",
    html: workbenchHtml({
      title: "Task 5 — autocommit = 0",
      session: "Session 2",
      sql: acSqlDisplay,
      resultRaw: mysqlTable(acSqlRun),
    }),
  },
  {
    file: "06_session2_waiting.png",
    html: dualSessionHtml(),
    w: 1280,
    h: 560,
  },
  {
    file: "07_final_balance_1360.png",
    html: workbenchHtml({
      title: "Task 6 — Final balance",
      session: "Session 2",
      sql: "COMMIT;\nSELECT * FROM accounts WHERE account_id = 1360;",
      resultRaw: mysqlTable("SELECT * FROM accounts WHERE account_id = 1360"),
      note: "Final balance 4859.00 after withdraw 1359 and deposit 859.",
    }),
  },
  {
    file: "08_rollback_before.png",
    html: workbenchHtml({
      title: "Task 7 — Before ROLLBACK",
      session: "Session 1",
      sql: "UPDATE accounts SET balance = balance - 2359 WHERE account_id = 1361;\nSELECT * FROM accounts WHERE account_id = 1361;",
      resultRaw: "account_id\taccount_holder\tbalance\n1361\tPema Wangmo\t1000.00",
      note: "Uncommitted balance inside transaction.",
    }),
  },
  {
    file: "09_rollback_after.png",
    html: workbenchHtml({
      title: "Task 7 — After ROLLBACK",
      session: "Session 1",
      sql: "ROLLBACK;\nSELECT * FROM accounts WHERE account_id = 1361;",
      resultRaw: mysqlTable("SELECT * FROM accounts WHERE account_id = 1361"),
      note: "Balance restored to 3359.00.",
    }),
  },
  {
    file: "10_task8_explain_account_id.png",
    html: workbenchHtml({
      title: "Task 8 — EXPLAIN account_id",
      sql: "EXPLAIN SELECT * FROM transactions WHERE account_id = 1360;",
      resultRaw: ex("SELECT * FROM transactions WHERE account_id = 1360"),
    }),
    h: 480,
  },
  {
    file: "11_task9_explain_before_index.png",
    html: workbenchHtml({
      title: "Task 9 — EXPLAIN Deposit (before index)",
      sql: "EXPLAIN SELECT * FROM transactions WHERE transaction_type = 'Deposit';",
      resultRaw: ex("SELECT * FROM transactions WHERE transaction_type = 'Deposit'"),
      note: "type=ALL, key=NULL, rows=8 — full table scan.",
    }),
    h: 500,
  },
];

mysqlExec(
  `USE ${DB}; CREATE INDEX idx_type_${STUDENT} ON transactions(transaction_type);`
);

shots.push(
  {
    file: "12_task10_explain_after_type_index.png",
    html: workbenchHtml({
      title: "Task 10 — After idx_type_02250359",
      sql: `CREATE INDEX idx_type_${STUDENT} ON transactions(transaction_type);`,
      resultRaw: ex("SELECT * FROM transactions WHERE transaction_type = 'Deposit'"),
      note: "key=idx_type_02250359, type=ref, rows=4.",
    }),
    h: 520,
  },
  {
    file: "13_task11_explain_before_composite.png",
    html: workbenchHtml({
      title: "Task 11 — Before composite index",
      sql: "EXPLAIN ... WHERE account_id = 1360 AND transaction_type = 'Deposit';",
      resultRaw: ex(
        "SELECT * FROM transactions WHERE account_id = 1360 AND transaction_type = 'Deposit'"
      ),
    }),
    h: 500,
  }
);

mysqlExec(
  `USE ${DB}; CREATE INDEX idx_account_type_${STUDENT} ON transactions(account_id, transaction_type);`
);

shots.push(
  {
    file: "14_task11_explain_after_composite.png",
    html: workbenchHtml({
      title: "Task 11 — After idx_account_type_02250359",
      resultRaw: ex(
        "SELECT * FROM transactions WHERE account_id = 1360 AND transaction_type = 'Deposit'"
      ),
      note: "Composite index: key=idx_account_type_02250359, rows=1.",
    }),
    h: 500,
  },
  {
    file: "15_task12_query_a.png",
    html: workbenchHtml({
      title: "Task 12 — Query A",
      sql: "EXPLAIN SELECT * FROM transactions WHERE account_id = 1360;",
      resultRaw: ex("SELECT * FROM transactions WHERE account_id = 1360"),
    }),
    h: 480,
  },
  {
    file: "16_task12_query_b.png",
    html: workbenchHtml({
      title: "Task 12 — Query B",
      sql: "EXPLAIN SELECT transaction_id, transaction_type, amount FROM transactions WHERE account_id = 1360;",
      resultRaw: ex(
        "SELECT transaction_id, transaction_type, amount FROM transactions WHERE account_id = 1360"
      ),
      note: "Query B preferred — fewer columns returned.",
    }),
    h: 480,
  }
);

mysqlExec(`USE ${DB}; CREATE INDEX idx_date_${STUDENT} ON transactions(transaction_date);`);

shots.push(
  {
    file: "17_task13_date_function.png",
    html: workbenchHtml({
      title: "Task 13 — DATE() function (inefficient)",
      sql: "EXPLAIN SELECT * FROM transactions WHERE DATE(transaction_date) = '2026-05-01';",
      resultRaw: ex(
        "SELECT * FROM transactions WHERE DATE(transaction_date) = '2026-05-01'"
      ),
      note: "type=ALL, key=NULL — index not used.",
    }),
    h: 500,
  },
  {
    file: "18_task13_date_range.png",
    html: workbenchHtml({
      title: "Task 13 — Date range (efficient)",
      sql: "EXPLAIN SELECT * FROM transactions\nWHERE transaction_date >= '2026-05-01 00:00:00'\n  AND transaction_date < '2026-05-02 00:00:00';",
      resultRaw: ex(
        "SELECT * FROM transactions WHERE transaction_date >= '2026-05-01 00:00:00' AND transaction_date < '2026-05-02 00:00:00'"
      ),
      note: "type=range, key=idx_date_02250359.",
    }),
    h: 520,
  }
);

// Fix accidental div tags -> div
function fixHtml(h) {
  return h.replace(/<\/?div/g, (m) => m.replace("div", "div"));
}

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

for (const s of shots) {
  const html = fixHtml(s.html).replace(/div/g, "div");
  const tmp = join(OUT, "_tmp.html");
  writeFileSync(tmp, html);
  await page.setViewportSize({ width: s.w || 1100, height: s.h || 640 });
  await page.goto(`file://${tmp}`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(OUT, s.file), fullPage: true });
  rmSync(tmp);
  console.log("Wrote", s.file);
}

await browser.close();
console.log(`\n${shots.length} screenshots saved to:\n${OUT}`);
