//Google map API
$(document).ready(function(){
    
        var map; //basic map setup
        var centerLatlng= new google.maps.LatLng(-40.930, 173.050); //center location
        var minZoomLevel = 12;        //minzoom
        var MY_MAPTYPE_ID = "custom_style"; //customize style
        var markers = []; //Set up markers arraylist
        var lastinfowindow;
        var locIndex;
        
    
        //======  Image marker setting ======
    
        //This is the data as JS array... and should put the type and lat long... inside here
        var data = [
            {title:'Frenchman &#8211 Bay', content:'<img src="image/Abel Tasman.jpg"',lat:"-40.938444",long:"173.058625",type:'Animals'},
            
            {title:'Abel Tasman', lat:"-40.936624",long:"173.058164",type:"Plants"},
            
            {title:'Abel Tasman Walkway', lat:"-40.939611",long:"173.061179",type:"Spots"}
        ];
        
        //A function that translate a given type
        function getIcon(type){
             switch(type){
             case "Animals": return "image/zoo.png";
             case "Plants": return "image/forest.png";
             case "Spots": return "image/mountains.png";
             }
        }
        
//        var i, newMarker;
//
//        for (i = 0; i < spots.length; i++) {
//           newMarker = new google.maps.Marker({
//           position: new google.maps.LatLng(spots[i][1], spots[i][2]),
//           map: map,
//           title: spots[i][0]
//         });
//
//         newMarker.category = spots[i][3];
//         newMarker.setVisible(false);
//
//         markers.push(newMarker);
//       }    
//        
//        function displayMarkers(category) {
//        var i;
//        for (i = 0; i < markers.length; i++) {
//        if (markers[i].category === category) {
//        markers[i].setVisible(true);
//           }
//           else {
//             markers[i].setVisible(false);
//           }
//         }
//        }
        
        
        //Setting up the customize style, able to change code in here with Json Wizard
        var style_Tasman = [
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
              { "hue": "#00ffff" },
              { "color": "#1b8080" }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#F24C32" },
              { "weight": 1 }
            ]
          }      
        ];   
        
        //  For the map basic set up    
        var mapOptions = {    
          //Default to Abel Tasman National Park    
          center: centerLatlng,
          zoom:minZoomLevel,  
          //disableUI
          disableDefaultUI:true,
          
          mapTypeControlOptions:{  
          mapTypeIds:[google.maps.MapTypeId.ROADMAP,MY_MAPTYPE_ID]
          },
          mapTypeId: MY_MAPTYPE_ID
        }
          
        map = new google.maps.Map(document.getElementById("map"),mapOptions);
        
        // Data for marker
        data.forEach(function(mapData,idx){
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(mapData.lat,mapData.long),
                title: mapData.title,
                icon: getIcon(mapData.type)
            });
            
        // info window + content html
            var contentHtml="<div style='width:300px; height:200px'><h3>"+mapData.title+"</h3>"+mapData.content+"</div>";
            var infowindow = new google.maps.InfoWindow({
                content:contentHtml
            });
        //  google click marker function    
            google.maps.event.addListener(marker,'click',function(){
        if(lastinfowindow instanceof google.maps.InfoWindow) lastinfowindow.close();
        marker.infowindow.open(map,marker);
        lastinfowindow = marker.infowindow;
            });
            marker.locid = idx+1;
            marker.infowindow = infowindow;
            markers[markers.length] = marker;
         
        //are we all done? not 100% sure of this
            if(marker.length ==data.length) doFilter();
        
        });
    
        //everytime change the checkbox.
        
        function doFilter(){
            if(!locIndex){
            locIndex = {};
            
            for(var x = 0, len=markers.length; x < len; x++){
                locIndex[markers[x].locid]= x;
            }
        }
            
        //what's checked?
		var checked = $("input[type=checkbox] checked");
		var selTypes = [];
		for(var i=0, len=checked.length; i<len; i++) {
			selTypes.push($(checked[i]).val());
		}
		for(var i=0, len=data.length; i<len; i++) {
			var sideDom = "p.loc[data-locid="+(i+1)+"]";

			//Only hide if length != 0
			if(checked.length !=0 && selTypes.indexOf(data[i].type) < 0) {
				$(sideDom).hide();
				markers[locIndex[i+1]].setVisible(false);
			} else {
				$(sideDom).show();
				markers[locIndex[i+1]].setVisible(true);
			}
		}
	}

	$(document).on("click", "input[type=checkbox]", doFilter);

    
            
//      =====Bounds for Abel Tasman Park=====
        var strictBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-41.11,171.50),
            new google.maps.LatLng(-40.18,173.34)
        );
        //Listen for the dragend event
            
        google.maps.event.addListener(map,'dragend',function(){
        if(strictBounds.contains(map.getCenter()))return;
            
        // We're out of bounds - Move the map back within the bounds
            
        var c = map.getCenter();
            x = c.lng();
            y = c.lat();
            maxX = strictBounds.getNorthEast().lng(),
            maxY = strictBounds.getNorthEast().lat(),
            minX = strictBounds.getSouthWest().lng(),
            minY = strictBounds.getSouthWest().lat();

            if (x < minX) x = minX;
            if (x > maxX) x = maxX;
            if (y < minY) y = minY;
            if (y > maxY) y = maxY;
            map.setCenter(new google.maps.LatLng(y, x));
            
       });

       // Limit the zoom level
       google.maps.event.addListener(map, 'zoom_changed', function() {
       if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
       });        
      

//      ======   Custom style name for style map ======
        var styledMapOptions ={
          name:'Custom Style'
        };
        
        var customMapType = new google.maps.StyledMapType(style_Tasman,styledMapOptions);
        
        map.mapTypes.set(MY_MAPTYPE_ID,customMapType);
        
        //} //The ending of initialize
            
        //The line belows call the function to initialize() to loadup the map    
        // google.maps.event.addDomListener(window, 'load', initialize);
        
});

     