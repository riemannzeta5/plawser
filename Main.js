/*
 * In this file, we gather all the classes/functions/etc. we want to export
 * as part of Plawser.
 */

var GameObjects = require('./GameObjects');
var Player = require('./Player');
var RandomUtils = require('./RandomUtils');
var WebUtils = require('./WebUtils');

window.plawser = {
    GameObject: GameObjects.GameObject,
    Enemy: GameObjects.Enemy,
    Item: GameObjects.Item,
    Player: Player.Player,
    RandomUtils: RandomUtils.RandomUtils,
    WebUtils: WebUtils.WebUtils
};
