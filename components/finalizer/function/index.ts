import { ISpinParams } from '../../../types';
import conditions from '../conditions';

/**
 * Checks if all conditions are met and executes a function if they are.
 * @param {ISpinParams} params - The parameters used for checking conditions and executing the function.
 */
function check(params: ISpinParams): void {
  try {
    const { settings, agentDI } = params;
    const config = settings.finalizer[agentDI.glossary.finalizerTypes.FUNCTION];

    if (!config || !config.fn || !Array.isArray(config.conditions)) {
      throw new Error('Invalid finalizer configuration.');
    }

    if (areConditionsMet(config.conditions)) {
      config.fn(params);
    }
  } catch (error) {
    console.error('Error in check function:', error);
  }

  /**
   * Checks if all conditions specified in the configuration are met.
   * @param {string[]} conditionsList - List of condition types to check.
   * @returns {boolean} - True if all conditions are met, false otherwise.
   */
  function areConditionsMet(conditionsList: string[]): boolean {
    return conditionsList.every(conditionType => {
      const conditionFn = conditions[conditionType];
      if (typeof conditionFn !== 'function') {
        console.warn(`Condition function for type "${conditionType}" is not defined.`);
        return false;
      }
      try {
        return conditionFn(params);
      } catch (error) {
        console.error(`Error evaluating condition "${conditionType}":`, error);
        return false;
      }
    });
  }
}

/** @type {FinalizerInterface} */
export default { check };
