import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker
} from '@jupyterlab/notebook';

import { Kernel } from '@jupyterlab/services';

import PackageTool from './components/PackageTool';

/**
 * Initialization data for the pkgmanager extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkgmanager',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {
    console.log('2');
    Kernel.listRunning().then(kernelModels => {
      console.log(kernelModels, kernelModels[0])
      const kernel = Kernel.connectTo(kernelModels[0]);
      if (kernel) {
        kernel.requestExecute({ code: '%pip install gender-guesser' });
        console.log("Finished")
      }
  });
  const packageTool = new PackageTool(app, notebookTracker);
  cellTools.addItem({ tool: packageTool });
  }
};

export default extension;
