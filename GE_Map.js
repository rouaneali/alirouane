
//Créer une map
var mymap = L.map('mapid');
mymap.setView([29,-8.89], 5);

//Créer un Layer
Layer= L.geoJSON(regions,{onEachFeature:onEachFeature});
Layer.addTo(mymap);


var Hydda_Base = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

Hydda_Base.addTo(mymap);




function Comparor(part1,part2){
    return part2.voix-part1.voix
}

function onEachFeature(feature,layer) {

    var popupContent = "";
    var data = [];


    for (var party in feature.properties) {

        if (party != "Nom_Region" && party != "Code_Regio") {

            var party_obj = eval("(function(){return " + feature.properties[party] + ";})()");


            if (party_obj.hasOwnProperty("voix")) {

                data.push({name:party_obj.name,y:party_obj.sieges,voix:party_obj.voix,pourcentage:party_obj.pourcentage})
            }
        }



    }

    data.sort(Comparor);
    data.splice(10,data.length-10);
	
    feature.parties =  [{
        name: 'Sièges',
        colorByPoint: true,
        data: data
    }];
	feature.parties.region=feature.properties.Nom_Region;
	
	
	popupContent='<div id="chart" style="min-width: 300px; height: 200px; max-width: 600px; margin: 0 auto"></div>'

    layer.bindPopup(popupContent);

    layer.on({
		click: update_chart,
        mouseover:highlightFeature,
        mouseout: resetHighlight
    });
}

function update_chart(e){
    Chart(e.target.feature.parties);
}




var legend = L.control({position: 'bottomright'});
legend.onAdd = function (e) {
	var data=e.target.feature.parties.data;
    var div = L.DomUtil.create('div', 'info legend');
	for (var i = 0; i < 10; i++){
		div.innerHTML+= "<b>" + data[i].name + "</b>:" + data[i].voix + "</br>";
		
		
//		for (var i = 0; i < ; i++) {
//         div.innerHTML +=
//             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
//             grades[i].toFixed(0) + (grades[i + 1] ? '&ndash;' + grades[i + 1].toFixed(0) + '<br>' : '+');
//     }
	
	}
	
	
    return div;
};
legend.update=function(e){
    this.remove();
    this.addTo(mymap);
};
legend.addTo(mymap);


function resetHighlight(e) {
    Layer.resetStyle(e.target);
}
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        dashArray: '',
        fillOpacity: 1
    });
}

function MouseOn(e){
	highlightFeature(e); 
	legend.update(e);
	
	
}










