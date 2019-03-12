import React from 'react' ;
import axios from 'axios' ;
import {connect} from 'react-redux'
class Login extends React.Component {
state = {
  email : '',
  password : '' ,
}
change = (e,field)=>{
  let state = this.state
  state[field] = e.target.value
  this.setState({state:state})
}
login = ()=>{
  let data = {email:this.state.email,password:this.state.password}
  console.log(data);
  axios.post('http://127.0.0.1:8000/api/token/',data).then((res)=>{

    localStorage.setItem('token',res.data.token)
    let config =  {headers: {Authorization : 'Bearer '+localStorage.getItem('token')}}
    axios.get('http://127.0.0.1:8000/api/user/get_user_info',config).then(res=>{
      console.log(res);
      localStorage.getItem('user_id',res.data.user_info.id);
      localStorage.getItem('username',res.data.user_info.username);
  this.props.login()
  this.props.history.push('/vehicles/')

    })
  })

}
  render(){
    return(
      <div class='row' style={{marginTop:'200px'}}>
      <div class='col-lg-6 offset-lg-3'>
      <div class="form-group row">
         <label for="email" class="col-sm-2 col-form-label">Email</label>
         <div class="col-sm-10">
           <input type="email" class="form-control" id="email" placeholder="Email" value={this.state.email.value} onChange={(e)=>{this.change(e,'email')}} />
         </div>
       </div>
       <div class="form-group row">
          <label for="password" class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" id="password" placeholder="enter Password" value={this.state.password.value} onChange={(e)=>{this.change(e,'password')}} />
          </div>
        </div>
        <center><button class='btn btn-warning' onClick={this.login}>login</button></center>
      </div>

      </div>
    )
  }
}


const mapDispathToProps = (dispatch)=>{
  return {
     login : ()=>dispatch({type:'login'}) ,
  }
}
export default connect(null,mapDispathToProps)(Login) ;
