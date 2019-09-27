import { PanelLayout } from '@phosphor/widgets';

import { Dialog, showDialog, IClientSession, VDomRenderer, VDomModel } from '@jupyterlab/apputils';

import { Kernel, KernelMessage, Session } from '@jupyterlab/services';

import React, { useState, useCallback } from 'react'; 

import { Dropdown } from './Dropdown';

import StyleClasses from './style';

import { JSONExt } from '@phosphor/coreutils';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

interface PackageSearcherProps {
  kernelId: string;
  kernelName: string;
  uninstalledPackage: string;
  moduleError: boolean;
  layouty: PanelLayout;
}

/**
  * Return a human-friendly message indicating whether the installation 
  * or uninstallation process was successful.
  */
function getPipMessage(install: boolean, successfulProcess: boolean, packageToProcess: string): string {
  if (successfulProcess === true) {
    let baseMsg: string = '✨ ';
    install ? baseMsg += 'Installed ' : baseMsg += 'Uninstalled ';
    return baseMsg + packageToProcess + '!';
  } else if (successfulProcess === false) {
  let baseMsg: string = packageToProcess + ' could not ';
  install? baseMsg += 'install.' : baseMsg += 'uninstall.';
  return baseMsg;
  }
  return 'Working... Please wait.';
}

/**
  * Render a search-bar-and-buttons UI that allows
  * installation and uninstallation of packages.
  */
export function PackageSearcher(props: PackageSearcherProps) {
  const [input, setInput] = useState('');
  const [packageToProcess, setPackageToProcess] = useState('');
  const [install, setInstall] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [successfulProcess, setSuccessfulProcess] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false)
  const [stdOut, setStdOut] = useState([]);
  const [moduleErrorOccurred, setModuleErrorOccurred] = useState(props.moduleError);

  /**
    * Parse stdout messages during the installation or uninstallation process to
    * determine if the process is successful.
    */
  function parseMessage(msg: KernelMessage.IStreamMsg): void {
    let msgContent = msg.content;
    if (msgContent.hasOwnProperty('text')) {
      stdOut.unshift({value: msgContent.text, label: msgContent.text});
      setStdOut(stdOut);
      if (msgContent.text.includes('Successfully') || 
        msgContent.text.includes('already satisfied')) {
        setSuccessfulProcess(true);
      } else if (msgContent.text.includes('ERROR') || 
        msgContent.text.includes('Skipping')) {
        setSuccessfulProcess(false);
      } 
      setIsProcessing(false);
      setShowMessage(true);
      setModuleErrorOccurred(false);
    }
  }

  /**
    * Execute an inline pip magic in the current active kernel's 
    * environment to install or uninstall a package.
    */
  const sendRequest = useCallback(async (input: string, install: boolean) => {
    setIsProcessing(true);
    setPackageToProcess(input);
    let pipCommand: string = '';
    install ? pipCommand = '%pip install ' : pipCommand = '%pip uninstall -y ';
    Kernel.listRunning().then(kernelModels => {
      const kernel = Kernel.connectTo(
        (kernelModels.filter(kernelModel => kernelModel.id === props.kernelId))[0]
      );
      kernel.requestExecute({
        code: pipCommand + input, silent: true
      }).onIOPub = msg => {parseMessage(msg as KernelMessage.IStreamMsg); 
      }; 
    });
  }, [isProcessing]) 

  /**
    * Show a Package Not Found dialog if a ModuleNotFound error occurs.
    */
  function installDialog(chooseError: string) {
    let body = (
      <div>
        <p>
          Would you like to install <span className={PackageBarStyleClasses.uninstalledPackage}>{chooseError}</span> in this kernel?</p>
      </div>
    );
    return showDialog({
      title: 'Package Not Found',
      body,
      buttons: [
        Dialog.cancelButton(),
        Dialog.okButton({
          label: 'Install',
          caption: 'Install package in this kernel'
        })
      ]
    }).then(result => {
      if (result.button.accept) {
        sendRequest(chooseError, true); 
        setInstall(true);
      }
      return result.button.accept;
    });
  }
  if (moduleErrorOccurred) { 
    let uninstalledPackage: string = props.uninstalledPackage;
    if (uninstalledPackage) {
      installDialog(uninstalledPackage);
    }
    setInput(uninstalledPackage);
    setModuleErrorOccurred(false);
  }
  return (
    <div className={PackageBarStyleClasses.packageContainer}>
      <p className={PackageBarStyleClasses.title}>Package Installer</p>
      <p className={PackageBarStyleClasses.topBar}>Current Environment: {props.kernelName}</p>
      <div className={PackageBarStyleClasses.search}>
        <div className={PackageBarStyleClasses.heading}>
          <p className={PackageBarStyleClasses.searchTitle}>Package Name</p>
          {isProcessing && <p className={PackageBarStyleClasses.messageText}>Working... Please wait.</p>}
          {!isProcessing && showMessage && <p className={PackageBarStyleClasses.messageText}>{getPipMessage(install, successfulProcess, packageToProcess)}</p>}
        </div>
        {!moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={input} 
              onChange={e => setInput(e.target.value)}
              type='text'
              name='packageToProcess'
              required
        />}
        {moduleErrorOccurred && <input id='result' className={PackageBarStyleClasses.packageInput}
              value={props.uninstalledPackage} 
              onChange={e => setInput(e.target.value)}
              type='text'
              name='packageToProcess'
              required
        />}
      </div>
      <div className={PackageBarStyleClasses.buttonContainer}>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, true); setInstall(true);}}>
          Install
        </button>
        <button className={PackageBarStyleClasses.pipButton}
        onClick={() => {sendRequest(input, false); setInstall(false);}}>
          Uninstall
        </button>
      </div>
      {successfulProcess && showMessage && !isProcessing && <p className={PackageBarStyleClasses.kernelPrompt}>You may need to update the kernel to see updated packages.</p>}
      {showMessage && <Dropdown stdOut={stdOut}/>}
    </div>
  );
}
/** From status bar */
/**
 * A VDomRenderer widget for displaying the status of a kernel.
 */
