import React from 'react' ;
import axios from 'axios' ;
import {withRouter} from 'react-router-dom'

class CreateVehicle extends React.Component {
state = {
  drivers : [] ,
  vehicle_to_update : {} ,
  form : {
    vehicle_name : {value:'',error_msg:'',valid:true} ,
    driver_id :''  ,
    img : {url:'', file: ''}  ,

  }
}
componentDidMount(){
  let vehicle_id = ''
  if (this.props.mode == 'update'){
  let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
  let url = 'http://127.0.0.1:8000/api/vehicle/'
  vehicle_id = this.props.match.params.id
  axios.get(url+vehicle_id+'/',config).then(res=>{
    let vehicle = res.data
    let state = this.state
    state.form.vehicle_name.value = vehicle.name
    if (vehicle.driver != null ) {
      console.log(vehicle.driver.driver_id);
      state.form.driver_id = vehicle.driver.driver_id
    }
    else {
      state.form.driver_id = vehicle.driver
    }
    state.form.img.url = 'http://127.0.0.1:8000'+vehicle.image
    state.vehcile_to_update = vehicle
    this.setState({state:state})
  })
}
let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
axios.get('http://127.0.0.1:8000/api/driver/',config).then(res=>{
    // this.setState({drivers:res.data})
    let drivers = res.data
    drivers.map((driver,idx)=>{
      if (this.props.mode == 'update' && driver.vehicle && driver.vehicle.vehicle_id == vehicle_id ){
      drivers[idx]['checked'] = true }
      else {
        drivers[idx]['checked'] = false
      }
    })
    console.log(drivers);
    this.setState({drivers:drivers})
  }
  )
}

handle_vehicle_name_change = (e)=>{
  let form = this.state.form
  form.vehicle_name.value = e.target.value
  this.setState({form:form})

}
validate_vehicle_name = ()=>{
// check if it is a unique email
let vehicle = this.state.form.vehicle_name.value
let valid = true
let form = this.state.form
if (vehicle.length == 0){
  form.vehicle_name.error_msg = 'this field is required'
  valid = false
  this.setState({form:form})
}
console.log(valid);
return valid
}
handle_image_change = (e)=>{
  let img_file = e.target.files[0]
  let img_url = URL.createObjectURL(img_file)
  let img = {url:img_url,file:img_file}
  let form = this.state.form
  form['img'] = img
  this.setState({form:form})
}

handle_picking_driver = (e,idx)=>{
let checked = e.target.checked
let state = this.state
state.drivers[idx].checked = checked
if (checked == true){
state.form.driver_id = state.drivers[idx].id
state.drivers.map((driver,idx)=>{
  if (driver.id != state.form.driver_id )
  state.drivers[idx].checked = false
})
}
if(checked == false && state.drivers[idx].id == this.state.form.driver_id){
  state.form.driver_id = ''
}
this.setState({state:state})

}

create_vehicle=()=>{
if (this.validate_vehicle_name()){
  console.log('let us create a new vehicle');
  let form = this.state.form
  let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
  let formData = new FormData()
  formData.append('name',form.vehicle_name.value)
  if (form.driver_id || this.props.mode != 'update'){
  formData.append('driver_id',form.driver_id)
}
  if(form.img.file || this.props.mode != 'update'){
  formData.append('image_file',form.img.file)
}
// if(this.props.mode == 'update') {
//   let should_update = false
//   if (this.state.vehicle_to_update.name != form.vehicle_name.value ){
//     console.log('update vehicle name ');
//   formData.append('name',form.vehicle_name.value)
//    should_update = true }
//
//   if(this.state.vehicle_to_update.driver){
//    if(this.state.vehicle_to_update.driver.driver_id != form.driver_id){
//     console.log('update driver ');
//   formData.append('driver_id',form.driver_id)
//    should_update = true
//  }
//  }
//   if (form.img.file){
//     console.log('update image ');
//   formData.append('image',form.img.file)
//   should_update = true }
//   if(should_update == true ){
//    axios.put('http://127.0.0.1:8000/api/vehicle/'+this.props.match.params.id+'/',formData,config).then(res=>{
//     this.props.history.push('/vehicles/')
//   })
// }
// }
if(this.props.mode == 'update') {
  axios.put('http://127.0.0.1:8000/api/vehicle/'+this.props.match.params.id+'/',formData,config).then(res=>{
     this.props.history.push('/vehicles/')
   })
}
else {

  axios.post('http://127.0.0.1:8000/api/vehicle/',formData,config).then(res=>{
   this.props.history.push('/vehicles/')
 })

}
}

}




render(){

  return(
    <div class='row'>
         <div class='col-lg-8 offset-lg-2' style={{marginTop:'100px'}} >
         <center>
         <img style={{marginBottom:'10px'}} src={this.state.form.img.url ? this.state.form.img.url : 'http://127.0.0.1:8000/media/vehicle_img.jpg'}  height='200px' width='300px' />
      <br/>
      <input type='file' onChange={(e)=>{this.handle_image_change(e)}} style={{display:'none'}} ref={inp_img=>this.inp_img=inp_img} />
         <button style={{marginBottom:'10px'}} onClick={()=>{this.inp_img.click()}} class='btn btn-secondary' >upload</button>
         </center>
         <div class="form-group row">
            <label for="vehicle_name" class="col-sm-2 col-form-label">Vehicle Name</label>
             <div class="col-sm-10">
                <input type="text" class="form-control" id="vehicle_name" placeholder="vehicle name" onChange={(e)=>{this.handle_vehicle_name_change(e)}} value={this.state.form.vehicle_name.value} />
             </div>
          </div>
          <span style={{fontSize:'18px'}}>Select a driver : </span>
          <div class='row' style={{overflow:'scroll',height:'200px'}} >
          <div class='col-lg-12'>
          <ul class="list-group">
          {this.state.drivers.map((driver,idx)=>{
            return(
              <li class="list-group-item " >

                <img style={{height:'50px',width:'50px',display:'inline',borderRadius:'5px'}} src={'http://127.0.0.1:8000'+driver.image} />
              <span style={{display:'inline',marginLeft:'5%',fontSize:'18px',color:'grey'}}>{driver.username} currently drive {driver.vehicle ? driver.vehicle.vehicle_name : 'nothing'}</span>
              <input style={{float:'right',dispaly:'inline',height:'20px',width:'20px'}} type="checkbox" height='50px' aria-label="Checkbox for following text input" onClick={(e)=>{this.handle_picking_driver(e,idx)}} checked={driver.checked} />

              </li>
            )
          })
            }
            </ul>
           </div>
           </div>
           <center>
           <span>NB: in case of the driver that you will choose have already a vehicle this last one it will be free </span>
           <button style={{marginTop:'10px'}} class='btn btn-warning' onClick={this.create_vehicle} >Create vehicle</button></center>
         </div>
    </div>
  )
}


}
export default withRouter(CreateVehicle)  ;
