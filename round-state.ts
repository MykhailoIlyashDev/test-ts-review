import { Lifecycle, scoped } from 'tsyringe'
import { RoundParamsDto } from './common/dto/round-params.dto'
import { ModeParams } from './types'
import finalizer from './components/finalizer'
import worker from './components/worker'
import config from './config'

@scoped(Lifecycle.ResolutionScoped)
export class RoundState {
  public agentDI = {
    finalizer: finalizer,
    worker: worker,
    injector: null,
  }
  public params: Partial<ModeParams>

  constructor(public readonly args: RoundParamsDto) {
    this.params = {
      args,
      settings: config.settings,
      agentDI: this.agentDI,
      mode: config.mode,
    }
  }

  public registerInAgent(data: { [name: string]: any }): void {
    Object.assign(this.agentDI, data)
  }
}