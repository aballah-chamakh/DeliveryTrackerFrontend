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
this.ws_client = new WebSocket('ws://127.0.0.1:8000/ws/driver_delivery_company/?token='+localStorage.getItem('token'))
this.ws_client.onopen = (event)=>{
  console.log(event);
}
this.ws_client.onmessage = (event)=>{
  console.log(event);
}
this.ws_client.onclose = (event)=>{
  console.log(event);
}

let drivers = []
let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
axios.get('http://127.0.0.1:8000/api/driver/?map=true',config).then(res=>{
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
let map = new mapboxgl.Map({
 container: this.mapContainer,
 style: 'mapbox://styles/mapbox/streets-v9',
 zoom:1,
});
this.map = map
map.on('load', function () {
console.log('map loaded');
map.addLayer({
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
map.on('mousemove',(e)=>{
this.setState({coordinates:JSON.stringify(e.lngLat)})
})
map.on('click','vehicules',(e)=>{
let coordinates = e.features[0].geometry.coordinates;
let description = e.features[0].properties.description;
let drivername = e.features[0].properties.title;
let driverimage = 'http://127.0.0.1:8000'+e.features[0].properties.image ;
var popup = new mapboxgl.Popup({closeOnClick: true})
.setLngLat(coordinates)
.setHTML("<div width='200' ><div class='row'  ><div class='col-lg-6'><img src="+driverimage+" height='100' width='100%' /></div><div class='col-lg-6'><h4 class='text-primary'>"+drivername+"</h4><button class='btn btn-primary'>detail</button></div></div></div>")
.addTo(map) })
map.on('mouseenter', 'places', function () {
map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves
map.on('mouseleave', 'places', function () {
map.getCanvas().style.cursor = '';
});



}
moveTo = (coordinate)=>{
  console.log(coordinate);
  this.map.flyTo({center:[coordinate.latitude,coordinate.longtitude],zoom:5,speed: 0.4,curve: 1})
}
render(){
return(
 <div class='row' style={{marginTop:'100px'}}>
 <div class='col-lg-4' style={{overflow:'scroll',height:'600px'}}>
 <ul class="list-group">
   <li class="list-group-item bg-light" >
    <center style={{color:'grey'}}>List of drivers</center>

   </li>
   {this.state.drivers.map(driver=>{
     return(
       <li class="list-group-item d-flex justify-content-between align-items-center">
        <img src={'http://127.0.0.1:8000'+driver.image} height='50px' width='50px' />
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
