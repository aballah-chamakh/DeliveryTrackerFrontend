import React from 'react' ;
import axios from 'axios' ;
import {Link} from 'react-router-dom' ;


class VehicleList extends React.Component {
  state = {
    vehicles: []
  }
  componentDidMount(){
  let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
axios.get('http://127.0.0.1:8000/api/vehicle/',config).then(res=>{
  this.setState({vehicles:res.data})
})
  }
  new_vehicle = ()=>{
    this.props.history.push('/vehicle/create/')
  }
  delete_vehicle = (vehicle_id,idx)=>{
    console.log('let us delete');
    axios.delete('http://127.0.0.1:8000/api/vehicle/'+vehicle_id+'/').then(res=>{
      let vehicles = this.state.vehicles
      vehicles.splice(idx,1)
      this.setState({vehicles:vehicles})
    })
  }
  handle_tracking_change = (e,vehicle_idx,vehicle_id)=>{
    let checked = e.target.checked
    let vehicles = this.state.vehicles
    vehicles[vehicle_idx].tracked = checked
    let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
    let data = {tracked:checked}
    axios.put('http://127.0.0.1:8000/api/vehicle/'+vehicle_id+'/toogle_tracking/',data,config).then(res=>{
      console.log(res.data);
    })
    this.setState({vehicles:vehicles})
  }
  render(){
    return(
      <div>
<div class='row' style={{marginTop:'100px'}}>
<div class='col-lg-4 offset-lg-4'>
<img src={localStorage.getItem('user_img')} height='2
00px' width='100%' />
</div>
</div>
<div class='row' style={{marginTop:'50px'}}><div class='col-lg-12'>
<center><button class='btn btn-warning' style={{marginBottom:'20px'}} onClick={this.new_vehicle} >+ new vehicle</button></center>
<table class="table table-striped">
  <thead style={{backgroundColor:'#ced6e2'}}>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Driver</th>
      <th scope="col">Detail</th>
      <th scope="col">Delete</th>
      <th scope="col">Track it</th>
    </tr>
  </thead>
  <tbody>
  {this.state.vehicles.map((vehicle,idx)=>{
    return(
      <tr>
        <td ><center><img src={'http://127.0.0.1:8000'+vehicle.image} width='250px' /></center></td>
        <td>{vehicle.name}</td>
        <td>{vehicle.driver != null  ? <Link to={'/driver/'+vehicle.driver.driver_id+'/'}>{vehicle.driver.driver_username}</Link>: 'none'}</td>
        <td><button class='btn btn-warning' onClick={()=>{this.props.history.push('/vehicle/'+vehicle.id+'/update/')}}>update</button></td>
        <td><button class='btn btn-primary' onClick={()=>{this.delete_vehicle(vehicle.id,idx)}}>delete</button></td>
        <td><center><input type='checkbox' style={{height:'20px',width:'20px'}} checked={vehicle.tracked} onClick={(e)=>{this.handle_tracking_change(e,idx,vehicle.id)}} /></center></td>
    </tr>
    )
  })

  }

  </tbody>
</table>
</div></div>
      </div>
    )
  }
}
export default VehicleList ;
