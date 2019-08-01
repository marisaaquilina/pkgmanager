import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker
} from '@jupyterlab/notebook';


import PackageTool from './components/PackageTool';

/**
 * Initialization data for the pkgmanager extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkgmanager',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {
    console.log(14);

  const packageTool = new PackageTool(app, notebookTracker);
  cellTools.addItem({ tool: packageTool });
  }
};

export default extension;
