import { useState } from "react";
import "./styles/App.css";

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

	// [FUNCTIONS]
	// Function Name : getLocation
	// USE : Handles getting user's location
	const getLocation = () => {
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

		const success = (pos) => {
			const lat = pos.coords.latitude;
			const long = pos.coords.longitude;
			getForecast(lat, long);
		};

		const error = () => {
			setStatusMsg("Unable to Retrieve Location");
		};

		// If the browser does not allow geolocation
		if (!navigator.geolocation) {
			setStatusMsg("Geolocation is not Supported by your Browser");
		} else {
			setStatusMsg("Finding Location..");
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

			let addr = await getAddr(lat, long);

			setWeatherInfo({
				location: addr,
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

	// Function Name : getForecast
	// USE : Given longitude & latitude, returns api result of weather
	const getAddr = async (lat, long) => {
		const API_KEY = "AeJ03vjX2DuUgrZyE22K6m7IdeCaoxXF";
		const resp = await fetch(
			`https://api.tomtom.com/search/2/reverseGeocode/${lat},${long}.json?key=${API_KEY}&language=en-US`
		);
		const data = await resp.json();

		let city = String(data.addresses[0].address.municipality);
		let country = String(data.addresses[0].address.country);

		return `${city}, ${country}`;
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
				<div className="location-btn" onClick={getLocation}>
					<button>Detect My Location</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="app">
				<div className="status-msg">{statusMsg}</div>
				<div className="location-btn" onClick={getLocation}>
					<button>Get my Location</button>
				</div>
			</div>
		);
	}
}

export default App;
