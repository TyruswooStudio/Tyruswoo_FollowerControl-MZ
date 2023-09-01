//=============================================================================
// Follower Control
// For RPG Maker MZ
// By Tyruswoo
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Imported = Imported || {};
Imported.Tyruswoo_FollowerControl = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.FollowerControl = Tyruswoo.FollowerControl || {};

/*:
 * @target MZ
 * @plugindesc v1.2.1 Provides greater control of party follower movement! Allows event commands
 * targeting the "player" to affect any follower of your choosing!
 * @author Tyruswoo
 * @url https://www.tyruswoo.com
 *
 * @help Tyruswoo Follower Control for RPG Maker MZ
 * 
 * WARNING: This is an older plugin! It lacks features and improvements
 * present in the latest version. You can get the latest version for free
 * on Tyruswoo.com.
 *
 * ============================================================================
 * Plugin commands:
 *    Leader                   Selects the party leader. (Default.)
 *    Follower 1               Selects the 1st follower.
 *    Follower 2               Selects the 2nd follower.
 *    Follower 3               Selects the 3rd follower.
 *    Follower 4               Selects the 4th follower.
 *    Follower 5               Selects the 5th follower.
 *    Follower 6               Selects the 6th follower.
 *    Follower 7               Selects the 7th follower.
 *    Follower 8               Selects the 8th follower.
 *    Follower 9               Selects the 9th follower.
 *    Follower by Position     Select any follower, based on marching order.
 *    Follower by Name         Select follower by name of actor in database.
 *    Follower by Actor ID     Select follower by actor ID.
 *    Stop Chase               Prevent followers from chasing the leader.
 *    Chase                    Allow followers to chase the leader. (Default.)
 *    Pose                     Change a party member's character image to pose.
 *    Reset Pose               Change a party member's to their default pose.
 * ============================================================================
 * Plugin parameters:
 *    Max Party Members        Set how many party members are shown. Default 4.
 *    Search Limit             Set the pathfinding search limit. Default 12.
 * ============================================================================
 * Script calls: (Advanced. Use these within the Set Move Route command.)
 *    this.path(x, y)          Pathfind to the absolute coordinates indicated.
 *    this.path('event', id)   Pathfind to the event of ID number id.
 *    this.path('e', id)       Same as this.path('event', id). May use 'E'.
 *    this.path('follower', i) Pathfind to the follower of position i.
 *    this.path('f', i)        Same as this.path('follower', i). May use 'F'.
 *    this.path('leader')      Pathfind to the party leader.
 *    this.path('L')           Same as this.path('leader'). May use 'l'.
 *    this.moveToward(x, y)    Move toward the absolute coordinates indicated.
 *    this.moveToward('e', id) Move toward the event of ID number id.
 *    this.moveToward('f', i)  Move toward the follower of position i.
 *    this.moveToward('L')     Move toward the party leader. May use 'l'.
 * ============================================================================
 * Basics of how to use this plugin:
 * 1. First, select the desired party member. This may be the leader, for
 *    default RPG Maker behavior. To control followers, select a follower.
 * 2. Next, use an event command on the "player", and the selected party member
 *    will be affected! This works for many commands, including:
 *     - Set Move Route
 *     - Show Balloon Icon
 *     - Show Animation
 *     - Transfer Player
 *     - Conditional Branch
 * 3. Note that if you are moving the party leader, the followers by default
 *    will chase the leader. If you want the leader to move independently,
 *    without the followers chasing, you will need to use the "Stop Chase"
 *    plugin command.
 * 4. After you are done with the eventing, remember to use the "Leader" and
 *    "Chase" plugin commands to return to default RPG Maker behavior, if
 *    desired.
 * ============================================================================
 * Advanced uses for this plugin:
 *  - Make common events with preset movement patterns for the party. Then,
 *    use these movement patterns for cutscenes throughout the game!
 *  - You can make a follower that looks transparent, like a ghost! Select a
 *    follower, then using the Set Move Route command to change the follower's
 *    opacity, and/or to turn off (or on) the follower's walking animation,
 *    stepping animation, or direction fix.
 *  - You can make a follower turn toward the party leader. First, select a
 *    follower. Then, use the Set Move Route command and use the move route
 *    "turn toward player". (If you also want the party leader to turn
 *    toward the follower: Use conditional branches to check the direction
 *    faced by the follower; then, inside the conditional branch, select the
 *    leader, and use Set Move Route to make the leader face the opposite
 *    direction.)
 *  - If followers are on the same tile as the leader, you can make them
 *    face the same direction as the leader. Select a follower, then use the
 *    Set Move Route command and use the move route "turn toward player".
 *    (This also works for events that are on the same tile as the leader.)
 *  - Poses! These allow you to change an actor's character image, without
 *    needing to know which actor is being affected. Based on the follower
 *    you choose, the follower's actor's character image will change to the
 *    pose you choose. Example: If you have an actor named Tyruswoo with
 *    character image "Tyruswoo.png", then you can use the Pose plugin command
 *    with the argument "wounded" to change the character's image to
 *    "Tyruswoo_wounded.png". Most importantly, this affects the chosen
 *    follower, without needing to know which actor ID is being affected, and
 *    without needing to know the current graphic of the actor. To change the
 *    pose back to default, use the Reset Pose plugin command.
 *  - Pathfinding! You can make any character (party leader, follower, or
 *    event) take a step toward coordinates, or a step toward any other
 *    follower or event! Within the Set Move Route command, use this script:
 *    this.path(x, y) and the character will step toward coordinates x,y.
 *    To make the character step toward a follower, use the script
 *    this.path('follower', i) where i is the position (marching order) of the
 *    follower. To make the character step toward the party leader, use the
 *    script this.path('leader'). To make the character step toward an event,
 *    use the script this.path('event', i) where i is the ID number of the
 *    event. If you don't want pathfinding, but want the character to attempt
 *    to take a step without trying to avoid walls, you can use the script
 *    this.moveToward(x,y), this.moveToward('follower',id),
 *    this.moveToward('event',i), or this.moveToward('leader'). In all these
 *    scripts, you can also abbreviate 'follower' to 'f', 'leader' to 'l', and
 *    'event' to 'e'. Using abbreviations can make it easier to read the
 *    scripts inside the Set Move Route window. Note that by default, followers
 *    have Through On, so if you want the followers to pathfind around
 *    solid obstacles, you will need to use Set Move Route on the follower to
 *    set Through Off.
 * ============================================================================
 * For more help using the Follower Control plugin, see Tyruswoo.com.
 * ============================================================================
 * Version History:
 *
 * v1.0  8/22/2020
 *        - Follower Control released for RPG Maker MZ!
 *
 * v1.1  8/25/2020
 *        - Removed a bug that caused Tyruswoo.FollowerControl._follower to be
 *          reverted to $gamePlayer whenever a Game_Interpreter closed. Now,
 *          the selected follower is remembered from one event to the next,
 *          (as long as the player stays in the same map). This also allows
 *          the Follower Control plugin to much more easily communicate with
 *          other plugins. For example, this allows Tyruswoo_TileControl to use
 *          information about the current follower in its plugin commands.
 *
 * v1.2  8/30/2020
 *        - Corrected bug in replacement method for the function
 *          Game_Interpreter.character(), in which if
 *          Tyruswoo.FollowerControl._follower was not defined using the
 *          Follower Control plugin, then the first instance of eventing (such
 *          as a Transfer Player event) could result in
 *          Game_Interpreter.character() returning null instead of returning
 *          $gamePlayer. Now, if Tyruswoo.FollowerControl._follower is not yet
 *          defined, Game_Interpreter.character() will never use a null value
 *          Tyruswoo.FollowerControl._follower, but will instead use
 *          $gamePlayer, as is the default behavior for the function.
 * 
 * v1.2.1  8/31/2023
 *        - This plugin is now free and open source under the MIT license.
 * 
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 * ============================================================================
 * Remember, only you can build your dreams!
 * -Tyruswoo
 *
 * @param Max Party Members
 * @type number
 * @min 1
 * @desc The maximum number of party members. This includes the leader and followers. Default: 4
 * @default 4
 *
 * @param Pathfinding Search Limit
 * @type number
 * @min 1
 * @desc The pathfinding search limit for the player, followers, and events. Default: 12
 * @default 12
 *
 * @command leader
 * @text Leader
 * @desc Selects the party leader. (This is the default for RPG Maker.)
 *       Then, use Set Move Route on "player" to move the party leader.
 *
 * @command follower_1
 * @text Follower 1
 * @desc Selects the first follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_2
 * @text Follower 2
 * @desc Selects the second follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_3
 * @text Follower 3
 * @desc Selects the third follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_4
 * @text Follower 4
 * @desc Selects the fourth follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_5
 * @text Follower 5
 * @desc Selects the fifth follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_6
 * @text Follower 6
 * @desc Selects the sixth follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_7
 * @text Follower 7
 * @desc Selects the seventh follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_8
 * @text Follower 8
 * @desc Selects the eighth follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 *
 * @command follower_9
 * @text Follower 9
 * @desc Selects the ninth follower (in current marching order).
 *       Then, use Set Move Route on "player" to move the follower.
 * 
 * @command follower_by_position
 * @text Follower by Position
 * @desc Selects a follower by position (in current marching order).
 *       Then, use Set Move Route on the "player" to move the follower.
 *
 * @arg followerId
 * @type number
 * @default 0
 * @text Follower Position
 * @desc Select a follower by position (in current marching order).
 *       Using 0 selects the party leader.
 *
 * @command follower_by_name
 * @text Follower by Name
 * @desc Select a follower by name (as defined in the Database).
 *       Then, use Set Move Route on the "player" to move the follower.
 *
 * @arg followerName
 * @type string
 * @text Follower Name
 * @desc Select a follower by name.
 *       Must match the actor's name as defined in the Database.
 *
 * @command follower_by_actor_id
 * @text Follower by Actor ID
 * @desc Select a follower by actor ID (as defined in the Database).
 *       Then, use Set Move Route on the "player" to move the follower.
 *
 * @arg actorId
 * @type actor
 * @text Actor
 * @desc Select a follower by actor ID.
 *       Must match the actor's ID number defined in the Database.
 *
 * @command stop_chase
 * @text Stop Chase
 * @desc Prevent the followers from chasing the leader.
 *       Then, you can move the leader without the followers chasing.
 *
 * @command chase
 * @text Chase
 * @desc Allow the followers to chase the leader.
 *       This is the default for RPG Maker.
 *
 * @command pose
 * @text Pose
 * @desc Change the character image of a follower's associated actor.
 *       Pose graphic must exist, or game will crash!
 *
 * @arg poseName
 * @type string
 * @text Pose
 * @desc Example: Change actor's character image "Tyruswoo.png" to
 *       "Tyruswoo_wounded.png" by typing "wounded".
 *
 * @command reset_pose
 * @text Reset Pose
 * @desc Reset the follower's actor's character image to the actor's
 *       current non-posed character image.
 */

