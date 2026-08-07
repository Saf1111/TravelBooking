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
bookingForm.addEventListener("submit", async function(event){

    event.preventDefault();

    const bookingData = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        destination: document.getElementById("destination").value,

        travelDate: document.getElementById("travelDate").value

    };

    try{

        const response = await fetch("http://localhost:3000/booking",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(bookingData)

        });

        const data = await response.json();

        alert(data.message);

        bookingForm.reset();

    }

    catch(error){

        console.log(error);

        alert("Server Connection Failed");

    }

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