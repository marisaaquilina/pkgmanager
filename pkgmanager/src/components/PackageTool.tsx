import {
  NotebookTools,
  INotebookTracker,
  //NotebookPanel,
} from '@jupyterlab/notebook';

import { PanelLayout } from '@phosphor/widgets';

import { JupyterFrontEnd } from '@jupyterlab/application';

import { PackageSearcher } from './PackageBar';

import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';

class PackageTool extends NotebookTools.Tool {
  readonly app: JupyterFrontEnd;
  constructor(app: JupyterFrontEnd, notebookTracker: INotebookTracker) {
    super();
    this.app = app;
    //this.notebookTracker = notebookTracker;
    this.layout = new PanelLayout();
    let layout = this.layout as PanelLayout;
      let count = layout.widgets.length;
      for (let i = 0; i < count; i++) {
        layout.widgets[0].dispose();
      }
      //const panel: NotebookPanel = this.notebookTracker.currentWidget;
      const cellWidget = ReactWidget.create(<PackageSearcher/>);
      layout.addWidget(cellWidget);
  }  
  //private notebookTracker: INotebookTracker;
}

export default PackageTool;