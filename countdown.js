(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .countdown-card {
      margin: 1.25rem 0;
      padding: 1.25rem;
      border: 1px solid var(--line, rgba(210,230,255,.16));
      border-radius: .8rem;
      background: linear-gradient(135deg, var(--panel, #101f33), var(--panel2, #162a43));
      box-shadow: var(--shadow, 0 24px 70px rgba(0,0,0,.3));
    }
    .countdown-card h3 { margin-bottom: .35rem; }
    .countdown-card p { color: var(--muted, #aebdd1); }
    .countdown-time {
      display: grid;
      grid-template-columns: repeat(4, minmax(4.5rem, 1fr));
      gap: .6rem;
      margin-top: 1rem;
      max-width: 32rem;
    }
    .countdown-unit {
      padding: .7rem .45rem;
      text-align: center;
      border: 1px solid var(--line, rgba(210,230,255,.16));
      border-radius: .55rem;
      background: rgba(7,17,31,.32);
    }
    .countdown-value { display: block; font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 800; line-height: 1.1; color: var(--ink, #f5f8fc); }
    .countdown-label { display: block; margin-top: .25rem; font-size: .72rem; color: var(--muted, #aebdd1); text-transform: uppercase; letter-spacing: .08em; }
    .countdown-finished { color: var(--aqua, #8fe3db); font-weight: 700; margin-top: .8rem; }
    @media (max-width: 450px) { .countdown-time { grid-template-columns: repeat(2, 1fr); } }
  `;
  document.head.appendChild(style);

  const target = document.querySelector('#explorer .section-head');
  if (!target || !window.EclipseAtlas || !Array.isArray(window.EclipseAtlas.ECLIPSES)) return;

  const card = document.createElement('section');
  card.className = 'countdown-card';
  card.setAttribute('aria-live', 'polite');
  card.setAttribute('aria-labelledby', 'countdown-title');
  card.innerHTML = '<h3 id="countdown-title">Countdown to selected eclipse</h3><p class="countdown-event"></p><div class="countdown-time" role="timer"></div><p class="countdown-finished" hidden>This eclipse has begun or has already passed.</p>';
  target.after(card);

  const eventText = card.querySelector('.countdown-event');
  const time = card.querySelector('.countdown-time');
  const finished = card.querySelector('.countdown-finished');
  const units = [['days', 86400], ['hours', 3600], ['minutes', 60], ['seconds', 1]];
  let lastEventId;

  function selectedEvent() {
    const id = localStorage.getItem('ea-event') || '2027-02-06';
    return window.EclipseAtlas.ECLIPSES.find(e => e.id === id) || window.EclipseAtlas.ECLIPSES[0];
  }

  function render() {
    const event = selectedEvent();
    if (!event) return;
    if (event.id !== lastEventId) {
      lastEventId = event.id;
      eventText.textContent = `${event.label} · ${event.type} ${event.class} eclipse (counting to 00:00 UTC)`;
    }

    const remaining = Math.floor((Date.parse(`${event.date}T00:00:00Z`) - Date.now()) / 1000);
    if (remaining <= 0) {
      time.innerHTML = '';
      finished.hidden = false;
      return;
    }

    finished.hidden = true;
    let value = remaining;
    time.innerHTML = units.map(([label, seconds]) => {
      const amount = Math.floor(value / seconds);
      value %= seconds;
      return `<div class="countdown-unit"><span class="countdown-value">${String(amount).padStart(2, '0')}</span><span class="countdown-label">${label}</span></div>`;
    }).join('');
  }

  render();
  window.setInterval(render, 1000);
})();
