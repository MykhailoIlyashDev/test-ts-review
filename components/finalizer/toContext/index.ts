import { ISpinParams } from '../../../types';
import conditions from '../conditions';

interface ContextConfig {
  toContext: any;
  conditions: string[];
}

/**
 * Checks if all conditions are met and returns the context configuration.
 * @param {ISpinParams} params - The spin parameters.
 * @returns {any} - The context configuration if conditions are met, otherwise undefined.
 */
function check(params: ISpinParams): any {
  const { settings, agentDI } = params;
  const config = settings.finalizer[agentDI.glossary.finalizerTypes.CONTEXT] as ContextConfig;

  try {
    if (config && areConditionsMet(config.conditions)) {
      return config.toContext;
    }
  } catch (error) {
    console.error('Error in check function:', error);
  }

  return undefined;

  /**
   * Checks if all the conditions specified in the configuration are met.
   * @param {string[]} conditionsList - List of condition types to check.
   * @returns {boolean} - True if all conditions are met, false otherwise.
   */
  function areConditionsMet(conditionsList: string[]): boolean {
    try {
      return conditionsList.every((conditionType: string) => {
        const conditionFn = conditions[conditionType];
        if (typeof conditionFn === 'function') {
          return conditionFn(params);
        } else {
          console.warn(`Condition function for '${conditionType}' not found.`);
          return false;
        }
      });
    } catch (error) {
      console.error('Error in areConditionsMet function:', error);
      return false;
    }
  }
}

/** @type {FinalizerInterface} */
export default { check };
