const listingsContainer = document.querySelector(".listings");

const onClickedRent = (evt) => {
  evt.preventDefault();
  appearPopupModal(evt);
};

function appearPopupModal(evt) {
  // Remove any existing modal first
  const existingModal = document.querySelector(".modal");
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Request This AirBnb</h5>
      </div>
      <div class="modal-body px-4">
        <p>Rent ${evt.target.dataset.hostName}'s Listing</p>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input id="input-name" type="text" class="form-control" name="name" />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input id="input-email" type="email" class="form-control" name="email" />
        </div>
        <div class="mb-3">
          <label class="form-label">Number of Guests</label>
          <input id="input-guests" type="number" class="form-control" name="guests" />
        </div>
        <div class="mb-3">
          <label class="form-label">Number of Nights</label>
          <input id="input-nights" type="number" class="form-control" name="nights" />
        </div>
        <div class="mb-3">
          <label class="form-label">Total Cost</label>
          <input id="input-total" type="text" class="form-control" name="total" readonly />
        </div>
      </div>
      <div class="modal-footer">
        <button id="button-submit" type="button" class="btn btn-primary">Submit</button>
        <button id="button-close" type="button" class="btn btn-secondary">Close</button>
      </div>
    </div>
  </div>
</div>`
  );

  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  modal.classList.add("show");
  document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop fade show"></div>`);

  const buttonClose = document.getElementById("button-close");
  const buttonSubmit = document.getElementById("button-submit");
  const inputNights = document.getElementById("input-nights");
  const inputTotal = document.getElementById("input-total");
  const price = parseFloat(evt.target.dataset.price.replace("$", ""));

  inputNights.addEventListener("input", () => {
    const nights = parseFloat(inputNights.value);
    inputTotal.value = `$${(nights * price)}`;
  });

  buttonClose.addEventListener("click", () => {
    modal.remove();
    document.querySelector(".modal-backdrop").remove();
  });

  buttonSubmit.addEventListener("click", () => {
    clearAllInputFields();
    alert("Booking submitted successfully!");
    modal.remove();
    document.querySelector(".modal-backdrop").remove();
  });
}

function clearAllInputFields() {
  document.getElementById("input-name").value = "";
  document.getElementById("input-email").value = "";
  document.getElementById("input-guests").value = "";
  document.getElementById("input-nights").value = "";
  document.getElementById("input-total").value = "";
}

listingsContainer.addEventListener("click", (evt) => {
  if (!evt.target.classList.contains("rent-button")) return;
  onClickedRent(evt);
});

async function getAirBnbListings() {
  const airBnbJsonPath = "./airbnb_sf_listings_500.json";
  try {
    const fetchResponse = await fetch(airBnbJsonPath);
    if (!fetchResponse.ok) {
      throw new Error(`Response Status: ${fetchResponse.status}`);
    }
    const airBnbDataParsed = await fetchResponse.json();
    return airBnbDataParsed.slice(0, 50);
  } catch (error) {
    console.error(error.message);
  }
}

async function parseAirBndDataIntoHtml() {
  const airBnbData = await getAirBnbListings();
  if (airBnbData.length !== 50) {
    throw new Error(`Listings size must be 50, not ${airBnbData.length}`);
  }
  for (const listing of airBnbData) {
    const listingImg = listing.picture_url;
    const listingName = listing.name;
    const listingDescription = listing.description;
    const listingHostName = listing.host_name;
    const listingPrice = listing.price;
    const listingReview = listing.review_scores_rating;
    const listingHostPicture = listing.host_picture_url;
    const listingAmenities = JSON.parse(listing.amenities).map((amenity) => `<li>${amenity}</li>`).join("");

    listingsContainer.insertAdjacentHTML("beforeend", `<div class="col-6">
      <article class="listing card bg-light">
        <img
          src="${listingImg}"
          alt="Thumb nail for ${listingName}"
          onerror="this.src='https://a0.muscache.com/pictures/ea603d74-57cd-41d2-b74f-c76ddd920a8e.jpg'"
        />
        <div class="card-body">
          <h3>${listingName}</h3>
          <img
            src="${listingHostPicture}"
            alt="Picture of ${listingHostName}, the owner of ${listingName}"
            class="img-thumbnail mx-auto d-block"
            onerror="this.src='https://a0.muscache.com/im/pictures/user/9a5a55f0-4a59-4656-9170-0701cbef6d05.jpg?aki_policy=profile_x_medium'"
          />
          <div class="host">Your host is ${listingHostName}</div>
          <div class="price">${listingPrice} per night</div>
          <div class="rating">Rating: ${ratingToStar(listingReview)} ${listingReview}</div>
          <br>
          <h5>About this Listing</h5>
          <hr>
          <div class="description overflow-scroll" style="max-height: 250px">
            ${listingDescription}
          </div>
          <br>
          <h5>Amenities</h5>
          <hr>
          <div class="amenities overflow-scroll" style="max-height: 150px">
            <ul>${listingAmenities}</ul>
          </div>
          <div class="actions">
            <br>
            <button
              data-name="${listingName}"
              data-host-name="${listingHostName}"
              data-price="${listingPrice}"
              class="btn btn-primary rent-button">Rent</button>
          </div>
        </div>
      </article>
    </div>`)
  }
}

document.addEventListener("DOMContentLoaded", parseAirBndDataIntoHtml);

function ratingToStar(rating) {
  let ratingToString = "";
  for (let numberOfStars = 0; numberOfStars < rating; numberOfStars++) {
    if (rating - numberOfStars >= 1) {
      ratingToString += "🌕";
    } else if (rating - numberOfStars < 1) {
      ratingToString += "🌗";
    } else {
      continue;
    }
  }
  return ratingToString;
}