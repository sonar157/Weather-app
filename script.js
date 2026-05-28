const api="YOUR_API_HERE"

const input=document.getElementById("cityinput");
const cityname=document.getElementById("cityname");
const temp=document.getElementById("temp");
const wind=document.getElementById("wind");
const humid=document.getElementById("humidity");
const search=document.getElementById("searchbtn");

function getweather(){
    var city=input.value;

    if (city===""){
        alert("Enter any city name!");
        return;
    }

    var url="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + api + "&units=metric";
    
    fetch(url)
    .then(function(response){
        return response.json();
    })

    .then(function(data){
        cityname.innerHTML=data.name;
        temp.innerHTML=data.main.temp+"C";
        humid.innerHTML="Humidity: "+data.main.humidity+"%";
        wind.innerHTML="Wind: "+data.wind.speed+"km/h";
    })
    .catch(function(error){
        alert("City not found! Please try again!");
    });
}
