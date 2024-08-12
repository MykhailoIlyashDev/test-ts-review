import { ISpinParams } from '../../types';

/**
 * Checks if the current value is less than the maximum allowed value.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the current value is less than the maximum, false otherwise.
 */
function lessThanMaxValue(params: ISpinParams): boolean {
  try {
    const { settings, agentDI } = params;
    const config = settings.finalizer[agentDI.glossary.finalizerTypes.COLLECTIBLE];
    if (!config || typeof config.max !== 'number') {
      throw new Error('Invalid finalizer config or max value.');
    }
    const currentValue = agentDI.stats.getValuesByMode()[agentDI.glossary.finalizerTypes.COLLECTIBLE];

    return currentValue < config.max;
  } catch (error) {
    console.error('Error in lessThanMaxValue:', error);
    return false;
  }
}

/**
 * Checks if the previous win is smaller than the current win.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the previous win is smaller than the current win, false otherwise.
 */
function previousWinSmaller(params: ISpinParams): boolean {
  try {
    const { agentDI, win } = params;
    const statsValues = agentDI.stats.getValuesByMode();
    const prevWin = statsValues.prevWin;

    if (typeof win?.total !== 'number') {
      throw new Error('Invalid win total.');
    }

    return win.total > prevWin;
  } catch (error) {
    console.error('Error in previousWinSmaller:', error);
    return false;
  }
}

/**
 * Checks if the spin is not the first spin.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if it's not the first spin, false otherwise.
 */
function isNotFirstSpin(params: ISpinParams): boolean {
  try {
    const { agentDI } = params;
    const statsValues = agentDI.stats.getValuesByMode();
    const { total = 0, rest = 0 } = statsValues;

    return total > rest;
  } catch (error) {
    console.error('Error in isNotFirstSpin:', error);
    return false;
  }
}

/**
 * Checks if there is a win in the current spin.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if there is a win, false otherwise.
 */
function hasWin(params: ISpinParams): boolean {
  try {
    const { win } = params;

    return win?.total > 0;
  } catch (error) {
    console.error('Error in hasWin:', error);
    return false;
  }
}

/**
 * Checks if the feature has finished.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {boolean} - True if the feature is finished, false otherwise.
 */
function isFinished(params: ISpinParams): boolean {
  try {
    const { features } = params;

    return !!features?.finished;
  } catch (error) {
    console.error('Error in isFinished:', error);
    return false;
  }
}

export default {
  lessThanMaxValue,
  previousWinSmaller,
  isNotFirstSpin,
  hasWin,
  isFinished,
};
