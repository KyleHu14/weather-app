import { useState } from "react";
import "./styles/App.css";

function App() {
	// [USE STATES]
	// User's coordinates
	const [displayLocationText, setLocationText] = useState("");
	// Current Weather Information
	// Location of weather being displayed
	const [currWeatherInfo, setWeatherInfo] = useState({
		location: "",
		temp: "",
		desc: "",
		high: "",
		low: "",
		precip: "",
		humidity: "",
		windspeed: "",
	});

	// [FUNCTIONS]
	// Function Name : getLocation
	// USE : Handles getting user's location
	const getLocation = () => {
		const success = (pos) => {
			const lat = pos.coords.latitude;
			const long = pos.coords.longitude;

			setLocationText(`Your location : (${lat}, ${long})`);
			getForecast(lat, long);
		};

		const error = () => {
			setLocationText("Unable to retrieve your location");
		};

		// If the user does not allow geolocation
		if (!navigator.geolocation) {
			setLocationText("Geolocation is unsupported by your browser");
		} else {
			setLocationText("Finding your location..");
			navigator.geolocation.getCurrentPosition(success, error);
		}
	};

	// Function Name : getForecast
	// USE : Given longitude & latitude, returns api result of weather
	const getForecast = async (lat, long) => {
		const API_KEY = "X5AS4VH98AAB58ZTQRZ6MEBJK";
		const options = {
			method: "GET",
			headers: {},
		};

		// Wait for a response from API
		const response = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=${API_KEY}&contentType=json`,
			options
		);

		// If response is OK, do something
		if (response.ok) {
			const data = await response.json();
			const currDay = data.days[0];
			setWeatherInfo({
				location: "Hsinchu, Taiwan",
				temp: currDay.temp,
				desc: currDay.conditions,
				high: currDay.tempmax,
				low: currDay.tempmin,
				precip: currDay.precip,
				humidity: currDay.humidity,
				windspeed: currDay.windspeed,
			});
			console.log(data);
		} else {
			console.log("ERROR!");
		}
	};

	if (currWeatherInfo.location !== "") {
		return (
			<div className="app">
				<div className="today-weather">
					<div className="location-name">Hsinchu, Taiwan</div>
					<div className="current-temp">{currWeatherInfo.temp} F</div>
					<div className="temp-desc">{currWeatherInfo.desc}</div>
					<div className="min-max">
						<div>High : {currWeatherInfo.high}</div>
						<div>Low : {currWeatherInfo.low}</div>
					</div>
					<div className="misc-info">
						<div>Precipitation : {currWeatherInfo.precip}</div>
						<div>Humidity : {currWeatherInfo.humidity}</div>
						<div>Windspeed : {currWeatherInfo.windspeed}</div>
					</div>
				</div>
				<div className="location-btn" onClick={getLocation}>
					<button>Detect My Location</button>
				</div>
				<div className="display-location">{displayLocationText}</div>
			</div>
		);
	} else {
		return (
			<div className="app">
				<div className="today-weather">
					<div className="location-name">No Information Yet</div>
				</div>
				<div className="location-btn" onClick={getLocation}>
					<button>Get my Location</button>
				</div>
				<div className="display-location">{displayLocationText}</div>
			</div>
		);
	}
}

export default App;
