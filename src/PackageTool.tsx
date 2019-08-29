import { NotebookTools, INotebookTracker } from '@jupyterlab/notebook';

import { PanelLayout } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { JupyterFrontEnd } from '@jupyterlab/application';

import { PackageSearcher } from './PackageBar';

import { ReactWidget } from '@jupyterlab/apputils';

import * as React from 'react';
import { KernelSpyModel } from './model';

import { MessageLogView } from './widget';
import { Kernel } from '@jupyterlab/services';

class PackageTool extends NotebookTools.Tool {
  readonly app: JupyterFrontEnd;
  constructor(app: JupyterFrontEnd, notebookTracker: INotebookTracker) {
    super();
    this.app = app;
    this.notebookTracker = notebookTracker;
    this.layout = new PanelLayout();
  } 
  protected onAfterAttach(msg: Message): void {
    this.notebookTracker.currentWidget.session.ready.then(() => {
      let layout = this.layout as PanelLayout;
      let count = layout.widgets.length;
      for (let i = 0; i < count; i++) {
        layout.widgets[0].dispose();
      }
      let session = this.notebookTracker.currentWidget.session;
      let model = new KernelSpyModel(session.kernel! as Kernel.IKernel);
      const view = new MessageLogView(model, session.kernel.id, session.kernelDisplayName, layout);
      layout.addWidget(view);
      const cellWidget = ReactWidget.create(<PackageSearcher kernelId={session.kernel.id} kernelName={session.kernelDisplayName} uninstalledPackage={''} moduleError={false} layouty={layout}/>);
      layout.addWidget(cellWidget);
    });
  }
  protected onActiveCellChanged(msg: Message): void {
    if (this.notebookTracker.currentWidget && this.notebookTracker.currentWidget.session) {
      this.notebookTracker.currentWidget.session.ready.then(() => {
        let layout = this.layout as PanelLayout;
        let count = layout.widgets.length;
        for (let i = 0; i < count; i++) {
          layout.widgets[0].dispose();
        }
        let session = this.notebookTracker.currentWidget.session;
        let model = new KernelSpyModel(session.kernel! as Kernel.IKernel);
        const view = new MessageLogView(model, session.kernel.id, session.kernelDisplayName, layout);
        layout.addWidget(view);
        console.log("What is value of view on cell change", view);
        const cellWidget = ReactWidget.create(<PackageSearcher kernelId={session.kernel.id} kernelName={session.kernelDisplayName} uninstalledPackage={''} moduleError={false} layouty={layout}/>);
        layout.addWidget(cellWidget);
        console.log(layout.widgets.length);
      });
    }
  }
  
  private notebookTracker:INotebookTracker;
}

export default PackageTool;