/**
 * Constructs a Player, which represents the stats, info, state, and
 * functionality for a player of the game.
 * 
 * @param name (required)
 *      the name of the player
 * @param initialSkills (required)
 *      a map of skills that the player starts off with, format of string name
 *      to `{description: string, value: number}`
 * @param initialXp (required)
 *      the XP that the player starts off with
 * @param getLevelFromXp (required)
 *      a function that given a numerical XP value computes the corresponding
 *      XP level, signature `(number) --> number`
 * @param initialItems (required)
 *      an array of `Item`s that the player starts off with (see
 *      GameObjects.js)
 */
class Player {
    // Status constants returned by the instance methods to indicate status
    // (success, failure, etc.) of the operation.
    static STATUS_CONSTANTS = {
        addSkill: {
            alreadyExists: 'alreadyExists',
            success: 'success'
        },
        improveSkill: {
            doesNotExist: 'doesNotExist',
            success: 'success'
        }
    };

    constructor(name, initialSkills, initialXp, getLevelFromXp, initialItems) {
        this.name = name;
        this.skills = initialSkills;
        this.xp = initialXp;
        this.getLevelFromXp = getLevelFromXp;
        this.xpLevel = this.recalculateXpLevel();
        this.items = initialItems;
    }

    /**
     * Recalculates and returns the new XP level. This is automatically called
     * every time `setXp()` is.
     */
    recalculateXpLevel() {
        return this.getLevelFromXp(this.xp);
    }

    /**
     * Sets the XP value, and auto-recalculates and sets XP level too.
     */
    setXp(newXp) {
        this.xp = newXp;
        this.xpLevel = this.recalculateXpLevel();
    }

    /**
     * Attempts to add the specified skill. Returns the appropriate status
     * constant above and fails completely if not successful (atomic failure.)
     * Otherwise, adds the skill and initializes the skill points for it.
     */
    addSkill(skillName, skillDescription, skillPoints) {
        if (this.playerStats.customSkills.has(skillName)) {
            return Player.STATUS_CONSTANTS.addSkill.alreadyExists;
        }

        this.skills.set(skillName, {
            description: skillDescription,
            value: skillPoints
        });
        return Player.STATUS_CONSTANTS.addSkill.success;
    }
    
    /**
     * Improve a skill by the given amount. Returns the appropriate status
     * constant.
     */
    improveSkill(skillName, improvePoints) {
        if (! this.skills.has(skillName)) {
            return Player.STATUS_CONSTANTS.improveSkill.doesNotExist;
        }
        var description = this.skills.get(skillName).description;
        var oldValue = this.skills.get(skillName).value;
        this.skills.set(skillName, {
            description: description,
            value: oldValue + improvePoints
        });
        return Player.STATUS_CONSTANTS.improveSkill.success;
    }
}

module.exports = {
    Player: Player
};
