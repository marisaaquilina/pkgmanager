import {
  JupyterFrontEnd, JupyterFrontEndPlugin, 
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker, 
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';

import '../style/index.css';

//Expriments


/**
 * Initialization data for the pkginstaller extension.
 */
const pkginstaller: JupyterFrontEndPlugin<void> = {
  id: 'pkginstaller',
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker) => {  
    const packageTool = new PackageTool(app, notebookTracker);
    cellTools.addItem({ tool: packageTool });
    console.log('Ya\'ll')
  }
};

/**
 * Experimnents
 */

export default [
  pkginstaller,
];