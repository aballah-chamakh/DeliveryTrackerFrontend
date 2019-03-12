import React from 'react' ;
import {Link} from 'react-router-dom' ;
import {connect} from 'react-redux' ;



class DeliveryCompanyNavbar extends React.Component {
logout =()=>{
  this.props.logout()
}
  render(){
    return(
      <nav class="navbar navbar-expand-lg navbar-dark  bg-secondary fixed-top">
     <div class="container">
       <Link class="navbar-brand" to='/'>DeliveryTracker</Link>
       <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
       </button>
       <div class="collapse navbar-collapse" id="navbarResponsive">
         <ul class="navbar-nav ml-auto">
         <li class="nav-item">
           <Link class="nav-link" to="/map/">Map</Link>
         </li>
         <li class="nav-item">
           <Link class="nav-link" to="/vehicles/">Vehicles</Link>
         </li>
         <li class="nav-item">
           <Link class="nav-link" to="/drivers/">Drivers</Link>
         </li>
         <li class="nav-item">
           <button class='btn btn-warning' onClick={this.logout}>logout</button>
         </li>


         </ul>
       </div>
     </div>
   </nav>
    )
  }
}
const mapDispathToProps = (dispath)=>{
  return {
    logout : ()=>dispath({type:'logout'})
  }
}
export default connect(null,mapDispathToProps)(DeliveryCompanyNavbar)  ;
