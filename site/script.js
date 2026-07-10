/* ─── Canvas: neural-net particle field ─── */
(function () {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  const ACCENT   = '0, 200, 248';
  const COUNT    = 70;
  const RANGE    = 140;
  const SPEED    = 0.28;

  let W, H, pts;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkPt() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.2 + 0.4,
    };
  }

  function init() { pts = Array.from({ length: COUNT }, mkPt); }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT}, 0.5)`;
      ctx.fill();
    }

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RANGE) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - d / RANGE) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  frame();
})();

/* ─── Nav: glass on scroll ─── */
(function () {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Typewriter ─── */
(function () {
  const phrases = [
    'ai-generated software packages.',
    'human-curated. machine-built.',
    'open source. openly artificial.',
    'patterns for the post-AI era.',
    'crafted with intent. written by AI.',
  ];

  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 52);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 380);
        return;
      }
      setTimeout(tick, 22);
    }
  }
  setTimeout(tick, 900);
})();

/* ─── GitHub repos ─── */
(function () {
  const GITHUB_USER = 'aisloperator';

  const LANG_COLORS = {
    JavaScript:  '#f1e05a',
    TypeScript:  '#3178c6',
    Python:      '#3572a5',
    Rust:        '#dea584',
    Go:          '#00add8',
    Ruby:        '#701516',
    'C++':       '#f34b7d',
    C:           '#555555',
    Shell:       '#89e051',
    HTML:        '#e34c26',
    CSS:         '#563d7c',
    Nix:         '#7e7eff',
    Lua:         '#000080',
    Haskell:     '#5e5086',
    Zig:         '#ec915c',
    Swift:       '#f05138',
    Kotlin:      '#a97bff',
    Java:        '#b07219',
    Elixir:      '#6e4a7e',
    Clojure:     '#db5855',
  };

  function langColor(lang) {
    return LANG_COLORS[lang] || '#6b7280';
  }

  function relTime(iso) {
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d < 1)  return 'today';
    if (d < 7)  return `${d}d ago`;
    const w = Math.floor(d / 7);
    if (w < 5)  return `${w}w ago`;
    const m = Math.floor(d / 30);
    if (m < 12) return `${m}mo ago`;
    return `${Math.floor(m / 12)}y ago`;
  }

  function starIcon() {
    return `<svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
    </svg>`;
  }

  function repoIcon() {
    return `<svg class="pkg-icon" viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8z"/>
    </svg>`;
  }

  function cardHTML(r) {
    const meta = [];
    if (r.language) {
      meta.push(`<span class="pkg-lang">
        <span class="lang-dot" style="background:${langColor(r.language)}"></span>
        ${r.language}
      </span>`);
    }
    meta.push(`<span class="pkg-stars">${starIcon()} ${r.stargazers_count}</span>`);
    meta.push(`<span class="pkg-updated">${relTime(r.updated_at)}</span>`);

    return `<a class="pkg-card reveal" href="${r.html_url}" target="_blank" rel="noopener">
      <div class="pkg-header">
        ${repoIcon()}
        <span class="pkg-name">${r.name}</span>
      </div>
      ${r.description ? `<p class="pkg-desc">${r.description}</p>` : ''}
      <div class="pkg-meta">${meta.join('')}</div>
    </a>`;
  }

  async function load() {
    const grid = document.getElementById('packages-grid');
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const all = await res.json();

      const repos = all
        .filter(r => !r.fork && !r.archived)
        .sort((a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.updated_at) - new Date(a.updated_at)
        );

      const totalStars = all.reduce((s, r) => s + r.stargazers_count, 0);
      const statRepos = document.getElementById('stat-repos');
      const statStars = document.getElementById('stat-stars');
      if (statRepos) statRepos.textContent = repos.length;
      if (statStars) statStars.textContent =
        totalStars >= 1000 ? `${(totalStars / 1000).toFixed(1)}k` : totalStars;

      if (repos.length === 0) {
        grid.innerHTML = `<div class="empty-state">
          <h3>// no packages yet</h3>
          <p>Check back soon &mdash; packages are on the way.</p>
        </div>`;
        return;
      }

      grid.innerHTML = repos.map(r => cardHTML(r)).join('');

      /* staggered reveal */
      grid.querySelectorAll('.pkg-card.reveal').forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 55);
      });

    } catch (err) {
      console.warn('GitHub fetch failed:', err.message);
      document.getElementById('packages-grid').innerHTML = `<div class="empty-state">
        <h3>// could not reach GitHub</h3>
        <p>Visit <a href="https://github.com/${GITHUB_USER}">github.com/${GITHUB_USER}</a> directly.</p>
      </div>`;
    }
  }

  load();
})();

/* ─── Scroll reveal (static elements) ─── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* also observe cards injected later */
  new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.classList?.contains('reveal')) io.observe(node);
        node.querySelectorAll?.('.reveal').forEach(el => io.observe(el));
      });
    }
  }).observe(document.getElementById('packages-grid'), { childList: true });
})();
