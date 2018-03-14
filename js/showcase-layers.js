/* set of layers with which to populate my custom controls */

// base options for all geoserver wms requests
var geoserver_base = 'http://localhost:8080/geoserver/climdex/wms?';
var geoserver_options = {
  service: 'WMS',
  version: '1.1.0',
  request: 'GetMap',
  format: 'image/png',
  className: 'blend_multiply',
  transparent: true
};

var months_short = ['ann', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul',
  'aug', 'sep', 'oct', 'nov', 'dec'];
var months_long = ['Year', 'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var outputs_short = ['series'];
var outputs_long = ['Series'];

var indices = [
  {
    short: 'CDD',
    long: 'CDD: Max dry spell length',
    all_months: false,
  },
  {
    short: 'CSDI',
    long: 'CSDI: Cold spell duration index',
    all_months: false,
  },
  {
    short: 'CWD',
    long: 'CWD: Max wet spell length',
    all_months: false,
  },
  {
    short: 'DTR',
    long: 'DTR: Daily temperature range',
    all_months: true,
  },
  {
    short: 'FD',
    long: 'FD: Number of frost days',
    all_months: false,
  },
  {
    short: 'GSL',
    long: 'GSL: Growing season length',
    all_months: false,
  },
  {
    short: 'ID',
    long: 'ID: Num icing days',
    all_months: false,
  },
  {
    short: 'PRCPTOT',
    long: 'PRCPTOT: Annual total precip',
    all_months: false,
  },
  {
    short: 'R10mm',
    long: 'R10mm: Num days w/ \u226510mm precip',
    all_months: false,
  },
  {
    short: 'R20mm',
    long: 'R20mm: Num. days w/ \u226520mm precip',
    all_months: false,
  },
  {
    short: 'R99p',
    long: 'R99p: Total precip when rain rate >99th pct',
    all_months: false,
  },
  {
    short: 'Rx1day',
    long: 'Rx1day: Precip on rainiest day',
    all_months: true,
  },
  {
    short: 'Rx5day',
    long: 'Rx5day: Precip on rainiest 5-day stretch',
    all_months: true,
  },
  {
    short: 'SDII',
    long: 'SDII: Simple precip intensity index',
    all_months: false,
  },
  {
    short: 'SU',
    long: 'SU: Num summer days',
    all_months: false,
  },
  {
    short: 'TN10p',
    long: 'TN10p: Pct days w/ min temp <10th pct',
    all_months: true,
  },
  {
    short: 'TXx',
    long: 'TXx: Hottest daily max temp',
    all_months: true,
  },
  {
    short: 'TXn',
    long: 'TXn: Coolest daily max temp',
    all_months: true,
  },
];

var climdex_indices = {};

for (index of indices) {

  if (index.all_months == true) {

    for (i = 0; i < months_short.length; i++) {
      for (j = 0; j < outputs_short.length; j++) {
        climdex_indices[
          index.long + '_' + months_long[i] + '_' + outputs_long[j]] =
          L.timeDimension.layer.wms(
            L.tileLayer.wms(
              geoserver_base + '/climdex/wms?',
              L.extend({ layers: index.short + '_' + months_short[i] + '_' + outputs_short[j] },
                geoserver_options)),
            { cache: 67 });
      }
    }

  } else if (index.all_months == false) {

    for (j = 0; j < outputs_short.length; j++) {
      climdex_indices[index.long + '_Year_' + outputs_long[j]] =
        L.timeDimension.layer.wms(
          L.tileLayer.wms(
            geoserver_base + '/climdex/wms?',
            L.extend({ layers: index.short + '_ann_' + outputs_short[j] },
              geoserver_options)),
          { cache: 67 });
    }

  } else {
    console.log('Invalid all_months option for ' + index.short);
  }

};
