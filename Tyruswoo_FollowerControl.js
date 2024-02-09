//=============================================================================
// Follower Control
// For RPG Maker MZ
// By Tyruswoo and McKathlin
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
 * @plugindesc MZ v6.0.1 Provides greater control of party follower movement! Allows event commands targeting the "player" to affect any follower!
 * @author Tyruswoo and McKathlin
 * @url https://www.tyruswoo.com
 *
 * @help Tyruswoo Follower Control for RPG Maker MZ
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
 *    Follower by Position Var Select follower by position stored in variable.
 *    Follower by Actor Var.   Select follower by actor ID stored in variable.
 *    Stop Chase               Prevent followers from chasing the leader.
 *    Chase                    Allow followers to chase the leader. (Default.)
 *    Pose                     Change a party member's character image to pose.
 *    Reset Pose               Change a party member to their default pose.
 *    Change Actor Stepping    Change whether one's step animation stays on.
 *    Save Party               Save current party as an available party.
 *    Load Party               Remove current party, then add a saved party.
 *    Add Party                Join current party with a saved party.
 *    Clear Party              Remove party. (Be sure to add a party member!)
 * ============================================================================
 * Plugin parameters:
 * 
 *    Max Battle Members        Set how many party members can be in battle at
 *                              a time. The current battle party will also be
 *                              visible in the follower lineup. Default 4.
 * 
 *    Max Non-Combat Followers  Up to this many actors who never battle may
 *                              join the party at a time for plot reasons and
 *                              be seen following the active party. Default 1.
 * 
 *    Non-Combat Class          Pick a class from the database. Actors of
 *                              this class will show up in the follower lineup
 *                              but not in the field menu or in battle.
 * 
 *    Search Limit              Set the pathfinding search limit. Default 12.
 * 
 * ============================================================================
 * Notetags:
 *    <stepAnime: true>     Give an actor this notetag if he should always do
 *                          his step animation, even when staying in one place.
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
 *
 *    this.path($gamePlayer.x+n, $gamePlayer.y+m)
 *                             Where n and m are integer numbers to indicate
 *                             coordinates relative to the player's position.
 *                             Pathfind to the coordinates indicated. (May use
 *                             +n or -n, +m or -m.)
 *
 *    Note that this.path() scripts are to be used within Set Move Route
 *    commands, and only result in taking 1 step on the path. Use multiple
 *    this.path() scripts in the move route for multiple steps on the path.
 *
 *    Note also that this.path() seeks a path around obstacles, whereas
 *    this.moveToward() may result in bumping into obstacles. When using
 *    this.path(), be sure the character's Through is Off to find a path around
 *    obstacles. If Through is On, then this.path() will cause the character to
 *    move through obstacles, instead of pathing around obstacles.
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
 *  - Followers who don't battle! Comes in handy for escort or rescue quests
 *    or other tag-alongs. To make a character a Non-Combat Follower, put him
 *    in the Actors database and assign the Non-Combat Class as his class.
 *    He can join and leave the party in the same way that adventuring party
 *    members do, and he counts as "in the party" for the purposes of on-map
 *    events. As a Non-Combat Follower, he will walk behind the active
 *    adventuring party, but he won't appear in the field menu or in battle.
 *  - Make some player characters always do their step animation, even when
 *    they remain in one place. This is useful for a flying character whose
 *    wings are always flapping, for instance. Do this up front with the Actor
 *    notetag <stepAnime: true>, or toggle during play with the plugin command
 *    Change Actor Stepping. Actor stepping status persists for each save file.
 *    If a move route turns a party member's stepping ON or OFF, step animation
 *    runs if Actor stepping is ON, or move route stepping is ON, or both.
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
 * v1.3  9/12/2020
 *        - Now, if a follower is selected, and the follower does not exist,
 *          the leader is no longer selected; instead, the non-existent
 *          follower is selected. Therefore, eventing intended for a follower
 *          that is not present will have no effect, instead of affecting the
 *          party leader.
 *        - Added the Tyruswoo.FollowerControl.follower() function, which
 *          allows improves compatability with other plugins that may need to
 *          access the current valid follower (if available) stored in the
 *          Tyruswoo.FollowerControl._follower variable. Plugins that may use
 *          this information include Tyruswoo_TileControl and
 *          Tyruswoo_CameraControl.
 *        - Changed the method Game_Interpreter.character() to an alias method.
 *          This increases the chance of compatibility with other plugins
 *          that use the Game_Interpreter.character() method.
 *
 * v3.0  8/27/2021
 *        - Fixed a bug in which it was possible to select an absent follower.
 *          (Followers always technically exist, even if there is no associated
 *          actor. If there is no actor, the follower is absent/invisible.)
 *          This bug manifested when the player had a small party, and the
 *          follower selected was less than the Max Party Size but greater than
 *          the current party size. This "absent" follower still exists, but
 *          has no associated actor and therefore no image. If Show Balloon
 *          Icon or Show Animation was used, then the balloon icon or animation
 *          would appear at the "absent" follower's location. Note: We made a
 *          similar bugfix in Follower Control v2.2 for RPG Maker MV.
 *          Big thanks to Lei-Yan for bringing this bug to our attention!
 *        - Fixed a rare bug affecting loading and saving in some projects.
 *          Thanks to Edsephiroth for bringing this to our attention and
 *          helping us test!
 * 
 * v4.0  1/21/2022
 *         - Introduced non-combat followers.
 *         - Introduced notetag for always-stepping Actors.
 *         - New plugin commands: Follower by Position Variable, Follower by
 *           Actor Variable, and Change Actor Stepping.
 *
 * v5.0  12/2/2022
 *         - Introduced Party plugin commands! Save Party, Load Party,
 *           Add Party, and Clear Party.
 * 
 * v5.0.1  8/30/2023
 *         - This plugin is now free and open source under the MIT license.
 * 
 * v6.0.0  1/23/2024
 *         - Each event now starts with the Player as the selected follower,
 *           and its follower selection is independent from other events'
 *           follower selections. (A common event uses the follower selection
 *           of the event that called it.)
 *         - Tyruswoo.FollowerControl.follower() is no longer supported.
 *         - It is now possible to have an individual follower stop chase
 *           or resume chase.
 *         - Fixed the bug where the game got stuck when Gather Followers was
 *           called when followers were non-chasing. Followers now always
 *           resume chase when the Gather Followers command is used.
 * 
 * v6.0.1  2/9/2024
 *         - Re-added Tyruswoo.FollowerControl.follower() for the sake of
 *           compatibility with older plugins and scripts.
 *         - Game_Interpreter has a new property selectedFollower.
 *           In a script, use this.selectedFollower to get the active
 *           interpreter's currently selected follower.
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
 * @param Max Battle Members
 * @type number
 * @min 1
 * @desc The maximum number of party members active in battle. Default: 4
 * @default 4
 * 
 * @param Max Non-Combat Followers
 * @type number
 * @min 0
 * @desc Up to this many non-combat actors may be seen following the party at a time.
 * @default 1
 *
 * @param Non-Combat Class
 * @type class
 * @desc Actors of this class don't show up in battle or in the field menu.
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
 * 
 * @command follower_by_position_variable
 * @text Follower by Position Variable
 * @desc Select a follower by the position index stored in a variable.
 * 
 * @arg variableId
 * @type variable
 * @text Variable ID
 * @desc Pick a variable. The value stored in it represents the
 *       member's place in the party lineup, where 0 is leader.
 * 
 * @command follower_by_actor_variable
 * @text Follower by Actor Variable
 * @desc Select a follower by the actor ID stored in a variable.
 * 
 * @arg variableId
 * @type variable
 * @text Variable ID
 * @desc Pick a variable. The value stored in it represents the
 *       actor ID of the follower to select.
 * 
 * @command stop_chase
 * @text Stop Chase
 * @desc Prevent the followers from chasing the leader.
 *       Then, you can move the leader without the followers chasing.
 * 
 * @arg target
 * @type select
 * @option All Followers
 * @value all
 * @option Selected Follower
 * @value selected
 * @default all
 * @desc Whether all followers, or only the selected follower,
 * will stop following the leader.
 *
 * @command chase
 * @text Chase
 * @desc Allow the followers to chase the leader.
 *       This is the default for RPG Maker.
 * 
 * @arg target
 * @type select
 * @option All Followers
 * @value all
 * @option Selected Follower
 * @value selected
 * @default all
 * @desc Whether all followers, or only the selected follower,
 * will resume following the leader.
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
 * 
 * @command change_actor_step_anime
 * @text Change Actor Stepping
 * @desc Change whether a particular actor's step animation always runs, even when the actor is not walking.
 * 
 * @arg actorId
 * @type actor
 * @text Actor
 * @desc The actor whose step animation setting should change.
 *
 * @arg stepAnime
 * @type boolean
 * @text Stepping
 * @desc Whether this actor should always be stepping.
 * @default false
 *
 * @command save_party
 * @text Save Party
 * @desc Save the current set of actors as an available party.
 *
 * @arg party_id
 * @text Party ID
 * @type number
 * @default 1
 * @min 1
 * @desc Save the current set of actors to the party slot with this ID.
 *
 * @command load_party
 * @text Load Party
 * @desc Removes all actors from the current party, and adds the actors from one of the available parties.
 *
 * @arg party_id
 * @text Party ID
 * @type number
 * @default 1
 * @min 1
 * @desc Load the set of actors from the party slot with this ID.
 *
 * @command add_party
 * @text Add Party
 * @desc Joins the current party with a specified party from the available saved parties.
 *
 * @arg party_id
 * @text Party ID
 * @type number
 * @default 1
 * @min 1
 * @desc Onto the current party, append the set of actors from the party slot with this ID.
 *
 * @command clear_party
 * @text Clear Party
 * @desc Removes all actors from the current party. (After clearing the party, remember to add an actor to the party!)
 * 
 */

