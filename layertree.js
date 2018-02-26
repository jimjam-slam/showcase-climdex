/* set of layers with which to populate my custom controls */

var baseLayerSet = {
  layers: {
    'CDD_ann_series': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'CDD_ann_series' })),
      { cache: 12 }),
    'CSDI_ann_series': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'CSDI_ann_series' })),
      { cache: 12 }),
    'TXx_ann_series': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'TXx_ann_series' })),
      { cache: 12 }),
    'TXx_jan_series': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'TXx_jan_series' })),
      { cache: 12 }),
    'TXx_jul_series': L.timeDimension.layer.wms(
      L.tileLayer.wms(
        geoserver_base + '/climdex/wms?',
        $.extend({}, geoserver_options, { layers: 'TXx_jul_series' })),
      { cache: 12 })
  },

  controls: {
    primaryDropdown: {
      CDD: {
        name: 'CDD',
        description: 'Maximum length of dry spell: maximum number of consecutive days with RR < 1mm',
        controlType: 'css_dropdown',
        other_options: {
          seasonDropdown: ['ann'],
          typeDropdown: ['series']
        }
      },
      CSDI: {
        name: 'CSDI',
        description: 'Cold spell duration index: annual count of days with at least 6 consecutive days when TN < 10th percentile',
        controlType: 'css_dropdown',
        other_options: {
          seasonDropdown: ['ann'],
          typeDropdown: ['series']
        }
      },
      TXx: {
        name: 'TXx',
        description: 'Monthly maximum value of daily maximum temperature',
        controlType: 'css_dropdown',
        other_options: {
          seasonDropdown: ['ann', 'jan', 'jul'],
          typeDropdown: ['series']
        }
      }
    },
    others: {
      seasonDropdown: {
        ann: 'Year',
        jan: 'January',
        jul: 'July'
      },
      typeDropdown: {
        series: 'Series'
      }
    }
  }
}
