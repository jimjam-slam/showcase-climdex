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
  transparent: true
};

var months_short = ['ann', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul',
  'aug', 'sep', 'oct', 'nov', 'dec'];
var outputs_short = ['series'];

var indices = [
  {
    short: 'ACCESS10',
    all_months: false
  },
  {
    short: 'CDD',
    all_months: false,
  },
  {
    short: 'CSDI',
    all_months: false,
  },
  {
    short: 'CWD',
    all_months: false,
  },
  {
    short: 'DTR',
    all_months: true,
  },
  {
    short: 'FD',
    all_months: false,
  },
  {
    short: 'GSL',
    all_months: false,
  },
  {
    short: 'ID',
    all_months: false,
  },
  {
    short: 'PRCPTOT',
    all_months: false,
  },
  {
    short: 'R10mm',
    all_months: false,
  },
  {
    short: 'R20mm',
    all_months: false,
  },
  {
    short: 'R99p',
    all_months: false,
  },
  {
    short: 'Rx1day',
    all_months: true,
  },
  {
    short: 'Rx5day',
    all_months: true,
  },
  {
    short: 'SDII',
    all_months: false,
  },
  {
    short: 'SU',
    all_months: false,
  },
  {
    short: 'TN10p',
    all_months: true,
  },
  {
    short: 'TXx',
    all_months: true,
  },
  {
    short: 'TXn',
    all_months: true,
  },
];

var climdex_indices = {};
for (index of indices) {
  if (index.all_months == true) {
    for (i = 0; i < months_short.length; i++) {
      for (j = 0; j < outputs_short.length; j++) {
        climdex_indices[
          index.short + '_' + months_short[i] + '_' + outputs_short[j]] =
          L.timeDimension.layer.wms(
            L.tileLayer.wms(
              geoserver_base,
              L.extend({ layers: index.short + '_' + months_short[i] + '_' + outputs_short[j] },
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
            L.extend({ layers: index.short + '_ann_' + outputs_short[j] },
              geoserver_options)),
          { cache: 67 });
    }
  } else {
    console.log('Invalid all_months option for ' + index.short);
  }
};

/* matches to be used to add descriptions to items */
var matches = {
  TXx: 'Hottest daily max temp',
  TXn: 'Coolest daily max temp',
  TN10p: 'Pct days w/ min temp <10th pct',
  SU: 'Num summer days',
  SDII: 'Simple precip intensity index',
  Rx5day: 'Precip on rainiest 5-day stretch',
  Rx1day: 'Precip on rainiest day',
  R99p: 'Total precip when rain rate >99th pct',
  R20mm: 'Num. days w/ \u226520mm precip',
  R10mm: 'Num. days w/ \u226510mm precip',
  PRCPTOT: 'Annual total precip',
  ID: 'Num icing days',
  GSL: 'Growing season length',
  FD: 'Number of frost days',
  DTR: 'Daily temperature range',
  CWD: 'Max wet spell length',
  CSDI: 'Cold spell duration index',
  CDD: 'Max dry spell length',
  ann: 'Year',
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
  trend: 'Trend',
  avg: 'Average'
};
