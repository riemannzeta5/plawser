/**
 * A class that contains static utilities for randomization that are useful
 * later (e.g., randomized scene generation.)
 */
class RandomUtils {
    /**
     * Using the given distribution (map of value to probability), returns a
     * random option.
     * 
     * For example:
     * 
     * ```
     *  var map = new Map();
     *  map.set('red', 0.2);
     *  map.set('green', 0.8);
     *  // this will be either 'red' or 'green'
     *  var option = randomOptionWithProbabilityDistribution(map);
     * ```
     * 
     * The probability values obviously must add to 1.
     */
    static randomOptionWithProbabilityDistribution(distributionMap) {
        // We get a random number from 0 to 1, then we see at what map element
        // do the cumulative distribution probability values go above this
        // number. That element gives us our random option.

        var randomDouble = Math.random();
        var sum = 0;
        // shouldn't be necessary, but in case the loop exits without
        // returning, need to know the last key
        var keyVarAfterLoop;
        for (const [key, value] of distributionMap) {
            sum += value;
            if (sum >= randomDouble) {
                return key;
            }
            keyVarAfterLoop = key;
        }
        // A value should be returned above, but just in case, to avoid
        // edge-case bugs.
        return keyVarAfterLoop;
    }

    /**
     * Returns a boolean that is true with given probability (value between
     * 0 and 1.)
     */
    static randomBooleanWithChance(chance) {
        return (Math.random() <= chance);
    }

    /**
     * Returns a randomly chosen option from the provided array, with equal
     * chance to all.
     */
    static randomOption(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

module.exports = {
    RandomUtils: RandomUtils
};
