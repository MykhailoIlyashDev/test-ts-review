import "reflect-metadata"

import { RoundService } from './round.service'
import { RoundParamsDto } from './common/dto/round-params.dto'
import * as process from 'node:process'

const roundService = new RoundService()


const res = roundService.go(new RoundParamsDto({}))

console.log(res)
process.exit(0)

