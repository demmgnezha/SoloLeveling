/*
*	@filename	PatherOverrides.js
*	@author		isid0re
*	@desc		Pather.js fixes to improve functionality
*	@credits	Xcon for turn off teleport if below 20% mana
*/

if (!isIncluded("common/Pather.js")) {
	include("common/Pather.js");
}

NodeAction.killMonsters = function (arg) {
	var monList, sanityCheck = [8, 10, 12, 18, 19, 62, 63, 64, 74, 94, 95, 96, 97, 98, 99].indexOf(me.area) > -1 ? true : false;

	if (Config.Countess.KillGhosts && [21, 22, 23, 24, 25].indexOf(me.area) > -1) {
		monList = Attack.getMob(38, 0, 30);

		if (monList) {
			Attack.clearList(monList);
		}
	}

	if ([8, 3, 4, 38, 5, 6, 27, 28, 33, 37, 56, 57, 60, 45, 58, 66, 67, 68, 69, 70, 71, 72].indexOf(me.area) > -1) {
		monList = Attack.getMob([58, 59, 60, 61, 101, 102, 103, 104], 0, 30);

		if (monList) {
			Attack.clear(7, 0);
			Attack.clearList(monList);
		}
	}

	if ([39].indexOf(me.area) > -1) {
		let king = getUnit(1, "The Cow King");
		let kingPreset = getPresetUnit(me.area, 1, 773);

		if (king) {
			do {
				if (getDistance(me.x, me.y, getRoom(kingPreset.roomx * 5 + kingPreset.x), getRoom(kingPreset.roomy * 5 + kingPreset.y)) <= 25) {
					Town.goToTown();
					print('ÿc9SoloLevelingÿc0: exit cows. Near the king');
					me.overhead('Exit cows. Near the king');
					D2Bot.printToConsole('SoloLeveling: exit cows. Near the king');
				}
			} while (king.getNext());
		}
	}

	if ([8].indexOf(me.area) > -1) {
		let corpsefire = getUnit(1, getLocaleString(3319));

		if (corpsefire) {
			do {
				if (!Attack.canAttack(corpsefire)) {
					Town.goToTown();
					print('ÿc9SoloLevelingÿc0: exit Den. Corpsefire immune.');
					me.overhead('Exit Den. Corpsefire immune.');
				}
			} while (corpsefire.getNext());
		}
	}


	if ((typeof Config.ClearPath === "number" || typeof Config.ClearPath === "object") && arg.clearPath === false) {
		switch (typeof Config.ClearPath) {
		case "number":
			Attack.clear(7, 0);
			Attack.clear(sanityCheck ? 7 : 30, Config.ClearPath);

			break;
		case "object":
			if (!Config.ClearPath.hasOwnProperty("Areas") || Config.ClearPath.Areas.length === 0 || Config.ClearPath.Areas.indexOf(me.area) > -1) {
				Attack.clear(7, 0);
				Attack.clear(sanityCheck ? 7 : Config.ClearPath.Range, Config.ClearPath.Spectype);
			}

			break;
		}
	}

	if (arg.clearPath !== false) {
		Attack.clear(7, 0);
		Attack.clear(sanityCheck ? 7 : 15, typeof arg.clearPath === "number" ? arg.clearPath : 0);
	}
};

NodeAction.popChests = function () {
	let range = Pather.useTeleport() ? 25 : 15;

	if (Config.OpenChests) {
		Misc.openChests(range);
	}

	Misc.useWell(range);
};

Pather.checkWP = function (area) {
	if (!getWaypoint(Pather.wpAreas.indexOf(area))) {
		if (me.inTown) {
			Town.move("waypoint");
		}

		let wp;

		for (let i = 0; i < 15; i += 1) {
			wp = getUnit(2, "waypoint");

			if (wp && wp.area === me.area) {
				if (!me.inTown && getDistance(me, wp) > 7) {
					Pather.moveToUnit(wp);
				}

				Misc.click(0, 0, wp);

				let tick = getTickCount();

				while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), (1 + me.ping * 2))) {
					if (getUIFlag(0x14)) { // Waypoint screen is open
						delay(500 + me.ping);
						break;
					}

					delay(50 + me.ping);
				}
			}

			if (getUIFlag(0x14)) { // Waypoint screen is open
				me.cancel();
				break;
			}
		}
	}

	return getWaypoint(Pather.wpAreas.indexOf(area));
};

