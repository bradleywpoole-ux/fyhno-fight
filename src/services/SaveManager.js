// SaveManager — single source of truth for all persistent game state.
//
// The rest of the codebase MUST NOT touch localStorage directly. Everything
// (level completion, captives, accessories, coins, settings) goes through
// the singleton exported at the bottom of this file.
//
// Phase 0 decision 6: localStorage wrapped by a versioned manager.
// See docs/fyhno_fight_phase_0_decisions.md §6.

const STORAGE_KEY = 'fyhno-fight-save';
const CURRENT_SCHEMA_VERSION = 1;

/**
 * Fresh default save for a brand-new player.
 * @returns {object} A new default state object at the current schema version.
 */
function defaultState() {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profileName: 'default',
    currentLevel: 1,
    highestLevelUnlocked: 1,
    levelsCompleted: {},
    captivesRescued: {},
    accessoriesUnlocked: [],
    equippedAccessories: [],
    totalCoinsCollected: 0,
    settings: {
      musicOn: true,
      soundOn: true,
    },
    fyhnoAppearance: null,
  };
}

// Migration registry. Each key N is a function that takes a state at version N
// and returns a state at version N+1. load() runs them in sequence until the
// state reaches CURRENT_SCHEMA_VERSION. Empty today — framework ready for v2+.
//
// Example future entry:
//   1: (state) => ({ ...state, schemaVersion: 2, newField: 'default' }),
const migrations = {};

class SaveManager {
  constructor() {
    this.state = defaultState();
    this._loaded = false;
  }

