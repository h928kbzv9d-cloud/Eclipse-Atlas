(() => {
  'use strict';

  function getSelectedEventId() {
    return localStorage.getItem('ea-event') || '2027-02-06';
  }

  function getSelectedEvent() {
    const atlas = window.EclipseAtlas;
    if (!atlas || !Array.isArray(atlas.ECLIPSES)) return null;
    return atlas.ECLIPSES.find(e => e.id === getSelectedEventId()) || atlas.ECLIPSES[0] || null;
  }

  function getNextTotalSolarEclipse() {
    const atlas = window.EclipseAtlas;
    if (!atlas || !Array.isArray(atlas.ECLIPSES)) return null;
    const now = Date.now();
    return atlas.ECLIPSES
      .filter(e => e.class === 'solar' && e.type === 'total' && Date.parse(`${e.date}T00:00:00Z`) >= now)
      .sort((a, b) => Date.parse(`${a.date}T00:00:00Z`) - Date.parse(`${b.date}T00:00:00Z`))[0] || null;
  }

  function ensurePanel() {
    let panel = document.getElementById('countdown-panel');
    if (panel) return panel;

    const anchor = document.querySelector('#explorer .section-head');
    if (!anchor) return null;

    panel = document.createElement('section');
    panel.id = 'countdown-panel';
    panel.className = 'countdown-card';
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = `
      <div class="countdown-summary">
        <h3>Countdown to next total solar eclipse</h3>
        <strong id="countdown-next-event">—</strong>
        <span id="countdown-next-region">Counting to 00:00 UTC</span>
      </div>
      <h3>Countdown to selected eclipse</h3>
      <p id="countdown-selected-text">—</p>
      <div id="countdown-time" class="countdown-time" role="timer"></div>
      <p id="countdown-finished" class="countdown-finished" hidden>This eclipse has begun or has already passed.</p>
    `;
    anchor.after(panel);
    return panel;
  }

  function getCountdownParts(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    let remaining = totalSeconds % 86400;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return { days, hours, minutes, seconds };
  }

  function renderCountdown() {
    const panel = ensurePanel();
    if (!panel) return;

    const nextTotal = getNextTotalSolarEclipse();
    const selected = getSelectedEvent();
    if (!selected) return;

    const nextEventEl = panel.querySelector('#countdown-next-event');
    const nextRegionEl = panel.querySelector('#countdown-next-region');
    const selectedTextEl = panel.querySelector('#countdown-selected-text');
    const timeEl = panel.querySelector('#countdown-time');
    const finishedEl = panel.querySelector('#countdown-finished');

    if (nextTotal) {
      nextEventEl.textContent = `${nextTotal.label} · ${nextTotal.region}`;
      nextRegionEl.textContent = 'Counting to 00:00 UTC';
    } else {
      nextEventEl.textContent = 'No upcoming total solar eclipse in the current dataset';
      nextRegionEl.textContent = 'Check the eclipse list';
    }

    const targetDate = Date.parse(`${selected.date}T00:00:00Z`);
    const remainingMs = targetDate - Date.now();
    selectedTextEl.textContent = `${selected.label} · ${selected.type} ${selected.class} eclipse (counting to 00:00 UTC)`;

    if (remainingMs <= 0) {
      timeEl.innerHTML = '';
      finishedEl.hidden = false;
      return;
    }

    finishedEl.hidden = true;
    const totalSeconds = Math.floor(remainingMs / 1000);
    const parts = getCountdownParts(totalSeconds);

    timeEl.innerHTML = [
      { label: 'days', value: parts.days },
      { label: 'hours', value: parts.hours },
      { label: 'minutes', value: parts.minutes },
      { label: 'seconds', value: parts.seconds }
    ].map(entry => `
      <div class="countdown-unit">
        <span class="countdown-value">${String(entry.value).padStart(2, '0')}</span>
        <span class="countdown-label">${entry.label}</span>
      </div>
    `).join('');
  }

  function start() {
    renderCountdown();
    window.setInterval(renderCountdown, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
