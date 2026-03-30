/**
 * Manages scenario generation state with proper encapsulation.
 *
 * Provides thread-safe access to scenarios data and generation status.
 */
export class ScenarioManager {
  constructor() {
    this._scenarios = [];
    this._isGenerating = false;
    this._lastError = null;
  }

  /**
   * Gets all scenarios data.
   * @returns {Array} Copy of the scenarios array.
   */
  getScenarios() {
    return [...this._scenarios];
  }

  /**
   * Replaces all scenarios with new data.
   * @param {Array} scenarios - New scenarios array.
   */
  setScenarios(scenarios) {
    this._scenarios = [...scenarios];
  }

  /**
   * Appends a scenario to the list.
   * @param {Object} scenario - Scenario to add.
   */
  addScenario(scenario) {
    this._scenarios.push(scenario);
  }

  /**
   * Clears all scenarios.
   */
  clearScenarios() {
    this._scenarios = [];
  }

  /**
   * Checks if generation is in progress.
   * @returns {boolean} True if generating.
   */
  isGenerating() {
    return this._isGenerating;
  }

  /**
   * Attempts to start generation. Returns false if already generating.
   * @returns {boolean} True if generation was started, false if already in progress.
   */
  tryStartGeneration() {
    if (this._isGenerating) {
      return false;
    }
    this._isGenerating = true;
    this._lastError = null;
    return true;
  }

  /**
   * Marks generation as complete.
   * @param {Error|null} error - Optional error if generation failed.
   */
  finishGeneration(error = null) {
    this._isGenerating = false;
    this._lastError = error;
  }

  /**
   * Gets the last error from generation.
   * @returns {Error|null} The last error, or null if none.
   */
  getLastError() {
    return this._lastError;
  }

  /**
   * Gets the current status.
   * @returns {Object} Status object with isGenerating and hasError.
   */
  getStatus() {
    return {
      isGenerating: this._isGenerating,
      scenarioCount: this._scenarios.length,
      hasError: this._lastError !== null,
      error: this._lastError?.message || null,
    };
  }
}
