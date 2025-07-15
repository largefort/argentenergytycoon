class ArgentEnergyTycoonBrowser {
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
        this.initialFacilitySlots = 30;
        this.slotsPerExpansion = 15;
        this.upgrades = {};
        this.achievements = [];
        this.recentAchievements = [];
        
        // Browser-specific features
        this.totalClicks = 0;
        this.efficiencyRate = 100;
        
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
                description: "Increases maximum facility slots by 10 per level",
                cost: { argent: 1000, souls: 200 },
                maxLevel: 10
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
                id: 'first_ascension',
                name: 'First Ascension',
                description: 'Ascend to your first rank in Hell',
                condition: () => this.ascension.ascensionCount >= 1
            },
            {
                id: 'demon_lord_rank',
                name: 'Demon Lord',
                description: 'Reach the rank of Demon Lord',
                condition: () => this.ascension.currentRank >= 3
            },
            {
                id: 'hell_emperor_rank',
                name: 'Hell Emperor',
                description: 'Reach the rank of Hell Emperor',
                condition: () => this.ascension.currentRank >= 8
            },
            {
                id: 'satans_right_hand',
                name: 'Satan\'s Right Hand',
                description: 'Reach the ultimate rank in Hell',
                condition: () => this.ascension.currentRank >= 9
            }
        ];

        // Add more achievements to reach a substantial number
        for (let i = 21; i <= 632; i++) {
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
        
        // Browser-specific tracking
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
    
    initIntroScreen() {
        this.createIntroParticles();
        this.setupIntroEvents();
        this.startIntroSequence();
    }
    
    createIntroParticles() {
        const particlesContainer = document.getElementById('intro-particles');
        if (!particlesContainer) return;
        
        // Create 30 floating particles for desktop
        for (let i = 0; i < 30; i++) {
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
                this.initTitleScreen();
            }, 1000);
        } else {
            if (titleScreen) {
                titleScreen.style.display = 'flex';
            }
            this.initTitleScreen();
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
    }
    
    setupTitleScreenEvents() {
        const newGameBtn = document.getElementById('new-game-btn');
        const loadGameBtn = document.getElementById('load-game-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const backToTitleBtn = document.getElementById('back-to-title');
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.showSaveSlotScreen();
            });
        }
        
        if (loadGameBtn) {
            loadGameBtn.addEventListener('click', () => {
                this.showSaveSlotScreen(true);
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsScreen();
            });
        }
        
        if (backToTitleBtn) {
            backToTitleBtn.addEventListener('click', () => {
                this.showTitleScreen();
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
        
        // Settings checkboxes
        const clickEffectsToggle = document.getElementById('click-effects');
        const soundEffectsToggle = document.getElementById('sound-effects');
        
        if (clickEffectsToggle) {
            clickEffectsToggle.checked = this.settings.clickEffects;
            clickEffectsToggle.addEventListener('change', (e) => {
                this.settings.clickEffects = e.target.checked;
                this.saveSettings();
            });
        }
        
        if (soundEffectsToggle) {
            soundEffectsToggle.checked = this.settings.soundEffects;
            soundEffectsToggle.addEventListener('change', (e) => {
                this.settings.soundEffects = e.target.checked;
                this.saveSettings();
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
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('save-slot-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
    }
    
    showSaveSlotScreen(isLoading = false) {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('save-slot-screen').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';
        
        this.renderSaveSlots(isLoading);
    }
    
    renderSaveSlots(isLoading = false) {
        const container = document.getElementById('save-slots-container');
        container.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
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
                        <div>Rank: ${this.hellRanks[saveData.ascension?.currentRank || 0].name}</div>
                    </div>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = `
                    <div class="save-slot-header">
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
                    return;
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
        const saveKey = `argentEnergyTycoonBrowser_slot_${slotNumber}`;
        const savedData = localStorage.getItem(saveKey);
        return savedData ? JSON.parse(savedData) : null;
    }
    
    startGame() {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('save-slot-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupNavigation();
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
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        const switchTab = (targetTab) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            document.getElementById(targetTab).classList.add('active');
            
            const activeButton = [...tabButtons].find(b => b.dataset.tab === targetTab);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        };
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                switchTab(button.dataset.tab);
            });
        });
    }
    
    setupEventListeners() {
        // Facility grid handling
        const facilityGrid = document.getElementById('facility-grid');
        if (facilityGrid) {
            facilityGrid.addEventListener('click', (e) => {
                const slot = e.target.closest('.facility-slot');
                if (slot) {
                    const slotIndex = parseInt(slot.dataset.index);
                    this.handleFacilityClick(slotIndex, e);
                }
            });
        }
        
        // Shop items
        const shopItems = document.getElementById('shop-items');
        if (shopItems) {
            shopItems.addEventListener('click', (e) => {
                const item = e.target.closest('.shop-item');
                if (item && !item.classList.contains('disabled')) {
                    const facilityType = item.dataset.type;
                    this.tryBuyFacility(facilityType);
                }
            });
        }
        
        // Upgrade items
        const upgradesList = document.getElementById('upgrades-list');
        if (upgradesList) {
            upgradesList.addEventListener('click', (e) => {
                const item = e.target.closest('.upgrade-item');
                if (item && !item.classList.contains('disabled')) {
                    const upgradeType = item.dataset.type;
                    if (item.classList.contains('random-upgrade')) {
                        this.tryBuyRandomUpgrade(upgradeType);
                    } else {
                        this.tryBuyUpgrade(upgradeType);
                    }
                }
            });
        }
        
        // Auto-save
        this.restartAutoSave();
    }
    
    handleFacilityClick(slotIndex, event) {
        const facility = this.facilities[slotIndex];
        if (facility) {
            const bonus = this.calculateProduction(facility.type);
            this.resources.argent += bonus.argent * 2; // Double click bonus
            this.resources.souls += bonus.souls * 2;
            
            this.facilityClicks++;
            this.totalClicks++;
            
            this.maxResourcesHeld.argent = Math.max(this.maxResourcesHeld.argent || 0, this.resources.argent);
            this.maxResourcesHeld.souls = Math.max(this.maxResourcesHeld.souls || 0, this.resources.souls);
            
            if (facility.type === 'soulForge' || facility.type === 'portal') {
                this.demonsSlain++;
            }
            
            this.showClickEffect(
                `+${Math.floor(bonus.argent * 2)} Energy`,
                event.clientX,
                event.clientY
            );
            
            this.updateDisplay();
        }
    }
    
    tryBuyFacility(facilityType) {
        const facilityData = this.facilityTypes[facilityType];
        if (!facilityData) {
            console.error('Facility type not found:', facilityType);
            return false;
        }
        
        const existingCount = this.facilities.filter(f => f && f.type === facilityType).length;
        const costMultiplier = Math.pow(1.5, existingCount);
        
        const costReduction = this.ascension.permanentBonuses.costReduction / 100;
        const adjustedCost = {
            argent: Math.floor(facilityData.cost.argent * costMultiplier * (1 - costReduction)),
            souls: Math.floor(facilityData.cost.souls * costMultiplier * (1 - costReduction))
        };
        
        console.log(`Buying ${facilityType}: Cost ${adjustedCost.argent} argent, ${adjustedCost.souls} souls`);
        console.log(`Current resources: ${this.resources.argent} argent, ${this.resources.souls} souls`);
        
        if (this.resources.argent >= adjustedCost.argent && 
            this.resources.souls >= adjustedCost.souls) {
            
            let emptySlot = this.facilities.findIndex(f => f === null);
            if (emptySlot === -1) {
                this.expandFacilitySlots();
                emptySlot = this.facilities.findIndex(f => f === null);
            }
            
            if (emptySlot !== -1) {
                this.resources.argent -= adjustedCost.argent;
                this.resources.souls -= adjustedCost.souls;
                
                this.facilities[emptySlot] = {
                    type: facilityType,
                    level: 1,
                    lastProduced: Date.now()
                };
                
                this.ascension.totalFacilitiesBuilt = Math.max(
                    this.ascension.totalFacilitiesBuilt || 0, 
                    this.facilities.filter(f => f !== null).length
                );
                
                // Track rapid building
                const now = Date.now();
                if (now - (this.lastBuildTime || 0) < 6000) {
                    this.consecutiveBuilds = (this.consecutiveBuilds || 0) + 1;
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
                this.renderShop();
                this.checkAchievements();
                
                this.showClickEffect(
                    `Built ${facilityData.name}!`,
                    window.innerWidth / 2,
                    window.innerHeight / 3
                );
                
                console.log('Successfully purchased facility:', facilityType);
                return true;
            }
        } else {
            console.log('Cannot afford facility:', facilityType);
            this.showClickEffect(
                `Can't afford ${facilityData.name}!`,
                window.innerWidth / 2,
                window.innerHeight / 3
            );
            return false;
        }
    }
    
    expandFacilitySlots() {
        const currentSlots = this.facilities.length;
        const newSlots = currentSlots + this.slotsPerExpansion;
        
        for (let i = currentSlots; i < newSlots; i++) {
            this.facilities.push(null);
        }
        
        this.renderFacilityGrid();
    }
    
    tryBuyUpgrade(upgradeType) {
        const upgradeData = this.upgradeTypes[upgradeType];
        if (!upgradeData) return false;
        
        const currentLevel = this.upgrades[upgradeType] || 0;
        if (currentLevel >= upgradeData.maxLevel) return false;
        
        const cost = {
            argent: Math.floor(upgradeData.cost.argent * Math.pow(2, currentLevel)),
            souls: Math.floor(upgradeData.cost.souls * Math.pow(2, currentLevel))
        };
        
        if (this.resources.argent >= cost.argent && this.resources.souls >= cost.souls) {
            this.resources.argent -= cost.argent;
            this.resources.souls -= cost.souls;
            
            this.upgrades[upgradeType] = currentLevel + 1;
            
            this.updateProduction();
            this.updateDisplay();
            this.renderUpgrades();
            
            this.showClickEffect(
                `Upgraded ${upgradeData.name}!`,
                window.innerWidth / 2,
                200
            );
            
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
        
        const effectTypes = ['argentBoost', 'soulBoost', 'speedBoost', 'efficiency'];
        const effectType = effectTypes[Math.floor(Math.random() * effectTypes.length)];
        
        let description, multiplier, baseCost;
        
        switch (effectType) {
            case 'argentBoost':
                multiplier = 1.5 + Math.random() * 1.5;
                description = `Increases Argent Energy production by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(500 + Math.random() * 1500), souls: Math.floor(50 + Math.random() * 150) };
                break;
            case 'soulBoost':
                multiplier = 1.3 + Math.random() * 1.2;
                description = `Increases Demon Soul collection by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(300 + Math.random() * 1200), souls: Math.floor(30 + Math.random() * 120) };
                break;
            case 'speedBoost':
                multiplier = 1.2 + Math.random() * 0.8;
                description = `Increases all production speed by ${Math.floor((multiplier - 1) * 100)}%`;
                baseCost = { argent: Math.floor(800 + Math.random() * 2000), souls: Math.floor(80 + Math.random() * 200) };
                break;
            case 'efficiency':
                multiplier = 1.1 + Math.random() * 0.6;
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
            maxLevel: 3 + Math.floor(Math.random() * 5),
            timeGenerated: Date.now(),
            expiresIn: 7200000 // 2 hours
        };
        
        this.randomUpgrades.push(randomUpgrade);
        
        if (this.randomUpgrades.length > 5) {
            this.randomUpgrades.shift();
        }
        
        this.showNotification(`New Hell Discovery: ${name}!`);
        
        return randomUpgrade;
    }
    
    checkRandomUpgradeGeneration() {
        const now = Date.now();
        if (now - this.lastRandomUpgradeTime >= this.randomUpgradeInterval) {
            this.generateRandomUpgrade();
            this.lastRandomUpgradeTime = now;
        }
        
        this.randomUpgrades = this.randomUpgrades.filter(upgrade => {
            return (now - upgrade.timeGenerated) < upgrade.expiresIn;
        });
    }
    
    tryBuyRandomUpgrade(upgradeId) {
        const upgrade = this.randomUpgrades.find(u => u.id === upgradeId);
        if (!upgrade) return false;
        
        const currentLevel = this.upgrades[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) return false;
        
        const cost = {
            argent: Math.floor(upgrade.cost.argent * Math.pow(1.8, currentLevel)),
            souls: Math.floor(upgrade.cost.souls * Math.pow(1.8, currentLevel))
        };
        
        if (this.resources.argent >= cost.argent && this.resources.souls >= cost.souls) {
            this.resources.argent -= cost.argent;
            this.resources.souls -= cost.souls;
            
            this.upgrades[upgradeId] = currentLevel + 1;
            
            this.updateProduction();
            this.updateDisplay();
            this.renderUpgrades();
            
            this.showClickEffect(
                `Upgraded ${upgrade.name}!`,
                window.innerWidth / 2,
                200
            );
            
            return true;
        }
        return false;
    }
    
    calculateProduction(facilityType) {
        const baseProduction = this.facilityTypes[facilityType].production;
        
        let argentMult = this.ascension.permanentBonuses.productionMultiplier;
        let soulsMult = this.ascension.permanentBonuses.productionMultiplier;
        let speedMult = 1;
        
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
        if (!grid) return;
        
        grid.innerHTML = '';
        
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
                const production = this.calculateProduction(facility.type);
                
                slot.innerHTML = `
                    <img src="${facilityData.icon}" alt="${facilityData.name}" class="facility-icon">
                    <div class="facility-info">
                        <div style="font-size: 0.7rem; font-weight: bold;">${facilityData.name}</div>
                        <div style="font-size: 0.6rem; color: #ff8800;">
                            +${production.argent.toFixed(1)} E/s
                            ${production.souls > 0 ? `+${production.souls.toFixed(1)} S/s` : ''}
                        </div>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div style="color: #666; font-size: 0.7rem; text-align: center;">
                        Empty<br>Slot
                    </div>
                `;
            }
            
            grid.appendChild(slot);
        }
    }
    
    renderShop() {
        const shopItems = document.getElementById('shop-items');
        if (!shopItems) return;
        
        shopItems.innerHTML = '';
        
        Object.entries(this.facilityTypes).forEach(([type, data]) => {
            const item = document.createElement('div');
            item.className = 'shop-item';
            item.dataset.type = type;
            
            const existingCount = this.facilities.filter(f => f && f.type === type).length;
            const costMultiplier = Math.pow(1.5, existingCount);
            const costReduction = this.ascension.permanentBonuses.costReduction / 100;
            
            const currentCost = {
                argent: Math.floor(data.cost.argent * costMultiplier * (1 - costReduction)),
                souls: Math.floor(data.cost.souls * costMultiplier * (1 - costReduction))
            };
            
            const canAfford = this.resources.argent >= currentCost.argent && 
                             this.resources.souls >= currentCost.souls;
            
            if (!canAfford) {
                item.classList.add('disabled');
            }
            
            const production = this.calculateProduction(type);
            
            item.innerHTML = `
                <div class="item-name">${data.name}</div>
                <div class="item-description">${data.description}</div>
                <div class="item-production">
                    Production: ${production.argent > 0 ? `+${production.argent.toFixed(1)} Energy/sec` : ''}
                    ${production.argent > 0 && production.souls > 0 ? ', ' : ''}
                    ${production.souls > 0 ? `+${production.souls.toFixed(1)} Souls/sec` : ''}
                </div>
                <div class="item-cost">
                    Cost: ${currentCost.argent > 0 ? `${this.formatNumber(currentCost.argent)} Energy` : ''}
                    ${currentCost.argent > 0 && currentCost.souls > 0 ? ', ' : ''}
                    ${currentCost.souls > 0 ? `${this.formatNumber(currentCost.souls)} Souls` : ''}
                </div>
                <div style="font-size: 0.7rem; color: #888; margin-top: 0.5rem;">
                    Owned: ${existingCount}
                </div>
            `;
            
            shopItems.appendChild(item);
        });
    }
    
    renderUpgrades() {
        const upgradesList = document.getElementById('upgrades-list');
        if (!upgradesList) return;
        
        upgradesList.innerHTML = '';
        
        // Regular upgrades
        Object.entries(this.upgradeTypes).forEach(([type, data]) => {
            const currentLevel = this.upgrades[type] || 0;
            if (currentLevel >= data.maxLevel) return;
            
            const item = document.createElement('div');
            item.className = 'upgrade-item';
            item.dataset.type = type;
            
            const cost = {
                argent: Math.floor(data.cost.argent * Math.pow(2, currentLevel)),
                souls: Math.floor(data.cost.souls * Math.pow(2, currentLevel))
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
                    Cost: ${this.formatNumber(cost.argent)} Energy, ${this.formatNumber(cost.souls)} Souls
                </div>
            `;
            
            upgradesList.appendChild(item);
        });
        
        // Random upgrades section
        if (this.randomUpgrades.length > 0) {
            const separator = document.createElement('div');
            separator.innerHTML = '<h4 style="color: var(--accent-red); text-align: center; margin: 1rem 0; font-size: 1.1rem; letter-spacing: 1px;">HELLISH DISCOVERIES</h4>';
            upgradesList.appendChild(separator);
            
            this.randomUpgrades.forEach(upgrade => {
                const currentLevel = this.upgrades[upgrade.id] || 0;
                if (currentLevel >= upgrade.maxLevel) return;
                
                const item = document.createElement('div');
                item.className = 'upgrade-item random-upgrade';
                item.dataset.type = upgrade.id;
                
                const cost = {
                    argent: Math.floor(upgrade.cost.argent * Math.pow(1.8, currentLevel)),
                    souls: Math.floor(upgrade.cost.souls * Math.pow(1.8, currentLevel))
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
                        Cost: ${this.formatNumber(cost.argent)} Energy, ${this.formatNumber(cost.souls)} Souls
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.5rem;">
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
                <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-top: 1rem; padding: 1rem; border: 1px dashed var(--border-color); border-radius: 8px;">
                    Next Hell Discovery in: ${hoursLeft}h ${minutesLeft}m
                </div>
            `;
            upgradesList.appendChild(timerDiv);
        }
    }
    
    renderAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
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
                ${completed ? '<div style="color: #ff8800; font-size: 0.8rem; margin-top: 0.5rem;">✓ COMPLETED</div>' : ''}
            `;
            
            achievementsList.appendChild(item);
        });
    }
    
    renderRecentAchievements() {
        const recentList = document.getElementById('recent-achievements-list');
        if (!recentList) return;
        
        recentList.innerHTML = '';
        
        if (this.recentAchievements.length === 0) {
            recentList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 1rem; font-size: 0.9rem;">No recent achievements</div>';
            return;
        }
        
        this.recentAchievements.forEach(achievement => {
            const item = document.createElement('div');
            item.className = 'achievement completed';
            item.style.marginBottom = '0.5rem';
            item.style.fontSize = '0.8rem';
            
            item.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            `;
            
            recentList.appendChild(item);
        });
    }
    
    checkAchievements() {
        this.achievementList.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition()) {
                this.achievements.push(achievement.id);
                this.recentAchievements.unshift(achievement);
                
                if (this.recentAchievements.length > 3) {
                    this.recentAchievements.pop();
                }
                
                this.showNotification(`Achievement Unlocked: ${achievement.name}!`);
                
                this.renderAchievements();
                this.renderRecentAchievements();
            }
        });
    }
    
    setupAscensionSystem() {
        this.renderAscensionSystem();
        
        const ascendButton = document.getElementById('ascend-button');
        if (ascendButton) {
            ascendButton.addEventListener('click', () => {
                this.performAscension();
            });
        }
    }
    
    renderAscensionSystem() {
        const currentRankDisplay = document.getElementById('current-rank-display');
        if (currentRankDisplay) {
            currentRankDisplay.textContent = this.hellRanks[this.ascension.currentRank].name;
        }
        
        const nextRankIndex = this.ascension.currentRank + 1;
        if (nextRankIndex < this.hellRanks.length) {
            const nextRank = this.hellRanks[nextRankIndex];
            const progressFill = document.getElementById('ascension-progress-fill');
            const progressText = document.getElementById('ascension-progress-text');
            const ascendButton = document.getElementById('ascend-button');
            const nextRankName = document.getElementById('next-rank-name');
            
            if (progressFill && progressText) {
                const progress = Math.min(100, (this.ascension.totalArgentEverEarned / nextRank.requirements.argent) * 100);
                progressFill.style.width = progress + '%';
                progressText.textContent = `${this.formatNumber(this.ascension.totalArgentEverEarned)} / ${this.formatNumber(nextRank.requirements.argent)} Argent Energy Required`;
            }
            
            if (nextRankName) {
                nextRankName.textContent = nextRank.name;
            }
            
            const canAscend = this.ascension.totalArgentEverEarned >= nextRank.requirements.argent &&
                             this.ascension.totalSoulsEverEarned >= nextRank.requirements.souls &&
                             this.ascension.totalFacilitiesBuilt >= nextRank.requirements.facilities;
            
            if (ascendButton) {
                ascendButton.disabled = !canAscend;
            }
        }
        
        const productionMultiplier = document.getElementById('production-multiplier');
        const costReduction = document.getElementById('cost-reduction');
        const startingResources = document.getElementById('starting-resources');
        
        if (productionMultiplier) {
            productionMultiplier.textContent = this.ascension.permanentBonuses.productionMultiplier.toFixed(2) + 'x';
        }
        if (costReduction) {
            costReduction.textContent = this.ascension.permanentBonuses.costReduction + '%';
        }
        if (startingResources) {
            startingResources.textContent = `${this.formatNumber(this.ascension.permanentBonuses.startingResources.argent)} Energy, ${this.formatNumber(this.ascension.permanentBonuses.startingResources.souls)} Souls`;
        }
        
        this.renderHellRanks();
    }
    
    renderHellRanks() {
        const ranksGrid = document.getElementById('ranks-grid');
        if (!ranksGrid) return;
        
        ranksGrid.innerHTML = '';
        
        this.hellRanks.forEach((rank, index) => {
            const rankCard = document.createElement('div');
            rankCard.className = 'rank-card';
            
            if (index === this.ascension.currentRank) {
                rankCard.classList.add('current');
            } else if (index < this.ascension.currentRank) {
                rankCard.classList.add('achieved');
            } else {
                rankCard.classList.add('locked');
            }
            
            rankCard.innerHTML = `
                <div class="rank-number">${index + 1}</div>
                <div class="rank-name">${rank.name}</div>
                <div class="rank-requirements">
                    ${this.formatNumber(rank.requirements.argent)} Energy<br>
                    ${this.formatNumber(rank.requirements.souls)} Souls<br>
                    ${rank.requirements.facilities} Facilities
                </div>
                <div class="rank-bonuses">
                    ${rank.bonuses.productionMultiplier}x Production<br>
                    ${rank.bonuses.costReduction}% Cost Reduction
                </div>
            `;
            
            ranksGrid.appendChild(rankCard);
        });
    }
    
    performAscension() {
        const nextRankIndex = this.ascension.currentRank + 1;
        if (nextRankIndex >= this.hellRanks.length) return;
        
        const nextRank = this.hellRanks[nextRankIndex];
        const canAscend = this.ascension.totalArgentEverEarned >= nextRank.requirements.argent &&
                         this.ascension.totalSoulsEverEarned >= nextRank.requirements.souls &&
                         this.ascension.totalFacilitiesBuilt >= nextRank.requirements.facilities;
        
        if (!canAscend) return;
        
        this.ascension.currentRank = nextRankIndex;
        this.ascension.ascensionCount++;
        
        this.ascension.permanentBonuses.productionMultiplier = nextRank.bonuses.productionMultiplier;
        this.ascension.permanentBonuses.costReduction = nextRank.bonuses.costReduction;
        this.ascension.permanentBonuses.startingResources = {
            argent: nextRank.bonuses.startingArgent,
            souls: nextRank.bonuses.startingSouls
        };
        
        // Reset progress
        this.resources.argent = nextRank.bonuses.startingArgent;
        this.resources.souls = nextRank.bonuses.startingSouls;
        this.facilities = new Array(this.initialFacilitySlots).fill(null);
        this.upgrades = {};
        
        this.updateProduction();
        this.updateDisplay();
        this.renderFacilityGrid();
        this.renderShop();
        this.renderUpgrades();
        this.renderAscensionSystem();
        
        this.showNotification(`Ascended to ${nextRank.name}!`);
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
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
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
                case 'r':
                    this.switchToTab('ascension-tab');
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
                totalArgent += production.argent * 10; // 10 seconds worth
                totalSouls += production.souls * 10;
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
        
        for (let i = 0; i < 10; i++) {
            const randomType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
            if (this.tryBuyFacility(randomType)) {
                built++;
            }
        }
        
        if (built > 0) {
            this.showNotification(`Auto-built ${built} facilities!`);
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
            this.showNotification(`Mass upgraded ${upgraded} systems!`);
        }
    }
    
    setAchievementFilter(filter) {
        this.currentAchievementFilter = filter;
        
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.filter === filter) {
                button.classList.add('active');
            }
        });
        
        this.renderAchievements();
    }
    
    showClickEffect(text, x, y) {
        if (!this.settings.clickEffects) return;
        
        const effect = document.getElementById('click-effect');
        if (!effect) return;
        
        effect.innerHTML = text.replace(/\n/g, '<br>');
        effect.style.left = Math.min(x, window.innerWidth - 150) + 'px';
        effect.style.top = Math.max(y - 30, 20) + 'px';
        effect.style.opacity = '1';
        effect.style.animation = 'none';
        
        setTimeout(() => {
            effect.style.animation = 'clickEffect 1.5s ease-out forwards';
        }, 10);
    }
    
    updateDisplay() {
        const argentAmount = document.getElementById('argent-amount');
        const soulsAmount = document.getElementById('souls-amount');
        const energyRate = document.getElementById('energy-rate');
        const soulsRate = document.getElementById('souls-rate');
        const totalFacilities = document.getElementById('total-facilities');
        const efficiencyRate = document.getElementById('efficiency-rate');
        
        if (argentAmount) argentAmount.textContent = this.formatNumber(this.resources.argent);
        if (soulsAmount) soulsAmount.textContent = this.formatNumber(this.resources.souls);
        if (energyRate) energyRate.textContent = this.formatNumber(this.production.argent);
        if (soulsRate) soulsRate.textContent = this.formatNumber(this.production.souls);
        if (totalFacilities) totalFacilities.textContent = this.facilities.filter(f => f !== null).length;
        if (efficiencyRate) efficiencyRate.textContent = this.efficiencyRate + '%';
    }
    
    formatNumber(num) {
        if (num >= 1000000000000) {
            return (num / 1000000000000).toFixed(1) + 'T';
        } else if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
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
        }, 4000);
    }
    
    saveSettings() {
        localStorage.setItem('argentEnergyTycoonBrowserSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('argentEnergyTycoonBrowserSettings');
        if (saved) {
            this.settings = Object.assign(this.settings, JSON.parse(saved));
        }
    }
    
    saveGame() {
        if (!this.currentSaveSlot) return;
        
        const saveData = {
            resources: this.resources,
            facilities: this.facilities,
            upgrades: this.upgrades,
            achievements: this.achievements,
            recentAchievements: this.recentAchievements,
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
            totalClicks: this.totalClicks,
            efficiencyRate: this.efficiencyRate,
            lastPlayed: Date.now()
        };
        
        const saveKey = `argentEnergyTycoonBrowser_slot_${this.currentSaveSlot}`;
        localStorage.setItem(saveKey, JSON.stringify(saveData));
    }
    
    loadGame() {
        if (!this.currentSaveSlot) return;
        
        const saveKey = `argentEnergyTycoonBrowser_slot_${this.currentSaveSlot}`;
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
            
            // Load browser-specific data
            this.facilityClicks = data.facilityClicks || 0;
            this.rapidBuildCount = data.rapidBuildCount || 0;
            this.demonsSlain = data.demonsSlain || 0;
            this.playTime = data.playTime || 0;
            this.maxResourcesHeld = data.maxResourcesHeld || { argent: 0, souls: 0 };
            this.gameStartTime = data.gameStartTime || Date.now();
            this.lastBuildTime = data.lastBuildTime || 0;
            this.consecutiveBuilds = data.consecutiveBuilds || 0;
            this.totalClicks = data.totalClicks || 0;
            this.efficiencyRate = data.efficiencyRate || 100;
            
            this.checkRandomUpgradeGeneration();
            this.updateProduction();
        }
    }
    
    startGameLoop() {
        setInterval(() => {
            // Resource generation
            this.resources.argent += this.production.argent / 10;
            this.resources.souls += this.production.souls / 10;
            
            // Track total resources for ascension
            this.ascension.totalArgentEverEarned = Math.max(this.ascension.totalArgentEverEarned, this.resources.argent);
            this.ascension.totalSoulsEverEarned = Math.max(this.ascension.totalSoulsEverEarned, this.resources.souls);
            
            // Check for random upgrades
            this.checkRandomUpgradeGeneration();
            
            // Update display
            this.updateDisplay();
            
            // Check achievements
            this.checkAchievements();
            
            // Auto-save every 30 seconds
            if (Date.now() % 30000 < 100) {
                this.saveGame();
            }
        }, 100);
    }
    
    startSessionTimer() {
        setInterval(() => {
            this.playTime += 1000;
            const sessionTime = Date.now() - this.sessionStartTime;
            const hours = Math.floor(sessionTime / 3600000);
            const minutes = Math.floor((sessionTime % 3600000) / 60000);
            const seconds = Math.floor((sessionTime % 60000) / 1000);
            
            const sessionTimeDisplay = document.getElementById('session-time');
            if (sessionTimeDisplay) {
                sessionTimeDisplay.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            const totalClicksDisplay = document.getElementById('total-clicks');
            if (totalClicksDisplay) {
                totalClicksDisplay.textContent = this.totalClicks.toString();
            }
            
            const achievementProgress = document.getElementById('achievement-progress');
            if (achievementProgress) {
                achievementProgress.textContent = `${this.achievements.length}/${this.achievementList.length}`;
            }
        }, 1000);
    }
}

// Add screen shake animation
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

const styleSheet = document.createElement('style');
styleSheet.textContent = screenShakeCSS;
document.head.appendChild(styleSheet);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ArgentEnergyTycoonBrowser();
});