import React from 'react' ;
import axios from 'axios' ;

class CreateDriver extends React.Component {
  state = {
    vehicles : [],
    form : {
      img : {file:'',url:''},
      vehicle_id : '',
      email : {value:'',error_msg:''},
      username : {value:'',error_msg:''},
      password : {value:'',error_msg:''},
      confirm_password : {value:'',error_msg:''}
    }
  }
  componentDidMount(){

    let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;
    axios.get('http://127.0.0.1:8000/api/vehicle/',config).then(res=>{
      let vehicles = res.data
      vehicles.map((vehicle,idx)=>{
        vehicles[idx]['checked'] = false
      })
      this.setState({vehicles:vehicles})
    }
    )
  }
  handle_field_change = (e,field)=>{
    let form = this.state.form
    form[field].value = e.target.value
    this.setState({form:form})
  }
  handle_image_change = (e)=>{
    let img_file = e.target.files[0]
    if (img_file){
    let img_url = URL.createObjectURL(img_file)
    let img = {url:img_url,file:img_file}
    let form = this.state.form
    form['img'] = img
    this.setState({form:form})
    }
  }
  handle_picking_vehicle = (e,idx)=>{
    let checked = e.target.checked
    let state = this.state
    state.vehicles[idx].checked = checked
    if (checked == true){
    state.form.vehicle_id = state.vehicles[idx].id
    state.vehicles.map((vehicle,idx)=>{
      if (vehicle.id != state.form.vehicle_id )
      state.vehicles[idx].checked = false
    })
    }
    this.setState({state:state})
  }
  validate_fields = ()=>{
    let fields = ['email','username','password','confirm_password']
    let fields_validity = true
    fields.map(field=>{
      let valid = true
      let form = this.state.form
      let field_value = form[field].value
      if(field_value.length == 0){
        console.log(field+' is required ');
        form[field].error_msg = 'this field is required'
        valid = false
        fields_validity = false
      }
      if(valid && field == 'email' &&  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field_value) == false){
        console.log('not a valid email');
        form[field].error_msg = 'this email is not valid'
        valid = false
        fields_validity = false
      }
      if(valid && field == 'confirm_password' && field_value != this.state.form.confirm_password.value){
        console.log('passords do not match');
        form[field].error_msg = 'password should match'
        valid = false
        fields_validity = false
      }
      this.setState({form:form})
    })
    console.log(fields_validity);
    return fields_validity
  }
  create_driver = ()=>{
    if(this.validate_fields()){
      let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}} ;

    let formData = new FormData()
    formData.append('email',this.state.form.email.value)
    formData.append('username',this.state.form.username.value)
    formData.append('password',this.state.form.password.value)
    formData.append('password2',this.state.form.confirm_password.value)
    if(this.state.form.vehicle_id){
    formData.append('vehicle_id',this.state.form.vehicle_id) }
    if(this.state.form.img.file !=''){
    formData.append('img',this.state.form.img.file) }
    axios.post('http://127.0.0.1:8000/api/driver/create_user_driver/',formData,config).then(res=>{
      this.props.history.push('/drivers/')
    })
  }
  }

  render(){
    return(
      <div class='row'>
        <div class='col-lg-8 offset-lg-2' style={{marginTop:'100px',marginBottom:'200px'}} >
        <center>
        <img style={{display:'block'}} src={this.state.form.img.url ? this.state.form.img.url : 'http://127.0.0.1:8000/media/driver_img.jpg'} height='200px' width='300px' />
        <input type='file' ref={inp_img=>this.inp_img=inp_img} onChange={this.handle_image_change} style={{display:'none'}} />
         <button  style={{marginTop:'10px',marginBottom:'10px'}} class='btn btn-secondary' onClick={()=>{this.inp_img.click()}}>upload</button>
         </center>
        <div class="form-group row">
           <label for="email" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
               <input type="email" class="form-control" id="email" placeholder="email" value={this.state.form.email.value} onChange={(e)=>{this.handle_field_change(e,'email')}}  />
            </div>
         </div>
         <div class="form-group row">
            <label for="username" class="col-sm-2 col-form-label">Username</label>
             <div class="col-sm-10">
                <input type="text" class="form-control" id="username" placeholder="username" value={this.state.form.username.value} onChange={(e)=>{this.handle_field_change(e,'username')}}  />
             </div>
          </div>
          <div class="form-group row">
             <label for="password1" class="col-sm-2 col-form-label">password</label>
              <div class="col-sm-10">
                 <input type="password" class="form-control" id="password1" placeholder="password" value={this.state.form.password.value} onChange={(e)=>{this.handle_field_change(e,'password')}}   />
              </div>
           </div>
           <div class="form-group row">
              <label for="password2" class="col-sm-2 col-form-label">confirm password</label>
               <div class="col-sm-10">
                  <input type="password" class="form-control" id="password2" placeholder="confirm password" value={this.state.form.confirm_password.value} onChange={(e)=>{this.handle_field_change(e,'confirm_password')}}   />
               </div>
            </div>
          <div class='row'>
           <div class='col-lg-12' style={{marginTop:'10px',overflow:'scroll',height:'300px'}}>
           <ul class="list-group">
           {this.state.vehicles.map((vehicle,idx)=>{
             return(
               <li class="list-group-item " >

                 <img style={{height:'50px',width:'50px',display:'inline',borderRadius:'5px'}} src={'http://127.0.0.1:8000'+vehicle.image} />
               <span style={{display:'inline',marginLeft:'5%',fontSize:'18px',color:'grey'}}>{vehicle.name} taken by {vehicle.driver ? vehicle.driver.driver_username : 'none'}</span>
               <input style={{float:'right',dispaly:'inline',height:'20px',width:'20px'}} type="checkbox" height='50px' aria-label="Checkbox for following text input" checked={vehicle.checked} onChange={(e)=>{this.handle_picking_vehicle(e,idx)}} />

               </li>
             )
           })
             }
             </ul>
           </div>
        </div>
        <center><button class='btn btn-warning' onClick={this.create_driver}>create driver</button></center>

       </div>
      </div>
    )
  }
}

export default CreateDriver ;
