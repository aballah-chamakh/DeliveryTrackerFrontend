import React from 'react' ;
import mapboxgl from 'mapbox-gl' ;
import axios from 'axios' ;
import {Link} from 'react-router-dom' ;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbWFraCIsImEiOiJjanNqNmlidjEwcGZkM3p0YmQ1bWU1NXFwIn0.NyeXU7JL3SkRM3g1T2_ZcQ'
class MapView extends React.Component {
state = {
coordinates : null ,
drivers : [] ,
drivers_map : [] ,
}
componentDidMount(){
    let drivers = []
axios.get('http://127.0.0.1:8000/api/driver/').then(res=>{
console.log(res.data);
this.setState({drivers:res.data})
  res.data.map((driver)=>{
   drivers.push({
  "type": "Feature",
  "geometry": {
  "type": "Point",
  "coordinates": [driver.vehicle.coordinate.latitude, driver.vehicle.coordinate.longtitude]
  },
  "properties": {
  "title": driver.username,
  "image":driver.image ,
  "icon": "bus"
  }
  })
})
})
this.setState({drivers_map:drivers})
 this.map = new mapboxgl.Map({
 container: this.mapContainer,
 style: 'mapbox://styles/mapbox/streets-v9',
 zoom:1,
});
this.map.on('load', function () {
console.log('map loaded');
this.map.addLayer({
"id": "vehicules",
"type": "symbol",
"source": {
"type": "geojson",
"data": {
"type": "FeatureCollection",
"features": drivers ,
}
},
"layout": {
"icon-image": "{icon}-15",
"text-field": "{title}",
"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
"text-offset": [0, 0.6],
"text-anchor": "top",
"icon-allow-overlap": true
}
});
});
this.map.on('mousemove',(e)=>{
this.setState({coordinates:JSON.stringify(e.lngLat)})
})
this.map.on('click','vehicules',(e)=>{
let coordinates = e.features[0].geometry.coordinates;
let description = e.features[0].properties.description;
let drivername = e.features[0].properties.title;
let driverimage = 'http://127.0.0.1:8000'+e.features[0].properties.image ;
var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(coordinates)
.setHTML("<div width='200' ><div class='row'  ><div class='col-lg-6'><img src="+driverimage+" height='100' width='100%' /></div><div class='col-lg-6'><h4 class='text-primary'>"+drivername+"</h4><button class='btn btn-primary'>detail</button></div></div></div>")
.addTo(this.map) })
this.map.on('mouseenter', 'places', function () {
this.map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
this.map.on('mouseleave', 'places', function () {
this.map.getCanvas().style.cursor = '';
});



}
moveTo = (coordinate)=>{
  console.log(coordinate);
  this.map.flyTo({center:[coordinate.latitude,coordinate.longtitude],zoom:10,speed: 0.4,curve: 1})
}
render(){
return(
 <div class='row' style={{marginTop:'100px'}}>
 <div class='col-lg-4'>
 <ul class="list-group">
   <li class="list-group-item bg-light" >
    <center style={{color:'grey'}}>List of drivers</center>

   </li>
   {this.state.drivers.map(driver=>{
     return(
       <li class="list-group-item d-flex justify-content-between align-items-center">
        <span color='grey'>{driver.username}</span>
         <button class='btn btn-warning' onClick={()=>{this.moveTo(driver.vehicle.coordinate)}}>Fly to</button>
       </li>
     )
   })

   }

 </ul>
 </div>

 <div class='col-lg-8'  ref={mapContainer=>this.mapContainer=mapContainer} style={{height:'600px'}} >

 </div>
 </div>
)
}
}
export default MapView
