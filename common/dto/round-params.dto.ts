export class RoundParamsDto {
    someArgs: string

  constructor(data: Partial<RoundParamsDto>) {
    Object.assign(this, data)
  }
}