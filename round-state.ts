import { Lifecycle, scoped } from 'tsyringe';

import { RoundParamsDto } from './common/dto/round-params.dto';
import finalizer from './components/finalizer';
import worker from './components/worker';
import config from './config';
import { ModeParams } from './types';

@scoped(Lifecycle.ResolutionScoped)
export class RoundState {
  public agentDI: {
    finalizer: typeof finalizer;
    worker: typeof worker;
    injector: any | null;
  } = {
      finalizer,
      worker,
      injector: null,
    };

  public params: Partial<ModeParams>;

  constructor(public readonly args: RoundParamsDto) {
    this.params = {
      args,
      settings: config.settings,
      agentDI: this.agentDI,
      mode: config.mode,
    };
  }

  /**
   * Registers additional data in the `agentDI` object.
   * @param data - An object containing additional properties to be added to `agentDI`.
   */
  public registerInAgent(data: Record<string, unknown>): void {
    Object.assign(this.agentDI, data);
  }
}
