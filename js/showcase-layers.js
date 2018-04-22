/* set of layers with which to populate my custom controls */

// base options for all geoserver wms requests
var geoserver_base = 'https://climdex.org/geoserver/showcase/wms?';
var geoserver_options = {
  service: 'WMS',
  version: '1.1.0',
  request: 'GetMap',
  srs: 'EPSG:4326',
  format: 'image/png',
  className: 'blend_multiply',
  transparent: true,
  updateWhenIdle: false
};

var months_short = ['ann', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul',
  'aug', 'sep', 'oct', 'nov', 'dec'];
var outputs_short = ['series', 'avg', 'trendval'];

var indices = [
  {
    short: 'CDD',
    all_months: false,
    env_series: 'low:10;high:366',
    units_series: 'days',
    env_avg: 'low:14;high:239',
    units_avg: 'days',
    env_trendval: 'low:-2;mid:0;high:2',
    units_trendval: 'days/yr'
  },
  {
    short: 'CSDI',
    all_months: false,
    env_series: 'low:0;high:50',
    units_series: 'days',
    env_avg: 'low:0;high:10',
    units_avg: 'days',
    env_trendval: 'low:-0.6;mid:0;high:0.6',
    units_trendval: 'days/yr'
  },
  {
    short: 'CWD',
    all_months: false,
    env_series: 'low:0;high:30',
    units_series: 'days',
    env_avg: 'low:1;high:19',
    units_avg: 'days',
    env_trendval: 'low:-0.15;mid:0;high:0.15',
    units_trendval: 'days/yr'
  },
  {
    short: 'DTR',
    all_months: true,
    env_series: 'low:2;high:23',
    units_series: '&deg;C',
    env_avg: 'low:2;high:22',
    units_avg: '&deg;C',
    env_trendval: 'low:-0.09;mid:0;high:0.09',
    units_trendval: '&deg;C/yr'
  },
  {
    short: 'FD',
    all_months: false,
    env_series: 'low:0;high:330',
    units_series: 'days',
    env_avg: 'low:0;high:305',
    units_avg: 'days',
    env_trendval: 'low:-1.3;mid:0;high:1.3',
    units_trendval: 'days/yr'
  },
  {
    short: 'GSL',
    all_months: false,
    env_series: 'low:0;high:366',
    units_series: 'days',
    env_avg: 'low:0;high:366',
    units_avg: 'days',
    env_trendval: 'low:-1.2;mid:0;high:1.2',
    units_trendval: 'days/yr'
  },
  {
    short: 'ID',
    all_months: false,
    env_series: 'low:0;high:285',
    units_series: 'days',
    env_avg: 'low:0;high:270',
    units_avg: 'days',
    env_trendval: 'low:-1.1;mid:0;high:1.1',
    units_trendval: 'days/yr'
  },
  {
    short: 'PRCPTOT',
    all_months: false,
    env_series: 'low:0;high:3500',
    units_series: 'mm',
    env_avg: 'low:0;high:2630',
    units_avg: 'mm',
    env_trendval: 'low:-12.5;mid:0;high:12.5',
    units_trendval: 'mm/yr'
  },
  {
    short: 'R10mm',
    all_months: false,
    env_series: 'low:0;high:110',
    units_series: 'days',
    env_avg: 'low:0;high:90',
    units_avg: 'days',
    env_trendval: 'low:-0.32;mid:0;high:0.32',
    units_trendval: 'days/yr'
  },
  {
    short: 'R20mm',
    all_months: false,
    env_series: 'low:0;high:60',
    units_series: 'days',
    env_avg: 'low:0;high:42',
    units_avg: 'days',
    env_trendval: 'low:-0.45;mid:0;high:0.45',
    units_trendval: 'days/yr'
  },
  {
    short: 'R95p',
    all_months: false,
    env_series: 'low:0;high:1500',
    units_series: 'mm',
    env_avg: 'low:0;high:875',
    units_avg: 'mm',
    env_trendval: 'low:-12.5;mid:0;high:12.5',
    units_trendval: 'mm/yr'
  },
  {
    short: 'R99p',
    all_months: false,
    env_series: 'low:0;high:900',
    units_series: 'mm',
    env_avg: 'low:0;high:280',
    units_avg: 'mm',
    env_trendval: 'low:-3;mid:0;high:3',
    units_trendval: 'mm/yr'
  },
  {
    short: 'Rx1day',
    all_months: true,
    env_series: 'low:0;high:425',
    units_series: 'mm',
    env_avg: 'low:0;high:200',
    units_avg: 'mm',
    env_trendval: 'low:-1.1;mid:0;high:1.1',
    units_trendval: 'mm/yr'
  },
  {
    short: 'Rx5day',
    all_months: true,
    env_series: 'low:0;high:940',
    units_series: 'mm',
    env_avg: 'low:0;high:370',
    units_avg: 'mm',
    env_trendval: 'low:-1.7;mid:0;high:1.7',
    units_trendval: 'mm/yr'
  },
  {
    short: 'SDII',
    all_months: false,
    env_series: 'low:0;high:50',
    units_series: 'mm',
    env_avg: 'low:0;high:30',
    units_avg: 'mm',
    env_trendval: 'low:-0.45;mid:0;high:0.45',
    units_trendval: 'mm/yr'
  },
  {
    short: 'SU',
    all_months: false,
    env_series: 'low:0;high:366',
    units_series: 'days',
    env_avg: 'low:0;high:366',
    units_avg: 'days',
    env_trendval: 'low:-2;mid:0;high:2',
    units_trendval: 'days/yr'
  },
  {
    short: 'TN10p',
    all_months: true,
    env_series: 'low:0;high:25',
    units_series: '%',
    env_avg: 'low:0;high:25',
    units_avg: '%',
    env_trendval: 'low:-1.4;mid:0;high:1.4',
    units_trendval: 'p.p./yr'
  },
  {
    short: 'TN90p',
    all_months: true,
    env_series: 'low:0;high:30',
    units_series: '%',
    env_avg: 'low:0;high:30',
    units_avg: '%',
    env_trendval: 'low:-1.2;mid:0;high:1.2',
    units_trendval: 'p.p./yr'
  },
  {
    short: 'TNn',
    all_months: true,
    env_series: 'low:-60;high:23',
    units_series: '&deg;C',
    env_avg: 'low:-60;high:23',
    units_avg: '&deg;C',
    env_trendval: 'low:-0.25;mid:0;high:0.25',
    units_trendval: '&deg;C/yr'
  },
  {
    short: 'TNx',
    all_months: true,
    env_series: 'low:-30;high:35',
    units_series: '&deg;C',
    env_avg: 'low:-30;high:35',
    units_avg: '&deg;C',
    env_trendval: 'low:-0.25;mid:0;high:0.25',
    units_trendval: '&deg;C/yr'
  },
  {
    short: 'TR',
    all_months: false,
    env_series: 'low:0;high:366',
    units_series: 'days',
    env_avg: 'low:0;high:366',
    units_avg: 'days',
    env_trendval: 'low:-2.4;mid:0;high:2.4',
    units_trendval: 'days/yr'
  },
  {
    short: 'TX10p',
    all_months: true,
    env_series: 'low:0;high:100',
    units_series: '%',
    env_avg: 'low:0;high:30',
    units_avg: '%',
    env_trendval: 'low:-1.35;mid:0;high:1.35',
    units_trendval: 'p.p./yr'
  },
  {
    short: 'TX90p',
    all_months: true,
    env_series: 'low:0;high:100',
    units_series: '%',
    env_avg: 'low:0;high:25',
    units_avg: '%',
    env_trendval: 'low:-1.1;mid:0;high:1.1',
    units_trendval: 'p.p./yr'
  },
  {
    short: 'TXn',
    all_months: true,
    env_series: 'low:-55;high:35',
    units_series: '&deg;C',
    env_avg: 'low:-55;high:35',
    units_avg: '&deg;C',
    env_trendval: 'low:-0.25;mid:0;high:0.25',
    units_trendval: '&deg;C/yr'
  },
  {
    short: 'TXx',
    all_months: true,
    env_series: 'low:5;high:50',
    units_series: '&deg;C',
    env_avg: 'low:5;high:50',
    units_avg: '&deg;C',
    env_trendval: 'low:-0.2;mid:0;high:0.2',
    units_trendval: '&deg;C/yr'
  },
  {
    short: 'WSDI',
    all_months: false,
    env_series: 'low:0;high:140',
    units_series: 'days',
    env_avg: 'low:0;high:23',
    units_avg: 'days',
    env_trendval: 'low:-1.2;mid:0;high:1.2',
    units_trendval: 'days/yr'
  },
];

