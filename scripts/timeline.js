/**
 * Expected format:
 * JSON with these top-level keys
 *  - Players
 *  - Moments
 */

 var module = (typeof(module) === "undefined" ? {} : module);
 module.exports = (typeof(module.exports) === "undefined" ? {} : module.exports);

module.exports.getPlayers = (civObj) => {
    return civObj["Players"];
};

/**
 * Return a histogram of moments as a dictionary
 */
module.exports.getMoments = (civObj) => {
    const moments = {};
    for(let moment of civObj.Moments) {
		if(!moments[moment.Type]) {
			moments[moment.Type] = 0;
		}
		moments[moment.Type] += 1;
    }
    return moments;
};
