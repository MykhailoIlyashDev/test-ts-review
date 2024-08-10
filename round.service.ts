import { container } from 'tsyringe'
import { RoundParamsDto } from './common/dto/round-params.dto'
import { RoundProcessor } from './round-processor'
import { RoundState } from './round-state'

export class RoundService {
  go(params: RoundParamsDto) {
    const roundProcessor = container.createChildContainer()
      .register(RoundState, { useValue: new RoundState(params) })
      .resolve(RoundProcessor)

    roundProcessor.run()

    return roundProcessor.getResult() as any
  }
}