Pather.useTeleport = function () {
	return this.teleport && !Config.NoTele && !me.getState(139) && !me.getState(140) && !me.inTown && !me.lowgold && ((me.classid === 1 && me.getSkill(54, 1) && ((me.getStat(8) / me.getStat(9)) * 100) >= 20) || me.getStat(97, 54));
};

Pather.openDoors = function (x, y) {
	if (me.inTown) {
		return false;
	}

	// Regular doors
	var i, tick,
		door = getUnit(2, "door", 0);

	if (door) {
		do {
			if ((getDistance(door, x, y) < 4 && getDistance(me, door) < 9) || getDistance(me, door) < 4) {
				for (i = 0; i < 3; i += 1) {
					Misc.click(0, 0, door);
					tick = getTickCount();

					while (getTickCount() - tick < 1000) {
						if (door.mode === 2) {
							me.overhead("Opened a door!");

							return true;
						}

						delay(10 + me.ping);
					}

					if (i === 2) {
						Packet.flash(me.gid);
					}
				}
			}
		} while (door.getNext());
	}

	// Monsta doors (Barricaded)
	var p,
		monstadoor = getUnit(1, "Barricaded Door"), //barricaded door
		monstawall = getUnit(1, "Barricade"); //barricaded wall

	if (monstadoor) {
		do {
			if ((getDistance(monstadoor, x, y) < 4 && getDistance(me, monstadoor) < 9) || getDistance(me, monstadoor) < 4) {

				for (p = 0; p < 20 && monstadoor.hp; p += 1) {
					Skill.cast(Config.AttackSkill[1], Skill.getHand(Config.AttackSkill[1]), monstadoor);
				}

				me.overhead("Broke a barricaded door!");
			}
		} while (monstadoor.getNext());
	}

	if (monstawall) {
		do {
			if ((getDistance(monstawall, x, y) < 4 && getDistance(me, monstawall) < 9) || getDistance(me, monstawall) < 4) {

				for (p = 0; p < 20 && monstawall.hp; p += 1) {
					Skill.cast(Config.AttackSkill[1], Skill.getHand(Config.AttackSkill[1]), monstawall);
				}

				me.overhead("Broke a barricaded wall!");
			}
		} while (monstawall.getNext());
	}

	return false;
};

Pather.changeAct = function () {
	let code, targetAct;

	if (!me.inTown) {
		Town.goToTown();
	}

	switch (me.act) {
	case 1:
		Town.npcInteract("warriv");
		code = 0x0D36;
		targetAct = 2;

		break;
	case 2:
		Town.npcInteract("meshif");
		code = 0x0D38;
		targetAct = 3;

		break;
	case 4:
		Town.npcInteract("tyrael");
		code = 0x58D2;
		targetAct = 5;

		break;
	default:
		break;
	}

	if (Misc.useMenu(code)) {
		for (let i = 0; i < 7; i += 1) {
			delay(1000 + me.ping);

			if (me.inTown && me.act === targetAct) {
				return true;
			}
		}
	}

	throw new Error("SoloLeveling: Failed to change Act");
};

