import React from 'react' ;
import axios from 'axios' ;
import {Link} from 'react-router-dom' ;


class VehicleList extends React.Component {
  state = {
    vehicles: []
  }
  componentDidMount(){
axios.get('http://127.0.0.1:8000/api/vehicle/').then(res=>{
  this.setState({vehicles:res.data})
})
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
<center><button class='btn btn-warning' style={{marginBottom:'20px'}} >+ new driver</button></center>
<table class="table table-striped">
  <thead style={{backgroundColor:'#ced6e2'}}>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Driver</th>
      <th scope="col">Detail</th>
    </tr>
  </thead>
  <tbody>
  {this.state.vehicles.map(vehicle=>{
    return(
      <tr>
        <td ><center><img src={'http://127.0.0.1:8000'+vehicle.image} width='250px' /></center></td>
        <td>{vehicle.name}</td>
        <td><Link to={'/driver/'+vehicle.driver.driver_id+'/'}>{vehicle.driver.driver_username}</Link></td>
        <td><button class='btn btn-warning' onClick={()=>{this.props.history.push('/vehicle/'+vehicle.id+'/')}}>more detail</button></td>
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
