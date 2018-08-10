import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Doctor } from './doctor.js'

$(document).ready(function(){
  let doctor = new Doctor();  // create instance of Doctor class

  $("#doctor-form").submit(function(event){
    event.preventDefault();
    let doctorName = $("#doctor-name").val();
    let namePromise = doctor.getDoctorByName(doctorName);  // call the instance method
    
    namePromise.then(function(response) {
      let body = JSON.parse(response);
      console.log(body.data[0].practices[0].visit_address.city);
      console.log(body.data[0].practices[0].visit_address.state);
      console.log(body.data[0].practices[0].visit_address.street);
      console.log(body.data[0].practices[0].visit_address.street2);
      console.log(body.data[0].practices[0].visit_address.zip);
      console.log("Accepts? " + body.data[0].practices[0].accepts_new_patients);
      console.log(body.data[0].practices[0].phones[0].number);
      console.log(body.data[0].practices[0].website);
      console.log(body.data[1].practices[0].website);
      console.log(body.data[2].practices[0].website);
      console.log(body.data[0].profile.first_name);
      console.log(body.data[0].profile.last_name);
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });
    
  });

});


// <div class="card">
// <div class="card-body">
//   <h5 class="card-title doctor-name"></h5>
//   <p class="card-text address"></p>
//   <p class="card-text phone"></p>
//   <p class="card-text website"></p>
//   <p class="card-text accepting"></p>
// </div>
// </div>