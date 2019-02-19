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
 * Return the types.
 */
module.exports.getMoments = (civObj) => {
    const moments = new Set();
    for(let moment of civObj.Moments) {
        moments.add(moment.Type);
    }
    return moments;
};
