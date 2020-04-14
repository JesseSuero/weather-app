function getLocationWeather() {
  // get location input element
  const inputLocation = document.getElementById("inputLocation");
  // get user entered location value
  const location = inputLocation.value;

  if (!location) {
    inputLocation.focus();
    return;
  }

  // previously registered account apiKey for openweathermap.org
  const apiKey = "48d912b4b6f4e0edf77baff94665e843";
  // set up API call using apiKey & user entered location
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;
  // get location input element
  const btnShowWeather = document.getElementById("btnShowWeather");
  const btnDefaultValue = btnShowWeather.value; // save old button text
  // inform user you are searching
  btnShowWeather.disabled = true;
  btnShowWeather.value = "Searching...";

  // make API call to OpenWeatherMap
  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        // Any status code that isn't 200 means there was an error.
        console.log(
          `error occurred calling OpenWeatherMap API using url: ${url}`
        );
        showError(location);
        return;
      }
      // show results
      response.json().then(showResults);
    })
    .catch((err) => {
      console.log(
        `error occurred calling OpenWeatherMap API using url: ${url}`,
        err
      );
      showError(location);
    })
    .finally(() => {
      btnShowWeather.disabled = false;
      btnShowWeather.value = btnDefaultValue;
    });
}

function showError(location) {
  const sectionResults = document.getElementById("sectionResults");
  const htmlMarkup = `<div> No results for location "${location}". Please try again.</div>`;
  sectionResults.innerHTML = htmlMarkup;
}

function showResults(results) {
  const sectionResults = document.getElementById("sectionResults");
  const { main, name, sys, weather, wind } = results;
  const currentWeather = weather[0];
  const icon = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
  const htmlMarkup = `
  <div style="font-size: 24px;"><b>${name}, ${sys.country}</b></div>
    <div>${getCurrentTime()}</div>
    <div><i>${currentWeather.main}</i></div>
    <div class="weatherDetails">
      <div class="temperatureDetails">
        <img src=${icon} title=${currentWeather.description}/>
        <div style="font-size: 32px">${Math.round(main.temp)}°F</div>
      </div>
      <div>
        <br/>
        <div><b>Feels like:</b> ${Math.round(main.feels_like)}°</div>
        <div><b>Low/High:</b> ${Math.round(main.temp_min)}°/${Math.round(
    main.temp_max
  )}°</div>
        <div><b>Humidity:</b> ${main.humidity}%</div>
        <div><b>Wind Gusts:</b> ${Math.round(wind.speed)} mph
      </div>
    </div>
  </div>
`;
  sectionResults.innerHTML = htmlMarkup;
}

function getCurrentTime() {
  const date = new Date();
  var hr = date.getHours();
  var min = date.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  var period = hr >= 12 ? "PM" : "AM";
  return `${hr % 12}:${min} ${period}`;
}
