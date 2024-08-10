import conditions from '../conditions'
import { ISpinParams } from '../../../types'

/**
 * @param {ISpinParams} params
 * @param type string
 */
function check(params: ISpinParams, type): void {
  const { settings, agentDI } = params
  const config = settings.finalizer[type]
  if (isEnable()) {
    agentDI.stats.get().updateCollectible(config.step)
    const value =
      agentDI.stats.getValuesByMode()[agentDI.glossary.finalizerTypes.COLLECTIBLE]
    agentDI.featurer.add({
      type: agentDI.glossary.finalizerTypes.COLLECTIBLE,
      name: config.name,
      value,
    })
  }

  function isEnable(): boolean {
    let result = true
    for (const conditionType of config.conditions) {
      result = result && conditions[conditionType](params)
      if (!result) {
        return result
      }
    }
    return result
  }
}

/** @type {FinalizerInterface} */
export default { check }
