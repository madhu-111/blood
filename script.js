// Handle form submission
document.getElementById("donorForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const number = document.getElementById("number").value;
    const bloodType = document.getElementById("bloodType").value;
    const location = document.getElementById("location").value;

    // Prepare the donor object
    const newDonor = { name, age, number, bloodType, location };

    // Send the donor data to the backend (Node.js server with MongoDB Atlas)
    fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDonor)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Donor added:', data);
        alert("Donor added successfully!");
        loadDonors(); // Reload the donor list
    })
    .catch(error => console.error('Error:', error));
    
    document.getElementById("donorForm").reset(); // Reset the form
});

// Search functionality
document.getElementById("searchBar").addEventListener("input", function(event) {
    const searchQuery = event.target.value.toLowerCase();
    const donorListItems = document.querySelectorAll("#donorList li");

    donorListItems.forEach(item => {
        const donorName = item.textContent.toLowerCase();
        // Add matching for blood type, location, etc.
        if (donorName.includes(searchQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Fetch and display donors from MongoDB
function loadDonors() {
    fetch('http://localhost:3000/donors')
        .then(response => response.json())
        .then(data => {
            const donorList = document.getElementById("donorList");
            donorList.innerHTML = ""; // Clear the existing list

            data.forEach(donor => {
                const listItem = document.createElement("li");
                // Format donor information for easier reading
                listItem.textContent = `Name: ${donor.name}, Age: ${donor.age}, Mobile: ${donor.number}, Blood Type: ${donor.bloodType}, Location: ${donor.location}`;
                donorList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Initial load of donors
loadDonors();
