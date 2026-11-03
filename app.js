/* ===== مصروفي — منطق التطبيق (جافاسكربت خام، بدون مكتبات) ===== */
(() => {
'use strict';

const KEY = 'masroofi:v2';
const APP_VERSION = '2.0.0';

/* ---------- التصنيفات ---------- */
const CATS = [
  { id: 'bills',         name: 'فواتير',  color: '#eab308' },
  { id: 'food',          name: 'طعام',    color: '#fb923c' },
  { id: 'transport',     name: 'مواصلات', color: '#38bdf8' },
  { id: 'entertainment', name: 'ترفيه',   color: '#a78bfa' },
  { id: 'shopping',      name: 'تسوق',    color: '#f472b6' },
  { id: 'health',        name: 'صحة',     color: '#34d399' },
  { id: 'education',     name: 'تعليم',   color: '#60a5fa' },
  { id: 'other',         name: 'أخرى',    color: '#94a3b8' }
];
const catOf = id => CATS.find(c => c.id === id) || CATS[CATS.length - 1];

/* ---------- الأيقونات ---------- */
const ICONS = {
  wallet: '<rect x="3.5" y="5.5" width="17" height="14" rx="3"/><path d="M3.5 9.5h13"/><rect x="15" y="11.5" width="6.5" height="4" rx="2"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M12 7.5v9M14.5 9.5c-.4-.8-1.4-1-2.5-1-1.3 0-2.3.6-2.3 1.6 0 2.2 4.8 1 4.8 3.2 0 1-1 1.6-2.5 1.6-1.1 0-2.1-.3-2.5-1.1"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 8H4c0-1 2-2 2-8z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.6-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  shield: '<path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  chevron: '<path d="m15 6-6 6 6 6"/>',
  inflow: '<path d="M17 7 7 17M17 17H7V7"/>',
  outflow: '<path d="M7 17 17 7M7 7h10v10"/>',
  down: '<path d="m3 7 6 6 4-4 8 8"/><path d="M21 11v6h-6"/>',
  up: '<path d="m3 17 6-6 4 4 8-8"/><path d="M21 13V7h-6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4M5 14v6h14v-6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 4v7h-7"/>',
  arrow: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
};
const ic = (n, s = 22, w = 2) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- أدوات مساعدة ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const AR = '٠١٢٣٤٥٦٧٨٩';
const toAr = s => String(s).replace(/\d/g, d => AR[d]);
const toEn = s => String(s).replace(/[٠-٩]/g, d => AR.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
const fmt = n => {
  const v = Math.round(Math.abs(n) * 100) / 100;
  const [i, d] = v.toString().split('.');
  return toAr(i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + (d ? '٫' + toAr(d) : '');
};
const signed = n => (n < 0 ? '-' : '') + fmt(n);
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const pad = n => String(n).padStart(2, '0');
const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = s => {
  const [y, m, d] = String(s).split('-').map(Number);
  return m ? `${toAr(d)} ${MONTHS[m - 1]}، ${toAr(y)}` : s;
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const sum = arr => arr.reduce((a, b) => a + b.amount, 0);
const parseAmount = s => {
  const v = parseFloat(toEn(s).replace(/[٫]/g, '.').replace(/[٬,\s]/g, ''));
  return isFinite(v) ? v : NaN;
};
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------- الحالة والتخزين ---------- */
const DEFAULT = {
  v: 2, onboarded: false,
  income: [], expenses: [], goals: [], contributions: [], challenges: [],
  settings: { dark: false, notify: false, accent: 'teal', lastNotified: '' }
};
function load() {
  try {
    const r = JSON.parse(localStorage.getItem(KEY));
    if (r && typeof r === 'object') {
      return { ...clone(DEFAULT), ...r, settings: { ...DEFAULT.settings, ...(r.settings || {}) } };
    }
  } catch (e) { /* تجاهل */ }
  return clone(DEFAULT);
}
let S = load();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('تعذّر حفظ البيانات: مساحة التخزين ممتلئة أو معطّلة'); }
}

/* ---------- تنبيه سريع ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- المظهر ---------- */
const ACCENT_COLORS = { rose: '#f43f5e', amber: '#f59e0b', teal: '#14b8a6' };
function applyTheme() {
  const root = document.documentElement;
  root.dataset.theme = S.settings.dark ? 'dark' : 'light';
  root.dataset.accent = S.settings.accent;
  updateThemeColor();
}
function updateThemeColor() {
  const meta = $('meta[name="theme-color"]');
  if (!meta) return;
  const welcome = !$('#welcome').hidden;
  meta.content = welcome ? '#0d9488' : (S.settings.dark ? '#0f1729' : '#ffffff');
}

/* ---------- الحسابات ---------- */
const totals = () => {
  const inc = sum(S.income), exp = sum(S.expenses);
  return { inc, exp, bal: inc - exp };
};

/* ---------- التحديات ---------- */
const SUGGESTED = [
  { type: 'save', amount: 20, days: 7 },
  { type: 'save', amount: 50, days: 7 },
  { type: 'save', amount: 100, days: 7 },
  { type: 'nospend', category: 'entertainment', days: 3 }
];
function challengeTitle(c) {
  if (c.type === 'save') {
    return `وفّر ${fmt(c.amount)} ريال ${c.days === 7 ? 'هذا الأسبوع' : `خلال ${toAr(c.days)} ${c.days <= 10 ? 'أيام' : 'يوماً'}`}`;
  }
  const cat = catOf(c.category).name;
  return `لا تنفق على ${cat === 'ترفيه' ? 'الترفيه' : cat} ${toAr(c.days)} ${c.days <= 10 ? 'أيام' : 'يوماً'}`;
}
function progressOf(c) {
  const now = Date.now(), end = c.startTs + c.days * 864e5;
  const left = Math.max(0, Math.ceil((end - now) / 864e5));
  if (c.type === 'save') {
    const got = S.contributions.filter(x => x.ts >= c.startTs).reduce((a, b) => a + b.amount, 0);
    return {
      ratio: Math.min(got / c.amount, 1), done: got >= c.amount, failed: now > end && got < c.amount, left,
      label: `${fmt(Math.min(got, c.amount))} / ${fmt(c.amount)} ر.س`
    };
  }
  const broke = S.expenses.some(e => e.category === c.category && e.date >= c.startDay);
  const elapsed = Math.min(Math.floor((now - c.startTs) / 864e5), c.days);
  return {
    ratio: broke ? 0 : elapsed / c.days, done: !broke && now >= end, failed: broke, left,
    label: broke ? 'تم الإنفاق على هذا التصنيف' : `${toAr(elapsed)} / ${toAr(c.days)} أيام`
  };
}
function evalChallenges() {
  let changed = false;
  S.challenges.forEach(c => {
    if (c.status !== 'active') return;
    const p = progressOf(c);
    if (p.done) { c.status = 'completed'; c.endedAt = Date.now(); changed = true; toast('🏆 أحسنت! أكملت التحدي'); }
    else if (p.failed) { c.status = 'failed'; c.endedAt = Date.now(); changed = true; }
  });
  if (changed) save();
}
function startChallenge(def) {
  const now = new Date();
  const c = { id: uid(), startTs: now.getTime(), startDay: dayStr(now), status: 'active', ...def };
  c.title = challengeTitle(c);
  S.challenges.unshift(c);
  save();
}

/* ---------- القوالب ---------- */
function expenseRow(e, withDelete) {
  const c = catOf(e.category);
  return `<div class="exp-row">
    <span class="badge" style="--c:${c.color}">${c.name}</span>
    <div class="grow">
      <div class="amt num">${fmt(e.amount)} <small>ر.س</small></div>
      <div class="dt">${fmtDate(e.date)}</div>
      ${e.note ? `<div class="note">${esc(e.note)}</div>` : ''}
    </div>
    ${withDelete ? `<button class="icon-btn del" data-act="del-expense" data-id="${e.id}" aria-label="حذف المصروف">${ic('trash', 20)}</button>` : ''}
  </div>`;
}
const byDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || '');

const VIEWS = {
  home() {
    const t = totals(), neg = t.bal < 0;
    const recent = [...S.expenses].sort(byDateDesc).slice(0, 5);
    const activeGoals = S.goals.filter(g => g.saved < g.target).length;
    const activeCh = S.challenges.filter(c => c.status === 'active').length;
    return `
    <section class="balance-card">
      <div class="bal-top"><span>${ic('wallet', 20)}</span><span>المبلغ المتوفر</span></div>
      <div class="bal-amount"><b class="num ltr">${signed(t.bal)}</b><small>ر.س</small></div>
      <div class="bal-sub">
        <div><div class="l">${ic('inflow', 16)} الدخل</div><b class="num">${fmt(t.inc)}</b></div>
        <div><div class="l">${ic('outflow', 16)} المصروفات</div><b class="num">${fmt(t.exp)}</b></div>
      </div>
    </section>

    <section class="card remain" style="margin-top:14px">
      <span class="ibox ${neg ? 'red' : 'green'}">${ic(neg ? 'down' : 'up', 22)}</span>
      <div class="tx"><span>المبلغ المتبقي</span><b class="num ${neg ? 'neg' : 'pos'}">${fmt(t.bal)} ر.س</b></div>
      <span class="pill ${neg ? 'bad' : 'good'}">${ic(neg ? 'x' : 'trophy', 14, 2.4)} ${neg ? 'عجز' : 'فائض'}</span>
    </section>

    <div class="grid2">
      <button class="card act exp" data-act="add-expense"><span class="ibox red">${ic('plus', 20)}</span>إضافة مصروف</button>
      <button class="card act inc" data-act="add-income"><span class="ibox green">${ic('plus', 20)}</span>إضافة دخل</button>
    </div>

    <div class="grid2">
      <button class="card stat" data-act="go" data-val="goals">
        <div class="stat-top"><span class="ibox teal">${ic('target', 22)}</span><span>${toAr(activeGoals)} نشط</span></div>
        <b>أهداف الادخار</b>
      </button>
      <button class="card stat" data-act="go" data-val="challenges">
        <div class="stat-top"><span class="ibox amber">${ic('trophy', 22)}</span><span>${toAr(activeCh)} نشط</span></div>
        <b>تحديات الادخار</b>
      </button>
    </div>

    <section class="card">
      <div class="sec-head"><h2>أحدث المصروفات</h2>${recent.length ? `<button class="link" data-act="go" data-val="expenses">عرض الكل</button>` : ''}</div>
      ${recent.length ? recent.map(e => expenseRow(e, false)).join('') : '<p class="empty">لم تسجّل أي مصروف بعد. اضغط «إضافة مصروف» للبدء.</p>'}
    </section>`;
  },

  expenses() {
    const t = totals().exp;
    const byCat = CATS.map(c => ({ ...c, total: sum(S.expenses.filter(e => e.category === c.id)) }))
      .filter(c => c.total > 0).sort((a, b) => b.total - a.total);
    const list = [...S.expenses].sort(byDateDesc);
    return `
    <section class="card">
      <h2>توزيع المصروفات</h2>
      <p class="sub" style="margin-bottom:16px">حسب التصنيف</p>
      ${byCat.length ? byCat.map(c => {
        const pct = Math.round(c.total / t * 100);
        return `<div class="dist-row" style="--c:${c.color}">
          <div class="dist-top"><span>${c.name}</span><span class="num">${fmt(c.total)} ر.س · <span class="ltr">${toAr(pct)}%</span></span></div>
          <div class="bar"><i style="width:${pct}%"></i></div></div>`;
      }).join('') : '<p class="empty">لا توجد مصروفات لعرض توزيعها.</p>'}
      <div class="total-row"><span>الإجمالي</span><b class="num">${fmt(t)} ر.س</b></div>
    </section>

    <section class="card">
      <h2>كل المصروفات</h2>
      <p class="sub" style="margin-bottom:6px">${toAr(list.length)} مصروف</p>
      ${list.length ? list.map(e => expenseRow(e, true)).join('') : '<p class="empty">لا توجد مصروفات بعد.</p>'}
    </section>`;
  },

  goals() {
    return `
    <div class="page-head">
      <div><h2>أهداف الادخار</h2><p class="sub">خطط لتحقيق أحلامك</p></div>
      <button class="btn primary" data-act="goal-new">${ic('plus', 18)} هدف جديد</button>
    </div>
    ${S.goals.length ? S.goals.map(g => {
      const pct = Math.min(100, Math.floor(g.saved / g.target * 100));
      const left = Math.max(0, g.target - g.saved);
      return `<article class="card goal ${g.saved >= g.target ? 'done' : ''}">
        <div class="goal-head">
          <span class="ibox teal">${ic('target', 22)}</span>
          <h3>${esc(g.name)}</h3>
          <div class="goal-tools">
            <button class="icon-btn" data-act="goal-edit" data-id="${g.id}" aria-label="تعديل الهدف">${ic('pencil', 19)}</button>
            <button class="icon-btn del" data-act="goal-del" data-id="${g.id}" aria-label="حذف الهدف">${ic('trash', 19)}</button>
          </div>
        </div>
        <div class="goal-line"><span class="num">${fmt(g.saved)} / ${fmt(g.target)} ر.س</span><span class="pct num ltr">${toAr(pct)}%</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="goal-foot">
          <span class="num">المتبقي: ${fmt(left)} ر.س</span>
          <div class="quick">
            <button data-act="goal-add" data-id="${g.id}" data-val="10"><span class="ltr">+10</span></button>
            <button data-act="goal-add" data-id="${g.id}" data-val="50"><span class="ltr">+50</span></button>
            <button data-act="goal-add" data-id="${g.id}" data-val="100"><span class="ltr">+100</span></button>
            <button data-act="goal-custom" data-id="${g.id}" aria-label="مبلغ آخر">${ic('plus', 16, 2.6)}</button>
          </div>
        </div>
      </article>`;
    }).join('') : `<section class="card"><p class="empty">لا توجد أهداف بعد.<br>أضف هدفك الأول مثل «شراء هاتف» وابدأ الادخار.</p></section>`}`;
  },

  challenges() {
    const done = S.challenges.filter(c => c.status === 'completed').length;
    const active = S.challenges.filter(c => c.status === 'active');
    const past = S.challenges.filter(c => c.status !== 'active');
    const chCard = c => {
      const p = progressOf(c);
      const tag = c.status === 'completed' ? '<span class="tag ok">مكتمل</span>' : c.status === 'failed' ? '<span class="tag no">لم يكتمل</span>' : '';
      return `<article class="card ch ${c.status}">
        <div class="ch-top">
          <span class="ibox amber">${ic(c.status === 'completed' ? 'trophy' : 'bolt', 20)}</span>
          <h3>${esc(c.title)}</h3>${tag}
          <button class="icon-btn del" data-act="ch-del" data-id="${c.id}" aria-label="حذف التحدي">${ic('trash', 19)}</button>
        </div>
        <div class="bar"><i style="width:${Math.round((c.status === 'completed' ? 1 : p.ratio) * 100)}%"></i></div>
        <div class="ch-meta"><span class="num">${p.label}</span>${c.status === 'active' ? `<span class="num">متبقٍ ${toAr(p.left)} ${p.left > 10 || p.left === 0 ? 'يوم' : 'أيام'}</span>` : ''}</div>
      </article>`;
    };
    return `
    <div class="page-head">
      <div><h2>تحديات الادخار</h2><p class="sub">تحدّ نفسك ووفّر أكثر</p></div>
      <button class="btn amber" data-act="ch-new">${ic('plus', 18)} تحدي جديد</button>
    </div>
    <section class="hero-ch">
      <span class="trophy">${ic('trophy', 34)}</span>
      <div><b class="num">${toAr(done)}</b><span>تحديات مكتملة</span></div>
    </section>
    ${active.length ? `<h3 class="h-sub">تحدياتك الحالية</h3>${active.map(chCard).join('')}` : ''}
    <section class="card" style="margin-top:14px">
      <h2 style="margin-bottom:14px;font-size:15px">تحديات مقترحة</h2>
      ${SUGGESTED.map((s, i) => `<button class="sugg" data-act="ch-suggest" data-val="${i}">
        ${ic('bolt', 20)}<span>${challengeTitle(s)}</span><span class="sp"></span>${ic('plus', 18)}</button>`).join('')}
    </section>
    ${past.length ? `<h3 class="h-sub">السجل</h3>${past.map(chCard).join('')}` : ''}`;
  },

  settings() {
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    const sw = (act, on, label) => `<button class="switch" role="switch" aria-checked="${on}" aria-label="${label}" data-act="${act}"></button>`;
    return `
    <div class="page-head"><div><h2>الإعدادات</h2><p class="sub">تخصيص التطبيق</p></div></div>

    <section class="card set-card">
      <h2 class="set-title" style="padding-top:12px">التفضيلات</h2>
      <div class="row"><span class="ibox amber">${ic('bell', 22)}</span><div class="tx"><b>تنبيهات التوفير</b><span>تذكير يومي للمتابعة</span></div>${sw('toggle-notify', S.settings.notify, 'تنبيهات التوفير')}</div>
      <div class="row"><span class="ibox indigo">${ic('moon', 22)}</span><div class="tx"><b>الوضع الليلي</b><span>مظهر داكن للتطبيق</span></div>${sw('toggle-dark', S.settings.dark, 'الوضع الليلي')}</div>
      <button class="row" data-act="lang"><span class="ibox blue">${ic('globe', 22)}</span><div class="tx"><b>اللغة</b><span>عربية</span></div><span class="chev">${ic('chevron', 20)}</span></button>
      <div class="row"><span class="ibox teal">${ic('palette', 22)}</span><div class="tx"><b>المظهر</b><span>ألوان هادئة</span></div>
        <div class="dots">${Object.entries(ACCENT_COLORS).map(([k, c]) => `<button class="dot" style="--c:${c}" data-act="accent" data-val="${k}" aria-label="لون ${k === 'rose' ? 'أحمر' : k === 'amber' ? 'برتقالي' : 'أخضر مزرق'}" aria-pressed="${S.settings.accent === k}"></button>`).join('')}</div>
      </div>
    </section>

    <section class="card set-card">
      <h2 class="set-title" style="padding-top:12px">حول التطبيق</h2>
      ${standalone ? '' : `<button class="row" data-act="install"><span class="ibox teal">${ic('download', 22)}</span><div class="tx"><b>تثبيت التطبيق</b><span>أضفه إلى الشاشة الرئيسية</span></div><span class="chev">${ic('chevron', 20)}</span></button>`}
      <div class="row"><span class="ibox slate">${ic('info', 22)}</span><div class="tx"><b>الإصدار</b><span class="ltr">${APP_VERSION}</span></div></div>
      <div class="row"><span class="ibox green">${ic('shield', 22)}</span><div class="tx"><b>الخصوصية</b><span>بياناتك محفوظة بأمان على جهازك فقط</span></div></div>
    </section>

    <section class="card set-card">
      <h2 class="set-title" style="padding-top:12px">البيانات</h2>
      <button class="row" data-act="export"><span class="ibox blue">${ic('share', 22)}</span><div class="tx"><b>تصدير نسخة احتياطية</b><span>ملف JSON على جهازك</span></div></button>
      <button class="row" data-act="demo"><span class="ibox amber">${ic('receipt', 22)}</span><div class="tx"><b>تحميل بيانات تجريبية</b><span>لاستعراض شكل التطبيق</span></div></button>
      <button class="row" data-act="reset"><span class="ibox red">${ic('refresh', 22)}</span><div class="tx"><b style="color:var(--danger)">مسح كل البيانات</b><span>لا يمكن التراجع عن هذا الإجراء</span></div></button>
    </section>
    <p class="ver">مصروفي · الإصدار <span class="ltr">${APP_VERSION}</span></p>`;
  }
};

/* ---------- التوجيه والعرض ---------- */
const TABS = [
  ['home', 'الرئيسية', 'home'], ['expenses', 'المصروفات', 'receipt'], ['goals', 'الأهداف', 'target'],
  ['challenges', 'التحديات', 'trophy'], ['settings', 'الإعدادات', 'gear']
];
let currentView = 'home';

function route() {
  let r = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
  if (r === 'add-expense' || r === 'add-income') {
    history.replaceState(null, '', '#/home');
    paint('home');
    r === 'add-expense' ? openExpense() : openIncome();
    return;
  }
  paint(VIEWS[r] ? r : 'home');
}
function paint(name, keepScroll) {
  evalChallenges();
  currentView = name;
  const y = window.scrollY;
  $('#view').innerHTML = VIEWS[name]();
  $('#tabbar').innerHTML = TABS.map(([id, label, icon]) =>
    `<a class="tab ${id === name ? 'active' : ''}" href="#/${id}" ${id === name ? 'aria-current="page"' : ''}><span class="t-ico">${ic(icon, 22)}</span>${label}</a>`).join('');
  window.scrollTo(0, keepScroll ? y : 0);
}
const refresh = () => paint(currentView, true);

function showApp() {
  const onboarded = S.onboarded;
  $('#welcome').hidden = onboarded;
  $('#shell').hidden = !onboarded;
  updateThemeColor();
  if (onboarded) route();
}

/* ---------- النوافذ السفلية ---------- */
let sheetEl = null;
function closeSheet() { if (sheetEl) { sheetEl.remove(); sheetEl = null; } }
function openSheet({ title, body, submitLabel, onSubmit, onOpen }) {
  closeSheet();
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="sheet-head"><h3>${esc(title)}</h3><button type="button" class="icon-btn" data-close aria-label="إغلاق">${ic('x', 22)}</button></div>
    <form novalidate>${body}<button class="btn primary block" type="submit">${esc(submitLabel)}</button></form></div>`;
  wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) closeSheet(); });
  const form = $('form', wrap);
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    if (onSubmit(Object.fromEntries(new FormData(form))) !== false) closeSheet();
  });
  document.getElementById('app').appendChild(wrap);
  sheetEl = wrap;
  if (onOpen) onOpen(form);
  setTimeout(() => { const f = form.querySelector('input[type=text]'); if (f) f.focus(); }, 60);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

const amountField = (label = 'المبلغ (ر.س)', value = '') =>
  `<label class="field"><span>${label}</span><input name="amount" type="text" inputmode="decimal" autocomplete="off" placeholder="٠" value="${value}" required></label>`;
const catChips = (sel = CATS[0].id) => `<div class="field"><span>التصنيف</span><div class="chips">${CATS.map(c =>
  `<label class="chip-opt" style="--c:${c.color}"><input type="radio" name="category" value="${c.id}" ${c.id === sel ? 'checked' : ''}><span>${c.name}</span></label>`).join('')}</div></div>`;

function readAmount(d) {
  const a = parseAmount(d.amount);
  if (!(a > 0)) { toast('أدخل مبلغاً صحيحاً أكبر من صفر'); return null; }
  return a;
}

function openExpense() {
  openSheet({
    title: 'إضافة مصروف', submitLabel: 'حفظ المصروف',
    body: amountField() + catChips() +
      `<label class="field"><span>التاريخ</span><input name="date" type="date" value="${dayStr()}"></label>
       <label class="field"><span>ملاحظة (اختياري)</span><input name="note" type="text" maxlength="60" placeholder="مثال: فاتورة الكهرباء"></label>`,
    onSubmit(d) {
      const a = readAmount(d); if (a === null) return false;
      S.expenses.push({ id: uid(), amount: a, category: d.category || 'other', date: d.date || dayStr(), note: (d.note || '').trim() });
      save(); evalChallenges(); refresh(); toast('تمت إضافة المصروف');
    }
  });
}
function openIncome() {
  openSheet({
    title: 'إضافة دخل', submitLabel: 'حفظ الدخل',
    body: amountField() +
      `<label class="field"><span>التاريخ</span><input name="date" type="date" value="${dayStr()}"></label>
       <label class="field"><span>المصدر (اختياري)</span><input name="note" type="text" maxlength="60" placeholder="مثال: راتب، مكافأة"></label>`,
    onSubmit(d) {
      const a = readAmount(d); if (a === null) return false;
      S.income.push({ id: uid(), amount: a, date: d.date || dayStr(), note: (d.note || '').trim() });
      save(); refresh(); toast('تمت إضافة الدخل');
    }
  });
}
function openGoal(g) {
  openSheet({
    title: g ? 'تعديل الهدف' : 'هدف جديد', submitLabel: g ? 'حفظ التعديل' : 'إضافة الهدف',
    body: `<label class="field"><span>اسم الهدف</span><input name="name" type="text" maxlength="40" value="${g ? esc(g.name) : ''}" placeholder="مثال: شراء هاتف" required></label>` +
      amountField('المبلغ المستهدف (ر.س)', g ? g.target : ''),
    onSubmit(d) {
      const name = (d.name || '').trim();
      const a = readAmount(d); if (a === null) return false;
      if (!name) { toast('اكتب اسماً للهدف'); return false; }
      if (g) { g.name = name; g.target = a; }
      else S.goals.unshift({ id: uid(), name, target: a, saved: 0 });
      save(); refresh(); toast(g ? 'تم تعديل الهدف' : 'تمت إضافة الهدف');
    }
  });
}
function addToGoal(id, amount) {
  const g = S.goals.find(x => x.id === id); if (!g) return;
  const was = g.saved >= g.target;
  g.saved += amount;
  S.contributions.push({ id: uid(), goalId: id, amount, ts: Date.now() });
  save();
  const challengeBefore = S.challenges.filter(c => c.status === 'completed').length;
  evalChallenges(); refresh();
  const challengeAfter = S.challenges.filter(c => c.status === 'completed').length;
  if (!was && g.saved >= g.target) toast('🎉 مبروك! تحقق هدفك');
  else if (challengeAfter === challengeBefore) toast(`تمت إضافة ${fmt(amount)} ر.س إلى «${g.name}»`);
}
function openChallenge() {
  openSheet({
    title: 'تحدي جديد', submitLabel: 'ابدأ التحدي',
    body: `<div class="field"><span>نوع التحدي</span><div class="chips">
        <label class="chip-opt" style="--c:#f59e0b"><input type="radio" name="type" value="save" checked><span>ادخار مبلغ</span></label>
        <label class="chip-opt" style="--c:#f59e0b"><input type="radio" name="type" value="nospend"><span>امتناع عن الإنفاق</span></label></div></div>
      <div data-for="save">${amountField('المبلغ المطلوب ادخاره (ر.س)')}<p class="hint">يُحتسب من المبالغ التي تضيفها إلى أهدافك خلال مدة التحدي.</p></div>
      <div data-for="nospend" hidden><label class="field"><span>التصنيف</span><select name="category">${CATS.map(c => `<option value="${c.id}" ${c.id === 'entertainment' ? 'selected' : ''}>${c.name}</option>`).join('')}</select></label></div>
      <label class="field"><span>المدة (بالأيام)</span><input name="days" type="text" inputmode="numeric" value="${toAr(7)}"></label>`,
    onOpen(form) {
      const sync = () => {
        const t = form.type.value;
        form.querySelectorAll('[data-for]').forEach(el => { el.hidden = el.dataset.for !== t; });
        form.querySelector('[data-for="save"] input').required = t === 'save';
      };
      form.addEventListener('change', sync); sync();
    },
    onSubmit(d) {
      const days = Math.round(parseAmount(d.days));
      if (!(days >= 1 && days <= 365)) { toast('المدة يجب أن تكون بين ١ و٣٦٥ يوماً'); return false; }
      if (d.type === 'nospend') startChallenge({ type: 'nospend', category: d.category, days });
      else { const a = readAmount(d); if (a === null) return false; startChallenge({ type: 'save', amount: a, days }); }
      refresh(); toast('بدأ التحدي، بالتوفيق!');
    }
  });
}

/* ---------- التثبيت والإشعارات ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; });
window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('تم تثبيت التطبيق'); if (currentView === 'settings') refresh(); });

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => {});
    deferredPrompt = null;
    return;
  }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  openSheet({
    title: 'تثبيت التطبيق', submitLabel: 'حسناً',
    body: `<p style="line-height:1.9;margin-bottom:14px">${ios
      ? 'في سفاري: اضغط زر <b>المشاركة</b> ثم اختر <b>إضافة إلى الشاشة الرئيسية</b>.'
      : 'من قائمة المتصفح (⋮) اختر <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.'}</p>`,
    onSubmit() {}
  });
}
async function toggleNotify() {
  if (!S.settings.notify) {
    if (!('Notification' in window)) { toast('متصفحك لا يدعم التنبيهات'); return; }
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (perm !== 'granted') { toast('لم يتم السماح بالتنبيهات من إعدادات المتصفح'); return; }
    S.settings.notify = true;
    toast('تم تفعيل تذكير التوفير');
  } else S.settings.notify = false;
  save(); refresh();
}
async function maybeRemind() {
  try {
    if (!S.settings.notify || !('Notification' in window) || Notification.permission !== 'granted') return;
    const t = dayStr();
    if (S.settings.lastNotified === t || S.expenses.some(e => e.date === t)) return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    await reg.showNotification('مصروفي', { body: 'لا تنسَ تسجيل مصروفاتك اليوم 💰', icon: 'icons/icon-192.png', badge: 'icons/favicon-32.png', lang: 'ar', dir: 'rtl' });
    S.settings.lastNotified = t; save();
  } catch (e) { /* تجاهل */ }
}

/* ---------- بيانات تجريبية / تصدير / مسح ---------- */
function loadDemo() {
  if ((S.expenses.length || S.goals.length || S.income.length) && !confirm('سيتم استبدال بياناتك الحالية ببيانات تجريبية. هل تريد المتابعة؟')) return;
  S.income = []; S.contributions = []; S.challenges = [];
  S.expenses = [{ id: uid(), amount: 2000, category: 'bills', date: '2026-10-07', note: '' }];
  S.goals = [
    { id: uid(), name: 'شراء هاتف', target: 5000, saved: 0 },
    { id: uid(), name: 'هدف الادخار', target: 20000, saved: 0 }
  ];
  save(); refresh(); toast('تم تحميل البيانات التجريبية');
}
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `masroofi-backup-${dayStr()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- الأحداث ---------- */
const ACTIONS = {
  go: (_, v) => { location.hash = '#/' + v; },
  'add-expense': openExpense,
  'add-income': openIncome,
  'del-expense': id => { if (confirm('حذف هذا المصروف؟')) { S.expenses = S.expenses.filter(e => e.id !== id); save(); refresh(); } },
  'goal-new': () => openGoal(),
  'goal-edit': id => openGoal(S.goals.find(g => g.id === id)),
  'goal-del': id => { if (confirm('حذف هذا الهدف؟')) { S.goals = S.goals.filter(g => g.id !== id); save(); refresh(); } },
  'goal-add': (id, v) => addToGoal(id, Number(v)),
  'goal-custom': id => openSheet({
    title: 'إضافة مبلغ للهدف', submitLabel: 'إضافة',
    body: amountField(),
    onSubmit(d) { const a = readAmount(d); if (a === null) return false; addToGoal(id, a); }
  }),
  'ch-suggest': (_, v) => { startChallenge({ ...SUGGESTED[Number(v)] }); refresh(); toast('بدأ التحدي، بالتوفيق!'); },
  'ch-new': openChallenge,
  'ch-del': id => { if (confirm('حذف هذا التحدي؟')) { S.challenges = S.challenges.filter(c => c.id !== id); save(); refresh(); } },
  'toggle-notify': toggleNotify,
  'toggle-dark': () => { S.settings.dark = !S.settings.dark; save(); applyTheme(); refresh(); },
  accent: (_, v) => { S.settings.accent = v; save(); applyTheme(); refresh(); },
  lang: () => toast('العربية هي اللغة المتاحة حالياً'),
  install: installApp,
  export: exportData,
  demo: loadDemo,
  reset: () => {
    if (!confirm('سيتم حذف جميع المصروفات والأهداف والتحديات نهائياً. هل أنت متأكد؟')) return;
    const settings = S.settings;
    S = { ...clone(DEFAULT), onboarded: true, settings };
    save(); refresh(); toast('تم مسح البيانات');
  }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) fn(el.dataset.id, el.dataset.val, el);
});
window.addEventListener('hashchange', () => { closeSheet(); if (S.onboarded) route(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.onboarded) { evalChallenges(); refresh(); maybeRemind(); }
});

/* ---------- الانطلاق ---------- */
function init() {
  $('#welcomeLogo').innerHTML = ic('wallet', 52, 1.8);
  $('#topLogo').innerHTML = ic('wallet', 24, 2);
  $('#startArrow').innerHTML = ic('arrow', 20, 2.4);
  $('#startBtn').addEventListener('click', () => {
    S.onboarded = true; save();
    if (!location.hash) location.hash = '#/home';
    showApp();
  });
  applyTheme();
  showApp();
  maybeRemind();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register('sw.js').catch(() => {});
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || reloaded || sheetEl) return;
        reloaded = true; location.reload();
      });
    });
  }
}
init();
})();
