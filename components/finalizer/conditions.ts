import { ISpinParams } from '../../types'

/**
 * @param {ISpinParams} params
 */
function lessThanMaxValue(params: ISpinParams): boolean {
  const { settings, agentDI } = params
  const { [agentDI.glossary.finalizerTypes.COLLECTIBLE]: config } =
    settings.finalizer
  const { [agentDI.glossary.finalizerTypes.COLLECTIBLE]: currentValue } =
    agentDI.stats.getValuesByMode()
  return currentValue < config.max
}

/**
 * @param {ISpinParams} params
 */
function previousWinSmaller(params: ISpinParams): boolean {
  const { agentDI, win } = params
  const { prevWin } = agentDI.stats.getValuesByMode()
  return win?.total ? win.total > prevWin : false
}

/**
 * @param {ISpinParams} params
 */
function isNotFirstSpin(params: ISpinParams): boolean {
  const { agentDI } = params
  const statsValues = agentDI.stats.getValuesByMode()
  return statsValues.total - 1 !== statsValues.rest
}

/**
 * @param {ISpinParams} params
 */
function hasWin(params: ISpinParams): boolean {
  const { win } = params
  return win?.total ? win.total > 0 : false
}

/**
 * @param {ISpinParams} params
 */
function isFinished(params: ISpinParams): boolean {
  const { features } = params
  return features.finished
}

export default {
  lessThanMaxValue,
  previousWinSmaller,
  isNotFirstSpin,
  hasWin,
  isFinished,
}
