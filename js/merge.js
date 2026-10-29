/* Generated from api/_lib/merge.js — edit that file, then keep this in sync. */
(function(){
// Merges two copies of a student's data (for example phone and laptop) without losing work.
// Browser copy of api/_lib/merge.js (same logic). test/merge.test.mjs checks both.

function lww(a, b) {
  // Maps of id -> signed timestamp: positive = on, negative = off. Latest change wins.
  const out = { ...(a || {}) };
  for (const [k, v] of Object.entries(b || {})) {
    if (typeof v !== "number") continue;
    const cur = out[k];
    if (typeof cur !== "number" || Math.abs(v) >= Math.abs(cur)) out[k] = v;
  }
  return out;
}

function pickBy(a, b, better) {
  const out = { ...(a || {}) };
  for (const [k, v] of Object.entries(b || {})) {
    if (!v || typeof v !== "object") continue;
    if (!out[k] || better(v, out[k])) out[k] = v;
  }
  return out;
}

function unionBy(list, key, prefer) {
  const m = new Map();
  for (const x of list) {
    if (!x || typeof x !== "object") continue;
    const k = key(x);
    const cur = m.get(k);
    if (!cur || (prefer && prefer(x, cur))) m.set(k, x);
  }
  return [...m.values()];
}

function mergeS(a, b) {
  a = a || {};
  b = b || {};
  const starts = [a.start, b.start].filter((x) => typeof x === "string").sort();
  return {
    start: starts[0] || null,
    done: lww(a.done, b.done),
    lessons: lww(a.lessons, b.lessons),
    att: pickBy(a.att, b.att, (x, y) => (x.n || 0) > (y.n || 0) || ((x.n || 0) === (y.n || 0) && (x.t || 0) > (y.t || 0))),
    vocab: pickBy(a.vocab, b.vocab, (x, y) => (x.t || 0) > (y.t || 0)),
    mocks: unionBy([...(a.mocks || []), ...(b.mocks || [])], (m) => [m.d, m.sec, m.c, m.n, m.secs, m.t || ""].join("|"))
      .sort((x, y) => String(x.d).localeCompare(String(y.d)))
      .slice(-40),
    days: [...new Set([...(a.days || []), ...(b.days || [])].filter((d) => typeof d === "string"))].sort().slice(-120),
    lang: (b.langT || 0) >= (a.langT || 0) ? b.lang || a.lang || "en" : a.lang || "en",
    langT: Math.max(a.langT || 0, b.langT || 0),
  };
}

function mergeAll(a, b) {
  a = a || {};
  b = b || {};
  return {
    S: mergeS(a.S, b.S),
    errors: unionBy([...(a.errors || []), ...(b.errors || [])], (e) => String(e.ts) + "|" + e.src)
      .sort((x, y) => (x.ts || 0) - (y.ts || 0))
      .slice(-300),
    essays: unionBy([...(a.essays || []), ...(b.essays || [])], (e) => String(e.ts), (x, y) => (x.u || x.ts || 0) > (y.u || y.ts || 0))
      .sort((x, y) => (x.ts || 0) - (y.ts || 0))
      .slice(-40),
  };
}

window.GREMerge={mergeS,mergeAll};
})();
