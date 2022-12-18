/**
 * Returns a promise to a GeoLocationPosition object
 * @returns {promise<GeoLocationPosition>} - GeoLocationObject contains the longitude & latitude
 */
const getGeoLoc = () => {
	// If geolocation isn't supported, return -1
	if (!navigator.geolocation) {
		return -1;
	} else {
		// Otherwise, return a promise of the GeoLocationPosition object
		return new Promise((success, error) => {
			navigator.geolocation.getCurrentPosition(success, error);
		});
	}
};

/**
 * Given a pair of coordinates, returns an object that
 * contains the municipality and country associated with the coordinates in string format
 * @param {int} lat - Latitude
 * @param {int} long - Longitude
 * @returns {locData} locData - Object that contains municpality & country
 * @returns {string} locData.municipality - Associated city of coordinates
 * @returns {string} locData.country - Associated country of coordinates
 */
const getLoc = async (lat, long) => {
	// API Key of TOM TOM
	const resp = await fetch(
		`https://api.tomtom.com/search/2/reverseGeocode/${lat},${long}.json?key=${process.env.REACT_APP_TOMTOM_API_KEY}&language=en-US`
	);

	const data = await resp.json();

	const locData = {
		municipality: String(data.addresses[0].address.municipality),
		country: String(data.addresses[0].address.country),
	};

	return locData;
};

// Exports
export { getGeoLoc, getLoc };
