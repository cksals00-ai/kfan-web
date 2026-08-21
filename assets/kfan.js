/* K-FAN PLANNER — static data consumer (schema v1, read-only)
   Data contract: kfan_data.json is produced by the A.P pipeline (gen_kfan.py, not part of this site).
   Fields may be ADDED upstream; never renamed/removed without notice. Render defensively. */
(function () {
  "use strict";

  // AFFILIATE TAGS — empty until provided (2026-08-25 per handover §4-3). Plain links until then.
  var AGODA_CID = "";   // e.g. "?cid=XXXXXX" appended by buildAgoda when non-empty
  var KLOOK_AID = "";

  var DATA_URL = document.body.getAttribute("data-src") || "data/kfan_data.json";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function httpsify(u) { return u ? String(u).replace(/^http:\/\//, "https://") : ""; }
  function stripKr(t) {
    // titles arrive as "English (한글)" — keep EN primary, KR small
    var m = /^(.*?)\s*\(([^)]*[가-힣][^)]*)\)\s*$/.exec(t || "");
    return m ? { en: m[1], kr: m[2] } : { en: t || "", kr: "" };
  }
  function walkMin(distM) { return Math.max(1, Math.round(distM / 80)); } // ~80 m/min

  function poiCard(item, showDist) {
    var t = stripKr(item.t);
    var card = el("div", "poi");
    var img = httpsify(item.img);
    if (img) {
      var im = el("img");
      im.loading = "lazy"; im.alt = ""; im.src = img;
      im.onerror = function () { var n = el("div", "noimg", "&#9678;"); card.replaceChild(n, im); };
      card.appendChild(im);
    } else {
      card.appendChild(el("div", "noimg", "&#9678;"));
    }
    var meta = el("div");
    meta.appendChild(el("div", "t", esc(t.en)));
    var bits = [];
    if (showDist && item.dist != null) bits.push(item.dist + " m &middot; ~" + walkMin(item.dist) + " min walk");
    if (item.start && item.end) bits.push(fmtDate(item.start) + " &ndash; " + fmtDate(item.end));
    if (bits.length) meta.appendChild(el("div", "d", bits.join(" &middot; ")));
    card.appendChild(meta);
    return card;
  }

  function fmtDate(yyyymmdd) {
    var s = String(yyyymmdd);
    if (s.length !== 8) return s;
    var M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return M[+s.slice(4, 6) - 1] + " " + (+s.slice(6, 8));
  }

  function buildAgoda(x, y) {
    var u = "https://www.agoda.com/search?latitude=" + y + "&longitude=" + x + "&sort=priceLowToHigh";
    return AGODA_CID ? u + "&cid=" + AGODA_CID : u;
  }
  function buildKlook(q) {
    var u = "https://www.klook.com/en-US/search/?query=" + encodeURIComponent(q || "Seoul");
    return KLOOK_AID ? u + "&aid=" + KLOOK_AID : u;
  }

  function fill(id, items, opts) {
    var host = document.getElementById(id);
    if (!host) return;
    if (!items || !items.length) { var w = host.closest("section"); if (w) w.style.display = "none"; return; }
    var cap = (opts && opts.cap) || 8;
    items.slice(0, cap).forEach(function (it) { host.appendChild(poiCard(it, opts && opts.dist)); });
  }

  function render(d) {
    var stamp = document.getElementById("dataStamp");
    if (stamp && d.generated) {
      stamp.textContent = "Data refreshed " + d.generated.slice(0, 10) + " · " + (d.source || "");
    }
    document.querySelectorAll("[data-disclaimer]").forEach(function (n) {
      n.textContent = d.disclaimer || "";
    });

    var vkey = document.body.getAttribute("data-venue");
    if (vkey && d.venues && d.venues[vkey]) {
      var v = d.venues[vkey];
      fill("stayList", (v.stay || []).slice().sort(function (a, b) { return (a.dist || 9e9) - (b.dist || 9e9); }), { dist: true, cap: 8 });
      fill("seeList", v.see || [], { dist: true, cap: 6 });
      fill("eatList", v.eat || [], { dist: true, cap: 6 });
      var capEl = document.getElementById("venueCap");
      if (capEl && v.cap) capEl.textContent = v.cap.toLocaleString("en-US") + " seats";
    }

    // homepage festivals: upcoming only, soonest first
    var fh = document.getElementById("festList");
    if (fh && d.festivals) {
      var today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      var up = d.festivals.filter(function (f) { return f.end && String(f.end) >= today; })
        .sort(function (a, b) { return String(a.start).localeCompare(String(b.start)); });
      fill("festList", up, { cap: 6 });
    }
  }

  // affiliate slot links (plain until tags arrive)
  document.querySelectorAll("[data-agoda]").forEach(function (a) {
    var xy = a.getAttribute("data-agoda").split(",");
    a.href = buildAgoda(parseFloat(xy[0]), parseFloat(xy[1]));
    a.target = "_blank"; a.rel = "noopener nofollow";
  });
  document.querySelectorAll("[data-klook]").forEach(function (a) {
    a.href = buildKlook(a.getAttribute("data-klook"));
    a.target = "_blank"; a.rel = "noopener nofollow";
  });

  // share row
  document.querySelectorAll(".share").forEach(function (row) {
    var url = location.href, title = document.title;
    var tw = row.querySelector("[data-share=x]");
    if (tw) { tw.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(title) + "&url=" + encodeURIComponent(url); tw.target = "_blank"; tw.rel = "noopener"; }
    var fb = row.querySelector("[data-share=fb]");
    if (fb) { fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url); fb.target = "_blank"; fb.rel = "noopener"; }
    var cp = row.querySelector("[data-share=copy]");
    if (cp) cp.addEventListener("click", function () {
      var done = function () { cp.textContent = "Copied!"; setTimeout(function () { cp.textContent = "Copy link"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
      else { var t = document.createElement("textarea"); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} document.body.removeChild(t); }
    });
  });

  // load data (graceful: sections hide, note shows)
  fetch(DATA_URL).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(render).catch(function () {
    var n = document.getElementById("dataNote");
    if (n) { n.style.display = "block"; n.textContent = "Nearby places are temporarily unavailable. Guide content on this page is unaffected."; }
    document.querySelectorAll("section[data-needs-data]").forEach(function (s) { s.style.display = "none"; });
  });
})();
