import { useState } from "react";

import { getGeoLoc, getLoc } from "./utils.js";

import "./styles/App.css";
import "./styles/general.css";

function App() {
	// [USE STATES]
	const [statusMsg, setStatusMsg] = useState("No Location Detected");

	const reqSvgs = require.context("./assets", true, /\.svg$/);

	const [icons, setIcons] = useState(
		reqSvgs.keys().reduce((images, path) => {
			images[`${path.substring(2).replace(".svg", "")}`] = reqSvgs(path);
			return images;
		}, {})
	);

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
		icon: "",
	});

	const getForecast = async (lat, long) => {
		const options = {
			method: "GET",
			headers: {},
		};

		// Wait for a response from API
		const response = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=${process.env.REACT_APP_VISUAL_CROSSING_API_KEY}&contentType=json`,
			options
		);

		// If response is OK, do something
		if (response.ok) {
			const data = await response.json();
			const currDay = data.days[0];

			const locData = await getLoc(lat, long);

			setWeatherInfo({
				location: `${locData.municipality}, ${locData.country}`,
				temp: currDay.temp,
				desc: currDay.conditions,
				high: currDay.tempmax,
				low: currDay.tempmin,
				precip: currDay.precip,
				humidity: currDay.humidity,
				windspeed: currDay.windspeed,
				icon: icons[currDay.icon],
			});
		} else {
			console.log("ERROR!");
		}
	};

	const displayWeather = async () => {
		setWeatherInfo({
			location: "",
			temp: "",
			desc: "",
			high: "",
			low: "",
			precip: "",
			humidity: "",
			windspeed: "",
			icon: "",
		});

		// Try to get location of user and get weather information
		try {
			const geoLoc = await getGeoLoc();
			const coordinates = geoLoc.coords;
			getForecast(coordinates.latitude, coordinates.longitude);
		} catch (error) {
			console.log(error);
		}
	};

	if (currWeatherInfo.location !== "") {
		return (
			<div className="app">
				<div className="location-name">{currWeatherInfo.location}</div>
				<div className="today-weather">
					<img className="weather-icon" src={currWeatherInfo.icon} />
					<div className="temp-desc">{currWeatherInfo.desc}</div>
					<div className="current-temp">{currWeatherInfo.temp} F</div>
					<div className="min-max">
						High : {currWeatherInfo.high} | Low :{" "}
						{currWeatherInfo.low}
					</div>
					<div className="misc-info">
						<div>Precipitation : {currWeatherInfo.precip}</div>
						<div>Humidity : {currWeatherInfo.humidity}</div>
						<div>Windspeed : {currWeatherInfo.windspeed}</div>
					</div>
				</div>
				<div className="location-btn" onClick={displayWeather}>
					<button>Get my Weather</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="app">
				<div className="status-msg">{statusMsg}</div>
				<div className="location-btn" onClick={displayWeather}>
					<button>Get my Weather</button>
				</div>
			</div>
		);
	}
}

export default App;
