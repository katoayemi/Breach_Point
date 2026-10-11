import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";

function SettingsDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog className="settings-dialog" ref={dialogRef} onClose={onClose}>
      <form method="dialog"><button className="dialog-close" aria-label="Close settings">×</button></form>
      <h2>Settings</h2>
      <label className="setting-row"><span>Threat alerts</span><input type="checkbox" defaultChecked /></label>
      <label className="setting-row"><span>Daily scan summary</span><input type="checkbox" defaultChecked /></label>
    </dialog>
  );
}

function Header({ active, onSettings }) {
  const links = [
    { label: "Home", href: "index.html#home", id: "home" },
    { label: "Scan", href: "scan.html", id: "scan" },
    { label: "Analyze", href: "analysis.html", id: "analysis" },
    { label: "History", href: "index.html#history", id: "history" },
  ];

  return (
    <header className="topbar">
      <a className="brand" href="index.html#home" aria-label="BreachPoint home"><span>Breach</span><strong>Point</strong></a>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.id} className={active === link.id ? "active" : undefined} href={link.href} aria-current={active === link.id ? "page" : undefined}>
            {link.label}
          </a>
        ))}
        <a href="#settings" onClick={(event) => { event.preventDefault(); onSettings(); }}>Settings</a>
      </nav>
      <span className="report-profile"><span className="avatar" aria-hidden="true">KA</span><span>Kato Aye</span></span>
    </header>
  );
}

function DashboardPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <Header active="home" onSettings={() => setSettingsOpen(true)} />
      <main id="home" className="dashboard">
        <svg className="wave-art" viewBox="0 0 1440 470" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="wave-color" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#00b8ca" stopOpacity=".28" />
              <stop offset=".42" stopColor="#04e8d0" stopOpacity=".92" />
              <stop offset=".72" stopColor="#16e89b" stopOpacity=".95" />
              <stop offset="1" stopColor="#00d993" stopOpacity=".48" />
            </linearGradient>
            <linearGradient id="wave-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0bd6c3" stopOpacity=".16" />
              <stop offset="1" stopColor="#00a67f" stopOpacity="0" />
            </linearGradient>
            <filter id="wave-glow" x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          <path className="wave-shape" d="M0 55 C120 125 185 210 310 214 C405 218 438 171 522 194 C603 216 617 322 760 315 C884 309 930 337 1012 308 C1121 270 1163 160 1280 90 C1348 49 1395 29 1440 17 L1440 370 C1321 389 1240 379 1158 351 C1067 319 1010 355 925 369 C824 385 750 351 665 380 C555 418 488 330 391 327 C271 324 219 386 106 359 C61 349 28 331 0 317 Z" />
          <path className="wave-glow" d="M0 211 C150 290 235 231 326 203 C405 178 440 179 513 217 C589 256 611 326 755 315 C859 306 921 337 1001 313 C1107 281 1169 183 1277 108 C1340 64 1393 42 1440 28" />
          <path className="wave-line main-wave" d="M0 211 C150 290 235 231 326 203 C405 178 440 179 513 217 C589 256 611 326 755 315 C859 306 921 337 1001 313 C1107 281 1169 183 1277 108 C1340 64 1393 42 1440 28" />
          <path className="wave-line" d="M0 234 C133 299 231 255 319 224 C411 191 455 198 526 241 C602 287 634 341 760 333 C868 326 921 356 1013 330 C1120 300 1177 207 1284 136 C1345 95 1393 72 1440 58" />
          <path className="wave-line faint-wave" d="M0 263 C131 320 226 279 318 246 C412 212 469 219 540 265 C617 315 654 360 766 355 C878 350 936 374 1024 349 C1129 319 1188 237 1295 170 C1350 135 1396 111 1440 95" />
          <path className="wave-line faint-wave" d="M0 298 C120 345 221 307 310 277 C408 243 467 248 544 293 C621 338 667 379 778 377 C883 375 945 395 1038 370 C1141 342 1200 270 1304 209 C1356 179 1400 155 1440 140" />
        </svg>
        <section className="scan-visual" aria-label="Daily link scan total">
          <svg className="gauge" viewBox="0 0 434 434" aria-hidden="true">
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0" stopColor="#0be8aa" />
                <stop offset="52%" stopColor="#13c7d4" />
                <stop offset="100%" stopColor="#08aee8" />
              </linearGradient>
            </defs>
            <circle className="gauge-outline outer" cx="217" cy="217" r="213" />
            <circle className="gauge-outline inner" cx="217" cy="217" r="174" />
            <circle className="gauge-progress" cx="217" cy="217" r="192" />
          </svg>
          <div className="gauge-value"><strong>365</strong><span>/ day</span></div>
          <p className="gauge-caption">Total Links Scanned</p>
        </section>
        <div className="dashboard-grid">
          <section className="risk-grid" aria-label="Threat levels">
            <article className="risk-card critical"><div className="risk-heading"><h2>Critical</h2><span className="trend-icon" aria-hidden="true">↗</span></div><div className="risk-value"><strong>89</strong><span>Link</span></div><span className="risk-change">+15%</span></article>
            <article className="risk-card high"><div className="risk-heading"><h2>High</h2><span className="trend-icon" aria-hidden="true">↗</span></div><div className="risk-value"><strong>95</strong><span>Link</span></div><span className="risk-change">+10%</span></article>
            <article className="risk-card medium"><div className="risk-heading"><h2>Medium</h2><span className="trend-icon" aria-hidden="true">↗</span></div><div className="risk-value"><strong>150</strong><span>Link</span></div></article>
          </section>
          <section className="summary-panel" id="history" aria-labelledby="summary-title">
            <h2 id="summary-title">Statistical Summary</h2>
            <div className="summary-list">
              <article className="summary-item"><span className="calendar-icon" aria-hidden="true">✓</span><div className="summary-copy"><strong>Daily Scanned</strong><small>Today, 11:30</small></div><span className="summary-total">0 Links</span></article>
              <article className="summary-item"><span className="calendar-icon" aria-hidden="true">✓</span><div className="summary-copy"><strong>Weekly Scanned</strong><small>Today, 11:30</small></div><span className="summary-total">0 Links</span></article>
              <article className="summary-item"><span className="calendar-icon" aria-hidden="true">✓</span><div className="summary-copy"><strong>Monthly Scanned</strong><small>Today, 11:30</small></div><span className="summary-total">0 Links</span></article>
            </div>
          </section>
        </div>
      </main>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function ScanPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <Header active="scan" onSettings={() => setSettingsOpen(true)} />
      <main className="scanner-page">
        <div className="scanner-content">
          <h1 id="scanner-title">Scan Link</h1>
          <div className="risk-meter" role="img" aria-label="Risk score 30 out of 100, unsafe">
            <div className="meter-arc"></div><div className="meter-needle"></div><div className="meter-hub"></div><span className="meter-status">Unsafe</span>
          </div>
          <div className="scan-form" aria-label="Scan a URL">
            <label className="visually-hidden" htmlFor="url-input">URL to scan</label>
            <div className="url-field"><input id="url-input" type="url" defaultValue="https://github.com/evan9908/Setup/raw/main/umr.exe" /><span className="search-symbol" aria-hidden="true">⌕</span></div>
            <button type="button">Scan URL <span aria-hidden="true">◎</span></button>
          </div>
          <section className="analysis-card" aria-labelledby="analysis-title">
            <div className="analysis-heading"><h2 id="analysis-title">Risk Analysis</h2></div><div className="analysis-alert" aria-hidden="true">▲</div>
            <dl className="analysis-list"><div><dt>Site Grade</dt><dd>F</dd></div><div><dt>Security Score</dt><dd>30 / 100</dd></div><div><dt>Synopsis</dt><dd>Malicious</dd></div></dl>
          </section>
        </div>
      </main>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

