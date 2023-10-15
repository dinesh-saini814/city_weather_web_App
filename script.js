const apiKey = "cdca845bfeb6c108c5d0876011ed0f7f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const weatherIcon = document.querySelector(".weather-icon");

var weatherFrontMessage = document.getElementById("weather-details");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  // checking for error
  if (response.status == 404) {
    gotError();
  } else {
    document.querySelector(".error").style.display = "none";
  }

  // check for weather data and print value on web page

  var data = await response.json();

  // variables for weather condition and cuttent time
  var timeOfDay = getTimeOfDay();
  var weatherConditions = data.weather[0].main;

  setBackgroundAndParameters(timeOfDay, weatherConditions);

  function setBackgroundAndParameters(timeOfDay, weatherCondition) {
    const card = document.querySelector(".card");
    const changeSearchIcon = document.querySelector(".button-s-icon");

    // Helper function to set default background based on time of day
    // defult baackground for any specific valuse of weather
    function setDefaultBackground(timeOfDay) {
      if (
        timeOfDay === "night" ||
        timeOfDay === "midnight" ||
        timeOfDay === "early morning"
      ) {
        setBackgroundImage(timeOfDay, "default");
        darkParameters();
      } else {
        setBackgroundImage(timeOfDay, "default");
        lightParameters();
      }
    }

    if (weatherCondition == "Clouds") {
      setBackgroundImage(timeOfDay, "Clouds");
      if (
        timeOfDay === "night" ||
        timeOfDay === "midnight" ||
        timeOfDay === "early morning"
      ) {
        darkParameters();
      } else {
        lightParameters();
      }
    } else if (weatherCondition == "Clear") {
      setBackgroundImage(timeOfDay, "Clear");
      if (
        timeOfDay === "night" ||
        timeOfDay === "midnight" ||
        timeOfDay === "early morning"
      ) {
        darkParameters();
      } else {
        lightParameters();
      }
    } else if (weatherCondition == "Rain") {
      setBackgroundImage(timeOfDay, "Rain");
      if (
        timeOfDay === "night" ||
        timeOfDay === "midnight" ||
        timeOfDay === "early morning"
      ) {
        darkParameters();
      } else {
        lightParameters();
      }
    } else {
      // Default to night if weatherCondition is not one of the specified values
      setDefaultBackground(timeOfDay);
    }
  }

  // assigning values in html on web page
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";

  console.log(data);
  console.log(timeOfDay);
  console.log(weatherConditions);

  // function for check day/night time
  function getTimeOfDay() {
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    const currentTime = new Date();

    if (currentTime > sunriseTime && currentTime < sunsetTime) {
      const morningEnd = new Date(
        sunriseTime.getTime() +
          (sunsetTime.getTime() - sunriseTime.getTime()) / 3
      );
      const afternoonEnd = new Date(
        sunriseTime.getTime() +
          ((sunsetTime.getTime() - sunriseTime.getTime()) * 2) / 3
      );
      return currentTime < morningEnd
        ? "morning"
        : currentTime < afternoonEnd
        ? "afternoon"
        : "evening";
    } else {
      const nightEnd = new Date(
        sunsetTime.getTime() +
          (24 * 60 * 60 * 1000 - sunsetTime.getTime() + sunriseTime.getTime()) /
            3
      );
      const midnightEnd = new Date(
        sunsetTime.getTime() +
          ((24 * 60 * 60 * 1000 -
            sunsetTime.getTime() +
            sunriseTime.getTime()) *
            2) /
            3
      );
      return currentTime < nightEnd
        ? "night"
        : currentTime < midnightEnd
        ? "midnight"
        : "early morning";
    }
  }

  document.querySelector(".front-tital").style.display = "none";
  changeFrontImage();
  document.querySelector(".city").style.display = "block";
  document.querySelector(".temp").style.display = "block";
  document.querySelector(".details").style.display = "flex";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Call your function to check weather when Enter is pressed
    checkWeather(searchBox.value);
  }
});

// function for shortcuts
function darkParameters() {
  const changeSearchIcon = document.querySelector(".button-s-icon");
  changeSearchIcon.src = "/fun little program/weather app/images/icon-s-w.png";
  document.querySelector(".card").style.color = "#fff";
}

function lightParameters() {
  document.querySelector(".card").style.color = "#000";
}

function setBackgroundImage(timeOfDay, weatherCondition) {
  const card = document.querySelector(".card");

  // Supported image formats: jpg, gif, png
  const supportedFormats = ["jpg", "gif", "png"];

  // Iterate through supported formats and find the first one that exists
  let imageUrl = null;

  for (const format of supportedFormats) {
    const img = new Image();
    img.src = `/fun little program/weather-app-customized/images/${timeOfDay}_${weatherCondition}.${format}`;

    img.onload = function () {
      // The image exists, set imageUrl and break the loop
      imageUrl = img.src;
      card.style.backgroundImage = `url("${imageUrl}")`;
    };
  }

  // If no valid image was found, set a default image
  if (!imageUrl) {
    card.style.backgroundImage = `url("/fun little program/weather-app-customized/images/default.jpg")`;
  }
}
// function for hide some specific paremeters when we got any error
function gotError() {
  document.querySelector(".error").style.display = "block";

  document.querySelector(".front-tital").style.display = "none";

  document.querySelector(".city").style.display = "none";
  document.querySelector(".temp").style.display = "none";
  document.querySelector(".details").style.display = "none";
}

function changeFrontImage() {
  weatherIcon.style.display = "none";
  weatherFrontMessage.style.marginTop = "240px";
}

document
  .getElementById("imageInput")
  .addEventListener("change", handleImageUpload);

function handleImageUpload() {
  const input = document.getElementById("imageInput");
  const box = document.getElementById("imageBox");

  const file = input.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      document.querySelector(
        ".card"
      ).style.backgroundImage = `url('${e.target.result}')`;
    };

    reader.readAsDataURL(file);
  }
}
