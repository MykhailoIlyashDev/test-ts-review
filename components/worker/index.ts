import { ISpinParams } from '../../types';

function run(params: ISpinParams): void {
  if (!params || !params.agentDI) {
    console.error('Invalid parameters: missing agentDI.');
    return;
  }

  const { injector, finalizer } = params.agentDI;

  if (!injector || typeof injector.inject !== 'function') {
    console.error('Invalid injector: missing or incorrect injector function.');
    return;
  }

  if (!finalizer || typeof finalizer.finish !== 'function') {
    console.error('Invalid finalizer: missing or incorrect finish function.');
    return;
  }

  try {
    injector.inject(params, { win: { total: 100 } });
    finalizer.finish(params);
  } catch (error) {
    console.error('Error executing run function:', error);
  }
}

export default { run };
