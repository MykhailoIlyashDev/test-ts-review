import conditions from '../conditions'
import { ISpinParams } from '../../../types'

/**
 * @param {ISpinParams} params
 */
function check(params: ISpinParams): void {
  const { settings, agentDI } = params
  const { finalizerBase: config } = settings.finalizer
  if (isEnable()) {
    params.agentDI.injector.inject(params,{ contexts: ['1'] })
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