Pather.moveTo = function (x, y, retry, clearPath, pop) {
	if (me.dead) { // Abort if dead
		return false;
	}

	var i, path, adjustedNode, cleared, useTeleport,
		node = {x: x, y: y},
		fail = 0;

	for (i = 0; i < this.cancelFlags.length; i += 1) {
		if (getUIFlag(this.cancelFlags[i])) {
			me.cancel();
		}
	}

	if (getDistance(me, x, y) < 2) {
		return true;
	}

	if (x === undefined || y === undefined) {
		throw new Error("moveTo: Function must be called with at least 2 arguments.");
	}

	if (typeof x !== "number" || typeof y !== "number") {
		throw new Error("moveTo: Coords must be numbers");
	}

	if (retry === undefined) {
		retry = 15;
	}

	if (clearPath === undefined) {
		clearPath = true;
	}

	if (pop === undefined) {
		pop = false;
	}

	useTeleport = this.useTeleport();
	path = getPath(me.area, x, y, me.x, me.y, useTeleport ? 1 : 0, useTeleport ? ([62, 63, 64].indexOf(me.area) > -1 ? 30 : this.teleDistance) : this.walkDistance);

	if (!path) {
		throw new Error("moveTo: Failed to generate path.");
	}

	path.reverse();

	if (pop) {
		path.pop();
	}

	PathDebug.drawPath(path);

	if (useTeleport && Config.TeleSwitch && path.length > 5) {
		Attack.weaponSwitch(Attack.getPrimarySlot() ^ 1);
	}

	while (path.length > 0) {
		if (me.dead) { // Abort if dead
			return false;
		}

		for (i = 0; i < this.cancelFlags.length; i += 1) {
			if (getUIFlag(this.cancelFlags[i])) {
				me.cancel();
			}
		}

		node = path.shift();

		if (getDistance(me, node) > 2) {
			if ([62, 63, 64].indexOf(me.area) > -1) {
				adjustedNode = this.getNearestWalkable(node.x, node.y, 15, 3, 0x1 | 0x4 | 0x800 | 0x1000);

				if (adjustedNode) {
					node.x = adjustedNode[0];
					node.y = adjustedNode[1];
				}
			}

			if (useTeleport ? this.teleportTo(node.x, node.y) : this.walkTo(node.x, node.y, (fail > 0 || me.inTown) ? 2 : 4)) {
				if (!me.inTown) {
					if (this.recursion) {
						this.recursion = false;

						NodeAction.go({clearPath: clearPath});

						if (getDistance(me, node.x, node.y) > 5) {
							this.moveTo(node.x, node.y);
						}

						this.recursion = true;
					}

					Misc.townCheck();
				}
			} else {
				if (fail > 0 && !useTeleport && !me.inTown) {
					if (!cleared) {
						Attack.clear(5);
						Misc.openChests(2);

						cleared = true;
					}

					if (fail > 1 && me.getSkill(143, 1)) {
						Skill.cast(143, 0, node.x, node.y);
					}
				}

				path = getPath(me.area, x, y, me.x, me.y, useTeleport ? 1 : 0, useTeleport ? rand(25, 35) : rand(10, 15));
				fail += 1;

				if (!path) {
					throw new Error("moveTo: Failed to generate path.");
				}

				path.reverse();
				PathDebug.drawPath(path);

				if (pop) {
					path.pop();
				}

				print("move retry " + fail);

				if (fail > 0) {
					Packet.flash(me.gid);
					Attack.clear(5);
					Misc.openChests(2);

					if (fail >= retry) {
						break;
					}
				}
			}
		}

		delay(5);
	}

	if (useTeleport && Config.TeleSwitch) {
		Attack.weaponSwitch(Attack.getPrimarySlot());
	}

	PathDebug.removeHooks();

	return getDistance(me, node.x, node.y) < 5;
};

Pather.moveToPreset = function (area, unitType, unitId, offX, offY, clearPath, pop) {
	if (area === undefined || unitType === undefined || unitId === undefined) {
		throw new Error("moveToPreset: Invalid parameters.");
	}

	if (offX === undefined) {
		offX = 0;
	}

	if (offY === undefined) {
		offY = 0;
	}

	if (clearPath === undefined) {
		clearPath = false;
	}

	if (pop === undefined) {
		pop = false;
	}

	var presetUnit = getPresetUnit(area, unitType, unitId);

	if (!presetUnit) {
		throw new Error("moveToPreset: Couldn't find preset unit - id " + unitId);
	}

	return this.moveTo(presetUnit.roomx * 5 + presetUnit.x + offX, presetUnit.roomy * 5 + presetUnit.y + offY, 15, clearPath, pop);
};

Pather.moveToExit = function (targetArea, use, clearPath) {
	var i, j, area, exits, targetRoom, dest, currExit,
		areas = [];

	if (targetArea instanceof Array) {
		areas = targetArea;
	} else {
		areas.push(targetArea);
	}

	for (i = 0; i < areas.length; i += 1) {
		area = getArea();

		if (!area) {
			throw new Error("moveToExit: error in getArea()");
		}

		exits = area.exits;

		if (!exits || !exits.length) {
			return false;
		}

		for (j = 0; j < exits.length; j += 1) {
			currExit = {
				x: exits[j].x,
				y: exits[j].y,
				type: exits[j].type,
				target: exits[j].target,
				tileid: exits[j].tileid
			};

			if (currExit.target === areas[i]) {
				dest = this.getNearestWalkable(currExit.x, currExit.y, 5, 1);

				if (!dest) {
					return false;
				}

				if (!this.moveTo(dest[0], dest[1], 15, clearPath)) {
					return false;
				}

				/* i < areas.length - 1 is for crossing multiple areas.
					In that case we must use the exit before the last area.
				*/
				if (use || i < areas.length - 1) {
					switch (currExit.type) {
					case 1: // walk through
						targetRoom = this.getNearestRoom(areas[i]);

						if (targetRoom) {
							this.moveTo(targetRoom[0], targetRoom[1]);
						} else {
							// might need adjustments
							return false;
						}

						break;
					case 2: // stairs
						if (!this.openExit(areas[i]) && !this.useUnit(5, currExit.tileid, areas[i])) {
							return false;
						}

						break;
					}
				}

				break;
			}
		}
	}

	if (use) {
		return typeof targetArea === "object" ? me.area === targetArea[targetArea.length - 1] : me.area === targetArea;
	}

	return true;
};

