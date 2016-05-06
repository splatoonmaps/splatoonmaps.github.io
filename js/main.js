$(function() {

  var newData = [];
  var mapNames = [];
  var turfWar = [];
  var splatZones = [];
  var towerControl = [];
  var rainMaker = [];
  var lastUpdate = '';

  //Bootstrap
  $('body').tooltip({
    selector: '[data-toggle=tooltip]'
  });

  //load JSON (via d3.js, gonna implement graph rendering through it later)
  //(╯°□°)╯︵ ┻━┻
  d3.json("data/data.json", function(error, data) {

    //define lastUpdate
    lastUpdate = data.lastUpdate;

    //my JSON is garbage and I can't wrap my head around it to make it work in d3
    for (var key in data) {
        var obj = data[key];
        mapNames.push(key);

        for (var prop in obj) {
          if (prop == "turfwar") {
            turfWar.push(obj[prop]);
          } else if (prop == "splatzones") {
            splatZones.push(obj[prop]);
          } else if (prop == "towercontrol") {
            towerControl.push(obj[prop]);
          } else if (prop == "rainmaker") {
            rainMaker.push(obj[prop]);
          }
        }
    }

    for (var i = 0; i < mapNames.length; i++) {
      newData[i] = {
        name         : mapNames[i],
        turfwar      : turfWar[i],
        splatzones   : splatZones[i],
        towercontrol : towerControl[i],
        rainmaker    : rainMaker[i]
      }
    }

    //delete last element in Array (don't need it there)
    newData = newData.splice(0, newData.length-1);

    update(newData);
  });

  //Update Schtuff (need to implement d3.js for graph stuff at some point)
  function update(data) {
    console.log(data);

    //insert lastUpdate into HTML
    $('.last-update').append('<strong>Last update</strong>' + lastUpdate);

    //render stuff for every map
    for (var i = 0; i < data.length; i++) {

      //Combine all rotations for each Map
      var dataTotal = data[i].splatzones.total + data[i].towercontrol.total + data[i].rainmaker.total;


      //To-Do: needs some clean up
      $('.content')
        .append($('<div class="col-xs-12 col-md-6">')
          .append($('<div class="map">')
            .append($('<div class="map-image">')
              .append('<h2>' + data[i].name + '</h2>')
              .append('<img src="img/' + data[i].name.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z-]/g, '') + '.jpg" title="' + data[i].name + '">')
            )
            //just display latest rotations
            .append($('<div>')
              .append('<p>Turf War: ' + convertTime(data[i].turfwar.latest) + '</p>')
              .append('Splat Zones: ' + convertTime(data[i].splatzones.latest) + '</p>')
              .append('Tower Control: ' + convertTime(data[i].towercontrol.latest) + '</p>')
              .append('Rainmaker: ' + convertTime(data[i].rainmaker.latest) + '</p>')
            )
            //overall rotation graph
            .append($('<div class="graph-overall">')
              .append('<div class="graph-name">Overall</div>')
              .append(buildGraph(data[i].splatzones.total,data[i].towercontrol.total,data[i].rainmaker.total,"b"))
            )
            //divider
            .append($('<div class="graph-divider">')
              .append('<div class="divider-text"><span>Distribution per month</span></div>')
            )
            //display graph for each month
            .append($('<div class="graph-month">')
              .append('<div class="graph-name">Aug 2015</div>')
              .append(buildGraph(data[i].splatzones.aug2015,data[i].towercontrol.aug2015,data[i].rainmaker.aug2015,"s"))
              .append('<div class="graph-name">Sep 2015</div>')
              .append(buildGraph(data[i].splatzones.sep2015,data[i].towercontrol.sep2015,data[i].rainmaker.sep2015,"s"))
              .append('<div class="graph-name">Oct 2015</div>')
              .append(buildGraph(data[i].splatzones.oct2015,data[i].towercontrol.oct2015,data[i].rainmaker.oct2015,"s"))
              .append('<div class="graph-name">Nov 2015</div>')
              .append(buildGraph(data[i].splatzones.nov2015,data[i].towercontrol.nov2015,data[i].rainmaker.nov2015,"s"))
              .append('<div class="graph-name">Dec 2015</div>')
              .append(buildGraph(data[i].splatzones.dec2015,data[i].towercontrol.dec2015,data[i].rainmaker.dec2015,"s"))
              .append('<div class="graph-name">Jan 2016</div>')
              .append(buildGraph(data[i].splatzones.jan2016,data[i].towercontrol.jan2016,data[i].rainmaker.jan2016,"s"))
              .append('<div class="graph-name">Feb 2016</div>')
              .append(buildGraph(data[i].splatzones.feb2016,data[i].towercontrol.feb2016,data[i].rainmaker.feb2016,"s"))
              .append('<div class="graph-name">Mar 2016</div>')
              .append(buildGraph(data[i].splatzones.mar2016,data[i].towercontrol.mar2016,data[i].rainmaker.mar2016,"s"))
              .append('<div class="graph-name">Apr 2016</div>')
              .append(buildGraph(data[i].splatzones.apr2016,data[i].towercontrol.apr2016,data[i].rainmaker.apr2016,"s"))
              .append('<div class="graph-name">May 2016</div>')
              .append(buildGraph(data[i].splatzones.may2016,data[i].towercontrol.may2016,data[i].rainmaker.may2016,"s"))
            )
          )
      )
    };
  }
});

//build graph if any rotation was found
//if not, display empty graph
function buildGraph(a,b,c,d){
  if(d == "s"){
    if(a != 0 || b != 0 || c !=0) {
      return '<div class="graph-small">' +
              '<div class="bar splatzones" style="width:' + (a/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Splat Zone rotations: ' + a + '"></a>' +
              '</div>' +
              '<div class="bar towercontrol" style="width:' + (b/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Tower Control rotations: ' + b + '"></a>' +
              '</div>' +
              '<div class="bar rainmaker" style="width:' + (c/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Rainmaker rotations: ' + c + '"></a>' +
              '</div>' +
             '</div>';
    } else {
      return '<div class="graph-small">' +
                '<div class="bar" style="width:100%"><a href="" data-toggle="tooltip" data-placement="top" title="No data available – Map was either not yet available or playable"></a></div>' +
             '</div>';
    }
  } else if(d == "b") {
    if(a != 0 || b != 0 || c !=0) {
      return '<div class="graph-big">' +
              '<div class="bar splatzones" style="width:' + (a/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Splat Zones">' + a + '</a>' +
              '</div>' +
              '<div class="bar towercontrol" style="width:' + (b/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Tower Control">' + b +'</a>' +
              '</div>' +
              '<div class="bar rainmaker" style="width:' + (c/(a+b+c))*100 + '%;">' +
                '<a href="" data-toggle="tooltip" data-placement="top" title="Rainmaker">' + c + '</a>' +
              '</div>' +
             '</div>';
    } else {
      return '<div class="graph-big">' +
                '<div class="bar" style="width:100%"><a href="" data-toggle="tooltip" data-placement="top" title="No data available – Map was either not yet available or playable"></a></div>' +
             '</div>';
    }
  }
};

//convert Time
function convertTime(isoString){
  var date = new Date(isoString);
  date = date.toString();

  return date;
};
