import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { Doctor } from './doctor.js';
import img from './bunny.png'

function isUndefined(element) {
  if(element === undefined) return true;
  else return false;
}

function isAccepting(element) {
  if(element) return "The doctor is currently accepting new patients."
  else return "The doctor is currently not accepting new patients."
}

function displayDoctors(doctor) {
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
  <h5 class='card-title doctor-name'>Dr. ${firstName} ${lastName}</h5>
  <p class='card-text'><b>Address:</b> ${address} ${isUndefined(address2) ? "" : address2}, ${city}, ${state}, ${zip}</p>
  <p class='card-text'><b>Phone:</b> ${phone}</p>
  <p class='card-text'><b>Website:</b> ${isUndefined(website) ? "No website found." : website}</p>
  <p class='card-text'>${isAccepting(accepts)}</p></div></div>`);
}

$(document).ready(function(){
  let doctor = new Doctor();
  let conditionsPromise = doctor.getConditions();
  console.log(img);
  $("#title-box").append(`<img id='bunny' src='${img}'>`);
  $("#title-box").append(`<h1 id='title'>What's Up, Doc?</h1>`);

  conditionsPromise.then(function(response) {
    let body = JSON.parse(response);

    body.data.forEach(function(condition) {
      let name = condition.name;
      $('#condition-select').append(`<option>${name}</option>`);
    });
  }, function(error) {
    $('.showErrors').text(`There was an error processing your request: ${error.message}`);
  });

  $("#doctor-form").submit(function(event){
    event.preventDefault();
    let doctorName = $("#doctor-name").val();
    let condition =  $("#condition-select").val();
    $("#results").html("<h3 id='search'>Searching for the right doc...</h3>");
    
    if(doctorName === "" && condition == "no") {
      $("#results").html("");
      $("#results").append(`<h3 id='no-input'>*Please input a name or select a condition</h3>`); 
    }
    else if(condition === "no") {
      let namePromise = doctor.getDoctorByName(doctorName);
      namePromise.then(function(response) {
        let body = JSON.parse(response);
        $("#results").html("");
        if (isUndefined(body.data[0])) {
          $("#results").append(`<h3>Sorry, no doctors with that name were found in the area.</h3>`);
        } 
        else {
          body.data.forEach(function(doctor){
            displayDoctors(doctor);
          });
        } 
      }, function(error) {
        $('.showErrors').text(`There was an error processing your request: ${error.message}`);
      });
    }
    else if (doctorName === "") {
      let conditionPromise = doctor.getDoctorByCondition(condition);

      conditionPromise.then(function(response) {
        let body = JSON.parse(response);
        $("#results").html("");
        if (isUndefined(body.data[0])) {
          $("#results").append(`<h3>Sorry, no doctors that treat that condition were found in the area.</h3>`);
        } else {
          body.data.forEach(function(doctor){
            displayDoctors(doctor);
          });
        }
      }, function(error) {
        $('.showErrors').text(`There was an error processing your request: ${error.message}`);
      });
    }
    else {
      let bothPromise = doctor.getDoctor(name, condition);
      
      bothPromise.then(function(response) {
        let body = JSON.parse(response);
        $("#results").html("");
        if (isUndefined(body.data[0])) {
          $("#results").append(`<h3>Sorry, either no doctors with that name or no doctors who treat that condition were found in the area.</h3>`);
        } else {
          body.data.forEach(function(doctor){
            displayDoctors(doctor);
          });
        }
      }, function(error) {
        $('.showErrors').text(`There was an error processing your request: ${error.message}`);
      });
    }
  });
});