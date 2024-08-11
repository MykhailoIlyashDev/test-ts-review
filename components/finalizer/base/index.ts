import { ISpinParams } from '../../../types';
import conditions from '../conditions';

interface FinalizerConfig {
  conditions: string[];
}

interface FinalizerSettings {
  finalizer: any;
  finalizerBase: FinalizerConfig;
}

interface AgentDI {
  injector: {
    inject: (params: ISpinParams, updates: Record<string, any>) => void;
  };
}

interface Params extends ISpinParams {
  settings: FinalizerSettings;
  agentDI: AgentDI;
}

/**
 * Checks if the conditions for the finalizer base are met and applies updates if they are.
 * @param {Params} params - The parameters used for checking conditions and applying updates.
 */
function check(params: Params): void {
  try {
    const { settings, agentDI } = params;
    const config = settings.finalizer.finalizerBase;

    if (config) {
      if (areConditionsMet(config.conditions)) {
        agentDI.injector.inject(params, { contexts: ['1'] });
      }
    } else {
      console.warn('Finalizer base configuration is missing.');
    }
  } catch (error) {
    console.error('Error while checking finalizer conditions:', error);
  }

  /**
   * Checks if all specified conditions are met.
   * @param {string[]} conditionsList - List of condition types to check.
   * @returns {boolean} - True if all conditions are met, false otherwise.
   */
  function areConditionsMet(conditionsList: string[]): boolean {
    return conditionsList.every(conditionType => {
      const conditionFn = conditions[conditionType];
      if (typeof conditionFn === 'function') {
        return conditionFn(params);
      } else {
        console.warn(`Condition function for "${conditionType}" is not defined.`);
        return false;
      }
    });
  }
}

/** @type {FinalizerInterface} */
export default { check };
