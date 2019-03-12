import React from 'react' ;
import axios from 'axios' ;
import {Link} from 'react-router-dom' ;


class DriverList extends React.Component {
  state = {
    drivers: []
  }
  componentDidMount(){
axios.get('http://127.0.0.1:8000/api/driver/').then(res=>{
  this.setState({drivers:res.data})
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
      <th scope="col">Vehicle</th>
      <th scope="col">Detail</th>
    </tr>
  </thead>
  <tbody>
  {this.state.drivers.map(driver=>{
    return(
      <tr>
        <td ><center><img src={'http://127.0.0.1:8000'+driver.image} width='150px' /></center></td>
        <td>{driver.username}</td>
        <td><Link to={'/vehicle/'+driver.vehicle.vehicle_id+'/'}>{driver.vehicle.vehicle_name}</Link></td>
        <td><button class='btn btn-warning' onClick={()=>{this.props.history.push('/driver/'+driver.id+'/')}}>more detail</button></td>
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
export default DriverList ;
