const weatherApiKey = "41fe5fd5e6ddaffb226bc2aa800d65d8";
const foursquareApiKey = "fsq3BNvWbvSLNHPXFnxOw45KYpPLiH3coNvrh2VGh/J9X3w=";
const ipgeolocationApiKey = "916bc2745d2d4e0abf1ede35eada4d5e";

// Event listeners for buttons
document.getElementById("search-city").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    fetchCityData(city);
  }
});

document.getElementById("use-location").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchLocationCity(lat, lon);
      },
      () => {
        alert("Unable to access your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Fetch weather and attractions for a city
async function fetchCityData(city) {
  try {
    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();
    displayWeather(weatherData);

    // Fetch city coordinates from weather data
    const { lat, lon } = weatherData.coord;

    // Fetch attractions
    fetchAttractions(lat, lon);
  } catch (error) {
    document.getElementById("weather-info").innerText =
      "Unable to fetch weather information.";
  }
}

// Fetch city name from coordinates
async function fetchLocationCity(lat, lon) {
  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/reverse-geocoding?apiKey=${ipgeolocationApiKey}&lat=${lat}&long=${lon}`
    );
    const data = await response.json();
    const city = data.city;
    document.getElementById("city-input").value = city;
    fetchCityData(city);
  } catch (error) {
    alert("Unable to fetch city from your location.");
  }
}

// Display weather information
function displayWeather(weatherData) {
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.innerHTML = `
                <p><strong>City:</strong> ${weatherData.name}</p>
                <p><strong>Temperature:</strong> ${weatherData.main.temp} °C</p>
                <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
            `;
}

// Fetch attractions using Foursquare API
async function fetchAttractions(lat, lon) {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&categories=16000`,
      {
        headers: {
          Authorization: foursquareApiKey,
        },
      }
    );
    const data = await response.json();

    const attractionsList = document.getElementById("attractions-list");
    attractionsList.innerHTML = "";

    data.results.forEach((attraction) => {
      const card = document.createElement("div");
      card.className = "col-md-6";

      const photoReference = attraction.categories?.[0]?.icon;
      const photoUrl = photoReference
        ? `${photoReference.prefix}original${photoReference.suffix}`
        : "https://via.placeholder.com/150";

      card.innerHTML = `
                        <div class="card">
                            <img src="${photoUrl}" class="card-img-top" alt="${
        attraction.name
      }">
                            <div class="card-body">
                                <h5 class="card-title">${attraction.name}</h5>
                                <p class="card-text">${
                                  attraction.location.address ||
                                  "No address available"
                                }</p>
                                <a href="https://foursquare.com/v/${
                                  attraction.fsq_id
                                }" target="_blank" class="btn btn-primary">View More</a>
                            </div>
                        </div>
                    `;

      attractionsList.appendChild(card);
    });
  } catch (error) {
    const attractionsList = document.getElementById("attractions-list");
    attractionsList.innerHTML =
      '<p class="text-danger">Unable to fetch attractions.</p>';
  }
}
