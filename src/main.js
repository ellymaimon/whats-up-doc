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
    $("#results").html("<h3>Searching for the right doc...</h3>");
    
    namePromise.then(function(response) {
      let body = JSON.parse(response);
      $("#results").html("");
      console.log(body.data[0]);
      //Message if no doctors were found
      if (body.data[0] === undefined) {
        $("#results").append(`<h3>Sorry, no doctors with that name were found in the area.</h3>`);
      } 
      //Display doctors in cards
      else {
        body.data.forEach(function(doctor){
          console.log(doctor);
          $("#results").append(`<div class='card'><div class='card-body'>
          <h5 class='card-title doctor-name'>${doctor.profile.first_name} ${doctor.profile.last_name}</h5>
          <p class='card-text address'>Address: ${doctor.practices[0].visit_address.street} ${doctor.practices[0].visit_address.street2},
          ${doctor.practices[0].visit_address.city}, ${doctor.practices[0].visit_address.state},
          ${doctor.practices[0].visit_address.zip}</p>
          <p class='card-text phone'>Phone: ${doctor.practices[0].phones[0].number}</p>`);
          // $("#results").append("<p class='card-text phone'></p>");
          // $("#results").append("<p class='card-text website'></p>");
          // $("#results").append("<p class='card-text accepting'></p></div></div>"); 
        });
      }
      // console.log(body.data[0].practices[0].visit_address.city);
      // console.log(body.data[0].practices[0].visit_address.state);
      // console.log(body.data[0].practices[0].visit_address.street);
      // console.log(body.data[0].practices[0].visit_address.street2);
      // console.log(body.data[0].practices[0].visit_address.zip);
      // console.log("Accepts? " + body.data[0].practices[0].accepts_new_patients);
      // console.log(body.data[0].practices[0].phones[0].number);
      // console.log(body.data[0].practices[0].website);
      // console.log(body.data[1].practices[0].website);
      // console.log(body.data[2].practices[0].website);
      // console.log(body.data[0].profile.first_name);
      // console.log(body.data[0].profile.last_name);

    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });
    
  });

});


{/* <div class="card">
<div class="card-body">
  <h5 class="card-title doctor-name"></h5>
  <p class="card-text address"></p>
  <p class="card-text phone"></p>
  <p class="card-text website"></p>
  <p class="card-text accepting"></p>
</div>
</div> */}