## WARNING: This is an older version!
It lacks the features and improvements of this plugin's later versions.
To get the latest version for free, visit
[Tyruswoo.com](https://www.tyruswoo.com).

# Tyruswoo Follower Control v4.0.1 for RPG Maker MZ

Provides greater control of party follower movement!

Allows event commands targeting the “player” to affect any follower of your choosing!

Plus, unlimited followers!

## Plugin commands
| Command               |  Action                    |
|-----------------------|----------------------------|
| Leader                |  Selects the party leader. (Default.) |
| Follower 1            |  Selects the 1st follower. |
| Follower 2            |  Selects the 2nd follower. |
| Follower 3            |  Selects the 3rd follower. |
| Follower 4            |  Selects the 4th follower. |
| Follower 5            |  Selects the 5th follower. |
| Follower 6            |  Selects the 6th follower. |
| Follower 7            |  Selects the 7th follower. |
| Follower 8            |  Selects the 8th follower. |
| Follower 9            |  Selects the 9th follower. |
| Follower by Position  |  Select any follower, based on marching order. |
| Follower by Name      |  Select follower by name of actor in database. |
| Follower by Actor ID  |  Select follower by actor ID. |
| Follower by Position Var | Select follower by position stored in variable. |
| Follower by Actor Var. | Select follower by actor ID stored in variable. |
| Stop Chase             | Prevent followers from chasing the leader. |
| Chase                  | Allow followers to chase the leader. (Default.) |
| Pose                   | Change a party member's character image to pose. |
| Reset Pose             | Change a party member to their default pose. |
| Change Actor Stepping  | Change whether one's step animation stays on. |

## Plugin parameters

| Parameter | Meaning |
|-----------|---------|
| Max Battle Members        | Set how many party members can be in battle at a time. The current battle party will also be visible in the follower lineup. Default 4. |
| Max Non-Combat Followers  | Up to this many actors who never battle may join the party at a time for plot reasons and be seen following the active party. Default 1. |
| Non-Combat Class          | Pick a class from the database. Actors of this class will show up in the follower lineup but not in the field menu or in battle. |
| Search Limit              | Set the pathfinding search limit. Default 12. |

## Notetags

| Notetag             | Meaning   |
|---------------------|-----------|
| `<stepAnime: true>` | Give an actor this notetag if he should always do his step animation, even when staying in one place. |

## Script calls
*(Advanced. Use these within the Set Move Route command.)*

| Script | Action |
|--------|--------|
| `this.path(x, y)`          | Pathfind to the absolute coordinates indicated. |
| `this.path('event', id)`   | Pathfind to the event of ID number id. |
| `this.path('e', id)`       | Same as this.path('event', id). May use 'E'. |
| `this.path('follower', i)` | Pathfind to the follower of position i. |
| `this.path('f', i)`        | Same as this.path('follower', i). May use 'F'. |
| `this.path('leader')`      | Pathfind to the party leader. |
| `this.path('L')`           | Same as this.path('leader'). May use 'l'. |
| `this.moveToward(x, y)`    | Move toward the absolute coordinates indicated. |
| `this.moveToward('e', id)` | Move toward the event of ID number id. |
| `this.moveToward('f', i)`  | Move toward the follower of position i. |
| `this.moveToward('L')`     | Move toward the party leader. May use 'l'. |
| `this.path($gamePlayer.x+n, $gamePlayer.y+m)` | Where n and m are integer numbers to indicate coordinates relative to the player's position. Pathfind to the coordinates indicated. (May use +n or -n, +m or -m.) |

   Note that this.path() scripts are to be used within Set Move Route
   commands, and only result in taking 1 step on the path. Use multiple
   this.path() scripts in the move route for multiple steps on the path.

   Note also that this.path() seeks a path around obstacles, whereas
   this.moveToward() may result in bumping into obstacles. When using
   this.path(), be sure the character's Through is Off to find a path around
   obstacles. If Through is On, then this.path() will cause the character to
   move through obstacles, instead of pathing around obstacles.

## Basics of how to use this plugin
1. First, select the desired party member. This may be the leader, for
   default RPG Maker behavior. To control followers, select a follower.
2. Next, use an event command on the "player", and the selected party member
   will be affected! This works for many commands, including:
    - Set Move Route
    - Show Balloon Icon
    - Show Animation
    - Transfer Player
    - Conditional Branch
3. Note that if you are moving the party leader, the followers by default
   will chase the leader. If you want the leader to move independently,
   without the followers chasing, you will need to use the "Stop Chase"
   plugin command.
4. After you are done with the eventing, remember to use the "Leader" and
   "Chase" plugin commands to return to default RPG Maker behavior, if
   desired.

## Advanced uses for this plugin
 - Make common events with preset movement patterns for the party. Then,
   use these movement patterns for cutscenes throughout the game!
 - You can make a follower that looks transparent, like a ghost! Select a
   follower, then using the Set Move Route command to change the follower's
   opacity, and/or to turn off (or on) the follower's walking animation,
   stepping animation, or direction fix.
 - You can make a follower turn toward the party leader. First, select a
   follower. Then, use the Set Move Route command and use the move route
   "turn toward player". (If you also want the party leader to turn
   toward the follower: Use conditional branches to check the direction
   faced by the follower; then, inside the conditional branch, select the
   leader, and use Set Move Route to make the leader face the opposite
   direction.)
 - If followers are on the same tile as the leader, you can make them
   face the same direction as the leader. Select a follower, then use the
   Set Move Route command and use the move route "turn toward player".
   (This also works for events that are on the same tile as the leader.)
 - Poses! These allow you to change an actor's character image, without
   needing to know which actor is being affected. Based on the follower
   you choose, the follower's actor's character image will change to the
   pose you choose. Example: If you have an actor named Tyruswoo with
   character image "Tyruswoo.png", then you can use the Pose plugin command
   with the argument "wounded" to change the character's image to
   "Tyruswoo_wounded.png". Most importantly, this affects the chosen
   follower, without needing to know which actor ID is being affected, and
   without needing to know the current graphic of the actor. To change the
   pose back to default, use the Reset Pose plugin command.
 - Pathfinding! You can make any character (party leader, follower, or
   event) take a step toward coordinates, or a step toward any other
   follower or event! Within the Set Move Route command, use this script:
   this.path(x, y) and the character will step toward coordinates x,y.
   To make the character step toward a follower, use the script
   this.path('follower', i) where i is the position (marching order) of the
   follower. To make the character step toward the party leader, use the
   script this.path('leader'). To make the character step toward an event,
   use the script this.path('event', i) where i is the ID number of the
   event. If you don't want pathfinding, but want the character to attempt
   to take a step without trying to avoid walls, you can use the script
   this.moveToward(x,y), this.moveToward('follower',id),
   this.moveToward('event',i), or this.moveToward('leader'). In all these
   scripts, you can also abbreviate 'follower' to 'f', 'leader' to 'l', and
   'event' to 'e'. Using abbreviations can make it easier to read the
   scripts inside the Set Move Route window. Note that by default, followers
   have Through On, so if you want the followers to pathfind around
   solid obstacles, you will need to use Set Move Route on the follower to
   set Through Off.
 - Followers who don't battle! Comes in handy for escort or rescue quests
   or other tag-alongs. To make a character a Non-Combat Follower, put him
   in the Actors database and assign the Non-Combat Class as his class.
   He can join and leave the party in the same way that adventuring party
   members do, and he counts as "in the party" for the purposes of on-map
   events. As a Non-Combat Follower, he will walk behind the active
   adventuring party, but he won't appear in the field menu or in battle.
 - Make some player characters always do their step animation, even when
   they remain in one place. This is useful for a flying character whose
   wings are always flapping, for instance. Do this up front with the Actor
   notetag `<stepAnime: true>`, or toggle during play with the plugin command
   Change Actor Stepping. Actor stepping status persists for each save file.
   If a move route turns a party member's stepping ON or OFF, step animation
   runs if Actor stepping is ON, or move route stepping is ON, or both.

### For more help using the Follower Control plugin, see [Tyruswoo.com](https://www.tyruswoo.com).

## Version History:
**v1.0** - 8/22/2020
- Follower Control released for RPG Maker MZ!

**v1.1** - 8/25/2020
- Removed a bug that caused `Tyruswoo.FollowerControl._follower` to be
  reverted to $gamePlayer whenever a `Game_Interpreter` closed. Now,
  the selected follower is remembered from one event to the next,
  (as long as the player stays in the same map). This also allows
  the Follower Control plugin to much more easily communicate with
  other plugins. For example, this allows `Tyruswoo_TileControl` to use
  information about the current follower in its plugin commands.

**v1.2** - 8/30/2020
- Corrected bug in replacement method for the function
  `Game_Interpreter.character()`, in which if
  `Tyruswoo.FollowerControl._follower` was not defined using the
  Follower Control plugin, then the first instance of eventing (such
  as a Transfer Player event) could result in
  `Game_Interpreter.character()` returning null instead of returning
  $gamePlayer. Now, if `Tyruswoo.FollowerControl._follower` is not yet
  defined, `Game_Interpreter.character()` will never use a null value
  `Tyruswoo.FollowerControl._follower`, but will instead use
  $gamePlayer, as is the default behavior for the function.

**v1.3** - 9/12/2020
- Now, if a follower is selected, and the follower does not exist,
  the leader is no longer selected; instead, the non-existent
  follower is selected. Therefore, eventing intended for a follower
  that is not present will have no effect, instead of affecting the
  party leader.
- Added the `Tyruswoo.FollowerControl.follower()` function, which
  allows improves compatability with other plugins that may need to
  access the current valid follower (if available) stored in the
  `Tyruswoo.FollowerControl._follower` variable. Plugins that may use
  this information include `Tyruswoo_TileControl` and
  `Tyruswoo_CameraControl`.
- Changed the method `Game_Interpreter.character()` to an alias method.
  This increases the chance of compatibility with other plugins
  that use the `Game_Interpreter.character()` method.

**v3.0** - 8/27/2021
- Fixed a bug in which it was possible to select an absent follower.
  (Followers always technically exist, even if there is no associated
  actor. If there is no actor, the follower is absent/invisible.)
  This bug manifested when the player had a small party, and the
  follower selected was less than the Max Party Size but greater than
  the current party size. This "absent" follower still exists, but
  has no associated actor and therefore no image. If Show Balloon
  Icon or Show Animation was used, then the balloon icon or animation
  would appear at the "absent" follower's location. Note: We made a
  similar bugfix in Follower Control v2.2 for RPG Maker MV.
  Big thanks to Lei-Yan for bringing this bug to our attention!
- Fixed a rare bug affecting loading and saving in some projects.
  Thanks to Edsephiroth for bringing this to our attention and
  helping us test!

**v4.0** - 1/21/2022
- Introduced non-combat followers.
- Introduced notetag for always-stepping Actors.
- New plugin commands: Follower by Position Variable, Follower by Actor Variable, and Change Actor Stepping.

**v4.0.1** - 8/31/2023
- This older plugin is now free and open source under the [MIT license](https://opensource.org/license/mit/).

> **Remember, only you can build your dreams!**
> 
> *Tyruswoo*
