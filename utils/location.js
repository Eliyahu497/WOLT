/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {Object} loc1 - First location {lat, lng}
 * @param {Object} loc2 - Second location {lat, lng}
 * @returns {number} Distance in kilometers
 */
function calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2 || typeof loc1.lat !== 'number' || typeof loc1.lng !== 'number' || typeof loc2.lat !== 'number' || typeof loc2.lng !== 'number') {
        return null;
    }

    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(loc2.lat, loc1.lat);
    const dLon = distance(loc2.lng, loc1.lng);

    const lat1 = toRadian(loc1.lat);
    const lat2 = toRadian(loc2.lat);

    // Haversine Formula
    const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    return RADIUS_OF_EARTH_IN_KM * c;
}

module.exports = {
    calculateDistance
};
