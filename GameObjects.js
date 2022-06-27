/**
 * Constructs a GameObject, which can represent anything that can be
 * encountered -- an item or an enemy (or, in future, an ally or quest-giver.)
 * 
 * @param name (required)
 *      the name of the object
 * @param isProperName (required)
 *      whether the name is a proper name
 * @param description (required)
 *      the description of the object, where HTML is respected (HTML will be
 *      displayed)
 * @param xpLevel (required)
 *      the min XP level associated with this object (for an enemy, the level
 *      at which this can show up; for an item, the level at which this can be
 *      wielded)
 * @param act (required)
 *      a function that given the stats of the player will act accordingly,
 *      signature `(Player object) --> void` (for an enemy, will complete a
 *      turn in battle; for an item, will apply to the player)
 */
class GameObject {
    constructor(name, isProperName, description, xpLevel, act) {
        this.name = name;
        this.isProperName = isProperName;
        this.description = description;
        this.xpLevel = xpLevel;
        this.act = act;
    }
}

/**
 * Constructs an Item, which is a special kind of GameObject that represents
 * an item that can be picked up by the player and used in battle.
 * 
 * The arguments to the constructor are all the same as `GameObject`.
 */
class Item extends GameObject {
    constructor(name, isProperName, description, xpLevel, act) {
        super(name, isProperName, description, xpLevel, act);
    }
}

/**
 * Constructs an Enemy, which is a special kind of GameObject that represents
 * an enemy that the player can battle.
 * 
 * The arguments to the constructor are all the same as `GameObject` and also
 * include:
 * @param xpGranted (required)
 *      the amount of XP granted to the player after this enemy is defeated
 */
class Enemy extends GameObject {
    constructor(name, isProperName, description, xpLevel, act, xpGranted) {
        super(name, isProperName, description, xpLevel, act);
        this.xpGranted = xpGranted;
    }
}

module.exports = {
    GameObject: GameObject,
    Item: Item,
    Enemy: Enemy
};
