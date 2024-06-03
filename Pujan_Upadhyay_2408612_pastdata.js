//declaring initial city or city searched in home page
if (localStorage.getItem("currentcity") == null) {
  var city = "aligarh";
} else {
  city = localStorage.getItem("currentcity");
}

const parent_element = document.getElementById("flex-box");
const main_element = document.getElementsByTagName("main");
const locationElement = document.getElementById("city-country-name");

document.getElementById("search_box").addEventListener("keydown", (e) => {
  console.log(e);
  //comparing the entered value in search box and displaying the following city
  if (e.key === "Enter") {
    city = e.target.value;
    fetch_database(city);
  }
});

async function fetch_database(cityname) {
  try {
    //fetching data from php
    const response = await fetch(
      `http://localhost/prototype2/Pujan_Upadhyay_2408612.php?city=${cityname}`
    );
    const data = await response.json(response);
    console.log(data);
    const check_element = document.getElementsByClassName("child-container");
    if (check_element == null || check_element == undefined) {
      //leave it
    } else {
      parent_element.innerHTML = "";
    }
    locationElement.textContent = `City:  ${data[0].city},  ${data[0].country}`;
    //using loop to show data in html one by one for past  days data
    for (let initial = 1; initial <= 7; initial++) {
      try {
        //time to show
        const timestamp = parseInt(data[initial].time_stamp);
        const date = new Date(timestamp * 1000);
        const data_store_time = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          weekday: "short",
        }).format(date);
        //converting visibility into kilometer(km)
        const visibility = parseInt(data[initial].visibility) / 1000;
        //adding to the html element
        var child_element = document.createElement("div");
        child_element.classList.add("child-container");
        child_element.innerHTML = `
        <p class="data">${data_store_time}</p>
        <p class="data">${data[initial].main_temp} &degC</p>
        <img src="https://openweathermap.org/img/wn/${data[initial].weather_icon}@2x.png" alt="${data[initial].weather_type}">
        <p class="data">${data[initial].weather_type}</p>
        <p class="data"><i class="fa-solid fa-droplet"></i>        ${data[initial].humidity} %</p>
        <p class="data"><i class="fa-solid fa-gauge-high"></i>        ${data[initial].pressure} hPa</p>
        <p class="data"><i class="fa-solid fa-wind fa-sm"></i>        ${data[initial].wind_speed} m/s</p>
        <p class="data"><i class="fa-solid fa-eye fa-sm"></i>        ${visibility} KM</p>
        `;
        parent_element.appendChild(child_element);
      } catch (err) {
        console.log("index Error:");
        child_element = document.createElement("div");
        child_element.classList.add("child-container");
        child_element.innerHTML = `data not avaliable`;
        parent_element.appendChild(child_element);
      }
    }
  } catch (err) {
    //if city not found or other errors then it will show this
    console.log(err);
    console.log("data not found...");
    if (localStorage.getItem(cityname) !== null) {
      const data = JSON.parse(localStorage.getItem(cityname));
      console.log(data);
      const check_element = document.getElementsByClassName("child-container");
      if (check_element == null || check_element == undefined) {
        //leave it
      } else {
        parent_element.innerHTML = "";
      }
      locationElement.textContent = `City:  ${data[0].city},  ${data[0].country}`;
      //using loop to show data in html one by one for past  days data
      for (let initial = 1; initial <= 7; initial++) {
        try {
          //time to show
          const timestamp = parseInt(data[initial].time_stamp);
          const date = new Date(timestamp * 1000);
          const data_store_time = new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            weekday: "short",
          }).format(date);
          //converting visibility into kilometer(km)
          const visibility = parseInt(data[initial].visibility) / 1000;
          //adding to the html element
          var child_element = document.createElement("div");
          child_element.classList.add("child-container");
          child_element.innerHTML = `
        <p class="data">${data_store_time}</p>
        <p class="data">${data[initial].main_temp} &degC</p>
        <img src="https://openweathermap.org/img/wn/${data[initial].weather_icon}@2x.png" alt="${data[initial].weather_type}">
        <p class="data">${data[initial].weather_type}</p>
        <p class="data"><i class="fa-solid fa-droplet"></i>        ${data[initial].humidity} %</p>
        <p class="data"><i class="fa-solid fa-gauge-high"></i>        ${data[initial].pressure} hPa</p>
        <p class="data"><i class="fa-solid fa-wind fa-sm"></i>        ${data[initial].wind_speed} m/s</p>
        <p class="data"><i class="fa-solid fa-eye fa-sm"></i>        ${visibility} KM</p>
        `;
          parent_element.appendChild(child_element);
        } catch (err) {
          console.log("index Error:");
          child_element = document.createElement("div");
          child_element.classList.add("child-container");
          child_element.innerHTML = `data not avaliable`;
          parent_element.appendChild(child_element);
        }
      }
    } else {
      alert("City not found!!!");
    }
  }
}
//calling our function
fetch_database(city);
/*code by
  Name: Pujan Upadhyay
  Group:L4CS16
  College ID:np03cs4a23028
  University Student Number:2408612
 */