Pather.makePortal = function (use) {
	if (me.inTown) {
		return true;
	}

	var i, portal, oldPortal, oldGid, tick, tpTome, tpScroll;

	for (i = 0; i < 5; i += 1) {
		if (me.dead) {
			break;
		}

		tpScroll = me.findItem("tsc", 0, 3);
		tpTome = me.findItem("tbk", 0, 3);

		if (!tpTome && !tpScroll) {
			return false;
		}

		if ((tpTome && !tpTome.getStat(70)) && !tpScroll) {
			return false;
		}

		oldPortal = getUnit(2, "portal");

		if (oldPortal) {
			do {
				if (oldPortal.getParent() === me.name) {
					oldGid = oldPortal.gid;

					break;
				}
			} while (oldPortal.getNext());
		}

		if (!tpTome) {
			tpScroll.interact();
		} else {
			tpTome.interact();
		}

		tick = getTickCount();

		MainLoop:
		while (getTickCount() - tick < Math.max(500 + i * 100, me.ping * 2 + 100)) {
			portal = getUnit(2, "portal");

			if (portal) {
				do {
					if (portal.getParent() === me.name && portal.gid !== oldGid) {
						if (use) {
							if (this.usePortal(null, null, copyUnit(portal))) {
								return true;
							}

							break MainLoop; // don't spam usePortal
						} else {
							return copyUnit(portal);
						}
					}
				} while (portal.getNext());
			}

			delay(10);
		}

		Packet.flash(me.gid);
	}

	return false;
};

Pather.moveToUnit = function (unit, offX, offY, clearPath, pop) {
	var useTeleport = this.useTeleport();

	if (offX === undefined) {
		offX = 0;
	}

	if (offY === undefined) {
		offY = 0;
	}

	if (clearPath === undefined) {
		clearPath = true;
	}

	if (pop === undefined) {
		pop = false;
	}

	if (!unit || !unit.hasOwnProperty("x") || !unit.hasOwnProperty("y")) {
		throw new Error("moveToUnit: Invalid unit.");
	}

	if (unit instanceof PresetUnit) {
		return this.moveTo(unit.roomx * 5 + unit.x + offX, unit.roomy * 5 + unit.y + offY, 3, clearPath);
	}

	if (!useTeleport) {
		this.moveTo(unit.x + offX, unit.y + offY, 0, clearPath, true);	// The unit will most likely be moving so call the first walk with 'pop' parameter
	}

	return this.moveTo(unit.x + offX, unit.y + offY, useTeleport && unit.type && unit.type === 1 ? 3 : 0, clearPath, pop);
};

Pather.useUnit = function (type, id, targetArea) {
	var tick, unit, coord, preArea = me.area;

	for (let i = 0; i < 15; i += 1) {
		unit = getUnit(type, id);

		if (unit) {
			break;
		}

		delay(200);
	}

	if (!unit) {
		throw new Error("useUnit: Unit not found. TYPE: " + type + " ID: " + id + " AREA: " + me.area);
	}

	for (let i = 0; i < 5; i += 1) {
		if (getDistance(me, unit) > 5) {
			this.moveToUnit(unit);
		}

		if (type === 2 && unit.mode === 0) {
			if ((me.area === 83 && targetArea === 100 && me.getQuest(21, 0) !== 1) || (me.area === 120 && targetArea === 128 && me.getQuest(39, 0) !== 1)) {
				throw new Error("useUnit: Incomplete quest.");
			}

			if (me.area === 92) {
				this.openUnit(2, 367);
			} else {
				this.openUnit(2, id);
			}
		}

		delay(300);

		if (type === 5) {
			Misc.click(0, 0, unit);
		} else {
			sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
		}

		tick = getTickCount();

		while (getTickCount() - tick < 3000) {
			if ((!targetArea && me.area !== preArea) || me.area === targetArea) {
				delay(100);

				return true;
			}

			delay(10);
		}

		Packet.flash(me.gid);
		coord = CollMap.getRandCoordinate(me.x, -1, 1, me.y, -1, 1, 3);
		this.moveTo(coord.x, coord.y);
	}

	return targetArea ? me.area === targetArea : me.area !== preArea;
};