var climdex_indices = {};
// ALERT - this is ES2015!
for (index of indices) {
  if (index.all_months == true) {
    for (i = 0; i < months_short.length; i++) {
      for (j = 0; j < outputs_short.length; j++) {
        climdex_indices[
          index.short + '_' + months_short[i] + '_' + outputs_short[j]] =
          L.timeDimension.layer.wms(
            L.tileLayer.wms(
              geoserver_base,
              L.extend({
                layers: index.short + '_' + months_short[i] + '_' +
                  outputs_short[j],
                env: index['env_' + outputs_short[j]],
                leg_units: index['units_' + outputs_short[j]]
              },
              geoserver_options)),
            { cache: 67 });
      }
    }
  } else if (index.all_months == false) {
    for (j = 0; j < outputs_short.length; j++) {
      climdex_indices[index.short + '_ann_' + outputs_short[j]] =
        L.timeDimension.layer.wms(
          L.tileLayer.wms(
            geoserver_base,
            L.extend({
              layers: index.short + '_ann_' + outputs_short[j],
              env: index['env_' + outputs_short[j]],
              leg_units: index['units_' + outputs_short[j]]
            }, geoserver_options)),
          { cache: 67 });
    }
  } else {
    console.log('Invalid all_months option for ' + index.short);
  }
};

