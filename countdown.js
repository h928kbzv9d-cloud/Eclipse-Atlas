(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .countdown-card { margin: 1.25rem 0; padding: 1.25rem; border: 1px solid var(--line, rgba(210,230,255,.16)); border-radius: .8rem; background: linear-gradient(135deg, var(--panel, #101f33), var(--panel2, #162a43)); box-shadow: var(--shadow, 0 24px 70px rgba(0,0,0,.3)); }
    .countdown-card h3 { margin-bottom: .35rem; }
    .countdown-card p { color: var(--muted, #aebdd1); }
    .countdown-summary { display: grid; gap: .35rem; margin: 0 0 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line, rgba(210,230,255,.16)); }
    .countdown-summary strong { color: var(--aqua, #8fe3db); font-size: 1.05rem; }
    .countdown-time { display: grid; grid-template-columns: repeat(4, minmax(4.5rem, 1fr)); gap: .6rem; margin-top: 1rem; max-width: 32rem; }
    .countdown-unit { padding: .7rem .45rem; text-align: center; border: 1px solid var(--line, rgba(210,230,255,.16)); border-radius: .55rem; background: rgba(7,17,31,.32); }
    .countdown-value { display: block; color: var(--ink, #f5f8fc); font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 800; line-height: 1.1; }
    .countdown-label { display: block; margin-top: .25rem; color: var(--muted, #aebdd1); font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; }
    .countdown-finished { margin-top: .8rem; color: var(--aqua, #8fe3db) !important; font-weight: 700; }
    @media (max-width: 450px) { .countdown-time { grid-template-columns: repeat(2, 1fr); } }
  `;
  document.head.appendChild(style);

  function start() {
    const target = document.querySelector('#explorer .section-head');
    const atlas = window.EclipseAtlas;
    if (!target || !atlas || !Array.isArray(atlas.ECLIPSES)) return;

    const old = document.querySelector('#countdown-panel');
    if (old) old.remove();

    const card = document.createElement('section');
    card.id = 'countdown-panel';
    card.className = 'countdown-card';
    card.setAttribute('aria-live', 'polite');
    card.innerHTML = `
      <div class="countdown-summary">
        <h3>Countdown to next total solar eclipse</h3>
        <strong class="countdown-next-event"></strong>
        <span class="countdown-next-region"></span>
      </div>
      <h3>Countdown to selected eclipse</h3>
      <p class="countdown-event"></p>
      <div class="countdown-time" role="timer"></div>
      <p class="countdown-finished" hidden>This eclipse has begun or has already passed.</p>`;
    target.after(card);

    const nextEventText = card.querySelector('.countdown-next-event');
    const nextRegionText = card.querySelector('.countdown-next-region');
    const eventText = card.querySelector('.countdown-event');
    const time = card.querySelector('.countdown-time');
    const finished = card.querySelector('.countdown-finished');
    const units = [['days', 86400], ['hours', 3600], ['minutes', 60], ['seconds', 1]];
    let selectedId = '';
    let nextId = '';

    const dateValue = e => Date.parse(`${e.date}T00:00:00Z`);
    const selectedEvent = () => atlas.ECLIPSES.find(e => e.id === (localStorage.getItem('ea-event') || '2027-02-06')) || atlas.ECLIPSES[0];
    const nextTotal = () => atlas.ECLIPSES.filter(e => e.class === 'solar' && e.type === 'total' && dateValue(e) > Date.now()).sort((a, b) => dateValue(a) - dateValue(b))[0];
    const format = (seconds, output) => { let value = Math.max(0, Math.floor(seconds)); output.innerHTML = units.map(([label, size]) => { const amount = Math.floor(value / size); value %= size; return `<div class="countdown-unit"><span class="countdown-value">${String(amount).padStart(2, '0')}</span><span class="countdown-label">${label}</span></div>`; }).join(''); };

    function render() {
      const event = selectedEvent();
      const total = nextTotal();
      if (!event || !total) return;
      if (total.id !== nextId) { nextId = total.id; nextEventText.textContent = `${total.label} · ${total.region}`; nextRegionText.textContent = 'Counting to 00:00 UTC'; }
      if (event.id !== selectedId) { selectedId = event.id; eventText.textContent = `${event.label} · ${event.type} ${event.class} eclipse (counting to 00:00 UTC)`; }
      const remaining = Math.floor((dateValue(event) - Date.now()) / 1000);
      finished.hidden = remaining > 0;
      if (remaining > 0) format(remaining, time); else time.innerHTML = '';
    }

    render();
    window.setInterval(render, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