Pather.useWaypoint = function useWaypoint (targetArea, check) {
	switch (targetArea) {
	case undefined:
		throw new Error("useWaypoint: Invalid targetArea parameter: " + targetArea);
	case null:
	case "random":
		check = true;

		break;
	default:
		if (typeof targetArea !== "number") {
			throw new Error("useWaypoint: Invalid targetArea parameter");
		}

		if (this.wpAreas.indexOf(targetArea) < 0) {
			throw new Error("useWaypoint: Invalid area");
		}

		break;
	}

	this.broadcastIntent(targetArea);

	var i, tick, wp, coord, retry, npc;

	for (i = 0; i < 12; i += 1) {
		if (me.area === targetArea || me.dead) {
			break;
		}

		if (me.inTown) {
			npc = getUnit(1, NPC.Warriv);

			if (me.area === 40 && npc && getDistance(me, npc) < 50) {
				if (npc && npc.openMenu()) {
					Misc.useMenu(0x0D37);

					if (!Misc.poll(function () {
						return me.area === 1;
					}, 2000, 100)) {
						throw new Error("Failed to go to act 1 using Warriv");
					}
				}
			}

			Town.move("waypoint");
		}

		wp = getUnit(2, "waypoint");

		if (wp && wp.area === me.area) {
			if (!me.inTown && getDistance(me, wp) > 7) {
				this.moveToUnit(wp);
			}

			if (check || Config.WaypointMenu) {
				if (getDistance(me, wp) > 5) {
					this.moveToUnit(wp);
				}

				Misc.click(0, 0, wp);

				tick = getTickCount();

				while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
					if (getUIFlag(0x14)) { // Waypoint screen is open
						delay(500);

						switch (targetArea) {
						case "random":
							while (true) {
								targetArea = this.wpAreas[rand(0, this.wpAreas.length - 1)];

								// get a valid wp, avoid towns
								if ([1, 40, 75, 103, 109].indexOf(targetArea) === -1 && getWaypoint(this.wpAreas.indexOf(targetArea))) {
									break;
								}

								delay(5);
							}

							break;
						case null:
							me.cancel();

							return true;
						}

						if (!getWaypoint(this.wpAreas.indexOf(targetArea))) {
							me.cancel();
							me.overhead("Trying to get the waypoint");

							if (this.getWP(targetArea)) {
								return true;
							}

							throw new Error("Pather.useWaypoint: Failed to go to waypoint");
						}

						break;
					}

					delay(10);
				}

				if (!getUIFlag(0x14)) {
					print("waypoint retry " + (i + 1));
					retry = Math.min(i + 1, 5)
					coord = CollMap.getRandCoordinate(me.x, -5 * retry, 5 * retry, me.y, -5 * retry, 5 * retry);
					this.moveTo(coord.x, coord.y);
					delay(200 + me.ping);

					Packet.flash(me.gid);

					continue;
				}
			}

			if (!check || getUIFlag(0x14)) {
				delay(200 + me.ping);
				wp.interact(targetArea);

				tick = getTickCount();

				while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
					if (me.area === targetArea) {
						delay(100 + me.ping);

						return true;
					}

					delay(10 + me.ping);
				}

				while (!me.gameReady) {
					delay(200 + me.ping);
				}

				me.cancel(); // In case lag causes the wp menu to stay open
			}

			Packet.flash(me.gid);

			if (i > 1) { // Activate check if we fail direct interact twice
				check = true;
			}
		} else {
			Packet.flash(me.gid);
		}

		delay(200 + me.ping);
	}

	if (me.area === targetArea) {
		return true;
	}

	throw new Error("useWaypoint: Failed to use waypoint");
};
