import conditions from '../conditions'
import { ISpinParams } from '../../../types'

/**
 * @param {ISpinParams} params
 */
function check(params: ISpinParams): void {
  const { settings, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.FUNCTION]: config } =
    settings.finalizer
  if (isEnable()) {
    config.fn(params)
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
