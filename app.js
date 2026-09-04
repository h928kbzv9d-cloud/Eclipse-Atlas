(() => {
'use strict';
const DATASET_VERSION='1.0';
const ECLIPSES=[
  {id:'2026-08-12',class:'solar',date:'2026-08-12',type:'total',label:'12 Aug 2026',region:'Arctic · Greenland · Iceland · Iberia',summary:'A total solar eclipse crossing Greenland, Iceland, northern Spain and the Balearic Islands.',source:'https://science.nasa.gov/eclipses/future-eclipses/total-solar-eclipse-on-august-12-2026/',path:[[75,50],[70,-24],[65,-22],[59,-16],[49,-10],[43,-6],[40,0],[39,3]],cities:[{name:'Reykjavík',country:'Iceland',lat:64.1466,lon:-21.9426,partialStart:'16:47',centralStart:'17:48',maximum:'17:49',centralEnd:'17:49',partialEnd:'18:48',duration:'1m 01s',status:'total'},{name:'León',country:'Spain',lat:42.5987,lon:-5.5671,partialStart:'19:32',centralStart:'20:28',maximum:'20:29',centralEnd:'20:30',partialEnd:'21:22',duration:'1m 48s',status:'total'},{name:'Paris',country:'France',lat:48.8566,lon:2.3522,partialStart:'19:22',maximum:'20:17',partialEnd:'21:09',coverage:'92%',status:'partial'}]},
  {id:'2027-02-06',class:'solar',date:'2027-02-06',type:'annular',label:'6 Feb 2027',region:'South America · Atlantic · Africa',summary:'An annular solar eclipse with a central path over parts of South America and Africa.',source:'https://science.nasa.gov/eclipses/future-eclipses/',path:[[-40,-70],[-30,-45],[-18,-20],[-5,5],[8,25],[18,42]],cities:[{name:'Buenos Aires',country:'Argentina',lat:-34.6037,lon:-58.3816,status:'partial',coverage:'Dataset reference'},{name:'Luanda',country:'Angola',lat:-8.8390,lon:13.2894,status:'partial',coverage:'Dataset reference'}]},
  {id:'2027-08-02',class:'solar',date:'2027-08-02',type:'total',label:'2 Aug 2027',region:'Europe · North Africa · Middle East',summary:'A total solar eclipse with a long central path through southern Europe, North Africa and the Middle East.',source:'https://science.nasa.gov/eclipses/future-eclipses/',path:[[38,-8],[37,0],[34,15],[30,30],[25,45],[18,55]],cities:[{name:'Luxor',country:'Egypt',lat:25.6872,lon:32.6396,status:'total',duration:'6m 23s',maximum:'12:00',coverage:'100%'},{name:'Cádiz',country:'Spain',lat:36.5297,lon:-6.2927,status:'partial',coverage:'Dataset reference'}]},
  {id:'2028-01-26',class:'solar',date:'2028-01-26',type:'annular',label:'26 Jan 2028',region:'Americas · Atlantic · Iberia · Northwest Africa',summary:'An annular solar eclipse crossing the Atlantic corridor between the Americas, Iberia and northwest Africa.',source:'https://science.nasa.gov/eclipses/future-eclipses/',path:[[15,-75],[22,-55],[30,-35],[35,-15],[36,-5],[32,5]],cities:[{name:'Miami',country:'United States',lat:25.7617,lon:-80.1918,status:'partial',coverage:'Dataset reference'},{name:'Funchal',country:'Portugal',lat:32.65,lon:-16.9087,status:'partial',coverage:'Dataset reference'}]},
  {id:'2028-07-22',class:'solar',date:'2028-07-22',type:'total',label:'22 Jul 2028',region:'Southeast Asia · Australia · New Zealand',summary:'A total solar eclipse whose central path reaches parts of Southeast Asia, Australia and New Zealand.',source:'https://science.nasa.gov/eclipses/future-eclipses/',path:[[5,105],[-5,120],[-15,135],[-25,150],[-37,165]],cities:[{name:'Darwin',country:'Australia',lat:-12.4634,lon:130.8456,status:'partial',coverage:'Dataset reference'},{name:'Auckland',country:'New Zealand',lat:-36.8509,lon:174.7645,status:'partial',coverage:'Dataset reference'}]},
  // Lunar eclipses (embedded, reference-only): dates and regional visibility from NASA/GSFC tables (2026-2028)
  {id:'2026-03-03',class:'lunar',date:'2026-03-03',type:'total',label:'3 Mar 2026',region:'East Asia · Australia · Pacific · Americas',summary:'Total lunar eclipse. See NASA/GSFC for maps and detailed visibility.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2026Mar03T.pdf'},
  {id:'2026-08-28',class:'lunar',date:'2026-08-28',type:'partial',label:'28 Aug 2026',region:'East Pacific · Americas · Europe · Africa',summary:'Partial lunar eclipse. See NASA/GSFC for maps and detailed visibility.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2026Aug28P.pdf'},
  {id:'2027-02-20',class:'lunar',date:'2027-02-20',type:'penumbral',label:'20 Feb 2027',region:'Americas · Europe · Africa · Asia',summary:'Penumbral lunar eclipse (reference). See NASA/GSFC for full details.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2027Feb20N.pdf'},
  {id:'2027-07-18',class:'lunar',date:'2027-07-18',type:'penumbral',label:'18 Jul 2027',region:'East Africa · Asia · Australia · Pacific',summary:'Penumbral lunar eclipse (reference). See NASA/GSFC for full details.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2027Jul18N.pdf'},
  {id:'2027-08-17',class:'lunar',date:'2027-08-17',type:'penumbral',label:'17 Aug 2027',region:'Pacific · Americas',summary:'Penumbral lunar eclipse (reference). See NASA/GSFC for full details.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2027Aug17N.pdf'},
  {id:'2028-01-12',class:'lunar',date:'2028-01-12',type:'partial',label:'12 Jan 2028',region:'Americas · Europe · Africa',summary:'Partial lunar eclipse. See NASA/GSFC for maps and detailed visibility.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2028Jan12P.pdf'},
  {id:'2028-07-06',class:'lunar',date:'2028-07-06',type:'partial',label:'6 Jul 2028',region:'Europe · Africa · Asia · Australia',summary:'Partial lunar eclipse. See NASA/GSFC for maps and detailed visibility.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2028Jul06P.pdf'},
  {id:'2028-12-31',class:'lunar',date:'2028-12-31',type:'total',label:'31 Dec 2028',region:'Europe · Africa · Asia · Australia · Pacific',summary:'Total lunar eclipse. See NASA/GSFC for maps and detailed visibility.',source:'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2028Dec31T.pdf'}
];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={lang:localStorage.getItem('ea-lang')||'en',theme:localStorage.getItem('ea-theme')||'dark',eventId:localStorage.getItem('ea-event')||'2027-02-06',place:null,filter:'all',classFilter:'all'};
const t=(k,v={})=>EclipseTranslations.t(state.lang,k,v);let map,pathLayer,cityLayer,placeMarker;
const save=()=>{localStorage.setItem('ea-lang',state.lang);localStorage.setItem('ea-theme',state.theme);localStorage.setItem('ea-event',state.eventId)};
const event=()=>ECLIPSES.find(x=>x.id===state.eventId)||ECLIPSES[1];
function typeLabel(type){return t(`type${type[0].toUpperCase()+type.slice(1)}`)}
function classLabel(cls){return t(`class${cls[0].toUpperCase()+cls.slice(1)}`)}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.id);toast.id=setTimeout(()=>el.classList.remove('show'),2600)}
function esc(v){return String(v||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":"&#39;",'"':'&quot;'}[c]))}
function renderEvents(){const shown=ECLIPSES.filter(e=> (state.classFilter==='all'||e.class===state.classFilter) && (state.filter==='all'||e.type===state.filter) );
  $('#event-cards').innerHTML=shown.map(e=>`<button class="event-card ${e.id===state.eventId?'selected':''}" data-event="${e.id}" type="button"><span class="type-badge ${e.type}">${typeLabel(e.type)}</span><strong>${e.label}</strong><span>${esc(e.region)}</span><small>${e.id==='2027-02-06'?t('nextEvent'):t('viewEvent')}</small></button>`).join('');
  $$('.event-card').forEach(b=>b.onclick=()=>chooseEvent(b.dataset.event));
  $('#event-timeline').innerHTML=shown.map(e=>`<button class="timeline-row ${e.id===state.eventId?'selected':''}" data-event="${e.id}" type="button"><span>${e.date.slice(0,4)}</span><strong>${e.label} · ${typeLabel(e.type)} · ${classLabel(e.class)}</strong><small>${esc(e.region)}</small></button>`).join('');
  $$('.timeline-row').forEach(b=>b.onclick=()=>chooseEvent(b.dataset.event));
}
function renderSelect(){$('#event-select').innerHTML=ECLIPSES.map(e=>`<option value="${e.id}">${e.label} — ${typeLabel(e.type)} — ${classLabel(e.class)}</option>`).join('');$('#event-select').value=state.eventId}
function findSupported(place,e){if(!place||!e.cities)return null;return e.cities.find(c=>Math.abs(c.lat-place.lat)<.22&&Math.abs(c.lon-place.lon)<.22)||null}
function renderBrief(){const e=event(),p=state.place,s=findSupported(p,e);let content;const supported = (e.cities||[]).map(c=>({name:c.name,country:c.country,lat:c.lat,lon:c.lon,zoom:c.zoom||10,status:c.status,duration:c.duration,maximum:c.maximum}));
  if(!p){
    content=`<div class="brief-empty"><span class="brief-icon">⌖</span><h3>${t('briefStartTitle')}</h3><p>${t('briefStartText')}</p></div>`
  } else if(s){
    content=`<div class="brief-top"><span class="type-badge ${s.status}">${typeLabel(s.status)}</span><span class="verified">${t('verified')}</span></div>
      <p class="brief-kicker">${e.label} · ${t('eclipseBrief')}</p>
      <h3>${esc(s.name)}, ${esc(s.country)}</h3>
      <p class="brief-summary">${t('supportedSummary',{type:typeLabel(s.status).toLowerCase()})}</p>
      <dl class="timing-grid"><div><dt>${t('maximum')}</dt><dd>${s.maximum||'—'}</dd></div><div><dt>${t('duration')}</dt><dd>${s.duration||s.coverage||'—'}</dd></div>
      ${s.partialStart?`<div><dt>${t('partialBegins')}</dt><dd>${s.partialStart}</dd></div>`:''}
      ${s.centralStart?`<div><dt>${t('centralBegins')}</dt><dd>${s.centralStart}</dd></div>`:''}
      ${s.centralEnd?`<div><dt>${t('centralEnds')}</dt><dd>${s.centralEnd}</dd></div>`:''}
      ${s.partialEnd?`<div><dt>${t('partialEnds')}</dt><dd>${s.partialEnd}</dd></div>`:''}</dl>
      <p class="brief-disclaimer">${t('timingDisclaimer')}</p>`
  } else {
    // Place provided but not covered by event
    let supportedHtml='';
    if(supported.length>0){
      supportedHtml = `<div class="supported-cities"><h4>${t('supportedCitiesTitle')}</h4><p class="hint">${t('supportedCitiesHint')}</p><ul>` + supported.map(c=>`<li><button class="supported-city" type="button" data-lat="${c.lat}" data-lon="${c.lon}" data-name="${esc(c.name)}">${esc(c.name)}, ${esc(c.country||'')}</button></li>`).join('') + `</ul></div>`
    } else {
      supportedHtml = `<div class="supported-cities"><h4>${t('supportedCitiesTitle')}</h4><p class="hint">${t('supportedCitiesNone')}</p></div>`
    }
    content=`<div class="brief-top"><span class="type-badge lookup">${t('lookup')}</span></div>
      <p class="brief-kicker">${e.label} · ${t('eclipseBrief')}</p>
      <h3>${esc(p.name)}</h3>
      <p class="brief-summary">${e.class==='lunar'?t('notCoveredLunar'):t('notCovered')}</p>
      <dl class="timing-grid"><div><dt>${t('coordinates')}</dt><dd>${p.lat.toFixed(4)}°, ${p.lon.toFixed(4)}°</dd></div><div><dt>${t('datasetStatus')}</dt><dd>${t('notIncluded')}</dd></div></dl>
      <p class="brief-disclaimer">${t('notCoveredText')}</p>
      ${supportedHtml}
      <div class="missing-hint"><p class="hint">${t('missingCityHint')}</p><p class="hint">${t('matchingExplanation')}</p></div>`
  }
  $('#eclipse-brief').innerHTML=`${content}<div class="brief-actions"><button id="calendar-button" class="button button-primary" type="button" ${p?'':'disabled'}>${t('addCalendar')}</button><a class="button button-secondary" href="${e.source}" target="_blank" rel="noopener noreferrer">${t('viewSource')}</a></div>`;
  // wire up supported city buttons
  $$('.supported-city').forEach(b=>b.addEventListener('click',()=>{const name=b.dataset.name;const lat=Number(b.dataset.lat);const lon=Number(b.dataset.lon);choosePlace({name:name,lat:lat,lon:lon,zoom:10})}));
  $('#calendar-button')?.addEventListener('click',exportCalendar)
}
function initMap(){if(!window.L){$('#world-map').innerHTML=`<p class="map-error">${t('mapUnavailable')}</p>`;return}map=L.map('world-map',{worldCopyJump:true}).setView([25,0],2);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);pathLayer=L.layerGroup().addTo(map);cityLayer=L.layerGroup().addTo(map);renderMap()}
function renderMap(){if(!map)return;pathLayer.clearLayers();cityLayer.clearLayers();const e=event();
  if(e.class==='solar' && Array.isArray(e.path)){
    const latlng=e.path.map(p=>[p[0],p[1]]);
    L.polyline(latlng,{color:'#ffb85c',weight:5,opacity:.9,dashArray:'10 8'}).addTo(pathLayer);
    e.cities?.forEach(c=>{L.circleMarker([c.lat,c.lon],{radius:6,color:'#07111f',weight:2,fillColor:'#8fe3db',fillOpacity:1}).bindTooltip(`${c.name} · ${typeLabel(c.status)}`).on('click',()=>choosePlace({...c,name:`${c.name}, ${c.country}`})).addTo(cityLayer)});
    if(!state.place && e.path.length) map.fitBounds(latlng,{padding:[40,40],maxZoom:4});
  } else if(e.class==='lunar'){
    // Broad, reference-only visibility region: visually distinct, translucent overlay.
    // This is illustrative only and not a local prediction.
    const visCircle=L.circle([20,0],{radius:14000000,color:'#6c9cff',weight:1,fillColor:'#6c9cff',fillOpacity:0.18}).addTo(pathLayer);
    visCircle.bindPopup(`<strong>${esc(e.label)}</strong><br>${esc(e.region)}<br><em>${t('mapReferenceNote')}</em>`);
    // No city markers from embedded lunar dataset (local circumstances are not included).
    if(!state.place) map.setView([20,0],2);
  }
  updatePlaceMarker()
}
function updatePlaceMarker(){if(!map)return;if(placeMarker)placeMarker.remove();if(state.place){placeMarker=L.marker([state.place.lat,state.place.lon],{title:state.place.name}).addTo(map);placeMarker.bindPopup(`<strong>${esc(state.place.name)}</strong>`);} }
function chooseEvent(id){state.eventId=id;save();renderEvents();renderSelect();renderBrief();renderMap();toast(t('eventSelected',{date:event().label}))}
function choosePlace(p){state.place={name:p.name||`${p.name}, ${p.country||''}`.replace(/, $/,'') ,lat:Number(p.lat),lon:Number(p.lon)};renderBrief();updatePlaceMarker();if(map)map.flyTo([state.place.lat,state.place.lon],Math.max(5,Math.min(11,p.zoom||8)),{duration:.65});toast(t('placeSelected',{name:state.place.name}))}
async function searchPlaces(query){const status=$('#place-status'),out=$('#place-results');out.innerHTML='';status.textContent=t('searching');try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`,{headers:{Accept:'application/json'}});if(!r.ok)throw Error();const places=await r.json();if(!places.length){status.textContent=t('noPlaces');return}status.textContent=t('results',{count:places.length});out.innerHTML=places.map((p,i)=>`<li><button class="place-result" data-index="${i}" type="button"><strong>${esc(p.display_name.split(',').slice(0,2).join(','))}</strong><span>${esc(p.display_name)}</span></button></li>`).join('');$$('.place-result').forEach(b=>b.onclick=()=>{const p=places[Number(b.dataset.index)];choosePlace({name:p.display_name.split(',').slice(0,2).join(','),lat:p.lat,lon:p.lon,zoom:10});out.innerHTML='';status.textContent=t('placeChosen')})}catch{status.textContent=t('searchError')}}
function useLocation(){if(!navigator.geolocation){toast(t('geoUnavailable'));return}toast(t('locating'));navigator.geolocation.getCurrentPosition(p=>choosePlace({name:t('yourLocation'),lat:p.coords.latitude,lon:p.coords.longitude,zoom:9}),()=>toast(t('geoDenied')),{timeout:8000})}
function exportCalendar(){const e=event(),p=state.place;const safe=(p.name||'location').replace(/[^a-z0-9]+/gi,'-').toLowerCase();const s=findSupported(p,e);const detail=s?`${typeLabel(s.status)} eclipse; maximum ${s.maximum||'see source'}; ${s.duration||s.coverage||''}`:'Exact local circumstances are not included in the Eclipse Atlas embedded dataset. See authoritative source.';const summary = `${typeLabel(e.type)} ${e.class==='lunar'?'Lunar':'Solar'} Eclipse — ${p.name}`;download(`eclipse-atlas-${e.id}-${safe}.ics`,`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Eclipse Atlas//EN\r\nBEGIN:VEVENT\r\nUID:eclipse-atlas-${e.id}-${safe}\r\nDTSTAMP:20260831T000000Z\r\nDTSTART;VALUE=DATE:${e.id.replaceAll('-','')}\r\nSUMMARY:${summary}\r\nLOCATION:${p.name}\r\nDESCRIPTION:${detail}\r\nURL:${e.source}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`,'text/calendar');toast(t('calendarDone'))}
function download(name,data,type){const b=new Blob([data],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(u)}
function translate(){document.documentElement.lang=state.lang;$$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$$('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));$('#language').value=state.lang;renderEvents();renderSelect();renderBrief();renderMap();if(typeof renderSupportedCities==='function')renderSupportedCities()}
function init(){document.documentElement.dataset.theme=state.theme;$('#field-notes').value=localStorage.getItem('ea-notes')||'';initMap();renderEvents();renderSelect();renderBrief();$('#language').onchange=e=>{state.lang=e.target.value;save();translate()};$('#theme-toggle').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=state.theme;save();toast(t('themeSaved'))};$('#event-select').onchange=e=>chooseEvent(e.target.value);
  $$('.filter-chip').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;$$('.filter-chip').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on)});renderEvents()});
  $$('.class-chip').forEach(b=>b.onclick=()=>{state.classFilter=b.dataset.class;$$('.class-chip').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on)});renderEvents()});
  $('#place-search-form').onsubmit=e=>{e.preventDefault();const q=$('#place-search-input').value.trim();if(q.length<2){$('#place-status').textContent=t('searchTooShort');return}searchPlaces(q)};$('#use-location').onclick=useLocation;  $('#hero-location').onclick=()=>{document.querySelector('#place-search-input').focus();document.querySelector('#explorer').scrollIntoView({behavior:'smooth'})};
    // Wire explorer entry buttons so the location entry focuses the place input and toggles active state
    $('#location-entry').onclick=()=>{document.getElementById('location-entry').classList.add('active');document.getElementById('browse-entry').classList.remove('active');document.querySelector('#place-search-input').focus();document.querySelector('#explorer').scrollIntoView({behavior:'smooth'})};
    $('#browse-entry').onclick=()=>{document.getElementById('browse-entry').classList.add('active');document.getElementById('location-entry').classList.remove('active');document.querySelector('#place-search-input').blur();document.querySelector('#explorer').scrollIntoView({behavior:'smooth'})};
  
    $('#reset-map').onclick=()=>{state.place=null;renderBrief();renderMap();toast(t('mapReset'))};$('#archive-locations').innerHTML=ECLIPSES.filter(e=>e.id==='2026-08-12')[0].cities.map(c=>`<button class="archive-location" type="button" data-city="${esc(c.name)}"><strong>${c.name}</strong><span>${c.country}</span><small>${typeLabel(c.status)}</small></button>`).join('');$$('.archive-location').forEach(b=>b.onclick=()=>{chooseEvent('2026-08-12');const c=ECLIPSES[0].cities.find(x=>x.name===b.dataset.city);choosePlace({...c,name:`${c.name}, ${c.country}`})});$('#field-notes').oninput=e=>{localStorage.setItem('ea-notes',e.target.value);$('#notes-status').textContent=t('localOnly')};$('#download-notes').onclick=()=>download('eclipse-atlas-notes.txt',`Eclipse Atlas dataset v${DATASET_VERSION}\n\n${$('#field-notes').value}`,'text/plain');
  // Sources dialog
  const dialog=$('#sources-dialog'),open=()=>dialog.showModal();$('#sources-button').onclick=open;$('.dialog-close').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close()}
  // News section rendering (static, curated)
  const NEWS=[
    {id:'n1',publisher:'NASA / GSFC',titleKey:'newsCard1Title',labelKey:'newsCardLabelEvergreen',date:'Verified',summaryKey:'newsCard1Summary',link:'https://eclipse.gsfc.nasa.gov/'},
    {id:'n2',publisher:'NASA',titleKey:'newsCard2Title',labelKey:'newsCardLabelEvergreen',date:'Verified',summaryKey:'newsCard2Summary',link:'https://science.nasa.gov/eclipses/future-eclipses/'},
    {id:'n3',publisher:'NASA',titleKey:'newsCard3Title',labelKey:'newsCardLabelEvergreen',date:'Verified',summaryKey:'newsCard3Summary',link:'https://eclipse.gsfc.nasa.gov/lunar.html'},
    {id:'n4',publisher:'American Astronomical Society',titleKey:'newsCard4Title',labelKey:'newsCardLabelDate',date:'2024-01-01',summaryKey:'newsCard4Summary',link:'https://eclipse.aas.org/'}
  ];
  function renderNews(){const container=$('#news-cards');if(!container)return;container.innerHTML=NEWS.map(n=>`<article class="news-card"><h3>${t(n.titleKey)}</h3><p class="publisher">${n.publisher} · <span class="label">${t(n.labelKey)}</span> ${n.date}</p><p class="summary">${t(n.summaryKey)}</p><p><a class="button button-secondary" href="${n.link}" target="_blank" rel="noopener noreferrer">${t('newsReadMore')}</a></p></article>`).join('')} 
  renderNews();
  function renderSupportedCities(){
    const container=$('#supported-cities-list');
    if(!container) return;
    const eventsWithCities = ECLIPSES.filter(e=>Array.isArray(e.cities)&&e.cities.length>0);
    if(eventsWithCities.length===0){ container.innerHTML = `<p>${t('supportedCitiesNone')}</p>`; return }
    container.innerHTML = eventsWithCities.map(e=>{
      const header = `<div class="sc-event-head"><strong>${esc(e.label)}</strong> · ${typeLabel(e.type)} · ${classLabel(e.class)}</div>`;
      const cities = (e.cities||[]).map(c=>`<li><button class="sc-city-button" data-event="${e.id}" data-lat="${c.lat}" data-lon="${c.lon}" type="button">${esc(c.name)}, ${esc(c.country||'')}</button></li>`).join('');
      return `<section class="sc-event">${header}<ul class="sc-city-list">${cities}</ul></section>`;
    }).join('');
    $$('.sc-city-button').forEach(b=>b.addEventListener('click',()=>{const ev=b.dataset.event;const lat=Number(b.dataset.lat);const lon=Number(b.dataset.lon);chooseEvent(ev);choosePlace({name:b.textContent.trim(),lat:lat,lon:lon,zoom:10})}));
  }
  renderSupportedCities();
}
document.addEventListener('DOMContentLoaded',init);window.EclipseAtlas={DATASET_VERSION,ECLIPSES};
})();
