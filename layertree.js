/* set of layers with which to populate my custom controls */

var layerMenuSet = {
  layers: {
    
  },

  controls: {
    indexDropdown: {
      CDD: {
        index: 'CDD',
        name: 'Maximum length of dry spell',
        description: 'Maximum number of consecutive days with RR < 1mm',
        controlType: 'css_dropdown',
        options: {
          seasonDropdown: ['ann'],
          typeDropdown: ['vals', 'trend', 'avg']
        }
      },
      CSDI: {
        index: 'CSDI',
        name: 'Cold spell duration index',
        description: 'Annual count of days with at least 6 consecutive days when TN < 10th percentile',
        controlType: 'css_dropdown',
        options: {
          seasonDropdown: ['ann'],
          typeDropdown: ['vals', 'trend', 'avg']
        }
      },


    },
    seasonDropdown: {
  
    },
    typeDropdown: {
  
    }
  }

}