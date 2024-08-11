type Worker = {
  run: (params: ISpinParams) => void;
};

export type ISpinParams = {
  mode?: string;
  settings?: Record<string, any>;
  args?: Record<string, any>;
  agentDI?: {
    injector?: any;
    finalizer?: any;
    featurer?: any;
    stats?: any;
    glossary?: {
      finalizerTypes?: {
        [key: string]: string;
      };
    };
    worker?: Worker;
  };
  multiplier?: number;
  credit?: number;
  size?: number[];
  strips?: string[];
  stops?: number[];
  reels?: string[];
  layout?: Record<string, any>;
  matrix?: string[];
  win?: {
    total?: number;
    [key: string]: any;
  };
  features?: {
    finished?: boolean;
    [key: string]: any;
  };
  cheats?: string;
  enable?: boolean;
  predefined?: Record<string, any>;
  specialSymbols?: string[];
  parent?: string;
  finalizer?: Record<string, any>;
  winPayouts?: Record<string, any>;
  blockedWinPatterns?: string[];
  buy?: boolean;
  contexts?: Record<string, any>;
}

export type ModeParams = Partial<ISpinParams>

export type InjectionToPatternItem = {
  from: string
  to: string
  params?: any
}

export type ModulesInjectiveFunctions = Function[]

export type InjectionToRoundState = Record<string, any>;
