(function () {
  'use strict';

  var state = {
    lang: 'en',
    theme: document.documentElement.getAttribute('data-theme') || 'dark'
  };

  /* ============================================================
     I18N
     ============================================================ */
  function applyLanguage(lang) {
    var dict = window.ECLIPSE_I18N[lang];
    if (!dict) return;
    state.lang = lang;
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-country]').forEach(function (el) {
      var key = 'country.' + el.getAttribute('data-i18n-country');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    var themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      var key = state.theme === 'dark' ? 'theme.toggle.toLight' : 'theme.toggle.toDark';
      themeToggle.setAttribute('aria-label', dict[key] || '');
    }
    var navToggle = document.getElementById('nav-toggle');
    if (navToggle) navToggle.setAttribute('aria-label', dict['nav.menu.open'] || '');

    updateCountdownLiveLabel();
    renderMapPopupsLanguage();
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang'));
    });
  });

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  var themeToggleBtn = document.querySelector('[data-theme-toggle]');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      var dict = window.ECLIPSE_I18N[state.lang];
      var key = state.theme === 'dark' ? 'theme.toggle.toLight' : 'theme.toggle.toDark';
      themeToggleBtn.setAttribute('aria-label', dict[key] || '');
    });
  }

  /* ============================================================
     MOBILE NAV (simple show/hide of links as a stacked menu)
     ============================================================ */
  var navToggle = document.getElementById('nav-toggle');
  var navLinksEl = document.querySelector('.nav-links');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinksEl.classList.toggle('is-open');
      if (isOpen) {
        navLinksEl.style.display = 'flex';
        navLinksEl.style.position = 'absolute';
        navLinksEl.style.top = '100%';
        navLinksEl.style.left = '0';
        navLinksEl.style.right = '0';
        navLinksEl.style.flexDirection = 'column';
        navLinksEl.style.padding = '1rem 1.5rem';
        navLinksEl.style.background = 'var(--color-surface)';
        navLinksEl.style.borderBottom = '1px solid var(--color-divider)';
        navLinksEl.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.35)';
        navLinksEl.style.gap = '1rem';
      } else {
        navLinksEl.removeAttribute('style');
      }
    });
    navLinksEl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinksEl.classList.remove('is-open');
        navLinksEl.removeAttribute('style');
      });
    });
  }

  /* ============================================================
     COUNTDOWN
     ============================================================ */
  var TARGET_UTC = Date.UTC(2026, 7, 12, 17, 46, 6); // Aug 12, 2026, 17:46:06 UTC
  var cdDays = document.getElementById('cd-days');
  var cdHours = document.getElementById('cd-hours');
  var cdMins = document.getElementById('cd-mins');
  var cdSecs = document.getElementById('cd-secs');
  var countdownEl = document.getElementById('countdown');
  var countdownLabelEl = document.getElementById('countdown-label');
  var countdownIsLive = false;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdownLiveLabel() {
    if (!countdownIsLive) return;
    var dict = window.ECLIPSE_I18N[state.lang];
    if (countdownLabelEl && dict['countdown.live']) countdownLabelEl.textContent = dict['countdown.live'];
  }

  function tickCountdown() {
    var now = Date.now();
    var diff = TARGET_UTC - now;
    if (diff <= 0) {
      if (!countdownIsLive) {
        countdownIsLive = true;
        if (countdownEl) countdownEl.classList.add('is-live');
        updateCountdownLiveLabel();
      }
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }
    var totalSecs = Math.floor(diff / 1000);
    var days = Math.floor(totalSecs / 86400);
    var hours = Math.floor((totalSecs % 86400) / 3600);
    var mins = Math.floor((totalSecs % 3600) / 60);
    var secs = totalSecs % 60;
    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }
  if (cdDays) {
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* ============================================================
     TABS
     ============================================================ */
  var tabBtns = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.remove('is-active');
      });
      btn.setAttribute('aria-selected', 'true');
      var panel = document.querySelector('[data-panel="' + btn.getAttribute('data-tab') + '"]');
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    question.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ============================================================
     STARFIELD (subtle canvas backdrop for hero)
     ============================================================ */
  (function starfield() {
    var canvas = document.getElementById('starfield');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      var count = Math.floor((rect.width * rect.height) / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 * dpr + 0.3,
          a: Math.random() * 0.6 + 0.2,
          tw: Math.random() * 0.02 + 0.005,
          dir: Math.random() > 0.5 ? 1 : -1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      stars.forEach(function (s) {
        s.a += s.tw * s.dir;
        if (s.a > 0.9 || s.a < 0.1) s.dir *= -1;
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  })();

  /* ============================================================
     MAP (MapLibre GL + OpenFreeMap tiles)
     ============================================================ */
  var mapCities = [
    { name: 'Station Nord', country: 'Greenland', lng: -16.7, lat: 81.6, type: 'total', duration: null },
    { name: 'Scoresby Sund', country: 'Greenland', lng: -21.95, lat: 70.48, type: 'total', duration: null },
    { name: 'Ísafjörður', country: 'Iceland', lng: -23.14, lat: 66.075, type: 'total', duration: '1m 31s' },
    { name: 'Snæfellsjökull', country: 'Iceland', lng: -23.78, lat: 64.81, type: 'total', duration: '2m 10s' },
    { name: 'Reykjavík', country: 'Iceland', lng: -21.9426, lat: 64.1466, type: 'total', duration: '1m 01s' },
    { name: 'A Coruña', country: 'Spain', lng: -8.4115, lat: 43.3623, type: 'total', duration: '1m 15s' },
    { name: 'Gijón', country: 'Spain', lng: -5.6615, lat: 43.5357, type: 'total', duration: '1m 46s' },
    { name: 'Santander', country: 'Spain', lng: -3.81, lat: 43.4623, type: 'total', duration: '1m 04s' },
    { name: 'Bilbao', country: 'Spain', lng: -2.935, lat: 43.263, type: 'total', duration: '~1m 30s' },
    { name: 'Burgos', country: 'Spain', lng: -3.6969, lat: 42.3439, type: 'total', duration: '1m 44s' },
    { name: 'Valladolid', country: 'Spain', lng: -4.7245, lat: 41.6523, type: 'total', duration: '1m 26s' },
    { name: 'Zaragoza', country: 'Spain', lng: -0.8891, lat: 41.6488, type: 'total', duration: '1m 23s' },
    { name: 'Valencia', country: 'Spain', lng: -0.3763, lat: 39.4699, type: 'total', duration: '0m 58s' },
    { name: 'Palma de Mallorca', country: 'Spain', lng: 2.6502, lat: 39.5696, type: 'total', duration: '1m 36s' },
    { name: 'Madrid', country: 'Spain', lng: -3.7038, lat: 40.4168, type: 'partial', coverage: '~100%' },
    { name: 'Lisbon', country: 'Portugal', lng: -9.1393, lat: 38.7223, type: 'partial', coverage: '95%' },
    { name: 'Paris', country: 'France', lng: 2.3522, lat: 48.8566, type: 'partial', coverage: '92%' },
    { name: 'Nantes', country: 'France', lng: -1.5534, lat: 47.2184, type: 'partial', coverage: '96%' },
    { name: 'London', country: 'United Kingdom', lng: -0.1276, lat: 51.5072, type: 'partial', coverage: '91%' },
    { name: 'Dublin', country: 'Ireland', lng: -6.2603, lat: 53.3498, type: 'partial', coverage: '94%' },
    { name: 'Brussels', country: 'Belgium', lng: 4.3517, lat: 50.8503, type: 'partial', coverage: '90%' },
    { name: 'Frankfurt', country: 'Germany', lng: 8.6821, lat: 50.1109, type: 'partial', coverage: '88%' },
    { name: 'Munich', country: 'Germany', lng: 11.582, lat: 48.1351, type: 'partial', coverage: '89%' },
    { name: 'Berlin', country: 'Germany', lng: 13.405, lat: 52.52, type: 'partial', coverage: '85%' },
    { name: 'Zurich', country: 'Switzerland', lng: 8.5417, lat: 47.3769, type: 'partial', coverage: '91%' },
    { name: 'Geneva', country: 'Switzerland', lng: 6.1432, lat: 46.2044, type: 'partial', coverage: '93%' },
    { name: 'Vienna', country: 'Austria', lng: 16.3738, lat: 48.2082, type: 'partial', coverage: '85%' },
    { name: 'Milan', country: 'Italy', lng: 9.19, lat: 45.4642, type: 'partial', coverage: '92%' },
    { name: 'Rome', country: 'Italy', lng: 12.4964, lat: 41.9028, type: 'partial', coverage: '69%' }
  ];

  var pathLine = [
    [-16.7, 81.6],
    [-21.95, 70.48],
    [-23.14, 66.075],
    [-23.78, 64.81],
    [-21.9426, 64.1466],
    [-8.4115, 43.3623],
    [-5.6615, 43.5357],
    [-3.81, 43.4623],
    [-2.935, 43.263],
    [-3.6969, 42.3439],
    [-4.7245, 41.6523],
    [-0.8891, 41.6488],
    [-0.3763, 39.4699],
    [2.6502, 39.5696]
  ];

  var activePopups = [];

  var COUNTRY_KEY_MAP = {
    Greenland: null,
    Iceland: 'country.iceland',
    Spain: 'country.spain',
    Portugal: 'country.portugal',
    France: 'country.france',
    'United Kingdom': 'country.uk',
    Ireland: 'country.ireland',
    Belgium: 'country.belgium',
    Germany: 'country.germany',
    Switzerland: 'country.switzerland',
    Austria: 'country.austria',
    Italy: 'country.italy'
  };

  function localizedCountry(dict, countryName) {
    var key = COUNTRY_KEY_MAP[countryName];
    return key && dict[key] ? dict[key] : countryName;
  }

  function popupHTML(city) {
    var dict = window.ECLIPSE_I18N[state.lang];
    var totalityWord = dict['th.totality'] || 'Totality';
    var coverageWord = dict['th.coverage'] || 'Coverage';
    var countryName = localizedCountry(dict, city.country);
    var line;
    if (city.type === 'total' && city.duration) {
      line = '<p>' + totalityWord + ': <strong>' + city.duration + '</strong></p>';
    } else if (city.type === 'total') {
      line = '<p>' + totalityWord + '</p>';
    } else {
      line = '<p>' + coverageWord + ': <strong>' + city.coverage + '</strong></p>';
    }
    return '<div class="map-popup"><h4>' + city.name + ', ' + countryName + '</h4>' + line + '</div>';
  }

  var markerRefs = [];

  function renderMapPopupsLanguage() {
    markerRefs.forEach(function (ref) {
      if (ref.popup.isOpen()) {
        ref.popup.setHTML(popupHTML(ref.city));
      } else {
        ref.popup.setHTML(popupHTML(ref.city));
      }
    });
  }

  function initMap() {
    if (typeof maplibregl === 'undefined' || !document.getElementById('eclipse-map')) return;
    var map = new maplibregl.Map({
      container: 'eclipse-map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-8, 55],
      zoom: 2.6,
      attributionControl: true
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', function () {
      map.addSource('totality-path', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: pathLine }
        }
      });
      map.addLayer({
        id: 'totality-path-line',
        type: 'line',
        source: 'totality-path',
        paint: {
          'line-color': '#f0a93c',
          'line-width': 3,
          'line-dasharray': [0.2, 1.4],
          'line-opacity': 0.9
        }
      });

      mapCities.forEach(function (city) {
        var el = document.createElement('div');
        el.style.width = city.type === 'total' ? '14px' : '10px';
        el.style.height = city.type === 'total' ? '14px' : '10px';
        el.style.borderRadius = '50%';
        el.style.background = city.type === 'total' ? '#f0a93c' : '#5fd0dd';
        el.style.border = '2px solid #0a0910';
        el.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.5)';
        el.style.cursor = 'pointer';

        var popup = new maplibregl.Popup({ offset: 14, closeButton: true }).setHTML(popupHTML(city));
        var marker = new maplibregl.Marker({ element: el })
          .setLngLat([city.lng, city.lat])
          .setPopup(popup)
          .addTo(map);
        markerRefs.push({ marker: marker, popup: popup, city: city });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }

  /* ============================================================
     INIT
     ============================================================ */
  applyLanguage('en');
})();
