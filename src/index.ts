import {
  JupyterFrontEnd, JupyterFrontEndPlugin, 
} from '@jupyterlab/application';

import {
  INotebookTools, INotebookTracker, 
} from '@jupyterlab/notebook';

import PackageTool from './PackageTool';

import '../style/index.css';

/**
 * Experiments BELOW
 */
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ICommandPalette } from '@jupyterlab/apputils';

import {
  ISearchProviderRegistry,
  SearchInstance,
  SearchProviderRegistry,
  CodeMirrorSearchProvider,
  NotebookSearchProvider
} from '@jupyterlab/documentsearch';

import { IMainMenu } from '@jupyterlab/mainmenu';

/**
 * Initialization data for the document-search extension.
 */
const extension: JupyterFrontEndPlugin<ISearchProviderRegistry> = {
  id: '@jupyterlab/documentsearch:plugin',
  provides: ISearchProviderRegistry,
  optional: [ICommandPalette, IMainMenu],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    mainMenu: IMainMenu | null
  ) => {
    // Create registry, retrieve all default providers
    const registry: SearchProviderRegistry = new SearchProviderRegistry();

    // Register default implementations of the Notebook and CodeMirror search providers
    registry.register('jp-notebookSearchProvider', NotebookSearchProvider);
    registry.register('jp-codeMirrorSearchProvider', CodeMirrorSearchProvider);

    const activeSearches = new Map<string, SearchInstance>();

    const startCommand: string = 'documentsearch:start';
    const nextCommand: string = 'documentsearch:highlightNext';
    const prevCommand: string = 'documentsearch:highlightPrevious';
    app.commands.addCommand(startCommand, {
      label: 'Find…',
      isEnabled: () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        return registry.getProviderForWidget(currentWidget) !== undefined;
      },
      execute: () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        const widgetId = currentWidget.id;
        let searchInstance = activeSearches.get(widgetId);
        if (!searchInstance) {
          const searchProvider = registry.getProviderForWidget(currentWidget);
          if (!searchProvider) {
            return;
          }
          searchInstance = new SearchInstance(currentWidget, searchProvider);

          activeSearches.set(widgetId, searchInstance);
          // find next and previous are now enabled
          app.commands.notifyCommandChanged();

          searchInstance.disposed.connect(() => {
            activeSearches.delete(widgetId);
            // find next and previous are now not enabled
            app.commands.notifyCommandChanged();
          });
        }
        searchInstance.focusInput();
      }
    });

    app.commands.addCommand(nextCommand, {
      label: 'Find Next',
      isEnabled: () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        return activeSearches.has(currentWidget.id);
      },
      execute: async () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        const instance = activeSearches.get(currentWidget.id);
        if (!instance) {
          return;
        }

        await instance.provider.highlightNext();
        instance.updateIndices();
      }
    });

    app.commands.addCommand(prevCommand, {
      label: 'Find Previous',
      isEnabled: () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        return activeSearches.has(currentWidget.id);
      },
      execute: async () => {
        const currentWidget = app.shell.currentWidget;
        if (!currentWidget) {
          return;
        }
        const instance = activeSearches.get(currentWidget.id);
        if (!instance) {
          return;
        }

        await instance.provider.highlightPrevious();
        instance.updateIndices();
      }
    });

    // Add the command to the palette.
    if (palette) {
      palette.addItem({ command: startCommand, category: 'Main Area' });
      palette.addItem({ command: nextCommand, category: 'Main Area' });
      palette.addItem({ command: prevCommand, category: 'Main Area' });
    }
    // Add main menu notebook menu.
    if (mainMenu) {
      mainMenu.editMenu.addGroup(
        [
          { command: startCommand },
          { command: nextCommand },
          { command: prevCommand }
        ],
        10
      );
    }

    // Provide the registry to the system.
    return registry;
  }
};

/**
 * Experiments ABOVE
 */



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
    console.log(':-)');
  }
};


export default [
  pkginstaller, extension, 
];