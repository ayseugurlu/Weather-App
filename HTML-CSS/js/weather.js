const button = document.querySelector("button");
const input = document.querySelector("input");
const message = document.querySelector(".msg");
const form = document.querySelector("form");
const locateI = document.getElementById("locate");
const locationDiv = document.getElementById("userLocation");
const languageButton = document.querySelector(".language");

const cities = document.querySelector(".cities");

let url;
// let userLocation = false;

const apiKey = "344af0bac8cf965c9169f60d16f1c1ae";
const units = "metric";
let lang = "en";

const searchedCities = [];

// Events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(input.value);
  let inputValue = input.value.trim().toLowerCase();

  if (searchedCities.includes(inputValue)) {
    if (lang == "en") {
      message.textContent = `You already know the weather for ${input.value}. Please search for another city. 😎`;
      form.reset();
      setTimeout(() => {
        message.textContent = "";
      }, 3000);
    } else if (lang == "de") {
      message.textContent = `Sie haben schon das Wetter für ${input.value} gesucht. Bitte suchen Sie nach einer anderen Stadt. 😎`;
      form.reset();
      setTimeout(() => {
        message.textContent = "";
      }, 3000);
    }
  } else {
    showScreen(inputValue);
    searchedCities.push(inputValue);
    message.textContent = "";
    console.log(searchedCities);
    form.reset();
  }
});

locateI.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    console.log(coords);
    const { latitude, longitude } = coords;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${apiKey}`;

    // userLocation = true
    console.log(showLocationWeather(url));
  });
});

languageButton.addEventListener("click", (e) => {
  console.log(e.target);

  if (e.target.textContent === "EN") {
    input.setAttribute("placeholder", "Search for a city");
    lang = "en";
  } else if (e.target.textContent === "DE") {
    input.setAttribute("placeholder", "Suche nach einer Stadt");
    lang = "de";
  }
});

// Functions
const showScreen = async (item) => {
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${item}&appid=${apiKey}&units=${units}&lang=${lang}`
  ).then((a) => a.json());

  const iconURL = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather.weather[0].icon}.svg`; // Alternatif

  cities.innerHTML += `
    <li class="city text-end me-2">
      <i class="delete fa-regular fa-circle-xmark"></i>
      <h2 class="city-name" data-name="${weather.name},${weather.sys.country}">
        <span>${weather.name}</span>
        <sup>${weather.sys.country}</sup>
      </h2>
      <div class="city-temp">${Math.round(weather.main.temp)}<sup>°C</sup></div>
      <figure>
        <img class="city-icon" src=${iconURL}>
        <figcaption>${weather.weather[0].description}</figcaption>
      </figure>
    </li>
  `;

  const deleteButtons = document.querySelectorAll(".fa-circle-xmark");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const cityName = button.closest("li").querySelector(".city-name span").textContent.toLowerCase();
      searchedCities.splice(searchedCities.indexOf(cityName), 1);
      button.closest("li").remove();
      console.log(searchedCities);
    });
  });
};

const showLocationWeather = async (a) => {
  const location = await fetch(a);
  const locationData = await location.json();

  console.log(locationData);

  const iconURL = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${locationData.weather[0].icon}.svg`; // Alternatif

  if (!searchedCities.includes(locationData.name.toLowerCase())) {
    locationDiv.innerHTML += `
      <li class="cityLocal">
        <h2 class="city-name" data-name="${locationData.name},${locationData.sys.country}">
          <span>${locationData.name}</span>
          <sup>${locationData.sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(locationData.main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src=${iconURL}>
          <figcaption>${locationData.weather[0].description}</figcaption>
        </figure>
        <i class="deleteLocal fa-regular fa-circle-xmark"></i>
      </li>
    `;

    searchedCities.push(locationData.name.toLowerCase());
    console.log(searchedCities);
  } else {
    if (lang == "de") {
      alert(`Sie kennen das Wetter für die ${locationData.name} bereits.`);
    } else if (lang == "en") {
      alert(`You already know the weather for ${locationData.name}.`);
    }
  }

  const deleteButtons = document.querySelectorAll(".fa-circle-xmark");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const cityName = button.closest("li").querySelector(".city-name span").textContent.toLowerCase();
      searchedCities.splice(searchedCities.indexOf(cityName), 1);
      button.closest("li").remove();
      console.log(searchedCities);
    });
  });
};