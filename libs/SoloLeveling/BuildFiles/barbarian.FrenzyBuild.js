/*
 *    @filename   	barbarian.FrenzyBuild.js
 *	  @author	  	isid0re
 *    @desc       	Frenzy build
 *    @credits		https://www.d2trophy.com/frenzy-barbarian-guide/
 */

var build = {
	caster: false,
	skillstab: 32, // Barbarian Combat
	wantedskills: [126, 133, 137], // fremzu, double swing, taunt
	usefulskills: [129, 153], // swordmastery, natural res
	mercAuraName: "Might",
	mercAuraWanted: 98,
	mercDiff: 1,
	stats: [
		["vit", 40],
		["str", 60],
		["vit", 100],
		["str", 85],
		["vit", 150],
		["dex", 35],
		["str", 100],
		["vit", 180],
		["str", 125],
		["vit", 205],
		["str", 156],
		["vit", "all"]
	],
	skills: [
		[126, 1], // Bash
		[139, 1], // Stun
		[133, 1], // Double Swing
		[140, 1], // Double Throw
		[144, 1], // Concentrate
		[147, 1], // Frenzy
		[152, 1], // Berserk
		[129, 1], // Sword Mastery
		[141, 1], //Increased Stamina
		[148, 1], //Increased Speed
		[145, 1], // Iron Skin
		[153, 1], // Natural Resistance
		[130, 1], // Howl
		[137, 1], // Taunt
		[138, 1], // Shout
		[149, 1], // Battle Orders
		[155, 1], // Battle Command
		[154, 1], // War Cry
		[147, 20], // Frenzy
		[133, 20], // Double Swing
		[149, 20], // Battle Orders
		[137, 20], // Taunt
		[129, 20], // Sword Mastery
	],
	autoEquipTiers: [ // autoequip final gear
		//weapon
		"[name] == phaseblade && [flag] == runeword # [ias] >= 30 # [tier] == 100000 + tierscore(item)", //Grief
		"[name] == colossusblade && [flag] == ethereal && [flag] == runeword # [ias] >= 60 # [tier] == 100000 + tierscore(item)", //BoTD
		//Helmet
		"[name] == wingedhelm && [quality] == set && [flag] != ethereal # [fhr] >= 30 # [tier] == 100000 + tierscore(item)", // gface
		//belt
		"[name] == spiderwebsash && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 90 # [tier] == 100000 + tierscore(item)", //arach's
		//boots
		"[name] == warboots && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 160 # [tier] == 100000 + tierscore(item)", //gorerider's
		//armor
		"[type] == armor && [flag] != ethereal && [flag] == runeword # [frw] >= 45 # [tier] == 100000 + tierscore(item)", //Enigma
		//gloves
		"[name] == bramblemitts && [quality] == set && [flag] != ethereal # [ias] == 20 # [tier] == 100000 + tierscore(item)", //laying of hands
		//ammy
		"[type] == amulet && [quality] == unique # [lightresist] == 35 # [tier] == 100000 + tierscore(item)", //highlords
		//rings
		"[type] == ring && [quality] == unique # [tohit] >= 180 && [dexterity] >= 15 # [tier] == 100000 + tierscore(item)", // ravenfrost
		"[type] == ring && [quality] == unique # [lifeleech] >= 5 && [maxstamina] == 50 # [tier] == 100000 + tierscore(item)", // bul-kathos' wedding band
		//swap
		"[type] == sword # [fcr] >= 25 # [swaptier] == 100000", //spirit
		"[type] == shield # [fcr] >= 25 # [swaptier] == 100000", //spirit
		//merc
		"[type] == armor && [flag] == runeword # [enhanceddefense] >= 200 && [enhanceddamage] >= 300 # [merctier] == 100000",	//Fortitude
		"[name] == demonhead && [quality] == unique # [strength] >= 25 && [enhanceddefense] >= 100 # [merctier] == 50000",	//Andy's
	]
};
