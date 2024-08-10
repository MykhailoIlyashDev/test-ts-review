import { ISpinParams } from '../../types'

function run(params: ISpinParams) {
  params.agentDI.injector.inject(params, { win: { total: 100 }})
  params.agentDI.finalizer.finish(params)
}

export default { run }