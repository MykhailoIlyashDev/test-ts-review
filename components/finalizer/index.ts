import collectible from './collectible'
import base from './base'
import types from './types'
import functionType from './function'
import toContext from './toContext'
import { ISpinParams } from '../../types'

const collection: Record<string, any> = {
  [types.COLLECTIBLE]: collectible,
  [types.COLLECTIBLE2]: collectible,
  [types.BASE]: base,
  [types.FUNCTION]: functionType,
  [types.CONTEXT]: toContext,
}

/**
 * @param {ISpinParams} params
 */
function finish(params: ISpinParams): { finalizer: Record<string, boolean> } {
  const { mode, settings, agentDI } = params
  const { finalizer: config } = settings
  const items = getItems()
  const finalizerResults: Record<string, boolean> = {}
  if (items.length) {
    for (const item of items) {
      finalizerResults[item] = collection[item].check(params, item)
    }
  }

  return { finalizer: finalizerResults }

  function getItems(): string[] {
    if (config && config?.items) {
      return config.items
    }
    if (config?.itemsByMode && config.itemsByMode.hasOwnProperty(mode)) {
      return config.itemsByMode[mode]
    }
    return []
  }
}

export default { finish }
