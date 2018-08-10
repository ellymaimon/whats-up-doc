import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Doctor } from './doctor.js'

function isUndefined(element) {
  if(element === undefined) return true;
  else return false;
}

function isAccepting(element) {
  if(element) return "The doctor is currently accepting new patients."
  else return "The doctor is currently not accepting new patients."
}

$(document).ready(function(){
  let doctor = new Doctor();  // create instance of Doctor class

  $("#doctor-form").submit(function(event){ //submit the form to search
    event.preventDefault();
    let doctorName = $("#doctor-name").val();
    let namePromise = doctor.getDoctorByName(doctorName);  // call the instance method
    $("#results").html("<h3>Searching for the right doc...</h3>");
    
    namePromise.then(function(response) {
      let body = JSON.parse(response);
      $("#results").html("");
      //Message if no doctors were found
      if (isUndefined(body.data[0])) {
        $("#results").append(`<h3>Sorry, no doctors with that name were found in the area.</h3>`);
      } 
      //Display doctors in cards
      else {
        body.data.forEach(function(doctor){
          let firstName = doctor.profile.first_name;
          let lastName = doctor.profile.last_name;
          let address = doctor.practices[0].visit_address.street;
          let address2 = doctor.practices[0].visit_address.street2;
          let city = doctor.practices[0].visit_address.city;
          let state = doctor.practices[0].visit_address.state;
          let zip = doctor.practices[0].visit_address.zip;
          let phone = doctor.practices[0].phones[0].number;
          let website = doctor.practices[0].website;
          let accepts = doctor.practices[0].accepts_new_patients;

          $("#results").append(`<div class='card'><div class='card-body'>
          <h5 class='card-title doctor-name'>${firstName} ${lastName}</h5>
          <p class='card-text'><b>Address:</b> ${address} ${isUndefined(address2) ? "" : address2}, ${city}, ${state}, ${zip}</p>
          <p class='card-text'><b>Phone:</b> ${phone}</p>
          <p class='card-text'><b>Website:</b> ${isUndefined(website) ? "No website found." : website}</p>
          <p class='card-text'>${isAccepting(accepts)}</p></div></div>`);
        });
      }
    }, function(error) {
      $('.showErrors').text(`There was an error processing your request: ${error.message}`);
    });
  });
});