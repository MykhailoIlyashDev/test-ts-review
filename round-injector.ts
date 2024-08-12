import { Lifecycle, scoped } from 'tsyringe';

import { RoundState } from './round-state';
import { InjectionToPatternItem, ISpinParams, ModulesInjectiveFunctions } from './types';
import { InjectionToRoundState } from './types';

enum InjectionType {
  NEXT_MODE = 'nextMode',
  TO_DELETE = 'toDelete',
  TO_PATTERN = 'toPattern',
  TO_ROUND_OBJECT = 'toRoundState',
}

const propSeparator = '@';

@scoped(Lifecycle.ResolutionScoped)
export class RoundInjector {
  public injectiveFunctions: Record<string, Record<string, (...args: any[]) => any>> = {};

  private all: Record<string, any> = {};
  private next: Record<string, any> = {};
  private [InjectionType.TO_DELETE]: string[] = [];
  private [InjectionType.TO_PATTERN]: InjectionToPatternItem[] = [];
  private [InjectionType.TO_ROUND_OBJECT]: InjectionToRoundState = {};
  private history: Partial<ISpinParams>[] = [];

  constructor(private readonly roundState: RoundState) {
    this.roundState.registerInAgent({ injector: this });

    this[InjectionType.TO_ROUND_OBJECT] = {
      roundState: this.roundState.params.args.state,
      updates: {},
    };
  }

  public getWinPatternInjections(pattern: string): Partial<ISpinParams> {
    const result: Partial<ISpinParams> = {};

    const relevantInjections = this[InjectionType.TO_PATTERN].filter(({ to }) => to === pattern);

    for (const item of relevantInjections) {
      this.history.push(item.params);
      this.inject(result, item.params);
    }

    this[InjectionType.TO_PATTERN] = this[InjectionType.TO_PATTERN].filter(({ to }) => to !== pattern);

    return result;
  }

  public executeInjections(params: ISpinParams, updates: Partial<ISpinParams>): ISpinParams {
    this.handleDeletions(params);
    this.inject(params, updates);

    const result = { ...params, ...this.all, ...this.next };

    this.next = {};
    this[InjectionType.TO_DELETE] = [];

    return result;
  }

  public executeInjectionsToRoundState(): Partial<ISpinParams> {
    const result: Partial<ISpinParams> = {};
    this.inject(result, this[InjectionType.TO_ROUND_OBJECT].updates);

    this[InjectionType.TO_ROUND_OBJECT].updates = {};
    return result;
  }

  public addInjectionsToRoundState(updates: Record<string, any>): void {
    Object.assign(this[InjectionType.TO_ROUND_OBJECT].updates, updates);
  }

  public injectToNextMode(newParams: Record<string, any>): void {
    Object.assign(this.next, newParams);
  }

  public injectToAllModes(newParams: Record<string, any>): void {
    Object.assign(this.all, newParams);
  }

  public injectToCurrentMode(params: ISpinParams, updates: Partial<ISpinParams>): void {
    this.inject(params, updates, true);
  }

  public deleteFromParams(prop: string): void {
    this[InjectionType.TO_DELETE].push(prop);
  }

  public deleteFromParamsChildProperty(prop: string, child: string): void {
    this[InjectionType.TO_DELETE].push(`${prop}${propSeparator}${child}`);
  }

  public addInjectiveFunctions(module: string, functions: ModulesInjectiveFunctions): void {
    this.injectiveFunctions[module] = {};

    functions.forEach(fn => {
      this.injectiveFunctions[module][fn.name] = fn as (...args: any[]) => any;
    });
  }

  public injectToWinPattern(item: InjectionToPatternItem): void {
    this[InjectionType.TO_PATTERN].push(item);
  }

  public addInjectionToWinPattern(item: InjectionToPatternItem): void {
    this.injectToWinPattern(item);
  }

  public getHistory(): Partial<ISpinParams>[] {
    return this.history;
  }

  private inject(params: ISpinParams, updates: Partial<ISpinParams>, replaceArrays = false): void {
    if (updates) {
      const updatesKeys = Object.keys(updates);

      for (const updateKey of updatesKeys) {
        if (
          !replaceArrays &&
          updateKey in params &&
          Array.isArray(params[updateKey]) &&
          Array.isArray(updates[updateKey])
        ) {
          params[updateKey].push(...updates[updateKey]);
          delete updates[updateKey];
        }
      }

      Object.assign(params, updates);
      this.history.push(updates);
    }
  }

  private handleDeletions(params: ISpinParams): void {
    for (const prop of this[InjectionType.TO_DELETE]) {
      if (prop.includes(propSeparator)) {
        const [parent, child] = prop.split(propSeparator);
        delete params[parent]?.[child];
      } else {
        delete params[prop];
      }
    }
  }
}
