import { container, DependencyContainer } from 'tsyringe';

import { RoundParamsDto } from './common/dto/round-params.dto';
import { RoundProcessor } from './round-processor';
import { RoundState } from './round-state';

export class RoundService {
  /**
   * Executes the round processing and returns the result.
   * @param {RoundParamsDto} params - The parameters for the round processing.
   * @returns {unknown} - The result of the round processing.
   */
  public go(params: RoundParamsDto): unknown {
    try {
      const childContainer: DependencyContainer = container.createChildContainer();
      childContainer.register(RoundState, { useValue: new RoundState(params) });
      const roundProcessor: RoundProcessor = childContainer.resolve(RoundProcessor);
      roundProcessor.run();

      return roundProcessor.getResult();
    } catch (error) {
      console.error('Error processing the round:', error);
      return { contexts: {} };
    }
  }
}
