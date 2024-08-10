import { Lifecycle, scoped } from 'tsyringe'
import { InjectionToPatternItem, ISpinParams, ModulesInjectiveFunctions } from './types'
import { RoundState } from './round-state'
import { InjectionToRoundState } from './types'

enum InjectionType {
  NEXT_MODE = 'nextMode',
  TO_DELETE = 'toDelete',
  TO_PATTERN = 'toPattern',
  TO_ROUND_OBJECT = 'toRoundState',
}

const propSeparator = '@'

@scoped(Lifecycle.ResolutionScoped)
export class RoundInjector {
  public injectiveFunctions: Record<string, Record<string, Function>> = {}

  private all: Record<string, any> = {}
  private next: Record<string, any> = {}
  private [InjectionType.TO_DELETE]: string[] = []
  private [InjectionType.TO_PATTERN]: InjectionToPatternItem[] = []
  private [InjectionType.TO_ROUND_OBJECT]: InjectionToRoundState = {}
  private history: any[] = []

  constructor(private roundState: RoundState) {
    this.roundState.registerInAgent({ injector: this })

    this[InjectionType.TO_ROUND_OBJECT] = {
      roundState: this.roundState.params.args.state,
      updates: {},
    }
  }

  public getWinPatternInjections = (pattern: string) => {
    const result: Partial<ISpinParams> = {}

    if (Object.keys(this[InjectionType.TO_PATTERN]).length !== 0) {
      const list = this[InjectionType.TO_PATTERN].filter(({ to }: InjectionToPatternItem) => pattern === to)

      if (list.length) {
        for (const item of list) {
          this.history.push(item)
          this.inject(result, item.params)
        }

        this[InjectionType.TO_PATTERN] = this[InjectionType.TO_PATTERN]
          .filter(({ to }: InjectionToPatternItem) => pattern !== to)
      }
    }

    return result
  }

  public executeInjections = (params: ISpinParams, updates) => {
    for (const prop of this.toDelete) {
      if (prop.search(propSeparator) > -1) {
        const [parent, child] = prop.split(propSeparator)
        delete params[parent][child]
      }
      else {
        delete params[prop]
      }
    }

    this.inject(params, updates)

    const result = { ...params, ...this.all, ...this.next }

    this.next = {}
    this.toDelete = []

    return result
  }

  public executeInjectionsToRoundState = () => {
    const result = {}
    this.inject(result, this[InjectionType.TO_ROUND_OBJECT].updates)

    this[InjectionType.TO_ROUND_OBJECT].updates = {}
    return result
  }

  public addInjectionsToRoundState = (updates: Record<string, any>) => {
    Object.assign(this[InjectionType.TO_ROUND_OBJECT].updates, updates)
  }

  public injectToNextMode = (newParams: Record<string, any>) => {
    Object.assign(this.next, newParams)
  }

  public injectToAllModes = (newParams: Record<string, any>) => {
    Object.assign(this.all, newParams)
  }

  public injectToCurrentMode = (params: ISpinParams, updates: Record<string, any>) => {
    this.inject(params, updates, true)
  }

  public deleteFromParams = (prop: string) => {
    this.toDelete.push(prop)
  }

  public deleteFromParamsChildProperty = (prop: string, child: string) => {
    this.toDelete.push(`${prop}${propSeparator}${child}`)
  }

  public addInjectiveFunctions = (
    module: string,
    functions: ModulesInjectiveFunctions,
  ) => {
    this.injectiveFunctions[module] = {}

    Object.assign(this.injectiveFunctions[module], ...functions.map((fn: Function) => ({ [fn.name]: fn })))
  }

  public injectToWinPattern = (item: InjectionToPatternItem) => {
    this[InjectionType.TO_PATTERN].push(item)
  }

  public addInjectionToWinPattern = (item: InjectionToPatternItem) => {
    this.injectToWinPattern(item)
  }

  public getHistory = () => {
    return this.history
  }

  private inject(params: ISpinParams, updates: Partial<ISpinParams>, replaceArrays = false) {
    if (updates) {
      const updatesKeys = Object.keys(updates)

      for (const updateKey of updatesKeys) {
        if (!replaceArrays && updateKey in params && Array.isArray(params[updateKey])) {
          params[updateKey].push(...updates[updateKey])
          delete updates[updateKey]
        }
      }

      Object.assign(params, updates)
      this.history.push(updates)
    }
  }
}