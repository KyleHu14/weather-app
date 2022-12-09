import { useState } from "react";
import "./styles/App.css";

function App() {
	// [USE STATES]
	// User's coordinates
	const [displayLocationText, setLocationText] = useState("");

	// [FUNCTIONS]
	// Function Name : getLocation
	// USE : Handles getting user's location
	const getLocation = () => {
		const success = (pos) => {
			const lat = pos.coords.latitude;
			const long = pos.coords.longitude;

			setLocationText(`Your location : (${lat}, ${long})`);
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

	return (
		<div className="app">
			<div className="location-btn" onClick={getLocation}>
				<button>Get my Location</button>
			</div>
			<div className="display-location">{displayLocationText}</div>
		</div>
	);
}

export default App;
