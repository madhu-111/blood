// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const number = document.getElementById("number").value;
    const bloodType = document.getElementById("bloodType").value;
    const location = document.getElementById("location").value;

    if (!name || !age || !number || !bloodType || !location) {
        alert("Please fill out all fields.");
        return;
    }

    const newDonor = { name, age, number, bloodType, location };

    // Send donor data to the backend
    fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonor)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Donor added:', data);
        alert("Donor added successfully!");
        loadDonors(); // Reload the donor list
    })
    .catch(error => console.error('Error:', error));
    
    document.getElementById("donorForm").reset();
    toggleDonorForm();
}

document.getElementById("donorForm").addEventListener("submit", handleFormSubmit);

// Toggle donor form visibility
function toggleDonorForm() {
    let formContainer = document.getElementById("donorFormContainer");
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
}

// Get user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById("userLocation").textContent = 
                `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Search donors
function searchDonors() {
    let searchValue = document.getElementById("searchBar").value.toLowerCase();
    let donors = document.querySelectorAll("#donorList li");
    donors.forEach(donor => {
        donor.style.display = donor.textContent.toLowerCase().includes(searchValue) ? "block" : "none";
    });
}

document.getElementById("searchBar").addEventListener("input", searchDonors);

// Fetch and display donors from MongoDB
function loadDonors() {
    fetch('http://localhost:3000/donors')
        .then(response => response.json())
        .then(data => {
            const donorList = document.getElementById("donorList");
            donorList.innerHTML = ""; // Clear the existing list

            data.forEach(donor => {
                const listItem = document.createElement("li");
                listItem.textContent = `Name: ${donor.name}, Age: ${donor.age}, Mobile: ${donor.number}, Blood Type: ${donor.bloodType}, Location: ${donor.location}`;
                donorList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Initial load of donors
loadDonors();
