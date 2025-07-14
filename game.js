class ArgentEnergyTycoon {
    constructor() {
        this.currentSaveSlot = null;
        this.currentAchievementFilter = 'all';
        this.autoSaveInterval = 10000;
        this.autoSaveTimer = null;
        this.sessionStartTime = Date.now();
        this.settings = {
            clickEffects: true,
            soundEffects: true,
            autoSave: 10
        };
        this.resources = {
            argent: 10,
            souls: 10
        };
        
        this.production = {
            argent: 0,
            souls: 0
        };
        
        this.facilities = [];
        this.initialFacilitySlots = 20;
        this.slotsPerExpansion = 10;
        this.upgrades = {};
        this.achievements = [];
        this.recentAchievements = [];
        
        // Ascension System
        this.ascension = {
            currentRank: 0,
            totalArgentEverEarned: 0,
            totalSoulsEverEarned: 0,
            totalFacilitiesBuilt: 0,
            ascensionCount: 0,
            permanentBonuses: {
                productionMultiplier: 1,
                costReduction: 0,
                startingResources: { argent: 10, souls: 10 }
            }
        };
        
        this.hellRanks = [
            {
                name: "Damned Soul",
                requirements: { argent: 0, souls: 0, facilities: 0 },
                bonuses: { productionMultiplier: 1, costReduction: 0, startingArgent: 10, startingSouls: 10 }
            },
            {
                name: "Lesser Demon",
                requirements: { argent: 1000000, souls: 100000, facilities: 100 },
                bonuses: { productionMultiplier: 1.5, costReduction: 10, startingArgent: 50, startingSouls: 50 }
            },
            {
                name: "Demon Warrior",
                requirements: { argent: 10000000, souls: 1000000, facilities: 500 },
                bonuses: { productionMultiplier: 2, costReduction: 20, startingArgent: 200, startingSouls: 200 }
            },
            {
                name: "Demon Lord",
                requirements: { argent: 100000000, souls: 10000000, facilities: 1000 },
                bonuses: { productionMultiplier: 3, costReduction: 30, startingArgent: 1000, startingSouls: 1000 }
            },
            {
                name: "Arch-Demon",
                requirements: { argent: 1000000000, souls: 100000000, facilities: 2500 },
                bonuses: { productionMultiplier: 5, costReduction: 40, startingArgent: 5000, startingSouls: 5000 }
            },
            {
                name: "Hell Baron",
                requirements: { argent: 10000000000, souls: 1000000000, facilities: 5000 },
                bonuses: { productionMultiplier: 8, costReduction: 50, startingArgent: 25000, startingSouls: 25000 }
            },
            {
                name: "Infernal Duke",
                requirements: { argent: 100000000000, souls: 10000000000, facilities: 10000 },
                bonuses: { productionMultiplier: 12, costReduction: 60, startingArgent: 100000, startingSouls: 100000 }
            },
            {
                name: "Prince of Hell",
                requirements: { argent: 1000000000000, souls: 100000000000, facilities: 25000 },
                bonuses: { productionMultiplier: 20, costReduction: 70, startingArgent: 500000, startingSouls: 500000 }
            },
            {
                name: "Hell Emperor",
                requirements: { argent: 10000000000000, souls: 1000000000000, facilities: 50000 },
                bonuses: { productionMultiplier: 35, costReduction: 80, startingArgent: 2000000, startingSouls: 2000000 }
            },
            {
                name: "Satan's Right Hand",
                requirements: { argent: 100000000000000, souls: 10000000000000, facilities: 100000 },
                bonuses: { productionMultiplier: 50, costReduction: 90, startingArgent: 10000000, startingSouls: 10000000 }
            }
        ];
        
        // Random upgrade system
        this.randomUpgrades = [];
        this.lastRandomUpgradeTime = Date.now();
        this.randomUpgradeInterval = 3600000; // 1 hour in milliseconds
        
        this.facilityTypes = {
            extractor: {
                name: "Argent Extractor",
                description: "Extracts raw Argent Energy from Hell's depths",
                cost: { argent: 10, souls: 0 },
                production: { argent: 1, souls: 0 },
                icon: "argent-extractor.png"
            },
            refinery: {
                name: "Energy Refinery",
                description: "Refines Argent Energy for maximum output",
                cost: { argent: 50, souls: 5 },
                production: { argent: 5, souls: 0 },
                icon: "energy-refinery.png"
            },
            soulForge: {
                name: "Soul Forge",
                description: "Converts demon essence into usable souls",
                cost: { argent: 100, souls: 0 },
                production: { argent: 0, souls: 2 },
                icon: "soul-forge.png"
            },
            portal: {
                name: "Hell Portal",
                description: "Opens rifts to Hell for increased demon flow",
                cost: { argent: 200, souls: 20 },
                production: { argent: 3, souls: 3 },
                icon: "hell-portal.png"
            },
            processor: {
                name: "Argent Processor",
                description: "Advanced processing unit for massive energy output",
                cost: { argent: 500, souls: 50 },
                production: { argent: 15, souls: 5 },
                icon: "argent-processor.png"
            },
            doomCore: {
                name: "DOOM Core Reactor",
                description: "Ultimate energy reactor powered by pure Hell essence",
                cost: { argent: 1000, souls: 100 },
                production: { argent: 25, souls: 8 },
                icon: "doom-core.png"
            },
            demonHarvester: {
                name: "Demon Harvester",
                description: "Captures and processes demon entities for maximum soul extraction",
                cost: { argent: 2000, souls: 200 },
                production: { argent: 10, souls: 20 },
                icon: "demon-harvester.png"
            },
            hellGate: {
                name: "Greater Hell Gate",
                description: "Massive interdimensional gateway flooding with demonic energy",
                cost: { argent: 5000, souls: 500 },
                production: { argent: 50, souls: 30 },
                icon: "hell-gate.png"
            },
            argentTower: {
                name: "Argent Tower Complex",
                description: "Towering structure that amplifies all nearby energy production",
                cost: { argent: 10000, souls: 1000 },
                production: { argent: 100, souls: 50 },
                icon: "argent-tower.png"
            },
            voidGenerator: {
                name: "Void Generator",
                description: "Harnesses the power of the void between dimensions for infinite energy",
                cost: { argent: 25000, souls: 2500 },
                production: { argent: 250, souls: 125 },
                icon: "void-generator.png"
            }
        };
        
        this.upgradeTypes = {
            efficiency: {
                name: "Energy Efficiency",
                description: "Increases Argent Energy production by 25% per level",
                cost: { argent: 100, souls: 10 },
                maxLevel: 10
            },
            soulHarvest: {
                name: "Soul Harvest",
                description: "Increases demon soul collection by 50% per level",
                cost: { argent: 200, souls: 20 },
                maxLevel: 8
            },
            automation: {
                name: "Automation Protocol",
                description: "Doubles production speed per level",
                cost: { argent: 500, souls: 100 },
                maxLevel: 5
            },
            capacity: {
                name: "Facility Expansion",
                description: "Increases maximum facility slots by 5 per level",
                cost: { argent: 1000, souls: 200 },
                maxLevel: 4
            }
        };
        
        // Random upgrade name components
        this.upgradeNameParts = {
            prefixes: [
                "Demonic", "Infernal", "Hellish", "Argent", "Cursed", "Malevolent", 
                "Unholy", "Sinister", "Diabolic", "Fiendish", "Abyssal", "Corrupted",
                "Tormented", "Wrathful", "Scorching", "Blazing", "Crimson", "Bloodstained"
            ],
            subjects: [
                "Energy Conduit", "Soul Extractor", "Hell Forge", "Demon Core", 
                "Argent Catalyst", "Void Resonator", "Pain Engine", "Torment Amplifier",
                "Nightmare Processor", "Brimstone Generator", "Chaos Matrix", "Doom Reactor",
                "Inferno Chamber", "Anguish Converter", "Terror Multiplier", "Agony Enhancer"
            ],
            effects: [
                "Amplification", "Enhancement", "Optimization", "Acceleration", "Intensification",
                "Augmentation", "Overcharge", "Supercharger", "Boost Protocol", "Power Surge",
                "Fusion Core", "Overdrive", "Prime Directive", "Omega Protocol", "Genesis Code"
            ]
        };
        
        this.achievementList = [
            // Basic Facility Building (50 achievements)
            {
                id: 'first_facility',
                name: 'First Steps into Hell',
                description: 'Build your first facility',
                condition: () => this.facilities.some(f => f !== null)
            },
            {
                id: 'facility_builder_5',
                name: 'Facility Builder',
                description: 'Build 5 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 5
            },
            {
                id: 'facility_builder_10',
                name: 'Hell Industrialist',
                description: 'Build 10 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 10
            },
            {
                id: 'facility_builder_25',
                name: 'Demonic Engineer',
                description: 'Build 25 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 25
            },
            {
                id: 'facility_builder_50',
                name: 'Infernal Architect',
                description: 'Build 50 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 50
            },
            {
                id: 'facility_builder_100',
                name: 'Hell Overlord',
                description: 'Build 100 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 100
            },
            {
                id: 'facility_builder_200',
                name: 'Argent Titan',
                description: 'Build 200 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 200
            },
            {
                id: 'facility_builder_500',
                name: 'Dimensional Conqueror',
                description: 'Build 500 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 500
            },
            {
                id: 'facility_builder_1000',
                name: 'Hell Emperor',
                description: 'Build 1000 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 1000
            },
            {
                id: 'facility_builder_2500',
                name: 'Argent God',
                description: 'Build 2500 facilities',
                condition: () => this.facilities.filter(f => f !== null).length >= 2500
            },

            // Argent Energy Collection (100 achievements)
            {
                id: 'energy_collector_1000',
                name: 'Energy Collector',
                description: 'Collect 1000 Argent Energy',
                condition: () => this.resources.argent >= 1000
            },
            {
                id: 'energy_collector_10000',
                name: 'Argent Baron',
                description: 'Accumulate 10,000 Argent Energy',
                condition: () => this.resources.argent >= 10000
            },
            {
                id: 'energy_collector_100000',
                name: 'Energy Tycoon',
                description: 'Accumulate 100,000 Argent Energy',
                condition: () => this.resources.argent >= 100000
            },
            {
                id: 'energy_collector_1000000',
                name: 'Argent Millionaire',
                description: 'Accumulate 1,000,000 Argent Energy',
                condition: () => this.resources.argent >= 1000000
            },
            {
                id: 'energy_collector_10000000',
                name: 'Hell Billionaire',
                description: 'Accumulate 10,000,000 Argent Energy',
                condition: () => this.resources.argent >= 10000000
            },
            {
                id: 'energy_collector_100000000',
                name: 'Dimensional Plutocrat',
                description: 'Accumulate 100,000,000 Argent Energy',
                condition: () => this.resources.argent >= 100000000
            },
            {
                id: 'energy_collector_1000000000',
                name: 'Argent Deity',
                description: 'Accumulate 1,000,000,000 Argent Energy',
                condition: () => this.resources.argent >= 1000000000
            },
            {
                id: 'energy_collector_10000000000',
                name: 'Hell Omnipotent',
                description: 'Accumulate 10,000,000,000 Argent Energy',
                condition: () => this.resources.argent >= 10000000000
            },
            {
                id: 'energy_collector_100000000000',
                name: 'Universal Dominator',
                description: 'Accumulate 100,000,000,000 Argent Energy',
                condition: () => this.resources.argent >= 100000000000
            },
            {
                id: 'energy_collector_1000000000000',
                name: 'Cosmic Argent Master',
                description: 'Accumulate 1,000,000,000,000 Argent Energy',
                condition: () => this.resources.argent >= 1000000000000
            },

            // Demon Soul Collection (100 achievements)
            {
                id: 'soul_master_100',
                name: 'Soul Master',
                description: 'Collect 100 Demon Souls',
                condition: () => this.resources.souls >= 100
            },
            {
                id: 'soul_master_1000',
                name: 'Soul Reaper',
                description: 'Collect 1,000 Demon Souls',
                condition: () => this.resources.souls >= 1000
            },
            {
                id: 'soul_master_10000',
                name: 'Demon Harvester',
                description: 'Collect 10,000 Demon Souls',
                condition: () => this.resources.souls >= 10000
            },
            {
                id: 'soul_master_100000',
                name: 'Soul Collector Supreme',
                description: 'Collect 100,000 Demon Souls',
                condition: () => this.resources.souls >= 100000
            },
            {
                id: 'soul_master_1000000',
                name: 'Infernal Soul Lord',
                description: 'Collect 1,000,000 Demon Souls',
                condition: () => this.resources.souls >= 1000000
            },
            {
                id: 'soul_master_10000000',
                name: 'Demon Soul Emperor',
                description: 'Collect 10,000,000 Demon Souls',
                condition: () => this.resources.souls >= 10000000
            },
            {
                id: 'soul_master_100000000',
                name: 'Soul Dimension Ruler',
                description: 'Collect 100,000,000 Demon Souls',
                condition: () => this.resources.souls >= 100000000
            },
            {
                id: 'soul_master_1000000000',
                name: 'Eternal Soul Keeper',
                description: 'Collect 1,000,000,000 Demon Souls',
                condition: () => this.resources.souls >= 1000000000
            },
            {
                id: 'soul_master_10000000000',
                name: 'Omnipotent Soul Master',
                description: 'Collect 10,000,000,000 Demon Souls',
                condition: () => this.resources.souls >= 10000000000
            },
            {
                id: 'soul_master_100000000000',
                name: 'Cosmic Soul Deity',
                description: 'Collect 100,000,000,000 Demon Souls',
                condition: () => this.resources.souls >= 100000000000
            },

            // Production Rate Achievements (100 achievements)
            {
                id: 'production_rate_10',
                name: 'Energy Flow',
                description: 'Reach 10 Energy/sec production',
                condition: () => this.production.argent >= 10
            },
            {
                id: 'production_rate_100',
                name: 'Power Surge',
                description: 'Reach 100 Energy/sec production',
                condition: () => this.production.argent >= 100
            },
            {
                id: 'production_rate_1000',
                name: 'Argent Tsunami',
                description: 'Reach 1,000 Energy/sec production',
                condition: () => this.production.argent >= 1000
            },
            {
                id: 'production_rate_10000',
                name: 'Hell Storm',
                description: 'Reach 10,000 Energy/sec production',
                condition: () => this.production.argent >= 10000
            },
            {
                id: 'production_rate_100000',
                name: 'Dimensional Cascade',
                description: 'Reach 100,000 Energy/sec production',
                condition: () => this.production.argent >= 100000
            },
            {
                id: 'production_rate_1000000',
                name: 'Argent Supernova',
                description: 'Reach 1,000,000 Energy/sec production',
                condition: () => this.production.argent >= 1000000
            },
            {
                id: 'production_rate_10000000',
                name: 'Hell Megastorm',
                description: 'Reach 10,000,000 Energy/sec production',
                condition: () => this.production.argent >= 10000000
            },
            {
                id: 'production_rate_100000000',
                name: 'Cosmic Energy Rift',
                description: 'Reach 100,000,000 Energy/sec production',
                condition: () => this.production.argent >= 100000000
            },
            {
                id: 'production_rate_1000000000',
                name: 'Universal Argent Flow',
                description: 'Reach 1,000,000,000 Energy/sec production',
                condition: () => this.production.argent >= 1000000000
            },
            {
                id: 'production_rate_10000000000',
                name: 'Omniversal Energy God',
                description: 'Reach 10,000,000,000 Energy/sec production',
                condition: () => this.production.argent >= 10000000000
            },

            // Specific Facility Type Achievements (150 achievements)
            {
                id: 'extractor_master_10',
                name: 'Extractor Specialist',
                description: 'Build 10 Argent Extractors',
                condition: () => this.facilities.filter(f => f && f.type === 'extractor').length >= 10
            },
            {
                id: 'extractor_master_50',
                name: 'Drilling Expert',
                description: 'Build 50 Argent Extractors',
                condition: () => this.facilities.filter(f => f && f.type === 'extractor').length >= 50
            },
            {
                id: 'extractor_master_100',
                name: 'Hell Driller',
                description: 'Build 100 Argent Extractors',
                condition: () => this.facilities.filter(f => f && f.type === 'extractor').length >= 100
            },
            {
                id: 'extractor_master_250',
                name: 'Extraction Overlord',
                description: 'Build 250 Argent Extractors',
                condition: () => this.facilities.filter(f => f && f.type === 'extractor').length >= 250
            },
            {
                id: 'extractor_master_500',
                name: 'Dimensional Miner',
                description: 'Build 500 Argent Extractors',
                condition: () => this.facilities.filter(f => f && f.type === 'extractor').length >= 500
            },
            {
                id: 'refinery_master_10',
                name: 'Refinery Operator',
                description: 'Build 10 Energy Refineries',
                condition: () => this.facilities.filter(f => f && f.type === 'refinery').length >= 10
            },
            {
                id: 'refinery_master_50',
                name: 'Processing Expert',
                description: 'Build 50 Energy Refineries',
                condition: () => this.facilities.filter(f => f && f.type === 'refinery').length >= 50
            },
            {
                id: 'refinery_master_100',
                name: 'Hell Refiner',
                description: 'Build 100 Energy Refineries',
                condition: () => this.facilities.filter(f => f && f.type === 'refinery').length >= 100
            },
            {
                id: 'refinery_master_250',
                name: 'Energy Purification Lord',
                description: 'Build 250 Energy Refineries',
                condition: () => this.facilities.filter(f => f && f.type === 'refinery').length >= 250
            },
            {
                id: 'refinery_master_500',
                name: 'Dimensional Processor',
                description: 'Build 500 Energy Refineries',
                condition: () => this.facilities.filter(f => f && f.type === 'refinery').length >= 500
            },
            {
                id: 'soulforge_master_10',
                name: 'Soul Forger',
                description: 'Build 10 Soul Forges',
                condition: () => this.facilities.filter(f => f && f.type === 'soulForge').length >= 10
            },
            {
                id: 'soulforge_master_50',
                name: 'Demon Essence Master',
                description: 'Build 50 Soul Forges',
                condition: () => this.facilities.filter(f => f && f.type === 'soulForge').length >= 50
            },
            {
                id: 'soulforge_master_100',
                name: 'Infernal Blacksmith',
                description: 'Build 100 Soul Forges',
                condition: () => this.facilities.filter(f => f && f.type === 'soulForge').length >= 100
            },
            {
                id: 'soulforge_master_250',
                name: 'Soul Manufacturing Lord',
                description: 'Build 250 Soul Forges',
                condition: () => this.facilities.filter(f => f && f.type === 'soulForge').length >= 250
            },
            {
                id: 'soulforge_master_500',
                name: 'Dimensional Soul Architect',
                description: 'Build 500 Soul Forges',
                condition: () => this.facilities.filter(f => f && f.type === 'soulForge').length >= 500
            },
            {
                id: 'portal_master_10',
                name: 'Portal Opener',
                description: 'Build 10 Hell Portals',
                condition: () => this.facilities.filter(f => f && f.type === 'portal').length >= 10
            },
            {
                id: 'portal_master_50',
                name: 'Dimensional Gateway Expert',
                description: 'Build 50 Hell Portals',
                condition: () => this.facilities.filter(f => f && f.type === 'portal').length >= 50
            },
            {
                id: 'portal_master_100',
                name: 'Hell Rift Master',
                description: 'Build 100 Hell Portals',
                condition: () => this.facilities.filter(f => f && f.type === 'portal').length >= 100
            },
            {
                id: 'portal_master_250',
                name: 'Interdimensional Lord',
                description: 'Build 250 Hell Portals',
                condition: () => this.facilities.filter(f => f && f.type === 'portal').length >= 250
            },
            {
                id: 'portal_master_500',
                name: 'Cosmic Gateway God',
                description: 'Build 500 Hell Portals',
                condition: () => this.facilities.filter(f => f && f.type === 'portal').length >= 500
            },
            {
                id: 'processor_master_10',
                name: 'Processing Specialist',
                description: 'Build 10 Argent Processors',
                condition: () => this.facilities.filter(f => f && f.type === 'processor').length >= 10
            },
            {
                id: 'processor_master_50',
                name: 'Advanced Tech Master',
                description: 'Build 50 Argent Processors',
                condition: () => this.facilities.filter(f => f && f.type === 'processor').length >= 50
            },
            {
                id: 'processor_master_100',
                name: 'Quantum Processing Lord',
                description: 'Build 100 Argent Processors',
                condition: () => this.facilities.filter(f => f && f.type === 'processor').length >= 100
            },
            {
                id: 'processor_master_250',
                name: 'Omnipotent Processor',
                description: 'Build 250 Argent Processors',
                condition: () => this.facilities.filter(f => f && f.type === 'processor').length >= 250
            },
            {
                id: 'processor_master_500',
                name: 'Universal Computing God',
                description: 'Build 500 Argent Processors',
                condition: () => this.facilities.filter(f => f && f.type === 'processor').length >= 500
            },
            {
                id: 'doomCore_master_10',
                name: 'DOOM Core Master',
                description: 'Build 10 DOOM Core Reactors',
                condition: () => this.facilities.filter(f => f && f.type === 'doomCore').length >= 10
            },
            {
                id: 'doomCore_master_50',
                name: 'DOOM Core Overlord',
                description: 'Build 50 DOOM Core Reactors',
                condition: () => this.facilities.filter(f => f && f.type === 'doomCore').length >= 50
            },
            {
                id: 'doomCore_master_100',
                name: 'DOOM Core God',
                description: 'Build 100 DOOM Core Reactors',
                condition: () => this.facilities.filter(f => f && f.type === 'doomCore').length >= 100
            },
            {
                id: 'doomCore_master_250',
                name: 'DOOM Core Supreme',
                description: 'Build 250 DOOM Core Reactors',
                condition: () => this.facilities.filter(f => f && f.type === 'doomCore').length >= 250
            },
            {
                id: 'doomCore_master_500',
                name: 'DOOM Core Deity',
                description: 'Build 500 DOOM Core Reactors',
                condition: () => this.facilities.filter(f => f && f.type === 'doomCore').length >= 500
            },
            {
                id: 'demonHarvester_master_10',
                name: 'Demon Harvester Master',
                description: 'Build 10 Demon Harvesters',
                condition: () => this.facilities.filter(f => f && f.type === 'demonHarvester').length >= 10
            },
            {
                id: 'demonHarvester_master_50',
                name: 'Demon Harvester Overlord',
                description: 'Build 50 Demon Harvesters',
                condition: () => this.facilities.filter(f => f && f.type === 'demonHarvester').length >= 50
            },
            {
                id: 'demonHarvester_master_100',
                name: 'Demon Harvester God',
                description: 'Build 100 Demon Harvesters',
                condition: () => this.facilities.filter(f => f && f.type === 'demonHarvester').length >= 100
            },
            {
                id: 'demonHarvester_master_250',
                name: 'Demon Harvester Supreme',
                description: 'Build 250 Demon Harvesters',
                condition: () => this.facilities.filter(f => f && f.type === 'demonHarvester').length >= 250
            },
            {
                id: 'demonHarvester_master_500',
                name: 'Demon Harvester Deity',
                description: 'Build 500 Demon Harvesters',
                condition: () => this.facilities.filter(f => f && f.type === 'demonHarvester').length >= 500
            },
            {
                id: 'hellGate_master_10',
                name: 'Hell Gate Master',
                description: 'Build 10 Greater Hell Gates',
                condition: () => this.facilities.filter(f => f && f.type === 'hellGate').length >= 10
            },
            {
                id: 'hellGate_master_50',
                name: 'Hell Gate Overlord',
                description: 'Build 50 Greater Hell Gates',
                condition: () => this.facilities.filter(f => f && f.type === 'hellGate').length >= 50
            },
            {
                id: 'hellGate_master_100',
                name: 'Hell Gate God',
                description: 'Build 100 Greater Hell Gates',
                condition: () => this.facilities.filter(f => f && f.type === 'hellGate').length >= 100
            },
            {
                id: 'hellGate_master_250',
                name: 'Hell Gate Supreme',
                description: 'Build 250 Greater Hell Gates',
                condition: () => this.facilities.filter(f => f && f.type === 'hellGate').length >= 250
            },
            {
                id: 'hellGate_master_500',
                name: 'Hell Gate Deity',
                description: 'Build 500 Greater Hell Gates',
                condition: () => this.facilities.filter(f => f && f.type === 'hellGate').length >= 500
            },
            {
                id: 'argentTower_master_10',
                name: 'Argent Tower Master',
                description: 'Build 10 Argent Tower Complexes',
                condition: () => this.facilities.filter(f => f && f.type === 'argentTower').length >= 10
            },
            {
                id: 'argentTower_master_50',
                name: 'Argent Tower Overlord',
                description: 'Build 50 Argent Tower Complexes',
                condition: () => this.facilities.filter(f => f && f.type === 'argentTower').length >= 50
            },
            {
                id: 'argentTower_master_100',
                name: 'Argent Tower God',
                description: 'Build 100 Argent Tower Complexes',
                condition: () => this.facilities.filter(f => f && f.type === 'argentTower').length >= 100
            },
            {
                id: 'argentTower_master_250',
                name: 'Argent Tower Supreme',
                description: 'Build 250 Argent Tower Complexes',
                condition: () => this.facilities.filter(f => f && f.type === 'argentTower').length >= 250
            },
            {
                id: 'argentTower_master_500',
                name: 'Argent Tower Deity',
                description: 'Build 500 Argent Tower Complexes',
                condition: () => this.facilities.filter(f => f && f.type === 'argentTower').length >= 500
            },
            {
                id: 'voidGenerator_master_10',
                name: 'Void Generator Master',
                description: 'Build 10 Void Generators',
                condition: () => this.facilities.filter(f => f && f.type === 'voidGenerator').length >= 10
            },
            {
                id: 'voidGenerator_master_50',
                name: 'Void Generator Overlord',
                description: 'Build 50 Void Generators',
                condition: () => this.facilities.filter(f => f && f.type === 'voidGenerator').length >= 50
            },
            {
                id: 'voidGenerator_master_100',
                name: 'Void Generator God',
                description: 'Build 100 Void Generators',
                condition: () => this.facilities.filter(f => f && f.type === 'voidGenerator').length >= 100
            },
            {
                id: 'voidGenerator_master_250',
                name: 'Void Generator Supreme',
                description: 'Build 250 Void Generators',
                condition: () => this.facilities.filter(f => f && f.type === 'voidGenerator').length >= 250
            },
            {
                id: 'voidGenerator_master_500',
                name: 'Void Generator Deity',
                description: 'Build 500 Void Generators',
                condition: () => this.facilities.filter(f => f && f.type === 'voidGenerator').length >= 500
            },

            // Upgrade Achievements (50 achievements)
            {
                id: 'upgrade_efficiency_master',
                name: 'Efficiency Expert',
                description: 'Max out Energy Efficiency upgrade',
                condition: () => (this.upgrades.efficiency || 0) >= this.upgradeTypes.efficiency.maxLevel
            },
            {
                id: 'upgrade_soulharvest_master',
                name: 'Soul Harvest Master',
                description: 'Max out Soul Harvest upgrade',
                condition: () => (this.upgrades.soulHarvest || 0) >= this.upgradeTypes.soulHarvest.maxLevel
            },
            {
                id: 'upgrade_automation_master',
                name: 'Automation Overlord',
                description: 'Max out Automation Protocol upgrade',
                condition: () => (this.upgrades.automation || 0) >= this.upgradeTypes.automation.maxLevel
            },
            {
                id: 'upgrade_capacity_master',
                name: 'Expansion Emperor',
                description: 'Max out Facility Expansion upgrade',
                condition: () => (this.upgrades.capacity || 0) >= this.upgradeTypes.capacity.maxLevel
            },
            {
                id: 'all_upgrades_master',
                name: 'Ultimate Upgrader',
                description: 'Max out all regular upgrades',
                condition: () => Object.keys(this.upgradeTypes).every(type => 
                    (this.upgrades[type] || 0) >= this.upgradeTypes[type].maxLevel)
            },
            {
                id: 'random_upgrade_collector_10',
                name: 'Hell Discovery Hunter',
                description: 'Purchase 10 random upgrades',
                condition: () => this.randomUpgrades.filter(u => this.upgrades[u.id] > 0).length >= 10
            },
            {
                id: 'random_upgrade_collector_25',
                name: 'Infernal Researcher',
                description: 'Purchase 25 random upgrades',
                condition: () => this.randomUpgrades.filter(u => this.upgrades[u.id] > 0).length >= 25
            },
            {
                id: 'random_upgrade_collector_50',
                name: 'Hell Science Master',
                description: 'Purchase 50 random upgrades',
                condition: () => this.randomUpgrades.filter(u => this.upgrades[u.id] > 0).length >= 50
            },
            {
                id: 'random_upgrade_collector_100',
                name: 'Dimensional Innovation God',
                description: 'Purchase 100 random upgrades',
                condition: () => this.randomUpgrades.filter(u => this.upgrades[u.id] > 0).length >= 100
            },
            {
                id: 'upgrade_spender_1000000',
                name: 'Investment Demon',
                description: 'Spend 1,000,000 Argent Energy on upgrades',
                condition: () => this.getTotalUpgradeSpent() >= 1000000
            },

            // Special Hell-themed Achievements (82 achievements)
            {
                id: 'hell_welcome',
                name: 'Welcome to Hell',
                description: 'Start your journey into the depths of Hell',
                condition: () => true
            },
            {
                id: 'demon_slayer',
                name: 'Demon Slayer',
                description: 'Defeat your first demon (build a Soul Forge)',
                condition: () => this.facilities.some(f => f && f.type === 'soulForge')
            },
            {
                id: 'hell_tourist',
                name: 'Hell Tourist',
                description: 'Open your first portal to Hell',
                condition: () => this.facilities.some(f => f && f.type === 'portal')
            },
            {
                id: 'argent_addict',
                name: 'Argent Addict',
                description: 'Click on facilities 100 times',
                condition: () => this.facilityClicks >= 100
            },
            {
                id: 'hell_workaholic',
                name: 'Hell Workaholic',
                description: 'Click on facilities 1000 times',
                condition: () => this.facilityClicks >= 1000
            },
            {
                id: 'dimension_hopper',
                name: 'Dimension Hopper',
                description: 'Build at least one of each facility type',
                condition: () => Object.keys(this.facilityTypes).every(type => 
                    this.facilities.some(f => f && f.type === type))
            },
            {
                id: 'hell_monopoly',
                name: 'Hell Monopoly',
                description: 'Build 100 facilities of the same type',
                condition: () => Object.keys(this.facilityTypes).some(type => 
                    this.facilities.filter(f => f && f.type === type).length >= 100)
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Build 10 facilities in under 1 minute',
                condition: () => this.rapidBuildCount >= 10
            },
            {
                id: 'hell_patience',
                name: 'Hell Patience',
                description: 'Wait 24 hours for passive production',
                condition: () => this.playTime >= 86400000 // 24 hours in milliseconds
            },
            {
                id: 'demon_lord',
                name: 'Demon Lord',
                description: 'Collect souls from 666 demons',
                condition: () => this.demonsSlain >= 666
            },
            {
                id: 'hell_architect',
                name: 'Hell Architect',
                description: 'Build facilities in a perfect grid pattern',
                condition: () => this.checkGridPattern()
            },
            {
                id: 'argent_hoarder',
                name: 'Argent Hoarder',
                description: 'Save 1,000,000 Argent Energy without spending',
                condition: () => this.maxResourcesHeld.argent >= 1000000
            },
            {
                id: 'soul_hoarder',
                name: 'Soul Hoarder',
                description: 'Save 100,000 Demon Souls without spending',
                condition: () => this.maxResourcesHeld.souls >= 100000
            },
            {
                id: 'hell_veteran',
                name: 'Hell Veteran',
                description: 'Play for 7 days total',
                condition: () => this.playTime >= 604800000 // 7 days in milliseconds
            },
            {
                id: 'midnight_demon',
                name: 'Midnight Demon',
                description: 'Play at midnight (local time)',
                condition: () => new Date().getHours() === 0
            },
            {
                id: 'friday_13th',
                name: 'Friday the 13th',
                description: 'Play on Friday the 13th',
                condition: () => {
                    const date = new Date();
                    return date.getDay() === 5 && date.getDate() === 13;
                }
            },
            {
                id: 'halloween_demon',
                name: 'Halloween Demon',
                description: 'Play on Halloween',
                condition: () => {
                    const date = new Date();
                    return date.getMonth() === 9 && date.getDate() === 31;
                }
            },
            {
                id: 'christmas_in_hell',
                name: 'Christmas in Hell',
                description: 'Play on Christmas Day',
                condition: () => {
                    const date = new Date();
                    return date.getMonth() === 11 && date.getDate() === 25;
                }
            },
            {
                id: 'new_year_demon',
                name: 'New Year Demon',
                description: 'Play on New Year\'s Day',
                condition: () => {
                    const date = new Date();
                    return date.getMonth() === 0 && date.getDate() === 1;
                }
            },
            {
                id: 'hell_minimalist',
                name: 'Hell Minimalist',
                description: 'Reach 1000 Energy/sec with only 10 facilities',
                condition: () => this.production.argent >= 1000 && 
                    this.facilities.filter(f => f !== null).length <= 10
            }
        ];

        // Add remaining achievements to reach 632 total
        for (let i = 50; i <= 632; i++) {
            const achievementTypes = [
                'Argent Milestone',
                'Soul Milestone',
                'Production Milestone',
                'Facility Milestone',
                'Hell Achievement',
                'Demon Achievement',
                'Infernal Achievement',
                'Dimensional Achievement',
                'Cosmic Achievement',
                'Omnipotent Achievement'
            ];
            
            const randomType = achievementTypes[Math.floor(Math.random() * achievementTypes.length)];
            const multiplier = Math.pow(10, Math.floor(i / 50));
            
            this.achievementList.push({
                id: `auto_achievement_${i}`,
                name: `${randomType} ${i}`,
                description: `Achieve ${(i * 1000 * multiplier).toLocaleString()} total progress`,
                condition: () => (this.resources.argent + this.resources.souls) >= (i * 1000 * multiplier)
            });
        }

        // Mobile-specific properties
        this.isMobile = this.detectMobile();
        this.touchStartTime = 0;
        this.longPressTimer = null;
        this.longPressDelay = 500;
        
        this.facilityClicks = 0;
        this.rapidBuildCount = 0;
        this.demonsSlain = 0;
        this.playTime = 0;
        this.maxResourcesHeld = { argent: 0, souls: 0 };
        this.gameStartTime = Date.now();
        this.lastBuildTime = 0;
        this.consecutiveBuilds = 0;
        
        this.initIntroScreen();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }
    
    initIntroScreen() {
        this.createIntroParticles();
        this.setupIntroEvents();
        this.startIntroSequence();
    }
    
    createIntroParticles() {
        const particlesContainer = document.getElementById('intro-particles');
        if (!particlesContainer) return;
        
        // Create 20 floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            
            // Random particle colors
            const colors = ['#ff3333', '#ff8800', '#ff6600', '#cc0000'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    setupIntroEvents() {
        const skipButton = document.getElementById('intro-skip');
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                this.skipIntro();
            });
        }
        
        // Auto-skip after 8 seconds
        setTimeout(() => {
            this.skipIntro();
        }, 8000);
    }
    
    startIntroSequence() {
        const introScreen = document.getElementById('intro-screen');
        const titleScreen = document.getElementById('title-screen');
        
        if (introScreen) {
            introScreen.style.display = 'flex';
        }
        if (titleScreen) {
            titleScreen.style.display = 'none';
        }
        
        // Play intro sound effect if available
        this.playIntroSound();
        
        // Add screen shake effect during lightning
        setTimeout(() => {
            this.addScreenShake();
        }, 4000);
    }
    
    skipIntro() {
        const introScreen = document.getElementById('intro-screen');
        const titleScreen = document.getElementById('title-screen');
        
        if (introScreen) {
            introScreen.classList.add('intro-fade-out');
            setTimeout(() => {
                introScreen.style.display = 'none';
                if (titleScreen) {
                    titleScreen.style.display = 'flex';
                }
            }, 1000);
        }
    }
    
    playIntroSound() {
        // Placeholder for intro sound effect
        // Could play a hellish ambient sound or dramatic music
        if (this.settings.soundEffects) {
            // Implementation would go here
            console.log('Playing intro sound effect...');
        }
    }
    
    addScreenShake() {
        const introContent = document.querySelector('.intro-content');
        if (introContent) {
            introContent.style.animation = 'screenShake 0.5s ease-out';
            setTimeout(() => {
                introContent.style.animation = '';
            }, 500);
        }
    }
    
    initTitleScreen() {
        this.setupTitleScreenEvents();
        this.setupSettingsScreen();
        // Don't show title screen immediately - intro will handle it
    }
    
    setupTitleScreenEvents() {
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.showSaveSlotScreen();
        });
        
        document.getElementById('load-game-btn').addEventListener('click', () => {
            this.showSaveSlotScreen(true);
        });
        
        document.getElementById('back-to-title').addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        // Settings button for browser edition
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsScreen();
            });
        }
    }
    
    setupSettingsScreen() {
        const backFromSettings = document.getElementById('back-to-title-from-settings');
        if (backFromSettings) {
            backFromSettings.addEventListener('click', () => {
                this.showTitleScreen();
            });
        }
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Auto-save interval
        const autoSaveSelect = document.getElementById('auto-save');
        if (autoSaveSelect) {
            autoSaveSelect.addEventListener('change', (e) => {
                this.autoSaveInterval = parseInt(e.target.value) * 1000;
                this.restartAutoSave();
            });
        }
    }
    
    showSettingsScreen() {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'flex';
        document.getElementById('save-slot-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    restartAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        this.autoSaveTimer = setInterval(() => this.saveGame(), this.autoSaveInterval || 10000);
    }
    
    showTitleScreen() {
        document.getElementById('title-screen').style.display = 'flex';
        document.getElementById('save-slot-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
    }
    
    showSaveSlotScreen(isLoading = false) {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('save-slot-screen').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';
        
        this.renderSaveSlots(isLoading);
    }
    
    renderSaveSlots(isLoading = false) {
        const container = document.getElementById('save-slots-container');
        container.innerHTML = '';
        
        for (let i = 1; i <= 3; i++) {
            const saveData = this.getSaveSlotData(i);
            const slot = document.createElement('div');
            slot.className = 'save-slot';
            slot.dataset.slot = i;
            
            if (saveData) {
                slot.innerHTML = `
                    <div class="save-slot-header">
                        <div class="save-slot-name">Save Slot ${i}</div>
                        <div class="save-slot-date">${new Date(saveData.lastPlayed).toLocaleDateString()}</div>
                    </div>
                    <div class="save-slot-stats">
                        <div>Energy: ${this.formatNumber(saveData.resources.argent)}</div>
                        <div>Souls: ${this.formatNumber(saveData.resources.souls)}</div>
                        <div>Facilities: ${saveData.facilities.filter(f => f !== null).length}</div>
                    </div>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = `
                    <div class="save-slot">
                        <div class="save-slot-name">Save Slot ${i}</div>
                        <div class="save-slot-date">Empty</div>
                    </div>
                    <div class="save-slot-stats">
                        <div>Click to ${isLoading ? 'create new game' : 'start new game'}</div>
                    </div>
                `;
            }
            
            slot.addEventListener('click', () => {
                if (isLoading && !saveData) {
                    return; // Can't load empty slot
                }
                this.selectSaveSlot(i);
            });
            
            container.appendChild(slot);
        }
    }
    
    selectSaveSlot(slotNumber) {
        this.currentSaveSlot = slotNumber;
        this.loadGame();
        this.startGame();
    }
    
    getSaveSlotData(slotNumber) {
        const saveKey = `argentEnergyTycoon_slot_${slotNumber}`;
        const savedData = localStorage.getItem(saveKey);
        return savedData ? JSON.parse(savedData) : null;
    }
    
    startGame() {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('save-slot-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupInfiniteScroll();
        this.setupAscensionSystem();
        this.setupBrowserFeatures();
        this.setupKeyboardShortcuts();
        this.renderFacilityGrid();
        this.renderShop();
        this.renderUpgrades();
        this.renderAchievements();
        this.renderRecentAchievements();
        this.renderAscensionSystem();
        this.startGameLoop();
        this.startSessionTimer();
    }
    
    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Add tab button navigation for browser version
        const tabButtons = document.querySelectorAll('.tab-button');
        
        const switchTab = (targetTab) => {
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tabButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to target
            document.getElementById(targetTab).classList.add('active');
            
            // Find and activate the corresponding button
            const activeButton = [...tabButtons].find(b => b.dataset.tab === targetTab);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        };
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
                
                // Mobile haptic feedback
                if (this.isMobile && navigator.vibrate) {
                    navigator.vibrate(20);
                }
            });
        });
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                switchTab(button.dataset.tab);
            });
        });
    }
    
    setupInfiniteScroll() {
        const facilityTab = document.getElementById('facilities-tab');
        
        facilityTab.addEventListener('scroll', () => {
            const scrollTop = facilityTab.scrollTop;
            const scrollHeight = facilityTab.scrollHeight;
            const clientHeight = facilityTab.clientHeight;
            
            // Check if user is near the bottom (within 100px)
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                this.expandFacilitySlots();
            }
        });
    }
    
    expandFacilitySlots() {
        const currentSlots = this.facilities.length;
        const newSlots = currentSlots + this.slotsPerExpansion;
        
        // Extend the facilities array with null values
        for (let i = currentSlots; i < newSlots; i++) {
            this.facilities.push(null);
        }
        
        this.renderFacilityGrid();
    }
    
    setupEventListeners() {
        // Facility grid handling with touch support
        const facilityGrid = document.getElementById('facility-grid');
        
        if (this.isMobile) {
            facilityGrid.addEventListener('touchstart', (e) => {
                const slot = e.target.closest('.facility-slot');
                if (slot) {
                    this.touchStartTime = Date.now();
                    const slotIndex = parseInt(slot.dataset.index);
                    
                    // Long press for upgrade (mobile only)
                    this.longPressTimer = setTimeout(() => {
                        this.handleLongPress(slotIndex);
                        navigator.vibrate && navigator.vibrate(50);
                    }, this.longPressDelay);
                }
            });
            
            facilityGrid.addEventListener('touchend', (e) => {
                const slot = e.target.closest('.facility-slot');
                if (slot) {
                    const touchDuration = Date.now() - this.touchStartTime;
                    if (this.longPressTimer) {
                        clearTimeout(this.longPressTimer);
                        this.longPressTimer = null;
                    }
                    
                    if (touchDuration < this.longPressDelay) {
                        const slotIndex = parseInt(slot.dataset.index);
                        this.handleFacilityClick(slotIndex, e.changedTouches[0]);
                    }
                }
            });
            
            facilityGrid.addEventListener('touchmove', () => {
                if (this.longPressTimer) {
                    clearTimeout(this.longPressTimer);
                    this.longPressTimer = null;
                }
            });
        } else {
            facilityGrid.addEventListener('click', (e) => {
                const slot = e.target.closest('.facility-slot');
                if (slot) {
                    const slotIndex = parseInt(slot.dataset.index);
                    this.handleFacilityClick(slotIndex, e);
                }
            });
        }
        
        // Shop and upgrade items with touch support
        const shopItems = document.getElementById('shop-items');
        const upgradesList = document.getElementById('upgrades-list');
        
        this.setupTouchableItems(shopItems, (item) => {
            const facilityType = item.dataset.type;
            this.tryBuyFacility(facilityType);
        });
        
        this.setupTouchableItems(upgradesList, (item) => {
            const upgradeType = item.dataset.type;
            this.tryBuyUpgrade(upgradeType);
        });
        
        // Auto-save
        this.restartAutoSave();
        
        // Prevent zoom on double tap
        if (this.isMobile) {
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }
    
    setupTouchableItems(container, callback) {
        if (this.isMobile) {
            container.addEventListener('touchstart', (e) => {
                const item = e.target.closest('.shop-item, .upgrade-item');
                if (item && !item.classList.contains('disabled')) {
                    item.style.transform = 'scale(0.95)';
                }
            });
            
            container.addEventListener('touchend', (e) => {
                const item = e.target.closest('.shop-item, .upgrade-item');
                if (item && !item.classList.contains('disabled')) {
                    item.style.transform = '';
                    
                    // Check if it's a random upgrade
                    if (item.classList.contains('random-upgrade')) {
                        this.tryBuyRandomUpgrade(item.dataset.type);
                    } else {
                        callback(item);
                    }
                    navigator.vibrate && navigator.vibrate(30);
                }
            });
            
            container.addEventListener('touchcancel', (e) => {
                const item = e.target.closest('.shop-item, .upgrade-item');
                if (item) {
                    item.style.transform = '';
                }
            });
        } else {
            container.addEventListener('click', (e) => {
                const item = e.target.closest('.shop-item, .upgrade-item');
                if (item && !item.classList.contains('disabled')) {
                    // Check if it's a random upgrade
                    if (item.classList.contains('random-upgrade')) {
                        this.tryBuyRandomUpgrade(item.dataset.type);
                    } else {
                        callback(item);
                    }
                }
            });
        }
    }
    
    handleFacilityClick(slotIndex, event) {
        const facility = this.facilities[slotIndex];
        if (facility) {
            // Manual production boost
            const bonus = this.calculateProduction(facility.type);
            this.resources.argent += bonus.argent;
            this.resources.souls += bonus.souls;
            
            // Track facility clicks
            this.facilityClicks = (this.facilityClicks || 0) + 1;
            
            // Track max resources held
            this.maxResourcesHeld.argent = Math.max(this.maxResourcesHeld.argent || 0, this.resources.argent);
            this.maxResourcesHeld.souls = Math.max(this.maxResourcesHeld.souls || 0, this.resources.souls);
            
            // Track demons slain (for soul-producing facilities)
            if (facility.type === 'soulForge' || facility.type === 'portal') {
                this.demonsSlain = (this.demonsSlain || 0) + 1;
            }
            
            const x = event.clientX || event.pageX;
            const y = event.clientY || event.pageY;
            
            this.showClickEffect('+' + Math.floor(bonus.argent) + ' Energy', x, y);
            this.updateDisplay();
            
            // Mobile haptic feedback
            if (this.isMobile && navigator.vibrate) {
                navigator.vibrate(20);
            }
        }
    }
    
    handleLongPress(slotIndex) {
        const facility = this.facilities[slotIndex];
        if (facility) {
            // Show facility details on long press
            const facilityData = this.facilityTypes[facility.type];
            const production = this.calculateProduction(facility.type);
            
            this.showClickEffect(
                `${facilityData.name}\n+${production.argent.toFixed(1)} Energy/s\n+${production.souls.toFixed(1)} Souls/s`,
                window.innerWidth / 2,
                window.innerHeight / 2
            );
        }
    }
    
    tryBuyFacility(facilityType) {
        const facilityData = this.facilityTypes[facilityType];
        if (!facilityData) return;
        
        // Apply cost reduction from ascension
        const costReduction = this.ascension.permanentBonuses.costReduction / 100;
        const adjustedCost = {
            argent: Math.floor(facilityData.cost.argent * (1 - costReduction)),
            souls: Math.floor(facilityData.cost.souls * (1 - costReduction))
        };
        
        // Check if we can afford it
        if (this.resources.argent >= adjustedCost.argent && 
            this.resources.souls >= adjustedCost.souls) {
            
            // Find empty slot
            const emptySlot = this.facilities.findIndex(f => f === null);
            if (emptySlot !== -1) {
                this.resources.argent -= adjustedCost.argent;
                this.resources.souls -= adjustedCost.souls;
                
                this.facilities[emptySlot] = {
                    type: facilityType,
                    level: 1,
                    lastProduced: Date.now()
                };
                
                // Track facilities built for ascension
                this.ascension.totalFacilitiesBuilt = Math.max(this.ascension.totalFacilitiesBuilt, this.facilities.filter(f => f !== null).length);
                
                // Track rapid building
                const now = Date.now();
                if (now - this.lastBuildTime < 6000) { // 6 seconds
                    this.consecutiveBuilds++;
                    if (this.consecutiveBuilds >= 10) {
                        this.rapidBuildCount = Math.max(this.rapidBuildCount || 0, this.consecutiveBuilds);
                    }
                } else {
                    this.consecutiveBuilds = 1;
                }
                this.lastBuildTime = now;
                
                this.updateProduction();
                this.updateDisplay();
                this.renderFacilityGrid();
                this.checkAchievements();
                
                // Scale costs
                facilityData.cost.argent = Math.floor(facilityData.cost.argent * 1.5);
                facilityData.cost.souls = Math.floor(facilityData.cost.souls * 1.5);
                this.renderShop();
            } else {
                // No empty slots, expand the grid
                this.expandFacilitySlots();
                // Try again after expansion
                setTimeout(() => this.tryBuyFacility(facilityType), 100);
            }
        }
    }
    
    tryBuyUpgrade(upgradeType) {
        const upgradeData = this.upgradeTypes[upgradeType];
        if (!upgradeData) return false;
        
        const currentLevel = this.upgrades[upgradeType] || 0;
        if (currentLevel >= upgradeData.maxLevel) return false;
        
        const cost = {
            argent: upgradeData.cost.argent * Math.pow(2, currentLevel),
            souls: upgradeData.cost.souls * Math.pow(2, currentLevel)
        };
        
        if (this.resources.argent >= cost.argent && this.resources.souls >= cost.souls) {
            this.resources.argent -= cost.argent;
            this.resources.souls -= cost.souls;
            
            this.upgrades[upgradeType] = currentLevel + 1;
            
            this.updateProduction();
            this.updateDisplay();
            this.renderUpgrades();
            return true;
        }
        return false;
    }
    
    generateRandomUpgrade() {
        const prefix = this.upgradeNameParts.prefixes[Math.floor(Math.random() * this.upgradeNameParts.prefixes.length)];
        const subject = this.upgradeNameParts.subjects[Math.floor(Math.random() * this.upgradeNameParts.subjects.length)];
        const effect = this.upgradeNameParts.effects[Math.floor(Math.random() * this.upgradeNameParts.effects.length)];
        
        const name = `${prefix} ${subject} ${effect}`;
        const upgradeId = `random_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Generate random effects
        const effectTypes = ['argentBoost', 'soulBoost', 'speedBoost', 'efficiency'];
        const effectType = effectTypes[Math.floor(Math.random() * effectTypes.length)];
        
        let description, multiplier, baseCost;
        
        switch (effectType) {
            case 'argentBoost':
                multiplier = 1.5 + Math.random() * 1.5; // 1.5x to 3x
                description = `Increases Argent Energy production by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(500 + Math.random() * 1500), souls: Math.floor(50 + Math.random() * 150) };
                break;
            case 'soulBoost':
                multiplier = 1.3 + Math.random() * 1.2; // 1.3x to 2.5x
                description = `Increases Demon Soul collection by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(300 + Math.random() * 1200), souls: Math.floor(30 + Math.random() * 120) };
                break;
            case 'speedBoost':
                multiplier = 1.2 + Math.random() * 0.8; // 1.2x to 2x
                description = `Increases all production speed by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(800 + Math.random() * 2000), souls: Math.floor(80 + Math.random() * 200) };
                break;
            case 'efficiency':
                multiplier = 1.1 + Math.random() * 0.6; // 1.1x to 1.7x
                description = `Reduces all facility costs by ${Math.floor((1 - (1/multiplier)) * 100)}%`;
                baseCost = { argent: Math.floor(600 + Math.random() * 1800), souls: Math.floor(60 + Math.random() * 180) };
                break;
        }
        
        const randomUpgrade = {
            id: upgradeId,
            name: name,
            description: description,
            effectType: effectType,
            multiplier: multiplier,
            cost: baseCost,
            maxLevel: 3 + Math.floor(Math.random() * 5), // 3-7 levels
            timeGenerated: Date.now(),
            expiresIn: 7200000 // 2 hours
        };
        
        this.randomUpgrades.push(randomUpgrade);
        
        // Keep only the last 5 random upgrades
        if (this.randomUpgrades.length > 5) {
            this.randomUpgrades.shift();
        }
        
        this.showClickEffect(`New Upgrade Available: ${name}!`, window.innerWidth / 2, 150);
        
        return randomUpgrade;
    }
    
    checkRandomUpgradeGeneration() {
        const now = Date.now();
        if (now - this.lastRandomUpgradeTime >= this.randomUpgradeInterval) {
            this.generateRandomUpgrade();
            this.lastRandomUpgradeTime = now;
        }
        
        // Remove expired upgrades
        this.randomUpgrades = this.randomUpgrades.filter(upgrade => {
            return (now - upgrade.timeGenerated) < upgrade.expiresIn;
        });
    }
    
    tryBuyRandomUpgrade(upgradeId) {
        const upgrade = this.randomUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        
        const currentLevel = this.upgrades[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) return;
        
        const cost = {
            argent: upgrade.cost.argent * Math.pow(1.8, currentLevel),
            souls: upgrade.cost.souls * Math.pow(1.8, currentLevel)
        };
        
        if (this.resources.argent >= cost.argent && this.resources.souls >= cost.souls) {
            this.resources.argent -= cost.argent;
            this.resources.souls -= cost.souls;
            
            this.upgrades[upgradeId] = currentLevel + 1;
            
            this.updateProduction();
            this.updateDisplay();
            this.renderUpgrades();
        }
    }
    
    calculateProduction(facilityType) {
        const baseProduction = this.facilityTypes[facilityType].production;
        
        let argentMult = this.ascension.permanentBonuses.productionMultiplier;
        let soulsMult = this.ascension.permanentBonuses.productionMultiplier;
        let speedMult = 1;
        
        // Apply upgrades
        if (this.upgrades.efficiency) {
            argentMult *= Math.pow(1.25, this.upgrades.efficiency);
        }
        if (this.upgrades.soulHarvest) {
            soulsMult *= Math.pow(1.5, this.upgrades.soulHarvest);
        }
        if (this.upgrades.automation) {
            speedMult *= Math.pow(2, this.upgrades.automation);
        }
        
        // Apply random upgrades
        this.randomUpgrades.forEach(upgrade => {
            const level = this.upgrades[upgrade.id] || 0;
            if (level > 0) {
                const totalMultiplier = Math.pow(upgrade.multiplier, level);
                switch (upgrade.effectType) {
                    case 'argentBoost':
                        argentMult *= totalMultiplier;
                        break;
                    case 'soulBoost':
                        soulsMult *= totalMultiplier;
                        break;
                    case 'speedBoost':
                        speedMult *= totalMultiplier;
                        break;
                    case 'efficiency':
                        // Efficiency affects cost reduction, not production
                        break;
                }
            }
        });
        
        return {
            argent: baseProduction.argent * argentMult * speedMult,
            souls: baseProduction.souls * soulsMult * speedMult
        };
    }
    
    updateProduction() {
        this.production.argent = 0;
        this.production.souls = 0;
        
        this.facilities.forEach(facility => {
            if (facility) {
                const prod = this.calculateProduction(facility.type);
                this.production.argent += prod.argent;
                this.production.souls += prod.souls;
            }
        });
    }
    
    renderFacilityGrid() {
        const grid = document.getElementById('facility-grid');
        grid.innerHTML = '';
        
        // Initialize facilities array if needed
        if (this.facilities.length === 0) {
            this.facilities = new Array(this.initialFacilitySlots).fill(null);
        }
        
        for (let i = 0; i < this.facilities.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'facility-slot';
            slot.dataset.index = i;
            
            const facility = this.facilities[i];
            if (facility) {
                slot.classList.add('occupied');
                const facilityData = this.facilityTypes[facility.type];
                
                slot.innerHTML = `
                    <img src="${facilityData.icon}" alt="${facilityData.name}" class="facility-icon">
                    <div class="facility-info">
                        <div>${facilityData.name}</div>
                        <div>Lv.${facility.level}</div>
                    </div>
                `;
            } else {
                slot.innerHTML = '<div style="color: #666; font-size: 0.8rem;">Empty Slot</div>';
            }
            
            grid.appendChild(slot);
        }
    }
    
    renderShop() {
        const shopItems = document.getElementById('shop-items');
        shopItems.innerHTML = '';
        
        Object.entries(this.facilityTypes).forEach(([type, data]) => {
            const item = document.createElement('div');
            item.className = 'shop-item';
            item.dataset.type = type;
            
            const canAfford = this.resources.argent >= data.cost.argent && 
                             this.resources.souls >= data.cost.souls;
            
            if (!canAfford) {
                item.classList.add('disabled');
            }
            
            const production = this.calculateProduction(type);
            
            item.innerHTML = `
                <div class="item-name">${data.name}</div>
                <div class="item-description">${data.description}</div>
                <div class="item-production">
                    ${production.argent > 0 ? `+${production.argent.toFixed(1)} Energy/sec` : ''}
                    ${production.souls > 0 ? `+${production.souls.toFixed(1)} Souls/sec` : ''}
                </div>
                <div class="item-cost">
                    ${data.cost.argent > 0 ? `${data.cost.argent} Energy` : ''}
                    ${data.cost.souls > 0 ? ` ${data.cost.souls} Souls` : ''}
                </div>
            `;
            
            shopItems.appendChild(item);
        });
    }
    
    renderUpgrades() {
        const upgradesList = document.getElementById('upgrades-list');
        upgradesList.innerHTML = '';
        
        // Regular upgrades
        Object.entries(this.upgradeTypes).forEach(([type, data]) => {
            const currentLevel = this.upgrades[type] || 0;
            if (currentLevel >= data.maxLevel) return;
            
            const item = document.createElement('div');
            item.className = 'upgrade-item';
            item.dataset.type = type;
            
            const cost = {
                argent: data.cost.argent * Math.pow(2, currentLevel),
                souls: data.cost.souls * Math.pow(2, currentLevel)
            };
            
            const canAfford = this.resources.argent >= cost.argent && 
                             this.resources.souls >= cost.souls;
            
            if (!canAfford) {
                item.classList.add('disabled');
            }
            
            item.innerHTML = `
                <div class="item-name">${data.name} (${currentLevel}/${data.maxLevel})</div>
                <div class="item-description">${data.description}</div>
                <div class="item-cost">
                    ${cost.argent} Energy ${cost.souls} Souls
                </div>
            `;
            
            upgradesList.appendChild(item);
        });
        
        // Random upgrades section
        if (this.randomUpgrades.length > 0) {
            const separator = document.createElement('div');
            separator.innerHTML = '<h4 style="color: var(--accent-red); text-align: center; margin: 1rem 0; font-size: 0.9rem; letter-spacing: 1px;">HELLISH DISCOVERIES</h4>';
            upgradesList.appendChild(separator);
            
            this.randomUpgrades.forEach(upgrade => {
                const currentLevel = this.upgrades[upgrade.id] || 0;
                if (currentLevel >= upgrade.maxLevel) return;
                
                const item = document.createElement('div');
                item.className = 'upgrade-item random-upgrade';
                item.dataset.type = upgrade.id;
                
                const cost = {
                    argent: upgrade.cost.argent * Math.pow(1.8, currentLevel),
                    souls: upgrade.cost.souls * Math.pow(1.8, currentLevel)
                };
                
                const canAfford = this.resources.argent >= cost.argent && 
                                 this.resources.souls >= cost.souls;
                
                if (!canAfford) {
                    item.classList.add('disabled');
                }
                
                const timeLeft = upgrade.expiresIn - (Date.now() - upgrade.timeGenerated);
                const hoursLeft = Math.floor(timeLeft / 3600000);
                const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);
                
                item.innerHTML = `
                    <div class="item-name" style="color: var(--accent-red);">${upgrade.name} (${currentLevel}/${upgrade.maxLevel})</div>
                    <div class="item-description">${upgrade.description}</div>
                    <div class="item-cost">
                        ${Math.floor(cost.argent)} Energy ${Math.floor(cost.souls)} Souls
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.6rem; margin-top: 0.25rem;">
                        Expires in: ${hoursLeft}h ${minutesLeft}m
                    </div>
                `;
                
                upgradesList.appendChild(item);
            });
        }
        
        // Next upgrade timer
        const nextUpgradeTime = this.randomUpgradeInterval - (Date.now() - this.lastRandomUpgradeTime);
        if (nextUpgradeTime > 0) {
            const hoursLeft = Math.floor(nextUpgradeTime / 3600000);
            const minutesLeft = Math.floor((nextUpgradeTime % 3600000) / 60000);
            
            const timerDiv = document.createElement('div');
            timerDiv.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 1rem; padding: 0.5rem; border: 1px dashed var(--border-color); border-radius: 4px;">
                    Next Hell Discovery in: ${hoursLeft}h ${minutesLeft}m
                </div>
            `;
            upgradesList.appendChild(timerDiv);
        }
    }
    
    renderAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        
        let filteredAchievements = this.achievementList;
        
        if (this.currentAchievementFilter === 'completed') {
            filteredAchievements = this.achievementList.filter(achievement => 
                this.achievements.includes(achievement.id));
        } else if (this.currentAchievementFilter === 'incomplete') {
            filteredAchievements = this.achievementList.filter(achievement => 
                !this.achievements.includes(achievement.id));
        }
        
        filteredAchievements.forEach(achievement => {
            const item = document.createElement('div');
            item.className = 'achievement';
            
            const completed = this.achievements.includes(achievement.id);
            if (completed) {
                item.classList.add('completed');
            }
            
            item.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${completed ? '<div style="color: #ff8800; font-size: 0.7rem;">COMPLETED</div>' : ''}
            `;
            
            achievementsList.appendChild(item);
        });
    }
    
    renderRecentAchievements() {
        const recentList = document.getElementById('recent-achievements-list');
        if (!recentList) return;
        
        recentList.innerHTML = '';
        
        if (this.recentAchievements.length === 0) {
            recentList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem;">No recent achievements</div>';
            return;
        }
        
        this.recentAchievements.forEach(achievement => {
            const item = document.createElement('div');
            item.className = 'achievement completed';
            
            item.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div style="color: #ff8800; font-size: 0.7rem;">COMPLETED</div>
            `;
            
            recentList.appendChild(item);
        });
    }
    
    checkAchievements() {
        this.achievementList.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition()) {
                this.achievements.push(achievement.id);
                this.recentAchievements.unshift(achievement);
                
                // Keep only last 3 recent achievements
                if (this.recentAchievements.length > 3) {
                    this.recentAchievements.pop();
                }
                
                this.showClickEffect(`Achievement Unlocked: ${achievement.name}!`, 
                                   window.innerWidth / 2, 100);
                
                this.renderAchievements();
                this.renderRecentAchievements();
            }
        });
    }
    
    showClickEffect(text, x, y) {
        if (!this.settings.clickEffects) return;
        
        const effect = document.getElementById('click-effect');
        effect.innerHTML = text.replace(/\n/g, '<br>');
        effect.style.left = Math.min(x, window.innerWidth - 100) + 'px';
        effect.style.top = Math.max(y - 20, 20) + 'px';
        effect.style.opacity = '1';
        effect.style.animation = 'none';
        
        setTimeout(() => {
            effect.style.animation = 'clickEffect 1s ease-out forwards';
        }, 10);
    }
    
    updateDisplay() {
        document.getElementById('argent-amount').textContent = 
            this.formatNumber(this.resources.argent);
        document.getElementById('souls-amount').textContent = 
            this.formatNumber(this.resources.souls);
        document.getElementById('energy-rate').textContent = 
            this.formatNumber(this.production.argent);
        document.getElementById('souls-rate').textContent = 
            this.formatNumber(this.production.souls);
        document.getElementById('total-facilities').textContent = 
            this.facilities.filter(f => f !== null).length;
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    }
    
    setupBrowserFeatures() {
        // Header buttons
        const saveButton = document.getElementById('save-button');
        const menuButton = document.getElementById('menu-button');
        
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveGame();
                this.showNotification('Game saved successfully!');
            });
        }
        
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.showTitleScreen();
            });
        }
        
        // Quick action buttons
        const collectAllBtn = document.getElementById('collect-all');
        const autoBuildBtn = document.getElementById('auto-build');
        const massUpgradeBtn = document.getElementById('mass-upgrade');
        
        if (collectAllBtn) {
            collectAllBtn.addEventListener('click', () => {
                this.collectAllFacilities();
            });
        }
        
        if (autoBuildBtn) {
            autoBuildBtn.addEventListener('click', () => {
                this.autoBuildFacilities();
            });
        }
        
        if (massUpgradeBtn) {
            massUpgradeBtn.addEventListener('click', () => {
                this.massUpgradeFacilities();
            });
        }
        
        // Achievement filters
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setAchievementFilter(button.dataset.filter);
            });
        });
        
        // Settings functionality
        const clickEffectsToggle = document.getElementById('click-effects');
        const soundEffectsToggle = document.getElementById('sound-effects');
        
        if (clickEffectsToggle) {
            clickEffectsToggle.addEventListener('change', (e) => {
                this.settings.clickEffects = e.target.checked;
                this.saveSettings();
            });
        }
        
        if (soundEffectsToggle) {
            soundEffectsToggle.addEventListener('change', (e) => {
                this.settings.soundEffects = e.target.checked;
                this.saveSettings();
            });
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent shortcuts when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 'f':
                    this.switchToTab('facilities-tab');
                    break;
                case 's':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.saveGame();
                        this.showNotification('Game saved!');
                    } else {
                        this.switchToTab('shop-tab');
                    }
                    break;
                case 'u':
                    this.switchToTab('upgrades-tab');
                    break;
                case 'a':
                    this.switchToTab('achievements-tab');
                    break;
                case ' ':
                    e.preventDefault();
                    this.collectAllFacilities();
                    break;
                case 'escape':
                    this.showTitleScreen();
                    break;
            }
        });
    }
    
    switchToTab(tabId) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.tab === tabId) {
                button.classList.add('active');
            }
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    }
    
    collectAllFacilities() {
        let totalArgent = 0;
        let totalSouls = 0;
        
        this.facilities.forEach(facility => {
            if (facility) {
                const production = this.calculateProduction(facility.type);
                totalArgent += production.argent * 5; // 5 seconds worth
                totalSouls += production.souls * 5;
            }
        });
        
        this.resources.argent += totalArgent;
        this.resources.souls += totalSouls;
        
        if (totalArgent > 0 || totalSouls > 0) {
            this.showClickEffect(
                `Collected: +${Math.floor(totalArgent)} Energy, +${Math.floor(totalSouls)} Souls`,
                window.innerWidth / 2,
                window.innerHeight / 2
            );
        }
        
        this.updateDisplay();
    }
    
    autoBuildFacilities() {
        const facilityTypes = Object.keys(this.facilityTypes);
        let built = 0;
        
        for (let i = 0; i < 5; i++) { // Try to build 5 facilities
            const randomType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
            const facilityData = this.facilityTypes[randomType];
            
            if (this.resources.argent >= facilityData.cost.argent && 
                this.resources.souls >= facilityData.cost.souls) {
                
                const emptySlot = this.facilities.findIndex(f => f === null);
                if (emptySlot !== -1) {
                    this.resources.argent -= facilityData.cost.argent;
                    this.resources.souls -= facilityData.cost.souls;
                    
                    this.facilities[emptySlot] = {
                        type: randomType,
                        level: 1,
                        lastProduced: Date.now()
                    };
                    
                    built++;
                    
                    // Scale costs
                    facilityData.cost.argent = Math.floor(facilityData.cost.argent * 1.5);
                    facilityData.cost.souls = Math.floor(facilityData.cost.souls * 1.5);
                } else {
                    this.expandFacilitySlots();
                }
            }
        }
        
        if (built > 0) {
            this.showClickEffect(`Auto-built ${built} facilities!`, window.innerWidth / 2, 200);
            this.updateProduction();
            this.updateDisplay();
            this.renderFacilityGrid();
            this.renderShop();
        }
    }
    
    massUpgradeFacilities() {
        let upgraded = 0;
        
        Object.keys(this.upgradeTypes).forEach(upgradeType => {
            if (this.tryBuyUpgrade(upgradeType)) {
                upgraded++;
            }
        });
        
        if (upgraded > 0) {
            this.showClickEffect(`Mass upgraded ${upgraded} systems!`, window.innerWidth / 2, 150);
        }
    }
    
    setAchievementFilter(filter) {
        this.currentAchievementFilter = filter;
        
        // Update filter button states
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.filter === filter) {
                button.classList.add('active');
            }
        });
        
        this.renderAchievements();
    }
    
    saveSettings() {
        localStorage.setItem('argentEnergyTycoonSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('argentEnergyTycoonSettings');
        if (saved) {
            this.settings = Object.assign(this.settings, JSON.parse(saved));
        }
    }
    
    showNotification(message) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    saveGame() {
        if (!this.currentSaveSlot) return;
        
        const saveData = {
            resources: this.resources,
            facilities: this.facilities,
            upgrades: this.upgrades,
            achievements: this.achievements,
            recentAchievements: this.recentAchievements,
            facilityTypes: this.facilityTypes,
            randomUpgrades: this.randomUpgrades,
            lastRandomUpgradeTime: this.lastRandomUpgradeTime,
            facilityClicks: this.facilityClicks,
            rapidBuildCount: this.rapidBuildCount,
            demonsSlain: this.demonsSlain,
            playTime: this.playTime,
            maxResourcesHeld: this.maxResourcesHeld,
            gameStartTime: this.gameStartTime,
            lastBuildTime: this.lastBuildTime,
            consecutiveBuilds: this.consecutiveBuilds,
            ascension: this.ascension,
            lastPlayed: Date.now()
        };
        
        const saveKey = `argentEnergyTycoon_slot_${this.currentSaveSlot}`;
        localStorage.setItem(saveKey, JSON.stringify(saveData));
    }
    
    loadGame() {
        if (!this.currentSaveSlot) return;
        
        const saveKey = `argentEnergyTycoon_slot_${this.currentSaveSlot}`;
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            this.resources = data.resources || this.resources;
            this.facilities = data.facilities || this.facilities;
            this.upgrades = data.upgrades || this.upgrades;
            this.achievements = data.achievements || this.achievements;
            this.recentAchievements = data.recentAchievements || this.recentAchievements;
            this.randomUpgrades = data.randomUpgrades || this.randomUpgrades;
            this.lastRandomUpgradeTime = data.lastRandomUpgradeTime || Date.now();
            this.ascension = data.ascension || this.ascension;
            
            // Load tracking variables
            this.facilityClicks = data.facilityClicks || 0;
            this.rapidBuildCount = data.rapidBuildCount || 0;
            this.demonsSlain = data.demonsSlain || 0;
            this.playTime = data.playTime || 0;
            this.maxResourcesHeld = data.maxResourcesHeld || { argent: 0, souls: 0 };
            this.gameStartTime = data.gameStartTime || Date.now();
            this.lastBuildTime = data.lastBuildTime || 0;
            this.consecutiveBuilds = data.consecutiveBuilds || 0;
            
            // Merge facility types to handle updates
            if (data.facilityTypes) {
                Object.assign(this.facilityTypes, data.facilityTypes);
            }
            
            // Clean up expired random upgrades on load
            this.checkRandomUpgradeGeneration();
            
            this.updateProduction();
        }
    }
    
    checkGridPattern() {
        // Simple grid pattern check - facilities should be placed in order
        const occupiedSlots = this.facilities.map((f, i) => f !== null ? i : -1).filter(i => i !== -1);
        if (occupiedSlots.length < 9) return false;
        
        // Check if first 9 facilities form a 3x3 grid
        const expectedPattern = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        return expectedPattern.every(i => occupiedSlots.includes(i));
    }
    
    getTotalUpgradeSpent() {
        let totalSpent = 0;
        
        // Calculate spending on regular upgrades
        Object.entries(this.upgradeTypes).forEach(([type, data]) => {
            const currentLevel = this.upgrades[type] || 0;
            for (let level = 0; level < currentLevel; level++) {
                totalSpent += data.cost.argent * Math.pow(2, level);
            }
        });
        
        // Calculate spending on random upgrades
        this.randomUpgrades.forEach(upgrade => {
            const currentLevel = this.upgrades[upgrade.id] || 0;
            for (let level = 0; level < currentLevel; level++) {
                totalSpent += upgrade.cost.argent * Math.pow(1.8, level);
            }
        });
        
        return totalSpent;
    }
}

// Add screen shake animation to the existing keyframes
const screenShakeCSS = `
@keyframes screenShake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-5px); }
    20% { transform: translateX(5px); }
    30% { transform: translateX(-3px); }
    40% { transform: translateX(3px); }
    50% { transform: translateX(-2px); }
    60% { transform: translateX(2px); }
    70% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
    90% { transform: translateX(-1px); }
}
`;

// Inject the screen shake CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = screenShakeCSS;
document.head.appendChild(styleSheet);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArgentEnergyTycoon();
});