(() => {
    const pluginName = "Tyruswoo_FollowerControl";

	Tyruswoo.FollowerControl.parameters = PluginManager.parameters(pluginName);
	Tyruswoo.FollowerControl.param = Tyruswoo.FollowerControl.param || {};

	// User-Defined Plugin Parameters
	Tyruswoo.FollowerControl.param.maxBattleMembers = Number(Tyruswoo.FollowerControl.parameters['Max Party Members']);
	Tyruswoo.FollowerControl.param.searchLimit = Number(Tyruswoo.FollowerControl.parameters['Pathfinding Search Limit']);
	
	// Variables
	Tyruswoo.FollowerControl._follower = $gamePlayer;
	Tyruswoo.FollowerControl._stopChase = false;
	
	//=============================================================================
	// PluginManager
	//=============================================================================
	
	// leader
	PluginManager.registerCommand(pluginName, "leader", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer;
	});
	
	// follower_1
	PluginManager.registerCommand(pluginName, "follower_1", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(0);
	});

	// follower_2
	PluginManager.registerCommand(pluginName, "follower_2", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(1);
	});

	// follower_3
	PluginManager.registerCommand(pluginName, "follower_3", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(2);
	});
	
	// follower_4
	PluginManager.registerCommand(pluginName, "follower_4", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(3);
	});

	// follower_5
	PluginManager.registerCommand(pluginName, "follower_5", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(4);
	});

	// follower_6
	PluginManager.registerCommand(pluginName, "follower_6", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(5);
	});
	
	// follower_7
	PluginManager.registerCommand(pluginName, "follower_7", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(6);
	});
	
	// follower_8
	PluginManager.registerCommand(pluginName, "follower_8", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(7);
	});
	
	// follower_9
	PluginManager.registerCommand(pluginName, "follower_9", args => {
		Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(8);
	});

	// follower_by_position
	PluginManager.registerCommand(pluginName, "follower_by_position", args => {
		if(args.followerId == 0) {
			Tyruswoo.FollowerControl._follower = $gamePlayer;
		} else if(args.followerId >= 1) {
			Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(args.followerId - 1);
		};
	});

	// follower_by_name
	PluginManager.registerCommand(pluginName, "follower_by_name", args => {
		if(args.followerName) {
			let len = $gameParty.battleMembers().length;
			for (let i = 0; i < len; i++) {
				let actorId = $gameParty.battleMembers()[i].actorId(); //Get the actorId that belongs to this follower.
				let actorName = $dataActors[actorId].name; //Get the Database name of the actor, based on the actorId.
				if(actorName == args.followerName) {
					if(i == 0) {
						Tyruswoo.FollowerControl._follower = $gamePlayer;
					} else if(i >= 1) {
						Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(i - 1);
					};
					// console.log("Tyruswoo Follower Control:  Move Route commands now affect " + args.followerName + ", who is Follower", i);
				}
			};
		};
	});

	// follower_by_actor_id
	PluginManager.registerCommand(pluginName, "follower_by_actor_id", args => {
		if(args.actorId) {
			let len = $gameParty.battleMembers().length;
			for (let i = 0; i < len; i++) {
				let actorId = $gameParty.battleMembers()[i].actorId(); //Get the actorId that belongs to this follower.
				if(actorId == args.actorId) {
					if(i == 0) {
						Tyruswoo.FollowerControl._follower = $gamePlayer;
					} else if(i >= 1) {
						Tyruswoo.FollowerControl._follower = $gamePlayer.followers().follower(i - 1);
					};
				}
			};
		};
	});
	
	// stop_chase
	PluginManager.registerCommand(pluginName, "stop_chase", args => {
		Tyruswoo.FollowerControl._stopChase = true;
	});

	// chase
	PluginManager.registerCommand(pluginName, "chase", args => {
		Tyruswoo.FollowerControl._stopChase = false;
	});

	// pose
	PluginManager.registerCommand(pluginName, "pose", args => {
		let actor = Tyruswoo.FollowerControl._follower.actor();
		if(actor) {
			if(!actor._characterNameCore) {
				actor._characterNameCore = actor.characterName();
			}
			let core = actor._characterNameCore;
			let pose = core + "_" + args.poseName;
			actor._characterName = pose;
			$gamePlayer.refresh();
		};
	});

	// reset_pose
	PluginManager.registerCommand(pluginName, "reset_pose", args => {
		let actor = Tyruswoo.FollowerControl._follower.actor();
		if(actor) {
			actor._characterName = actor._characterNameCore;
			$gamePlayer.refresh();
		};
	});

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	// Replacement method
	// Transfer Player
	Game_Interpreter.prototype.command201 = function(params) {
		if ($gameParty.inBattle() || $gameMessage.isBusy()) {
			return false;
		}
		let mapId, x, y;
		if (params[0] === 0) {
			// Direct designation
			mapId = params[1];
			x = params[2];
			y = params[3];
		} else {
			// Designation with variables
			mapId = $gameVariables.value(params[1]);
			x = $gameVariables.value(params[2]);
			y = $gameVariables.value(params[3]);
		}
		if (mapId !== $gameMap.mapId()) {  //If transferring to a different map, then always transfer the leader, with followers.
			Tyruswoo.FollowerControl._stopChase = false;		//If player goes to a new map, followers will resume chase.
			Tyruswoo.FollowerControl._follower = $gamePlayer;	//If player goes to a new map, reset selected follower to the leader.
			$gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
			this.setWaitMode("transfer");
		} else if (Tyruswoo.FollowerControl._follower === $gamePlayer) {
			if (!Tyruswoo.FollowerControl._stopChase) { //Followers are chasing the leader, so transfer leader with followers.
				$gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
				this.setWaitMode("transfer");
			} else { //Followers are not chasing the leader, so simply teleport the leader within the map, like any other follower.
			    Game_Character.prototype.locate.call($gamePlayer, x, y);
				if (Imported.Tyruswoo_CameraControl) { //Check if the Tyruswoo_CameraControl plugin is installed and active.
					if ($gameMap._camFollow === 'player') {
						$gamePlayer.center(x, y);
					}
				} else {
					$gamePlayer.center(x, y);
				}
				$gamePlayer.makeEncounterCount();
				if ($gamePlayer.isInVehicle()) {
					$gamePlayer.vehicle().refresh();
				}
			}
		} else {  //Transfer a follower.
			Tyruswoo.FollowerControl._follower.locate(x, y);
			if (params[4] > 0) { // Set follower direction
				let d = params[4];
				if (!Tyruswoo.FollowerControl._follower.isDirectionFixed() && d) {
					Tyruswoo.FollowerControl._follower._direction = d;
				}
			}
		}
		return true;
	};
	
	// Replacement method
	// Note that this method is called by various commands, including Set Movement Route, Show Animation, and Show Balloon Icon.
	// This method is also called by the Game_Interpreter.updateWaitMode function.
	Game_Interpreter.prototype.character = function(param) {
		if ($gameParty.inBattle()) {
			return null;
		} else if (param < 0) {
			return Tyruswoo.FollowerControl._follower ? Tyruswoo.FollowerControl._follower : $gamePlayer; //Changed line.
		} else if (this.isOnCurrentMap()) {
			return $gameMap.event(param > 0 ? param : this._eventId);
		} else {
			return null;
		}
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	// Alias method.
	// If an actor's character image is set by a command, then reset the pose core to the new character image.
	Tyruswoo.FollowerControl.Game_Actor_setCharacterImage = Game_Actor.prototype.setCharacterImage;
	Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
		Tyruswoo.FollowerControl.Game_Actor_setCharacterImage.call(this, characterName, characterIndex);
		this._characterNameCore = this.characterName();
	};

	//=============================================================================
	// Game_Party
	//=============================================================================
	
	// Replacement method
	Game_Party.prototype.maxBattleMembers = function() {
		return Tyruswoo.FollowerControl.param.maxBattleMembers;
	};

	//=============================================================================
	// Game_CharacterBase
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
	Game_CharacterBase.prototype.initMembers = function() {
		Tyruswoo.FollowerControl.Game_CharacterBase_initMembers.call(this);
		this._searchLimit = Tyruswoo.FollowerControl.param.searchLimit; //We define a pathfinding searchLimit variable for each character.
	};

	// New method.
	// This can be used as a script call within a Set Move Route command, using this script: this.pathMax(12) where 12 can be replaced with any positive integer.
	// Note that for RPG Maker, the default search limit is 12 for all characters. Follower Control has a parameter that allows setting a different value for the default global search limit.
	Game_CharacterBase.prototype.pathMax = function(value = Tyruswoo.FollowerControl.param.searchLimit) {
		if (value && value > 0) {
			this._searchLimit = value; //Set the searchLimit for this character.
		} else {
			this._searchLimit = Tyruswoo.FollowerControl.param.searchLimit; //Default searchLimit.
		};
	};

	//=============================================================================
	// Game_Character
	//=============================================================================

	// Replacement method.
	Game_Character.prototype.searchLimit = function() {
		return this._searchLimit;
	};

	// Replacement method
	Game_Character.prototype.turnTowardCharacter = function(character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (sx === 0 && sy === 0) { //If a character is on the same tile as the target character toward which it is to look...
			this.setDirection($gamePlayer.direction()); //...then, make the character look the same direction as the target character.
		} else if (Math.abs(sx) > Math.abs(sy)) {
			this.setDirection(sx > 0 ? 4 : 6);
		} else if (sy !== 0) {
			this.setDirection(sy > 0 ? 8 : 2);
		}
	};

	// New method
	Game_Character.prototype.moveTowardPosition = function(target_x, target_y) {
		const sx = this.deltaXFrom(target_x);
		const sy = this.deltaYFrom(target_y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 4 : 6);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 8 : 2);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 4 : 6);
			}
		}
	};

	// New method
	// This method used to be the path method used in Follower Control v1.09, but has been renamed as moveToward,
	// because the improved path method of Follower Control v2.00 allows for avoiding obstacles.
	Game_Character.prototype.moveToward = function(target_x, target_y) {
		if(typeof target_x === 'string') {
			target_x = target_x.toLowerCase().charAt(0);
		};
		switch(target_x) {
			case 'e': //If target_x is the word 'event', then target_y is the event's ID number.
				this.moveTowardCharacter($gameMap.event(target_y));
				break;
			case 'f': //If target_x is the word 'follower', then target_y is the follower's marching order.
				if(target_y <= 0) {
					this.moveTowardPlayer();
				} else {
					this.moveTowardCharacter($gamePlayer.followers().follower(target_y - 1));
				}
				break;
			case 'l':
				this.moveTowardPlayer();
				break;
			default: //By default, the target_x is an x coordinate on the map, and the target_y is a y coordinate on the map.
				this.moveTowardPosition(target_x, target_y);
		};
	};

	// New method
	// This is the path method as of Follower Control v2.00. This method allows avoiding obstacles.
	// Keep in mind that the character must have Through Off in order to recognize obstacles in pathfinding.
	Game_Character.prototype.path = function(target_x, target_y) {
		let direction = 0;
		if(typeof target_x === 'string') {
			target_x = target_x.toLowerCase().charAt(0);
		};
		switch(target_x) {
			case 'e': //If target_x is the word 'event', then target_y is the event's ID number.
				var targetCharacter = $gameMap.event(target_y);
				direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
				break;
			case 'f': //If target_x is the word 'follower', then target_y is the follower's marching order.
				if(target_y <= 0) {
					var targetCharacter = $gamePlayer;
					direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
				} else {
					var targetCharacter = $gamePlayer.followers().follower(target_y - 1);
					direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
				}
				break;
			case 'l':
				var targetCharacter = $gamePlayer;
				direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
				break;
			default: //By default, the target_x is an x coordinate on the map, and the target_y is a y coordinate on the map.
				direction = this.findDirectionTo(target_x, target_y);
		};
		if(direction > 0) {
			this.executeMove(direction);
		};
	};

	// New method
	// This method is modeled on the Game_Player.executeMove function.
	// This allows us to use executeMove on characters besides the player, such as followers or events.
	Game_Character.prototype.executeMove = function(direction) {
		this.moveStraight(direction);
	};

	//=============================================================================
	// Game_Player
	//=============================================================================

	// New method
	Game_Player.prototype.actor = function() {
		return $gameParty.battleMembers()[0];
	};

	// Replacement method
	Game_Player.prototype.jump = function(xPlus, yPlus) {
		Game_Character.prototype.jump.call(this, xPlus, yPlus);
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.jumpAll();
		};
	};

	// New method
	Game_Player.prototype.setOpacity = function(opacity) {
		this._opacity = opacity;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setOpacityAll(opacity);
		}
	};

	// New method
	Game_Player.prototype.setStepAnime = function(stepAnime) {
		this._stepAnime = stepAnime;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setStepAnimeAll(stepAnime);
		}
	};

	// New method
	Game_Player.prototype.setDirectionFix = function(directionFix) {
		this._directionFix = directionFix;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setDirectionFixAll(directionFix);
		}
	};

	// New method
	Game_Player.prototype.setTransparent = function(transparent) {
		this._transparent = transparent;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setTransparentAll(transparent);
		}
	};

	// New method
	Game_Player.prototype.setWalkAnime = function(walkAnime) {
		this._walkAnime = walkAnime;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setWalkAnimeAll(walkAnime);
		}
	};

	// New method
	Game_Player.prototype.setBlendMode = function(blendMode) {
		this._blendMode = blendMode;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setBlendModeAll(blendMode);
		}
	};

	// New method
	Game_Player.prototype.setMoveSpeed = function(moveSpeed) {
		this._moveSpeed = moveSpeed;
		if(!Tyruswoo.FollowerControl._stopChase) {
			this._followers.setMoveSpeedAll(moveSpeed);
		}
	};

	//=============================================================================
	// Game_Followers
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_Followers_updateMove = Game_Followers.prototype.updateMove;
	Game_Followers.prototype.updateMove = function() {
		if(Tyruswoo.FollowerControl._stopChase) {
			return false;
		};
		Tyruswoo.FollowerControl.Game_Followers_updateMove.call(this);
	};

	// New method
	Game_Followers.prototype.setOpacityAll = function(opacity) {
		this._data.forEach(function(follower) {
			follower.setOpacity(opacity);
		}, this);
	};

	// New method
	Game_Followers.prototype.setStepAnimeAll = function(stepAnime) {
		this._data.forEach(function(follower) {
			follower.setStepAnime(stepAnime);
		}, this);
	};

	// New method
	Game_Followers.prototype.setDirectionFixAll = function(directionFix) {
		this._data.forEach(function(follower) {
			follower.setDirectionFix(directionFix);
		}, this);
	};

	// New method
	Game_Followers.prototype.setTransparentAll = function(transparent) {
		this._data.forEach(function(follower) {
			follower.setTransparent(transparent);
		}, this);
	};

	// New method
	Game_Followers.prototype.setWalkAnimeAll = function(walkAnime) {
		this._data.forEach(function(follower) {
			follower.setWalkAnime(walkAnime);
		}, this);
	};

	// New method
	Game_Followers.prototype.setBlendModeAll = function(blendMode) {
		this._data.forEach(function(follower) {
			follower.setBlendMode(blendMode);
		}, this);
	};

	// New method
	Game_Followers.prototype.setMoveSpeedAll = function(moveSpeed) {
		this._data.forEach(function(follower) {
			follower.setMoveSpeed($gamePlayer.realMoveSpeed()); //Use the player's realMoveSpeed
		}, this);
	};
	
	//=============================================================================
	// Game_Follower
	//=============================================================================
	
	// Replacement method
	// These atributes should be set when the player's attributes are set, rather than constantly updated.
	Game_Follower.prototype.update = function() {
		Game_Character.prototype.update.call(this);
		if(!Tyruswoo.FollowerControl._stopChase) {
			this.setMoveSpeed($gamePlayer.realMoveSpeed());
		};
		//this.setOpacity($gamePlayer.opacity());
		//this.setBlendMode($gamePlayer.blendMode());
		//this.setWalkAnime($gamePlayer.hasWalkAnime());
		//this.setStepAnime($gamePlayer.hasStepAnime());
		//this.setDirectionFix($gamePlayer.isDirectionFixed());
		//this.setTransparent($gamePlayer.isTransparent());
	};
	
	// New method.
	// For followers, this method is used, instead of Game_CharacterBase.isDebugThrough.
	// This allows followers to travel through walls when playtesting and holding Ctrl, just like the player (even if the followers have Through Off).
	Game_Follower.prototype.isDebugThrough = function() {
		return Input.isPressed("control") && $gameTemp.isPlaytest();
	};

})();
