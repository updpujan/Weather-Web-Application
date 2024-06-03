//clearing the data in localstorage
localStorage.clear();
//declaring initial city
var currentcity = "aligarh";
//creating variables for DOM
const temeratureElement = document.getElementById("degree_celcius");
const cloudElement = document.getElementById("weather_condtion");
const cloudCondition = document.getElementById("logo");
const windspeedElement = document.getElementById("speed_of_wind");
const windspeeddirectionElement = document.getElementById("wind_direction");
const pressureElement = document.getElementById("pressure_value");
const humidityElement = document.getElementById("humidity_percent");
const visibilityElement = document.getElementById("visibility_distance");
const citynameElement = document.getElementById("location");
const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const dayElement = document.getElementById("day");
//search box
document.getElementById("search_box").addEventListener("keydown", (e) => {
  console.log(e);
  //comparing the entered value in search box and displaying the following city
  if (e.key === "Enter") {
    currentcity = e.target.value;
    fetchapi(currentcity);
  }
});

async function fetchapi(city) {
  try {
    //storing the value of city to local storage
    localStorage.setItem("currentcity", city);
    //fetching data from php
    const response = await fetch(
      `http://localhost/prototype2/Pujan_Upadhyay_2408612.php?city=${city}`
    );
    const data = await response.json();
    console.log(data);
    //storing all the data in local storage
    localStorage.setItem(city, JSON.stringify(data));
    temeratureElement.textContent = `${data[0].main_temp} °C`;
    cloudElement.textContent = data[0].weather_type;
    cloudCondition.src = new URL(
      "https://openweathermap.org/img/wn/" + data[0].weather_icon + "@2x.png"
    );
    citynameElement.textContent = `${data[0].city}, ${data[0].country}`;
    windspeedElement.textContent = `${data[0].wind_speed} m/s`;
    windspeeddirectionElement.textContent = `${data[0].wind_deg}°`;
    pressureElement.textContent = `${data[0].pressure} hPa`;
    humidityElement.textContent = `${data[0].humidity} %`;
    visibility = parseInt(`${data[0].visibility}`) / 1000;
    visibilityElement.textContent = `${visibility} km`;
    //convet time
    const timestamp =
      Math.floor(Date.now() / 1000) + parseInt(data[0].timezone);
    const date = new Date(timestamp * 1000);
    const localTime1 = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    });
    timeElement.textContent = localTime1;
    //convert date
    const localTime2 = date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    dateElement.textContent = localTime2;
    //convert day
    const localTime3 = date.toLocaleString("en-US", {
      weekday: "long",
    });
    dayElement.textContent = localTime3;
  } catch (err) {
    console.log(err);
    if (localStorage.getItem(city) !== null) {
      const local_data = localStorage.getItem(city);
      const data = JSON.parse(local_data);
      console.log(data);

      temeratureElement.textContent = `${data[0].main_temp} °C`;
      cloudElement.textContent = data[0].weather_type;
      cloudCondition.src = new URL(
        "https://openweathermap.org/img/wn/" + data[0].weather_icon + "@2x.png"
      );
      citynameElement.textContent = `${data[0].city}, ${data[0].country}`;
      windspeedElement.textContent = `${data[0].wind_speed} m/s`;
      windspeeddirectionElement.textContent = `${data[0].wind_deg}°`;
      pressureElement.textContent = `${data[0].pressure} hPa`;
      humidityElement.textContent = `${data[0].humidity} %`;
      visibility = parseInt(`${data[0].visibility}`) / 1000;
      visibilityElement.textContent = `${visibility} km`;
      //convet time
      const timestamp =
        Math.floor(Date.now() / 1000) + parseInt(data[0].timezone);
      const date = new Date(timestamp * 1000);
      const localTime1 = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "UTC",
      });
      timeElement.textContent = localTime1;
      //convert date
      const localTime2 = date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      dateElement.textContent = localTime2;
      //convert day
      const localTime3 = date.toLocaleString("en-US", {
        weekday: "long",
      });
      dayElement.textContent = localTime3;
    } else {
      alert("City Not Found!!!");
    }
  }
}
fetchapi(currentcity);
/*code by
  Name: Pujan Upadhyay
  Group:L4CS16
  College ID:np03cs4a23028
  University Student Number:2408612
 */
