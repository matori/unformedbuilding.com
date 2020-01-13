jQuery(function ($) {

  var summary,
      browser,
      os;

  Highcharts.setOptions({
    chart: {
      zoomType: 'y'
    },
    xAxis: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true
    },
    symbols: 'circle',
    colors:['#268bd2', '#cb4b16', '#859900', '#839496', '#dc322f', '#002b36', '#6c71c4', '#2aa198'],
    credits: {
      enabled: false
    }
  });

  summary = new Highcharts.Chart({

    chart: {
      renderTo: 'summary'
    },

    title: {
      text: 'Summary'
    },

    yAxis: {
      min: 0,
      labels: {
        align: 'right',
        formatter: function() {
          return Highcharts.numberFormat(this.value, 0);
        }
      }
    },

    series: [
      {
        name: 'Page Views',
        data: [6120, 7051, 8725, 9753, 11136, 11490, 13650, 14866, 20888]
      },
      {
        name: 'Visits',
        data: [4246, 4857, 5517, 6221, 7059, 7398, 8881, 9816, 13792]
      },
      {
        name: 'Unique Visitors',
        data: [3798, 4301, 4728, 5327, 5937, 6245, 7476, 7897, 11301]
      },
      {
        name: 'New Visitors',
        data: [3641, 4132, 4508, 5092, 5609, 5854, 6980, 7267, 10423]
      }
    ]

  });

  browser = new Highcharts.Chart({

    chart: {
      renderTo: 'browser'
    },

    title: {
      text: 'Browser'
    },

    yAxis: {
      min: 0,
      labels: {
        formatter: function() {
          return this.value + '%';
        }
      }
    },

    series: [
      {
        name: 'Internet Explorer',
        data: [37.80, 37.02, 32.16, 29.74, 25.97, 24.70, 25.01, 22.39, 16.38]
      },
      {
        name: 'Firefox',
        data: [29.63, 30.66, 33.73, 33.10, 33.72, 33.78, 33.18, 33.12, 32.15]
      },
      {
        name: 'Google Chrome',
        data: [17.48, 18.47, 21.88, 22.28, 25.32, 27.06, 27.83, 30.23, 34.05]
      },
      {
        name: 'Safari',
        data: [8.17, 8.30, 7.92, 8.99, 9.55, 8.73, 8.51, 8.55, 9.79]
      },
      {
        name: 'Opera',
        data: [3.23, 2.55, 1.99, 2.04, 2.24, 2.07, 1.86, 1.89, 1.53]
      },
      {
        name: 'Lunascape',
        data: [3.13, 2.18, 1.76, 2.64, 1.80, 1.89, 1.67, 1.48, 0.97]
      },
      {
        name: 'Mozilla Compatible Agent',
        data: [0.40, 0.54, 0.29, 0.50, 0.95, 0.80, 0.80, 0.97, 3.21]
      },
      {
        name: 'Android Browser',
        data: [0, 0, 0, 0, 0.16, 0.57, 0.64, 0.81, 1.47]
      }
    ]

  });


});