import 'reflect-metadata';
import { exit } from 'process';

import { RoundParamsDto } from './common/dto/round-params.dto';
import { RoundService } from './round.service';

async function main() {
  try {
    const roundService = new RoundService();
    const roundParams = new RoundParamsDto({});

    const result = await roundService.go(roundParams);

    console.log(result);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    exit(0);
  }
}

main();
