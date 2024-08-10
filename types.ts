export type ISpinParams = {
  mode?: string
  settings?: any
  args?: Record<string, any>
  agentDI?: any
  multiplier?: number
  credit?: number
  size?: number[]
  strips?: string[]
  stops?: number[]
  reels?: string[]
  layout?: any
  matrix?: string[]
  win?: any
  features?: any
  cheats?: string
  enable?: boolean
  predefined?: any
  specialSymbols?: string[]
  parent?: string
  finalizer?: any
  winPayouts?: any
  blockedWinPatterns?: string[]
  buy?: boolean
  contexts?: any
}

export type ModeParams = Partial<ISpinParams>

export type InjectionToPatternItem = {
  from: string
  to: string
  params?: any
}

export type ModulesInjectiveFunctions = Function[]

export type InjectionToRoundState = any