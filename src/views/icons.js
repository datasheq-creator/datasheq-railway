// Inline SVG icons (24×24, stroke = currentColor)
const P = {
  legal:
    '<path d="M12 3v17"/><path d="M8 20.5h8"/><path d="M4 7h16"/><path d="M12 5 4 7m8-2 8 2"/><path d="M4 7 1.6 13a2.5 2.5 0 0 0 4.8 0z"/><path d="M20 7l-2.4 6a2.5 2.5 0 0 0 4.8 0z"/>',
  controla:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14 2 2 4-4"/>',
  previene:
    '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
  lidera: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  acredita:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10.8" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4"/><path d="M15 10h3M15 13.5h3"/>',
  capacita:
    '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  investiga:
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/><path d="M10.5 7.6v3.4"/><path d="M10.5 13.6v.1"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  check: '<path d="M5 12.5 9.5 17 19 7.5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M6.5 3.8v16.4L20 12z"/>',
  smartphone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 5.5h3"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.3v.1"/>',
  login: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M4 12h11"/><path d="m11 8 4 4-4 4"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  robot:
    '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1.2"/><circle cx="9" cy="13" r="1.3"/><circle cx="15" cy="13" r="1.3"/><path d="M2 12.5v2.5M22 12.5v2.5"/>',
  chart: '<path d="M4 20h17"/><path d="M6 20v-5M10.5 20v-8M15 20v-6M19.5 20V9"/><path d="m5 11 5-4 4 3 6-6"/><path d="M17 4h3v3"/>',
  bolt: '<path d="M13.5 2.5 5 13.5h6l-1.5 8 8.5-11h-6z"/>',
  shield:
    '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
  tick: '<path d="M4.5 12.5 9.5 17.5 19.5 6"/>',
};

function icon(name, { size = 24, cls = '', strokeWidth = 1.8 } = {}) {
  return `<svg class="icon ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || ''}</svg>`;
}

// Filled green download arrow used in the header (as in the design)
const downloadIcon = `<svg class="icon" width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.3 2h5.4v7.6h4.4L12 16.9 4.9 9.6h4.4z" fill="currentColor"/><rect x="4" y="19.4" width="16" height="2.3" rx="1.15" fill="currentColor"/></svg>`;

module.exports = { icon, downloadIcon };
