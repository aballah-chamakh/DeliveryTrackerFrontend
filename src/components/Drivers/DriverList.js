import React from 'react' ;
import axios from 'axios' ;
import {Link} from 'react-router-dom' ;


class DriverList extends React.Component {
  state = {
    drivers: []
  }
  componentDidMount(){
    let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
axios.get('http://127.0.0.1:8000/api/driver/',config).then(res=>{
  this.setState({drivers:res.data})
})
  }


  new_driver = ()=>{
    this.props.history.push('/driver/create/')
  }
  delete_driver = (driver_idx,driver_id)=>{

    axios.delete('http://127.0.0.1:8000/api/driver/'+driver_id+'/').then(res=>{
      console.log(res.data);
      let drivers = this.state.drivers
      drivers.splice(driver_idx,1)
      this.setState({drivers:drivers})
    })

  }
  render(){
    return(
      <div>
<div class='row' style={{marginTop:'100px'}}>
<div class='col-lg-4 offset-lg-4'>
<img src={localStorage.getItem('user_img')} height='20px' width='100%' />
</div>
</div>
<div class='row' style={{marginTop:'50px'}}><div class='col-lg-12'>
<center><button class='btn btn-warning' style={{marginBottom:'20px'}} onClick={this.new_driver} >+ new driver</button></center>
<table class="table table-striped">
  <thead style={{backgroundColor:'#ced6e2'}}>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Vehicle</th>
      <th scope="col">Detail</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody>
  {this.state.drivers.map((driver,idx)=>{
    return(
      <tr>
        <td ><center><img src={'http://127.0.0.1:8000'+driver.image} width='150px' /></center></td>
        <td>{driver.username}</td>
        <td>{driver.vehicle ? <Link to={'/vehicle/'+driver.vehicle.vehicle_id+'/'}>{driver.vehicle.vehicle_name}</Link> : 'none' }</td>
        <td><button class='btn btn-warning' onClick={()=>{this.props.history.push('/driver/'+driver.id+'/')}}>more detail</button></td>
        <td><button class='btn btn-primary' onClick={()=>{this.delete_driver(idx,driver.id)}}>delete</button></td>

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
