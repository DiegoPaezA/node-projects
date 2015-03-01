$(function(){
    document.body.style.background = "#a6d8f1"; //change background color
    var chart;
    var socket = io.connect();
    socket.emit('changeState', '{"state":6}'); //pag 3
    chart_A = new Highcharts.Chart({
        chart: {
            renderTo: 'chart_A',
            defaultSeriesType: 'spline',
            events: {
                load: function() {
                  socket.on('plotHRV-1', function (data) {
                    console.log("client receve rr: " + data);
                    var series =  chart_A.series[0];
                    series.setData(data);
                    /*
                    for (i = 0; i < data.length; i++) {
                      series.addPoint([i,data[i]]);
                    }
                    */
                  });
                }
              }
            },
            plotOptions: {
            series: {
                color: 'black',
                marker: {  enabled: true, fillColor: '#BF0B23', radius: 2 },
                lineWidth: 1
                }
            },
            title: {
                text: 'HRV'
            },
            xAxis: {
              title: {
                  text: 'Time[ms]'
              }

            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                title: {
                    text: 'RR[ms]',
                    margin: 40
                }
            },
            series: [{
                name: "HRV - 1",
                data: []
            }]
        });


    chart_B = new Highcharts.Chart({
        chart: {
            renderTo: 'chart_B',
            defaultSeriesType: 'spline',
            events: {
                load: function() {
                  socket.on('plotHRV-2', function (data) {
                    console.log("client receve rr -2: " + data);
                    var series =  chart_B.series[0];
                    series.setData(data);
                    /*
                    for (i = 0; i < data.length; i++) {
                      series.addPoint([i,data[i]]);
                    }
                    */
                  });
                }
              }
            },
            plotOptions: {
            series: {
                color: 'black',
                marker: {  enabled: true, fillColor: '#BF0B23', radius: 2 },
                lineWidth: 1
                }
            },
            title: {
                text: 'HRV'
            },
            xAxis: {
              title: {
                  text: 'Time[ms]'

              }
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2,
                title: {
                    text: 'RR[ms]',
                    margin: 40
                }
            },
            series: [{
              name: "HRV - 2",
              data: []
            }]
        });


});