const categories = [
  { name: "Fake News", score: 0 },
  { name: "Scam Risk", score: 57 },
  { name: "Harassment", score: 0 },
  { name: "Manipulation", score: 57 },
];
const flags = ["Urgent language detected", "Suspicious link or click request", "Possible phishing attempt", "Emotional manipulation"];

function AnalysisPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <Header active="analysis" onSettings={() => setSettingsOpen(true)} />
      <main className="report-page">
        <div className="report-topline">
          <div><p className="report-eyebrow">Sample analysis</p><h1>Safety Report</h1></div>
          <div className="report-actions"><button className="share-button" type="button">Share</button><a className="analyze-button" href="scan.html">Analyze Again</a></div>
        </div>
        <section className="assessment-panel" aria-labelledby="assessment-title">
          <div className="trust-score" role="img" aria-label="Sample trust score 48 out of 100"><div className="trust-score-ring"><strong>48</strong><span>TRUST SCORE</span></div></div>
          <div className="assessment-copy">
            <div className="assessment-tags"><span className="severity-tag">High</span><span className="category-tag">Scam / Phishing / Emotional Manipulation</span></div>
            <h2 id="assessment-title">Risk Assessment</h2>
            <p className="assessment-intro">Based on AI analysis of your submitted content, here's what we found.</p>
            <div className="content-preview"><span>ANALYZED CONTENT PREVIEW</span><p>URGENT: Your bank account has been temporarily suspended due to suspicious activity. To restore access, click this link immediately: example.invalid/verify and enter your banking credentials within 24 hours or your account may be permanently closed.</p></div>
          </div>
        </section>
        <section className="category-grid" aria-label="Risk category scores">
          {categories.map(({ name, score }) => <article className="category-card" key={name}><div><span>{name}</span><strong>{score}</strong></div><span className="category-track"><span style={{ "--score": `${score}%` }}></span></span></article>)}
        </section>
        <section className="detected-panel" aria-labelledby="detected-title">
          <h2 id="detected-title">Detected Flags</h2><ul className="flag-list">{flags.map((flag) => <li key={flag}>{flag}</li>)}</ul>
        </section>
      </main>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function App() {
  const page = document.getElementById("root")?.dataset.page;
  if (page === "scan") return <ScanPage />;
  if (page === "analysis") return <AnalysisPage />;
  return <DashboardPage />;
}

createRoot(document.getElementById("root")).render(<App />);
