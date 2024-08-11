import { injectable } from 'tsyringe';

import { RoundInjector } from './round-injector';
import { RoundState } from './round-state';

@injectable()
export class RoundProcessor {
  constructor(
    private readonly injector: RoundInjector,
    private readonly roundState: RoundState,
  ) {}

  /**
   * Executes the round processing using the worker in the current round state.
   */
  public run(): void {
    try {
      const worker = this.roundState.params.agentDI?.worker;
      if (worker) {
        worker.run(this.roundState.params);
      } else {
        console.error('Worker is not defined in the round state.');
      }
    } catch (error) {
      console.error('Error executing the round processing:', error);
    }
  }

  /**
   * Retrieves the result of the round processing.
   * @returns An object containing the contexts from the round state.
   */
  public getResult(): { contexts: any } {
    try {
      return {
        contexts: this.roundState.params.contexts,
      };
    } catch (error) {
      console.error('Error retrieving the result:', error);
      return { contexts: {} };
    }
  }
}
