import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';


/**
 * Initialization data for the pkgmanager extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'pkgmanager',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension pkgmanager is activated!');
  }
};

export default extension;