export class KernelStatus extends VDomRenderer<KernelStatus.Model> {
  /**
   * Construct the kernel status widget.
   */
  constructor(opts: KernelStatus.IOptions) {
    super();
    //this._handleClick = opts.onClick;
    this.model = new KernelStatus.Model();
    //this.addClass(interactiveItem);
  }

  /**
   * Render the kernel status item.
   */
  render() {
    if (this.model === null) {
      return null;
    } else {
      return (
        <p>{this.model.kernelName}: {this.model.status}</p>
      );
    }
  }

  //private _handleClick: () => void;
}

/**
 * A namespace for KernelStatus statics.
 */
export namespace KernelStatus {
  /**
   * A VDomModel for the kernel status indicator.
   */
  export class Model extends VDomModel {
    /**
     * The name of the kernel.
     */
    get kernelName() {
      return this._kernelName;
    }

    /**
     * The current status of the kernel.
     */
    get status() {
      return this._kernelStatus;
    }

    /**
     * A display name for the activity.
     */
    get activityName(): string {
      return this._activityName;
    }
    set activityName(val: string) {
      const oldVal = this._activityName;
      if (oldVal === val) {
        return;
      }
      this._activityName = val;
      this.stateChanged.emit(void 0);
    }

    /**
     * The current client session associated with the kernel status indicator.
     */
    get session(): IClientSession | null {
      return this._session;
    }
    set session(session: IClientSession | null) {
      const oldSession = this._session;
      if (oldSession !== null) {
        oldSession.statusChanged.disconnect(this._onKernelStatusChanged);
        oldSession.kernelChanged.disconnect(this._onKernelChanged);
      }

      const oldState = this._getAllState();
      this._session = session;
      if (this._session === null) {
        this._kernelStatus = 'unknown';
        this._kernelName = 'unknown';
      } else {
        this._kernelStatus = this._session.status;
        this._kernelName = this._session.kernelDisplayName;

        this._session.statusChanged.connect(this._onKernelStatusChanged);
        this._session.kernelChanged.connect(this._onKernelChanged);
      }

      this._triggerChange(oldState, this._getAllState());
    }

    /**
     * React to changes to the kernel status.
     */
    private _onKernelStatusChanged = (
      _session: IClientSession,
      status: Kernel.Status
    ) => {
      this._kernelStatus = status;
      this.stateChanged.emit(void 0);
    };

    /**
     * React to changes in the kernel.
     */
    private _onKernelChanged = (
      _session: IClientSession,
      change: Session.IKernelChangedArgs
    ) => {
      const oldState = this._getAllState();
      const { newValue } = change;
      if (newValue !== null) {
        newValue.getSpec().then(spec => {
          // sync setting of status and display name
          this._kernelStatus = newValue.status;
          this._kernelName = spec.display_name;
          this._triggerChange(oldState, this._getAllState());
        });
      } else {
        this._kernelStatus = 'unknown';
        this._kernelName = 'unknown';
        this._triggerChange(oldState, this._getAllState());
      }
    };

    private _getAllState(): [string, string, string] {
      return [this._kernelName, this._kernelStatus, this._activityName];
    }

    private _triggerChange(
      oldState: [string, string, string],
      newState: [string, string, string]
    ) {
      if (JSONExt.deepEqual(oldState, newState)) {
        this.stateChanged.emit(void 0);
      }
    }

    private _activityName: string = 'activity';
    private _kernelName: string = 'unknown';
    private _kernelStatus: Kernel.Status = 'unknown';
    private _session: IClientSession | null = null;
  }

  /**
   * Options for creating a KernelStatus object.
   */
  export interface IOptions {
    /**
     * A click handler for the item. By default
     * we launch a kernel selection dialog.
     */
    onClick: () => void;
  }
}