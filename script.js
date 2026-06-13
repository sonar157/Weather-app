const input = document.getElementById("cityinput");
const cityname = document.getElementById("cityname");
const temp = document.getElementById("temp");
const humid = document.getElementById("humidity");
const search = document.getElementById("searchbtn");
const nextdays = document.getElementById("next_days");

//search mode
function togglesearch() {
    const searchDiv = document.querySelector(".searchdiv");
    const inputEl = document.getElementById("cityinput");
    const isactive=searchDiv.classList.toggle("searchactive");
    
    if(isactive){
    document.body.classList.add("searchmode");
    inputEl.style.width = "400px";
    inputEl.style.padding = "12px 16px";
    inputEl.focus();
    }
    else{
        document.body.classList.remove("searchmode");
        getweather();
    }
}

//weather data
function getweather() {
    let city = input.value;

    if (city === "") {
        alert("Enter any city name!");
        return;
    }

    const searchDiv = document.querySelector(".searchdiv");
    const inputEl = document.getElementById("cityinput");
    
    searchDiv.classList.remove("searchactive");
    inputEl.style.width = "0";
    inputEl.style.padding = "0";

    document.body.classList.remove("searchmode");
    cityname.innerHTML = city;

    let url = "https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&count=1";

    fetch(url)
    .then(function(response) {
        return response.json();
    })
    
    .then(function(data) {
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        let weatherurl = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m";

        fetch(weatherurl)
        .then(function(response) {
            return response.json();
        })
    
        .then(function(weatherdata) {

            temp.innerHTML = weatherdata.current.temperature_2m + "°C";
            let hourlyTemps = weatherdata.hourly.temperature_2m.slice(0, 24);
            let hourlyTimes = weatherdata.hourly.time.slice(0, 24);
            drawGraph(hourlyTemps, hourlyTimes);

            let weathercodes = {
                0:"ClearSky☀️", 1:"Mainly Clear🌤️", 2:"Partly Cloudy⛅", 3:"Overcast☁️",
                45:"Fog🌫️", 48:"Depositing Fog🌫️", 51:"Light Drizzle🌨", 53:"Moderate Drizzle🌨",
                55:"Dense Drizzle🌨", 61:"Light Rain🌦️", 63:"Moderate Rain☔", 65:"Heavy Rain🌧️",
                71:"Light Snow❅", 73:"Moderate Snow❄︎", 75:"Heavy Snow⛇", 95:"Thunderstorm⛈️"
            };

            let weathercode_emojies = {
                0:"☀️", 1:"🌤️", 2:"⛅", 3:"☁️", 45:"🌫️", 48:"🌫️",
                51:"🌨", 53:"🌨", 55:"🌨", 61:"🌦️", 63:"☔", 65:"🌧️",
                71:"❅", 73:"❄︎", 75:"⛇",77:"🌨️",80:"🌦️", 81:"🌦️", 82:"🌦️", 85:"❄️", 86:"❄️", 95:"⛈️",96:"⛈️", 99:"⛈️"
            };

            humid.innerHTML = weathercodes[weatherdata.current.weather_code];
            let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

            nextdays.innerHTML = `<div class="forecast_row forecast_header">
                                    <div>Date</div>
                                    <div>Day</div>
                                    <div>Status</div>
                                    <div>Min Temp</div>
                                    <div>Max Temp</div>
                                </div>`;

            for (let i = 0; i < 7; i++) {
                let date = new Date(weatherdata.daily.time[i] + "T00:00:00");
                let dayname;
                if (i===0){
                    dayname="Today";
                }
                else if(i===1){
                    dayname="Tomorrow";
                }
                else{
                    dayname=days[date.getDay()];
                }
                let minTemp = weatherdata.daily.temperature_2m_min[i];
                let maxTemp = weatherdata.daily.temperature_2m_max[i];
                let status=weathercode_emojies[weatherdata.daily.weather_code[i]]||"🌡️";

                nextdays.innerHTML += `<div class="forecast_row">
                                        <div>${weatherdata.daily.time[i].slice(5).replace("-","/")}</div>
                                        <div>${dayname}</div>
                                        <div>${status}</div>
                                        <div>${minTemp}°C</div>
                                        <div>${maxTemp}°C</div>
                                    </div>`;
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    })
    
    .catch(function(error) {
        alert("City not found! Please try again!");
    });
}


//graph data
function drawGraph(temps, times) {
    let existing = Chart.getChart("tempChart");
    if (existing) existing.destroy();

    let labels = times.map(t => t.slice(11, 16));
    let ctx = document.getElementById("tempChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: temps,
                borderColor: "#f5a623",
                backgroundColor: "rgba(245,166,35,0.3)",
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { maxTicksLimit: 8 } },
                y: { ticks: { callback: val => val + "°C" } }
            }
        }
    });
}