(() => {
	const pluginName = "Tyruswoo_FollowerControl";

	Tyruswoo.FollowerControl.parameters = PluginManager.parameters(pluginName);
	Tyruswoo.FollowerControl.param = Tyruswoo.FollowerControl.param || {};

	// User-Defined Plugin Parameters
	Tyruswoo.FollowerControl.param.maxBattleMembers = Number(
		Tyruswoo.FollowerControl.parameters['Max Battle Members']);
	Tyruswoo.FollowerControl.param.maxNonCombatFollowers = Number(
		Tyruswoo.FollowerControl.parameters['Max Non-Combat Followers']);
	Tyruswoo.FollowerControl.param.nonCombatClass = Number(
		Tyruswoo.FollowerControl.parameters['Non-Combat Class']);
	Tyruswoo.FollowerControl.param.searchLimit = Number(
		Tyruswoo.FollowerControl.parameters['Pathfinding Search Limit']);

	//=============================================================================
	// Follower Control Functions and Properties
	//=============================================================================

	// This method is deprecated.
	// It is kept around for compatibility with older plugins and scripts.
	// Scripts should use the property this.selectedFollower instead.
	Tyruswoo.FollowerControl.follower = function() {
		// Use party leader if no on-map interpreter found.
		if (!$gameMap || !$gameMap.interpreter) {
			console.warn("Tyruswoo.FollowerControl.follower " +
				"can't find active on-map event.");
			return $gamePlayer;
		}

		// Get the innermost active interpreter.
		var interpreter = $gameMap._interpreter;
		while (innerInterpreter._childInterpreter &&
			interpreter._childInterpreter.isRunning()) {
			interpreter = innerInterpreter._childInterpreter;
		}

		// Return the follower currently selected in that interpreter.
		return interpreter.selectedFollower;
	};

	Tyruswoo.FollowerControl.setChase = function(doChase) {
		$gamePlayer._followers.setChase(doChase);
	};

	Tyruswoo.FollowerControl.partyIsChasing = function() {
		$gamePlayer._followers.areChasing();
	};
	
	//=============================================================================
	// PluginManager
	//=============================================================================
	
	// The code below gives Tyruswoo and McKathlin plugins a way to access
	// the calling interpreter: it's added to args as args.interpreter.
	if (!Tyruswoo.rmmz_PluginManager_callCommand) {
		Tyruswoo.rmmz_PluginManager_callCommand = PluginManager.callCommand;
		PluginManager.callCommand = function(caller, pluginName, commandName, args) {
			if (/^Tyruswoo|^McKathlin/.test(pluginName)) {
				args.interpreter = caller;
			}
			Tyruswoo.rmmz_PluginManager_callCommand.call(
				this, caller, pluginName, commandName, args);
		};
	}

	// leader
	PluginManager.registerCommand(pluginName, "leader", args => {
		args.interpreter.followerIndex = 0;
	});
	
	// follower_1
	PluginManager.registerCommand(pluginName, "follower_1", args => {
		args.interpreter.followerIndex = 1;
	});

	// follower_2
	PluginManager.registerCommand(pluginName, "follower_2", args => {
		args.interpreter.followerIndex = 2;
	});

	// follower_3
	PluginManager.registerCommand(pluginName, "follower_3", args => {
		args.interpreter.followerIndex = 3;
	});
	
	// follower_4
	PluginManager.registerCommand(pluginName, "follower_4", args => {
		args.interpreter.followerIndex = 4;
	});

	// follower_5
	PluginManager.registerCommand(pluginName, "follower_5", args => {
		args.interpreter.followerIndex = 5;
	});

	// follower_6
	PluginManager.registerCommand(pluginName, "follower_6", args => {
		args.interpreter.followerIndex = 6;
	});
	
	// follower_7
	PluginManager.registerCommand(pluginName, "follower_7", args => {
		args.interpreter.followerIndex = 7;
	});
	
	// follower_8
	PluginManager.registerCommand(pluginName, "follower_8", args => {
		args.interpreter.followerIndex = 8;
	});
	
	// follower_9
	PluginManager.registerCommand(pluginName, "follower_9", args => {
		args.interpreter.followerIndex = 9;
	});

	// follower_by_position
	PluginManager.registerCommand(pluginName, "follower_by_position", args => {
		args.interpreter.followerIndex = Number(args.followerId);
	});

	// follower_by_name
	PluginManager.registerCommand(pluginName, "follower_by_name", args => {
		if (args.followerName) {
			let len = $gameParty.onMapMembers().length;
			for (let i = 0; i < len; i++) {
				let actorId = $gameParty.onMapMembers()[i].actorId(); //Get the actorId that belongs to this follower.
				let actorName = $dataActors[actorId].name; //Get the Database name of the actor, based on the actorId.
				if (actorName == args.followerName) {
					args.interpreter.followerIndex = i;
					break;
				}
			}
		}
	});

	// follower_by_actor_id
	PluginManager.registerCommand(pluginName, "follower_by_actor_id", args => {
		if (args.actorId) {
			let len = $gameParty.onMapMembers().length;
			for (let i = 0; i < len; i++) {
				let actorId = $gameParty.onMapMembers()[i].actorId(); //Get the actorId that belongs to this follower.
				if (actorId == args.actorId) {
					args.interpreter.followerIndex = i;
					break;
				}
			}
		}
	});

	// follower_by_position_variable
	PluginManager.registerCommand(pluginName, "follower_by_position_variable", args => {
		if (args.variableId) {
			let followerIndex = $gameVariables.value(Number(args.variableId));
			args.interpreter.followerIndex = followerIndex;
		}
	});
	
	// follower_by_actor_variable
	PluginManager.registerCommand(pluginName, "follower_by_actor_variable", args => {
		if (args.variableId) {
			let targetActorId = $gameVariables.value(Number(args.variableId));
			if (targetActorId) {
				let len = $gameParty.onMapMembers().length;
				for (let i = 0; i < len; i++) {
					let actorId = $gameParty.onMapMembers()[i].actorId(); //Get the actorId that belongs to this follower.
					if (actorId == targetActorId) {
						args.interpreter.followerIndex = i;
						break;
					}
				} // endfor i in follower lineup
			} // endif there's a target actor ID
		} // endif there's a variable ID
	}); // end plugin command

	// stop_chase
	PluginManager.registerCommand(pluginName, "stop_chase", args => {
		if ('selected' == args.target) {
			// Selected follower stops chase.
			args.interpreter.selectedFollower.setChase(false);
		} else {
			// Make all stop chase.
			Tyruswoo.FollowerControl.setChase(false);
		}
	});

	// chase
	PluginManager.registerCommand(pluginName, "chase", args => {
		if ('selected' == args.target) {
			// Selected follower rejoins chase lineup.
			args.interpreter.selectedFollower.setChase(true);
		} else {
			// Make all resume chase.
			Tyruswoo.FollowerControl.setChase(true);
		}
	});

	// pose
	PluginManager.registerCommand(pluginName, "pose", args => {
		let actor = args.interpreter.followerActor;
		if (actor) {
			let core = actor.characterNameCore();
			let pose = core + "_" + args.poseName;
			actor._characterName = pose;
			$gamePlayer.refresh();
		}
	});

	// reset_pose
	PluginManager.registerCommand(pluginName, "reset_pose", args => {
		let actor = args.interpreter.followerActor;
		if (actor) {
			actor._characterName = actor.characterNameCore();
			$gamePlayer.refresh();
		}
	});
	
	// change_actor_step_anime
	PluginManager.registerCommand(pluginName, "change_actor_step_anime", args => {
		let actorId = Number(args.actorId);
		let stepAnime = 'true' == args.stepAnime;
		if (actorId) {
			let actor = $gameActors.actor(actorId);
			actor.setStepAnime(stepAnime);
		} else {
			console.warn("Tyruswoo_FollowerControl change_actor_step_anime: no actor selected.");
		}
	});
	
	// save_party
	PluginManager.registerCommand(pluginName, "save_party", args => {
		let partyId = Number(args.party_id);
		$gameParty.saveParty(partyId, $gameParty._actors);
		console.log("Current party saved as Party ID " + partyId + ":", $gameParty.getSavedParty(partyId));
	});
	
	// load_party
	PluginManager.registerCommand(pluginName, "load_party", args => {
		let partyId = Number(args.party_id);
		$gameParty.changeTo($gameParty.getSavedParty(partyId));
		console.log("Party " + partyId + "Loaded:", $gameParty.getSavedParty(partyId));
	});
	
	// add_party
	PluginManager.registerCommand(pluginName, "add_party", args => {
		let partyId = Number(args.party_id);
		$gameParty.addActors($gameParty.getSavedParty(partyId));
		console.log("Party " + partyId + " added to existing party.");
	});
	
	// clear_party
	PluginManager.registerCommand(pluginName, "clear_party", args => {
		$gameParty.clear();
	});

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_Interpreter_clear = 
		Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		Tyruswoo.FollowerControl.Game_Interpreter_clear.call(this);
		this._followerIndex = 0;
	};

	// Alias method
	// Parent interpreter passes its follower selection to its child
	Tyruswoo.FollowerControl.Game_Interpreter_setupChild =
		Game_Interpreter.prototype.setupChild;
	Game_Interpreter.prototype.setupChild = function(list, eventId) {
		Tyruswoo.FollowerControl.Game_Interpreter_setupChild.call(
			this, list, eventId);
		this._childInterpreter._parent = this;
	};

	Object.defineProperties(Game_Interpreter.prototype, {
		followerActor: {
			get: function() {
				let follower = this.selectedFollower;
				return follower ? follower.actor() : null;
			},
			enumerable: false
		},
		followerIndex: {
			get: function() {
				var root = this;
				while (root._depth > 0 && !!root._parent) {
					root = root._parent;
				}
				return root._followerIndex;
			},
			set: function(value) {
				var root = this;
				while (root._depth > 0 && !!root._parent) {
					root = root._parent;
				}
				root._followerIndex = value;
				if (root._followerIndex > 0) {
					//console.log("FollowerControl: Move Route commands now affect Follower ", this._followerIndex);
				} else if (root._followerIndex === 0) {
					//console.log("FollowerControl: Move Route commands now affect the party Leader.");
				} else {
					console.warn("FollowerControl: follower index set to unexpected number " + this._followerIndex);
				}
			},
			enumerable: true
		},
		selectedFollower: {
			get: function() {
				if (0 == this.followerIndex) {
					return $gamePlayer;
				} else if (this.followerIndex > 0 && $gamePlayer && $gamePlayer.followers) {
					if (this.followerIndex < $gameParty.onMapMembers().length) {
						return $gamePlayer.followers().follower(this.followerIndex - 1);
					} else {
						return null; // No one's following at this index.
					}
				} else {
					console.warn("FollowerControl: Follower property could not find Follower " + this.followerIndex);
					return null;
				}
			},
			set: function(value) {
				if (value === $gamePlayer) {
					this.followerIndex = 0; // party leader
				} else if (!$gamePlayer.followers() || null === value || undefined === value) {
					console.warn("FollowerControl: Couldn't set follower.");
					this.followerIndex = -1;
				} else {
					var idx = $gamePlayer.followers()._data.indexOf(value);
					this.followerIndex = idx >= 0 ? idx + 1 : -1;
				}
			},
			enumerable: false
		},
		// _follower is kept for the sake of backwards compatibility
		// with any plugins or scripts made to work with v6.0.0.
		_follower: {
			get: function() {
				return this.selectedFollower;
			},
			set: function(value) {
				this.selectedFollower = value;
			},
			enumerable: false
		}
	});

	// Alias method
	// Conditional Branch
	Tyruswoo.FollowerControl.Game_Interpreter_command111 =
		Game_Interpreter.prototype.command111;
	Game_Interpreter.prototype.command111 = function(params) {
		if (4 == params[0] && 0 == params[2]) {
			// Non-combat followers are included in checks for party membership.
			const actor = $gameActors.actor(params[1]);
			const n = params[3];
			let result = $gameParty.eventConditionMembers().includes(actor);
			this._branch[this._indent] = result;
			if (false === this._branch[this._indent]) {
				this.skipBranch();
			}
			return true;
		} else {
			// All other conditional branching works as usual.
			return Tyruswoo.FollowerControl.Game_Interpreter_command111.call(
				this, params);
		}
	};


	// Alias method
	// Transfer Player
	Tyruswoo.FollowerControl.Game_Interpreter_command201 =
		Game_Interpreter.prototype.command201;
	Game_Interpreter.prototype.command201 = function(params) {
		if ($gameParty.inBattle() || $gameMessage.isBusy()) {
			return false;
		};
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
		};

		// If transferring to a different map, then always transfer the leader, with followers.
		if (mapId !== $gameMap.mapId()) {
			// If player goes to a new map, followers will resume chase.
			Tyruswoo.FollowerControl.setChase(true);
			// And reset selected follower to the leader.
			this.followerIndex = 0;
			return Tyruswoo.FollowerControl.Game_Interpreter_command201.call(this, params);
		} else if (this.followerIndex === 0) {
			if (Tyruswoo.FollowerControl.partyIsChasing()) {
				// Followers are chasing the leader, so transfer leader with followers.
				return Tyruswoo.FollowerControl.Game_Interpreter_command201.call(this, params);
			} else {
				// Followers are not chasing the leader.
				// Teleport the leader within the map, like any other follower.
				Game_Character.prototype.locate.call($gamePlayer, x, y);
				if (!Imported.Tyruswoo_CameraControl || (Imported.Tyruswoo_CameraControl && $gameMap._camFollow == "player")) {
					$gamePlayer.center(x, y);
				}
				$gamePlayer.makeEncounterCount();
				if ($gamePlayer.isInVehicle()) {
					$gamePlayer.vehicle().refresh();
				}
			}
		} else {
			// Transfer a follower.
			const follower = this.selectedFollower;
			if (follower) {
				follower.locate(x, y);
				if (params[4] > 0) { // Set follower direction
					let d = params[4];
					if (!follower.isDirectionFixed() && d) {
						follower._direction = d;
					}
				}
			}
		}
		return true;
	};
	
	// Alias method
	// Note that this method is called by various commands, including Set Movement Route, Show Animation, and Show Balloon Icon.
	// This method is also called by the Game_Interpreter.updateWaitMode function.
	Tyruswoo.FollowerControl.Game_Interpreter_character = Game_Interpreter.prototype.character;
	Game_Interpreter.prototype.character = function(param) {
		if ($gameParty.inBattle()) {
			return null;
		} else if (param < 0) {
			return this.selectedFollower; // Changed line.
		} else {
			return Tyruswoo.FollowerControl.Game_Interpreter_character.call(this, param); //Default method.
		}
	};

	//=============================================================================
	// Game_Event
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_Event_meetsConditions =
		Game_Event.prototype.meetsConditions;
	Game_Event.prototype.meetsConditions = function(page) {
		if (page.conditions.actorValid) {
			var actor = $gameActors.actor(page.conditions.actorId)
			if (!$gameParty.eventConditionMembers().contains(actor)) {
				return false;
			}
			// If you're here, the actor is in party.
			// Run other condition checking as usual,
			// except that the default actor checking is disabled.
			page.conditions.actorValid = false;
			let valid = Tyruswoo.FollowerControl.Game_Event_meetsConditions.call(
				this, page);
			page.conditions.actorValid = true;
			return valid;
		} else {
			return Tyruswoo.FollowerControl.Game_Event_meetsConditions.call(
				this, page);
		}
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_Actor_setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		Tyruswoo.FollowerControl.Game_Actor_setup.call(this, actorId);
		// Check for and apply <stepAnime: true> notetag.
		this._stepAnime = !!this.actor().note.match(
			/<step(?:ping|[\-_ ]?anime)? ?: ?(?:on|true|yes|always)>/i);
	};

	// New method
	Game_Actor.prototype.characterNameCore = function() {
		if (undefined === this._characterNameCore) {
			this._characterNameCore = this.characterName();
		}
		return this._characterNameCore;
	};

	// Alias method
	// If an actor's character image is set by a command,
	// then reset the pose core to the new character image.
	Tyruswoo.FollowerControl.Game_Actor_setCharacterImage =
		Game_Actor.prototype.setCharacterImage;
	Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
		Tyruswoo.FollowerControl.Game_Actor_setCharacterImage.call(
			this, characterName, characterIndex);
		this._characterNameCore = this.characterName();
	};

	// New method
	Game_Actor.prototype.isNonCombat = function() {
		return this._classId == Tyruswoo.FollowerControl.param.nonCombatClass;
	};

	// Alias method
	Tyruswoo.FollowerControl.Game_Actor_changeExp =
		Game_Actor.prototype.changeExp;
	Game_Actor.prototype.changeExp = function(exp, show) {
		if (this.isNonCombat()) {
			// Do nothing.
			// Non-combat characters aren't affected by EXP changes.
		} else {
			// Do the usual.
			Tyruswoo.FollowerControl.Game_Actor_changeExp.call(this, exp, show);
		}
	};

	// New method
	// Check whether this Actor has stepping animation turned on.
	Game_Actor.prototype.hasStepAnime = function() {
		return !!this._stepAnime;
	};

	// New method
	// Change whether this Actor has stepping animation turned on.
	// Since Actors are included in save data,
	// this change persists for each save file.
	Game_Actor.prototype.setStepAnime = function(value) {
		this._stepAnime = value;
		$gamePlayer.refresh();
	};

	//=============================================================================
	// Game_Party
	//=============================================================================
	
	// TODO: Check for uses of $gameParty.size() and account for anywhere
	// that non-combat followers should count toward party size.

	// Replacement method
	Game_Party.prototype.maxBattleMembers = function() {
		return Tyruswoo.FollowerControl.param.maxBattleMembers;
	};

	// Replacement method
	// For most of the game's purposes, non-combat actors don't count.
	// So potentialCombatMembers() replaces allMembers() in this method.
	Game_Party.prototype.members = function() {
		return this.inBattle() ? this.battleMembers() : this.potentialCombatMembers();
	};

	// Replacement method
	// Non-combat members can't be battle members.
	Tyruswoo.FollowerControl.Game_Party_battleMembers =
		Game_Party.prototype.battleMembers;
	Game_Party.prototype.battleMembers = function() {
		return this.potentialCombatMembers()
			.slice(0, this.maxBattleMembers())
			.filter(actor => actor.isAppeared());
	};

	// New method
	// Event conditions include all members, except when in battle,
	// just like default RMMZ's definition for members.
	// So out-of-battle checks will include non-combat members.
	Game_Party.prototype.eventConditionMembers = function() {
		return this.inBattle() ? this.battleMembers() : this.allMembers();
	};

	// New method
	// Non-combat members are followers, but do not show up in battle
	// or in the field menu.
	Game_Party.prototype.nonCombatMembers = function() {
		return this.allMembers().filter(function(actor) {
			return actor.isNonCombat(); 
		});
	};

	// New method
	// This returns the follower lineup.
	// Active battle party members, followed by non-combat members.
	Game_Party.prototype.onMapMembers = function() {
		return this.battleMembers().concat(this.nonCombatMembers());
	};

	// New method
	// Returns only the party members who might ever participate in combat,
	// whether they're active or reserve party members.
	Game_Party.prototype.potentialCombatMembers = function() {
		return this.allMembers().filter(function(actor) {
			return !actor.isNonCombat();
		});
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
		}
	};
	
	// New method. Dec. 27, 2018.
	// For use in script calls.
	Game_CharacterBase.prototype.jumpToFront = function() {
		var x = this.x;
		var y = this.y;
		var x2 = $gameMap.roundXWithDirection($gamePlayer.x, $gamePlayer.direction());
		var y2 = $gameMap.roundYWithDirection($gamePlayer.y, $gamePlayer.direction());
		var dx = x2 - x;
		var dy = y2 - y;
		this.jump(dx, dy);
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
		if (typeof target_x === 'string') {
			target_x = target_x.toLowerCase().charAt(0);
		};
		switch(target_x) {
			case 'e': //If target_x is the word 'event', then target_y is the event's ID number.
				this.moveTowardCharacter($gameMap.event(target_y));
				break;
			case 'f': //If target_x is the word 'follower', then target_y is the follower's marching order.
				if (target_y <= 0) {
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
		if (typeof target_x === 'string') {
			target_x = target_x.toLowerCase().charAt(0);
		};
		switch(target_x) {
			case 'e': //If target_x is the word 'event', then target_y is the event's ID number.
				var targetCharacter = $gameMap.event(target_y);
				direction = this.findDirectionTo(targetCharacter.x, targetCharacter.y);
				break;
			case 'f': //If target_x is the word 'follower', then target_y is the follower's marching order.
				if (target_y <= 0) {
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
		if (direction > 0) {
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

	// Alias method
	Tyruswoo.FollowerControl.Game_Player_refresh =
		Game_Player.prototype.refresh;
	Game_Player.prototype.refresh = function() {
		Tyruswoo.FollowerControl.Game_Player_refresh.call(this);
		this.resetStepAnime();
	};
	
	// New method
	Game_Player.prototype.resetStepAnime = function() {
		let actor = this.actor();
		if (actor) {
			this._stepAnime = actor.hasStepAnime();
		}
	};

	// New method
	Game_Player.prototype.actor = function() {
		return $gameParty.battleMembers()[0];
	};

	// New method
	Game_Player.prototype.setOpacity = function(opacity) {
		this._opacity = opacity;
		this._followers.setOpacityAll(opacity);
	};

	// New method
	Game_Player.prototype.setStepAnime = function(stepAnime) {
		// Changes to step animation only happen
		// if the actor doesn't have step animation set to always on.
		if (!this.actor() || !this.actor().hasStepAnime()) {
			Game_Character.prototype.setStepAnime.call(this, stepAnime);
		}
		this._followers.setStepAnimeAll(stepAnime);
	};

	// New method
	Game_Player.prototype.setDirectionFix = function(directionFix) {
		this._directionFix = directionFix;
		this._followers.setDirectionFixAll(directionFix);
	};

	// New method
	Game_Player.prototype.setTransparent = function(transparent) {
		this._transparent = transparent;
		this._followers.setTransparentAll(transparent);
	};

	// New method
	Game_Player.prototype.setWalkAnime = function(walkAnime) {
		this._walkAnime = walkAnime;
		this._followers.setWalkAnimeAll(walkAnime);
	};

	// New method
	Game_Player.prototype.setBlendMode = function(blendMode) {
		this._blendMode = blendMode;
		this._followers.setBlendModeAll(blendMode);
	};

	// New method
	Game_Player.prototype.setMoveSpeed = function(moveSpeed) {
		this._moveSpeed = moveSpeed;
		this._followers.setMoveSpeedAll(moveSpeed);
	};
	
	// New method, 26 Dec. 2018.
	// Allows more easily using a script call to find the last follower.
	Game_Player.prototype.lastFollower = function() {
		var lastFollower = this;
		var partySize = $gameParty.allMembers().length;
		if (partySize > 1) {
			lastFollower = this.followers().follower(partySize - 2); // -1 because leader is not a follower, and another -1 because array starts at zero.
		}
		return lastFollower;
	};

	//=============================================================================
	// Game_Followers
	//=============================================================================

	// Replacement method
	// Followers are active battle members plus non-combat followers,
	// so max follower count is calculated differently from RMMZ default.
	Game_Followers.prototype.setup = function() {
		this._stopChase = false;
		this._data = [];
		const maxMembers = $gameParty.maxBattleMembers() +
			Tyruswoo.FollowerControl.param.maxNonCombatFollowers;
		for (let i = 1; i < maxMembers; i++) {
			this._data.push(new Game_Follower(i));
		}
	};

	// New method
	Game_Followers.prototype.areChasing = function() {
		return !this._stopChase;
	};

	// New method
	Game_Followers.prototype.setChase = function(doChase=true) {
		// Set chase for all followers
		this._stopChase = !doChase;
		for (follower of this._data) {
			// Remove individual chase toggles; do what the group is doing.
			follower.resetChase();
		}
	}

	// New method
	// Stop chasing the leader.
	Game_Followers.prototype.stopChase = function() {
		this.setChase(false);
	};

	// New method
	// Resume chasing the leader.
	Game_Followers.prototype.chase = function() {
		this.setChase(true);
	};

	// Replacement method
	Game_Followers.prototype.updateMove = function() {
		chaseList = this._data.filter((follower) => follower.isChasing())
		for (var i = chaseList.length - 1; i >= 0; i--) {
			var precedingCharacter = (i > 0 ? chaseList[i - 1] : $gamePlayer);
			chaseList[i].chaseCharacter(precedingCharacter);
		}
	};

	// Alias method
	// Resume chase before gathering.
	Tyruswoo.FollowerControl.Game_Followers_gather =
		Game_Followers.prototype.gather;
	Game_Followers.prototype.gather = function() {
		this.setChase(true);
		Tyruswoo.FollowerControl.Game_Followers_gather.call(this);
	};

	// Replacement method
	// Chasing followers will jump; non-chasing followers will not jump.
	Game_Followers.prototype.jumpAll = function() {
		if ($gamePlayer.isJumping()) {
			for (var i = 0; i < this._data.length; i++) {
				var follower = this._data[i];
				if (follower.isChasing()) {
					var sx = $gamePlayer.deltaXFrom(follower.x);
					var sy = $gamePlayer.deltaYFrom(follower.y);
					follower.jump(sx, sy);
				}
			}
		}
	};

	// New method
	Game_Followers.prototype.setOpacityAll = function(opacity) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setOpacity(opacity);
			}
		}
	};

	// New method
	Game_Followers.prototype.setStepAnimeAll = function(stepAnime) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setStepAnime(stepAnime);
			}
		}
	};

	// New method
	Game_Followers.prototype.setDirectionFixAll = function(directionFix) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setDirectionFix(directionFix);
			}
		}
	};

	// New method
	Game_Followers.prototype.setTransparentAll = function(transparent) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setTransparent(transparent);
			}
		}
	};

	// New method
	Game_Followers.prototype.setWalkAnimeAll = function(walkAnime) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setWalkAnime(walkAnime);
			}
		}
	};

	// New method
	Game_Followers.prototype.setBlendModeAll = function(blendMode) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				follower.setBlendMode(blendMode);
			}
		}
	};

	// New method
	Game_Followers.prototype.setMoveSpeedAll = function(moveSpeed) {
		for (follower of this._data) {
			if (follower.isChasing()) {
				// Use the player's realMoveSpeed
				follower.setMoveSpeed($gamePlayer.realMoveSpeed());
			}
		}
	};
	
	//=============================================================================
	// Game_Follower
	//=============================================================================
	
	// New method
	// Set this individual follower's chase.
	Game_Follower.prototype.setChase = function(doChase=true) {
		this._stopChase = !doChase;
	};

	// New method
	// This individual follower will start chasing the leader.
	Game_Follower.prototype.chase = function() {
		this._stopChase = false;
	};

	// New method
	// This individual follower will stop chasing the leader.
	Game_Follower.prototype.stopChase = function() {
		this._stopChase = true;
	};

	// New method
	// This individual follower will chase or not,
	// depending on what the Followers group is doing.
	Game_Follower.prototype.resetChase = function() {
		this._stopChase = null;
	};

	// New method
	Game_Follower.prototype.isChasing = function() {
		if (true === this._stopChase) {
			return false;
		} else if (false === this._stopChase) {
			return true;
		} else if ($gamePlayer && $gamePlayer._followers) {
			// When this._stopChase is null or undefined,
			// the Follower defaults to the whole Followers group's behavior.
			return $gamePlayer._followers.areChasing();
		} else {
			return true; // Chasing is followers' default behavior.
		}
	};

	// Alias method
	Tyruswoo.FollowerControl.Game_Follower_refresh =
		Game_Follower.prototype.refresh;
	Game_Follower.prototype.refresh = function() {
		Tyruswoo.FollowerControl.Game_Follower_refresh.call(this);
		this.resetStepAnime();
	};
	
	// New method
	Game_Follower.prototype.resetStepAnime = function() {
		let actor = this.actor();
		if (actor) {
			this._stepAnime = actor.hasStepAnime();
		}
	};
	
	// Replacement method
	// The followers in the lineup are now defined distinctly from battle members,
	// to allow for non-combat followers.
	Game_Follower.prototype.actor = function() {
		return $gameParty.onMapMembers()[this._memberIndex];
	};

	// Replacement method
	// These atributes should be set when the player's attributes are set, rather than constantly updated.
	Game_Follower.prototype.update = function() {
		Game_Character.prototype.update.call(this);
		if (this.isChasing()) {
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

	Game_Follower.prototype.setStepAnime = function(stepAnime) {
		let actor = this.actor();
		if (actor && actor.hasStepAnime()) {
			// Don't change anything. Step animation stays on always.
		} else {
			// Do the usual.
			Game_Character.prototype.setStepAnime.call(this, stepAnime);
		}
	};
	
	//=============================================================================
	// Game_Party
	//=============================================================================

	// Alias method
	Tyruswoo.FollowerControl.Game_Party_initialize = Game_Party.prototype.initialize;
	Game_Party.prototype.initialize = function() {
		Tyruswoo.FollowerControl.Game_Party_initialize.call(this);
		this._savedParties = [];
	};

	// New method
	// Get the Actor list from one of the saved party slots.
	Game_Party.prototype.getSavedParty = function(partyId) {
		if (!this._savedParties) {
			this._savedParties = [];
		}
		if (partyId && this._savedParties[partyId]) {
			return this._savedParties[partyId];
		} else {
			throw new Error("Invalid Saved Party ID: " + partyId);
		}
	};

	// New method
	// Save an Actor list to one of the saved party slots.
	Game_Party.prototype.saveParty = function(partyId, actorList) {
		if (!this._savedParties) {
			this._savedParties = [];
		}
		if (partyId && actorList) {
			this._savedParties[partyId] = actorList;
		} else {
			if (!partyId) {
				throw new Error("Tyruswoo_FollowerControl Game_Party.saveParty(): Invalid Saved Party ID: " + partyId);
			} else if (!actorList) {
				throw new Error("Tyruswoo_FollowerControl Game_Party.saveParty(): Invalid actorList: " + actorList);
			}
		}
	};

	// New method
	// Add all Actors from actorList to the existing list.
	Game_Party.prototype.addActors = function(actorList) {
		this._actors = this._actors.concat(actorList);
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	};

	// New method
	// replace current Actor list with the given one.
	Game_Party.prototype.changeTo = function(actorList) {
		this._actors = actorList;
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	};

	// New method
	// remove all party members
	Game_Party.prototype.clear = function() {
		$gameParty._actors = [];
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	};

})();
