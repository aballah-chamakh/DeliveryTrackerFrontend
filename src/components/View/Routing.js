import React from 'react' ;
import {Route} from 'react-router-dom' ;
import {withRouter} from 'react-router' ;
import {connect} from 'react-redux' ;
import Navbar from '../Navbar/Navbar' ;
import DeliveryCompanyNavbar from '../Navbar/DeliveryCompanyNavbar' ;
import VehicleList from '../Vehicles/VehicleList' ;
import DriverList from '../Drivers/DriverList' ;
import Map from '../Map/Map'
import Login from '../Authentication/Login' ;

class Routing extends React.Component {
  render(){
    return(
      <div>
      {localStorage.getItem('token') || this.props.authenticated == true ?
      <DeliveryCompanyNavbar/> : <Navbar />}
      <div class='container'>
      <Route path='/login/' component={Login}  />
      <Route path='/vehicles/' component={VehicleList} />
      <Route path='/drivers/' component={DriverList} />
      <Route path='/map/' component={Map} />
      </div>



      </div>
    )
  }
}
const mapStateToProps = (state)=>{
  return {
    authenticated : state.authenticated
  }
}
export default withRouter(connect(mapStateToProps)(Routing)) ;