  /**
   * Read save from localStorage, run migrations if needed, return current state.
   * If no save exists, initializes to default. If save is corrupted, logs a
   * warning and falls back to default — never throws.
   * @returns {object} The active state object.
   */
  load() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[SaveManager] localStorage unavailable, using default state:', err);
      this.state = defaultState();
      this._loaded = true;
      return this.state;
    }

    if (raw === null) {
      this.state = defaultState();
      this._loaded = true;
      this.save();
      return this.state;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn('[SaveManager] Save data corrupted (invalid JSON), resetting to default:', err);
      this.state = defaultState();
      this._loaded = true;
      this.save();
      return this.state;
    }

    if (!parsed || typeof parsed !== 'object' || typeof parsed.schemaVersion !== 'number') {
      console.warn('[SaveManager] Save data malformed (missing schemaVersion), resetting to default.');
      this.state = defaultState();
      this._loaded = true;
      this.save();
      return this.state;
    }

    this.state = this._migrate(parsed);
    this._loaded = true;

    if (this.state.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      console.warn(
        `[SaveManager] Could not fully migrate save (stopped at v${this.state.schemaVersion}, current is v${CURRENT_SCHEMA_VERSION}).`
      );
    } else {
      this.save();
    }

    return this.state;
  }

  /**
   * Run sequential migrations until state reaches CURRENT_SCHEMA_VERSION,
   * or until a needed migration is missing. Missing migrations log a warning
   * and return the partially-migrated state.
   * @private
   */
  _migrate(state) {
    let current = state;
    while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
      const fromVersion = current.schemaVersion;
      const migrate = migrations[fromVersion];
      if (typeof migrate !== 'function') {
        console.warn(`[SaveManager] No migration registered from v${fromVersion} to v${fromVersion + 1}.`);
        return current;
      }
      current = migrate(current);
    }
    return current;
  }

  /**
   * Persist current state to localStorage. Safe to call frequently.
   * @returns {boolean} true if the write succeeded.
   */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      return true;
    } catch (err) {
      console.warn('[SaveManager] Failed to write save:', err);
      return false;
    }
  }

  /**
   * Wipe save and reinitialize to default. Useful for testing and for
   * cousins playing fresh.
   * @returns {object} The new default state.
   */
  reset() {
    this.state = defaultState();
    this.save();
    console.log('[SaveManager] Save reset to default.');
    return this.state;
  }

  /**
   * Pretty-print current state to console. Debugging aid.
   */
  dumpState() {
    console.log('[SaveManager] Current state:\n' + JSON.stringify(this.state, null, 2));
  }

  // ── Mutators ──────────────────────────────────────────────────────────────
  // Every mutator auto-saves at the end. Pass { autoSave: false } to batch.

  /**
   * Mark a level as complete. Stamps completedAt and advances
   * highestLevelUnlocked to levelNumber + 1 if that's higher than current.
   * @param {number} levelNumber
   * @param {{ autoSave?: boolean }} [opts]
   */
  markLevelComplete(levelNumber, { autoSave = true } = {}) {
    this.state.levelsCompleted[levelNumber] = {
      completed: true,
      completedAt: new Date().toISOString(),
    };
    const nextUnlock = levelNumber + 1;
    if (nextUnlock > this.state.highestLevelUnlocked) {
      this.state.highestLevelUnlocked = nextUnlock;
    }
    if (autoSave) this.save();
  }

  /**
   * Record a captive as rescued.
   * @param {string} captiveId
   * @param {string} captiveName
   * @param {{ autoSave?: boolean }} [opts]
   */
  rescueCaptive(captiveId, captiveName, { autoSave = true } = {}) {
    this.state.captivesRescued[captiveId] = {
      name: captiveName,
      rescuedAt: new Date().toISOString(),
    };
    if (autoSave) this.save();
  }

  /**
   * Unlock an accessory. No-op if already unlocked.
   * @param {string} accessoryId
   * @param {{ autoSave?: boolean }} [opts]
   */
  unlockAccessory(accessoryId, { autoSave = true } = {}) {
    if (!this.state.accessoriesUnlocked.includes(accessoryId)) {
      this.state.accessoriesUnlocked.push(accessoryId);
      if (autoSave) this.save();
    }
  }

  /**
   * Equip an accessory on Fyhno. No-op if already equipped.
   * @param {string} accessoryId
   * @param {{ autoSave?: boolean }} [opts]
   */
  equipAccessory(accessoryId, { autoSave = true } = {}) {
    if (!this.state.equippedAccessories.includes(accessoryId)) {
      this.state.equippedAccessories.push(accessoryId);
      if (autoSave) this.save();
    }
  }

  /**
   * Remove an accessory from Fyhno. No-op if not equipped.
   * @param {string} accessoryId
   * @param {{ autoSave?: boolean }} [opts]
   */
  unequipAccessory(accessoryId, { autoSave = true } = {}) {
    const idx = this.state.equippedAccessories.indexOf(accessoryId);
    if (idx !== -1) {
      this.state.equippedAccessories.splice(idx, 1);
      if (autoSave) this.save();
    }
  }

  /**
   * Increment lifetime coin counter.
   * @param {number} count
   * @param {{ autoSave?: boolean }} [opts]
   */
  addCoins(count, { autoSave = true } = {}) {
    this.state.totalCoinsCollected += count;
    if (autoSave) this.save();
  }

  /**
   * Set the active level the player is on.
   * @param {number} levelNumber
   * @param {{ autoSave?: boolean }} [opts]
   */
  setCurrentLevel(levelNumber, { autoSave = true } = {}) {
    this.state.currentLevel = levelNumber;
    if (autoSave) this.save();
  }

  /** @param {boolean} on */
  setMusicOn(on, { autoSave = true } = {}) {
    this.state.settings.musicOn = !!on;
    if (autoSave) this.save();
  }

  /** @param {boolean} on */
  setSoundOn(on, { autoSave = true } = {}) {
    this.state.settings.soundOn = !!on;
    if (autoSave) this.save();
  }

  /**
   * Save which Midjourney Fyhno option Lydia picked.
   * @param {object} appearanceData
   */
  setFyhnoAppearance(appearanceData, { autoSave = true } = {}) {
    this.state.fyhnoAppearance = appearanceData;
    if (autoSave) this.save();
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  /** @returns {number} */
  getCurrentLevel() { return this.state.currentLevel; }

  /** @returns {number} */
  getHighestLevelUnlocked() { return this.state.highestLevelUnlocked; }

  /** @returns {object} */
  getLevelsCompleted() { return this.state.levelsCompleted; }

  /** @returns {boolean} */
  isLevelComplete(levelNumber) {
    return !!(this.state.levelsCompleted[levelNumber] && this.state.levelsCompleted[levelNumber].completed);
  }

  /** @returns {object} */
  getCaptivesRescued() { return this.state.captivesRescued; }

  /** @returns {string[]} */
  getAccessoriesUnlocked() { return this.state.accessoriesUnlocked.slice(); }

  /** @returns {boolean} */
  isAccessoryUnlocked(accessoryId) { return this.state.accessoriesUnlocked.includes(accessoryId); }

  /** @returns {string[]} */
  getEquippedAccessories() { return this.state.equippedAccessories.slice(); }

  /** @returns {boolean} */
  isAccessoryEquipped(accessoryId) { return this.state.equippedAccessories.includes(accessoryId); }

  /** @returns {number} */
  getTotalCoinsCollected() { return this.state.totalCoinsCollected; }

  /** @returns {{ musicOn: boolean, soundOn: boolean }} */
  getSettings() { return { ...this.state.settings }; }

  /** @returns {object|null} */
  getFyhnoAppearance() { return this.state.fyhnoAppearance; }

  /** @returns {string} */
  getProfileName() { return this.state.profileName; }
}

const saveManager = new SaveManager();
export default saveManager;
export { SaveManager, defaultState, CURRENT_SCHEMA_VERSION, STORAGE_KEY };
