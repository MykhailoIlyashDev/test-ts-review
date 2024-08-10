import { injectable } from 'tsyringe'
import { RoundInjector } from './round-injector'
import { RoundState } from './round-state'

@injectable()
export class RoundProcessor {
  constructor(
    private injector: RoundInjector,
    private roundState: RoundState,
  ) {}

  public run (): void {
    const a = {}
    this.roundState.params.agentDI.worker.run(this.roundState.params)
  }

  public getResult() {
    return {
      contexts: this.roundState.params.contexts,
    }
  }
}