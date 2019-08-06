//import { nbformat } from '@jupyterlab/coreutils';
//https://github.com/jupyterlab/jupyterlab/blob/88e20b03fbebf31b45b483797a6ed4947fd85606/packages/cells/src/model.ts
import { Notebook } from '@jupyterlab/notebook';
//cellmodel.value.text
export function paste(notebook: Notebook): void {
  const model = notebook.model;
  model;
  //cell
  //model.contentFactory.createMarkdownCell({ cell });
}