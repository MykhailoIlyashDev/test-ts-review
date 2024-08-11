import { ISpinParams } from '../../../types';
import conditions from '../conditions';

interface FinalizerConfig {
  conditions: string[];
  step: number;
  name: string;
}

interface FinalizerSettings {
  [key: string]: FinalizerConfig;
}

interface Stats {
  get: () => Stats;
  updateCollectible: (step: number) => void;
  getValuesByMode: () => Record<string, number>;
}

interface Featurer {
  add: (feature: { type: string; name: string; value: number }) => void;
}

interface AgentDI {
  stats: Stats;
  featurer: Featurer;
  glossary: {
    finalizerTypes: {
      COLLECTIBLE: string;
    };
  };
}

interface Params extends ISpinParams {
  settings: {
    finalizer: FinalizerSettings;
  };
  agentDI: AgentDI;
}

/**
 * Checks if the conditions for a given finalizer type are met and updates the collectible if they are.
 * @param {Params} params - The parameters used for checking conditions and updating.
 * @param {string} type - The type of finalizer to check and apply.
 */
function check(params: Params, type: string): void {
  try {
    const { settings, agentDI } = params;
    const config = settings.finalizer[type];

    if (!config) {
      console.warn(`Finalizer configuration for type "${type}" not found.`);
      return;
    }

    if (areConditionsMet(config.conditions)) {
      const stats = agentDI.stats.get();
      stats.updateCollectible(config.step);

      const collectibleValue = agentDI.stats.getValuesByMode()[agentDI.glossary.finalizerTypes.COLLECTIBLE];
      agentDI.featurer.add({
        type: agentDI.glossary.finalizerTypes.COLLECTIBLE,
        name: config.name,
        value: collectibleValue,
      });
    }
  } catch (error) {
    console.error(`Error in finalizer check for type "${type}":`, error);
  }

  /**
   * Checks if all specified conditions are met.
   * @param {string[]} conditionsList - List of condition types to check.
   * @returns {boolean} - True if all conditions are met, false otherwise.
   */
  function areConditionsMet(conditionsList: string[]): boolean {
    try {
      return conditionsList.every(conditionType => {
        const conditionFn = conditions[conditionType];
        if (typeof conditionFn === 'function') {
          return conditionFn(params);
        } else {
          console.warn(`Condition function for "${conditionType}" is not defined.`);
          return false;
        }
      });
    } catch (error) {
      console.error('Error evaluating conditions:', error);
      return false;
    }
  }
}

/** @type {FinalizerInterface} */
export default { check };
