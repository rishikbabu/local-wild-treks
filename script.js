document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const destinationList = document.querySelector(".destination-list");
  const destinationsSection = document.getElementById("destinations");

  const destinations = [
    { name: "Charminar", img: "https://media.istockphoto.com/id/1215274990/photo/high-wide-angle-view-of-charminar-in-the-night.jpg?s=1024x1024&w=is&k=20&c=8VF8tsWn8Iy5Ls8vTAo73rQntfzSYsK5pAAJDcP4oUE=", desc: "Iconic 16th-century mosque with grand arches." },
    { name: "Golconda Fort", img: "https://www.therevolverclub.com/cdn/shop/articles/image_2022-05-25_221257668.png", desc: "Historic fortress known for its acoustics and architecture." },
    { name: "Hussain Sagar Lake", img: "https://www.holidify.com/images/cmsuploads/compressed/Hussain_Sagar_Lake2C_Hyderabad_20230309151019.jpg", desc: "Serene lake with a massive Buddha statue in the center." },
    { name: "Ramoji Film City", img: "https://www.digitalstudioindia.com/cloud/2024/03/13/Ramoji-City.jpeg", desc: "One of the world’s largest film studio complexes." },
    { name: "Salar Jung Museum", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLDNJs_OffSQiLeWdSYPS8V8OlAXAIiVej_g&s", desc: "Museum with a rich collection of art and artifacts." },
    { name: "Chowmahalla Palace", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfL5nt4l3IBkJzx7wScFsVm3cYed5x5FnyFw&s", desc: "Elegant palace reflecting the grandeur of Nizams." },
    { name: "Birla Mandir", img: "https://www.indiatravelblog.com/attachments/Resources/3603-5-Birla-Mandir.jpg", desc: "A stunning white marble Hindu temple on a hilltop." },
    { name: "Nehru Zoological Park", img: "https://munsifdaily.com/wp-content/uploads/2025/02/ZOO-PARK-1.jpg", desc: "A vast zoo with diverse wildlife and safari rides." },
    { name: "Lumbini Park", img: "https://funworld-blr.s3.ap-south-1.amazonaws.com/public/Home/parkAttractions/newimage8.jpg", desc: "A lakeside park with laser shows and boating." },
    { name: "Shilparamam", img: "https://sceneloc8.com/wp-content/uploads/2024/03/Shilparamam-5.png", desc: "Cultural village showcasing arts, crafts, and traditions." }
  ];

  function displayResults(list) {
    destinationList.innerHTML = "";

    if (list.length === 0) {
      destinationList.innerHTML = `
        <div class="card">
          <p>We couldn't find that destination.</p>
          <h3>Let's Explore on Google Maps!</h3>
          <button class="route-btn" data-destination="${encodeURIComponent(searchInput.value.trim())}">Get Route</button>
        </div>`;
      document.querySelector(".route-btn").addEventListener("click", handleRouteClick);
      return;
    }

    list.forEach(dest => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${dest.img}" alt="${dest.name}">
        <h3>${dest.name}</h3>
        <p>${dest.desc}</p>
        <button class="route-btn" data-destination="${encodeURIComponent(dest.name)}">Get Route</button>
        <button class="book-btn" data-name="${dest.name}">Book Now</button>
      `;
      destinationList.appendChild(card);
    });

    document.querySelectorAll(".route-btn").forEach(btn =>
      btn.addEventListener("click", handleRouteClick)
    );

    document.querySelectorAll(".book-btn").forEach(btn =>
      btn.addEventListener("click", openBookingModal)
    );
  }

  function handleRouteClick(e) {
    const destination = e.target.dataset.destination;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, "_blank");
  }

  function openBookingModal(e) {
    const destinationName = e.target.dataset.name;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Book Your Trip to ${destinationName}</h2>
        <label>Transport:</label>
        <select id="transport">
          <option value="">Select Transport</option>
          <option value="cab">Cab (Uber)</option>
          <option value="bike">Bike (Rapido)</option>
          <option value="bus">Bus (RedBus)</option>
        </select><br><br>
        <label>Time Slot:</label>
        <select id="time-slot">
          <option value="">Select Time Slot</option>
          <option value="Morning">Morning (9 AM - 12 PM)</option>
          <option value="Afternoon">Afternoon (12 PM - 3 PM)</option>
          <option value="Evening">Evening (4 PM - 7 PM)</option>
        </select><br><br>
        <label>No. of Seats:</label>
        <input type="number" id="seats" min="1" max="10" value="1" /><br><br>
        <button id="pay-now" onclick="redirectToTransport()">Pay ₹<span id="total-amount">199</span></button>
        <button id="cancel-modal">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cancel-modal").onclick = () => modal.remove();

    const seatsInput = modal.querySelector("#seats");
    const totalAmountSpan = modal.querySelector("#total-amount");
    seatsInput.addEventListener("input", () => {
      const seats = Math.max(1, parseInt(seatsInput.value) || 1);
      totalAmountSpan.textContent = 199 * seats;
    });
  }

  // Razorpay Payment Handler
  window.redirectToTransport = function () {
    const transport = document.getElementById("transport").value;
    const time = document.getElementById("time-slot").value;
    const seats = parseInt(document.getElementById("seats").value) || 1;

    if (!transport || !time) {
      alert("Please select both transport and time slot.");
      return;
    }

    const destinationName = document.querySelector(".modal-content h2").textContent.replace("Book Your Trip to ", "");
    const amountPerSeat = 199;
    const totalAmount = amountPerSeat * seats;

    const options = {
      key: "rzp_test_IXdQMlPMelmpvi",  // 🔐 Replace this with your real Razorpay key
      amount: totalAmount * 100,
      currency: "INR",
      name: "Local Wild Treks",
      description: `Booking for ${destinationName}`,
      image: "https://www.iconpacks.net/icons/2/free-camping-icon-2078-thumb.png",
      handler: function (response) {
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `
          <h3>✅ Payment Successful!</h3>
          <p>Payment ID: <strong>${response.razorpay_payment_id}</strong></p>
          <p><strong>Destination:</strong> ${destinationName}</p>
          <p><strong>Transport:</strong> ${transport.toUpperCase()}</p>
          <p><strong>Time Slot:</strong> ${time}</p>
          <p><strong>Seats:</strong> ${seats}</p>
        `;

        let redirectUrl = "";
        if (transport === "cab") redirectUrl = "https://www.uber.com/in/en/";
        else if (transport === "bike") redirectUrl = "https://www.rapido.bike/";
        else if (transport === "bus") redirectUrl = "https://www.redbus.in/";

        setTimeout(() => {
          window.open(redirectUrl, "_blank");
          document.querySelector(".modal-overlay")?.remove();
        }, 4000);
      },
      prefill: {
        name: "Adventure Seeker",
        email: "sample@email.com"
      },
      theme: {
        color: "#ff385c"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  function searchDestinations() {
    const term = searchInput.value.toLowerCase().trim();
    const filtered = destinations.filter(dest =>
      dest.name.toLowerCase().includes(term)
    );
    displayResults(filtered);
    if (term) destinationsSection?.scrollIntoView({ behavior: "smooth" });
  }

  document.querySelector(".hero button").addEventListener("click", () => {
    searchDestinations();
  });

  displayResults(destinations);
});
