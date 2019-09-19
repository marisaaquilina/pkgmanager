import {
  JupyterFrontEnd, JupyterFrontEndPlugin, 
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker, NotebookPanel, 
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
  activate: (app: JupyterFrontEnd, cellTools: INotebookTools, notebookTracker: INotebookTracker, panel: NotebookPanel) => {  
    const packageTool = new PackageTool(app, notebookTracker, panel);
    cellTools.addItem({ tool: packageTool });
    console.log(':-))))');
  }
};

/**
 * Experimnents
 */

export default [
  pkginstaller,
];