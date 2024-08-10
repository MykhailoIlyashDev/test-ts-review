import conditions from '../conditions'
import { ISpinParams } from '../../../types'

/**
 * @param {ISpinParams} params
 */
function check(params: ISpinParams): any {
  const { settings, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.CONTEXT]: config } = settings.finalizer
  if (isEnable()) {
    return config.toContext
  }

  function isEnable(): boolean {
    for (const conditionType of config.conditions) {
      const conditionResult = conditions[conditionType](params)
      if (!conditionResult) {
        return false
      }
    }
    return true
  }
}

/** @type {FinalizerInterface} */
export default { check }
