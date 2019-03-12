/**
 * For interface definitions see ./src/components/interfaces.ts
 */

 var module = (typeof(module) === "undefined" ? {} : module);
 module.exports = (typeof(module.exports) === "undefined" ? {} : module.exports);

module.exports.getPlayers = (civObj) => {
    return civObj["Players"];
};

/**
 * Return a histogram of moments as a dictionary
 * @param {ITimelineData} civObj
 * @returns {IMoment[]}
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
