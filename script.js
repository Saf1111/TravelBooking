// ===============================
// TravelGo JavaScript
// ===============================

// Book a destination
function bookTrip(destinationName) {

    // Select destination automatically
    document.getElementById("destination").value = destinationName;

    // Scroll to booking form
    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

}

// Booking Form
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event){

    event.preventDefault();

    let name = document.getElementById("name").value;

    let email = document.getElementById("email").value;

    let phone = document.getElementById("phone").value;

    let destination = document.getElementById("destination").value;

    let travelDate = document.getElementById("travelDate").value;

    // Validation

    if(name=="" || email=="" || phone=="" || destination=="" || travelDate=="")
    {
        alert("Please fill all fields.");

        return;
    }

    alert(

"🎉 Booking Successful!\n\n" +

"Name : " + name +

"\nEmail : " + email +

"\nPhone : " + phone +

"\nDestination : " + destination +

"\nTravel Date : " + travelDate +

"\n\nThank you for choosing TravelGo!"

);

bookingForm.reset();

});

// ===============================
// Welcome Message
// ===============================

window.onload=function(){

console.log("Welcome to TravelGo!");

}

// ===============================
// Hero Button
// ===============================

const heroButton=document.querySelector(".hero button");

heroButton.addEventListener("click",function(){

document.getElementById("booking").scrollIntoView({

behavior:"smooth"

});

});

// ===============================
// Navbar Active Effect
// ===============================

const links=document.querySelectorAll("nav a");

links.forEach(function(link){

link.addEventListener("click",function(){

links.forEach(function(item){

item.style.color="white";

});

this.style.color="#ffd166";

});

});