/* matches to be used to add descriptions to items */
var matches = {
  TXx: 'Hottest day',
  TXn: 'Coolest day',
  TX10p: 'Frac. cool days',
  TX90p: 'Frac. hot days',
  TNx: 'Warmest night',
  TNn: 'Coldest night',
  TN10p: 'Frac. cold nights',
  TN90p: 'Frac. warm nights',
  SU: 'Summer days',
  TR: 'Tropical nights',
  SDII: 'Simple precip. intensity index',
  Rx5day: 'Max 5-day precip.',
  Rx1day: 'Max 1-day precip.',
  R95p: 'Precip. on very wet days',
  R99p: 'Precip. on extremely wet days',
  R20mm: 'Num. very heavy precip. days',
  R10mm: 'Num. heavy precip. days',
  PRCPTOT: 'Total precip.',
  ID: 'Num. ice days',
  GSL: 'Growing season length',
  FD: 'Num. frost days',
  DTR: 'Daily Temp Range',
  CWD: 'Max wet spell length',
  CSDI: 'Cold spell duration index',
  WSDI: 'Warm spell duration index',
  CDD: 'Max dry spell length',

  ann: 'Annual',
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December',
  series: 'Series',
  trendval: 'Trend (1951&ndash;2017)',
  avg: 'Average (1951&ndash;2017)'
};

// initialise layer control
var climdex_indices_control =
  L.control.layers.comboBaseLayer(climdex_indices, {}, {
    position: 'topleft',
    matches: matches,
    menu_count: 3,
    menu_delimiter: '_'
  });
