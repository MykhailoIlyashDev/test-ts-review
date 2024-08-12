import base from './base';
import collectible from './collectible';
import functionType from './function';
import toContext from './toContext';
import types from './types';
import { ISpinParams } from '../../types';

const collection: Record<string, any> = {
  [types.COLLECTIBLE]: collectible,
  [types.COLLECTIBLE2]: collectible,
  [types.BASE]: base,
  [types.FUNCTION]: functionType,
  [types.CONTEXT]: toContext,
};

/**
 * Executes the finalizer logic based on the configured items and mode.
 * @param {ISpinParams} params - The parameters used to execute the finalizer.
 * @returns {Record<string, boolean>} - The results of the finalizer checks.
 */
function finish(params: ISpinParams): { finalizer: Record<string, boolean> } {
  const { mode, settings } = params;
  const config = settings?.finalizer;
  const items = getItems();
  const finalizerResults: Record<string, boolean> = {};

  try {
    for (const item of items) {
      if (collection[item]) {
        finalizerResults[item] = collection[item].check(params, item);
      } else {
        console.warn(`Finalizer type '${item}' not found in the collection.`);
      }
    }
  } catch (error) {
    console.error('Error executing finalizer checks:', error);
  }

  return { finalizer: finalizerResults };

  /**
   * Retrieves the list of items to process based on the mode and configuration.
   * @returns {string[]} - The list of item keys to process.
   */
  function getItems(): string[] {
    try {
      if (config?.items) {
        return Array.isArray(config.items) ? config.items : [];
      }
      if (config?.itemsByMode && mode in config.itemsByMode) {
        return Array.isArray(config.itemsByMode[mode])
          ? config.itemsByMode[mode]
          : [];
      }
      return [];
    } catch (error) {
      console.error('Error retrieving items from configuration:', error);
      return [];
    }
  }
}

export default { finish };
