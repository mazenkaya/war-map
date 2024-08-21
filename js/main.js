var map = L.map("map", {
    center: [15.8, 31.0],
    zoom: 5.5
});

var osm = L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png");

map.addLayer(osm);

var drawItems = new L.FeatureGroup();

map.addLayer(drawItems);

var drawControl = new L.Control.Draw({
    edit: {
        
        featureGroup: drawItems

    }, 
    draw: {
        polygon: {
            shapeOptions: {
                color: "#c0392b",
                fillColor: "#e74c3c"
            }
        },
        polyline: {
            shapeOptions: {
                color: "#c0392b",
            }
        },
        circle: {
            shapeOptions: {
                color: "#c0392b",
                fillColor: "#e74c3c"
            }
        },
        marker: false,
        circlemarker: false,
        rectangle: false
    }
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {

    var layer = event.layer;

    drawItems.addLayer(layer);
    
});


var geocoder = L.Control.Geocoder.nominatim();

L.Control.geocoder({

   query: "",
   
   placeholder: "Searh the location",

   geocoder: geocoder

}).addTo(map);

var rotateIcons = document.querySelectorAll(".icons .box img");

rotateIcons.forEach(icon => {
    
    icon.addEventListener("dblclick", function (e) {
        this.classList.toggle("rotated");        
    });

});

var markers = [];

var currentIcon = null;

var clickHandler = function () {};

var isDrawing = false;

function enableDrawing() {

    isDrawing = true;

    map.off("click", clickHandler);

};

function enableIconPlacement() {

    isDrawing = false;

    map.on("click", clickHandler);

}

function iconClick(icon, iconLink, iconRotated = null, iconSize) {
    
    document.querySelector(icon).onclick = function (e) {

        if (!isDrawing) {
    
            e.target.parentElement.parentElement.querySelectorAll(".active").forEach(ep => {
    
                ep.classList.remove("active");
    
            });

            e.target.classList.add("active");

            currentIcon = iconLink;
    
            map.off("click", clickHandler);
            
            clickHandler = function (m) {
                
                if (!isDrawing) {

                    if (e.target.classList.contains("rotated")) {
                        
                        currentIcon = iconRotated;
            
                    }
                    
                    var iconOptions = {
                    
                        iconUrl: currentIcon,
                        
                        iconSize: iconSize
        
                    }
        
                    var customIcon = L.icon(iconOptions);
        
                    var markerOptions = {
        
                        clickable: true,
                        draggable: true,
                        icon: customIcon
        
                    }
        
                    var marker = L.marker(m.latlng, markerOptions).addTo(map);
        
                    markers.push(marker);
                }
    
            }
    
            map.on("click", clickHandler);
            
        }

    };

}

iconClick(".arrmy", "./images/army.png", "./images/army.png", [40, 40]);
iconClick(".army-tank", "./images/tank.png" , "./images/flip-tank.png", [40, 40]);
iconClick(".cannon", "./images/cannon.png", "./images/flip-cannon.png", [40, 40]);
iconClick(".r-lancher", "./images/r-lancher.png", "./images/flip-r-lancher.png", [40, 40]);
iconClick(".apache", "./images/apache.png", "./images/apache.png", [40, 40]);
iconClick(".iran-uav", "./images/iran-uav.png", "./images/flip-iran-uav.png", [40, 40]);
iconClick(".mig", "./images/fighter.png", "./images/flip-fighter.png", [40, 40]);
iconClick(".fire", "./images/fire.png", "./images/fire.png", [40, 40]);

map.on("draw:drawstart", function () {
    enableDrawing();
});

map.on("draw:drawstop", function () {
    enableIconPlacement();
});


document.querySelector(".reset").onclick =  function () {

    markers.forEach(marker => {
        
        map.removeLayer(marker);

    });
    
};

document.querySelector(".delete").onclick = function () {
        
    map.eachLayer(function (layer) {

        if (layer instanceof L.Marker) {

            layer.on("click", function (e) {

                map.removeLayer(e.target);

                markers = markers.filter(function (marker) {

                    return marker !== e.target;
                    
                });
                
            })
            
        }            
    })
    
}

document.querySelector(".home").onclick = function () {

    map.setView([15.8, 31.0], 5.5);
    
}

function goTo(element, coordinates, zoom) {

    document.querySelector(element).onclick = function () {
        
        map.setView(coordinates, zoom);
    
    }
    
}

goTo(".sinar", [13.5678621, 33.5670069], 13);
goTo(".fasher", [13.6213349, 25.3545692], 13);
goTo(".khartoum", [15.5974252, 32.5355855], 14);
goTo(".omdurman", [15.6500340, 32.4819200], 14);
goTo(".bahri", [15.6569431, 32.5485920], 14);


document.querySelector(".navigation .show").onclick = function () {

    var wrap = document.querySelector(".navigation");

    wrap.classList.toggle("open");

    if (wrap.classList.contains("open")) {
        
        this.innerHTML = "<i class='fa-solid fa-angle-down'></i>";

    } else {

        this.innerHTML = "<i class='fa-solid fa-angle-up'></i>";

    }

};

document.querySelector(".icons .show").onclick = function () {
    
    var icons = document.querySelector(".icons");
    
    icons.classList.toggle("open");

    if (icons.classList.contains("open")) {
        
        this.innerHTML = "<i class='fa-solid fa-angle-right'></i>";

    } else {

        this.innerHTML = "<i class='fa-solid fa-angle-left'></i>";

    }

};
