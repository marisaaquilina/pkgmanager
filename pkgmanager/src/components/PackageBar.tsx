
import { Kernel } from '@jupyterlab/services';

import React, { useState } from 'react';

//Execute a silent pip install in the current active kernel using a line magic
function installPackage(input: string): void {
  Kernel.listRunning().then(kernelModels => {
    console.log(kernelModels, kernelModels[0])
    const kernel = Kernel.connectTo(kernelModels[0]);
    if (kernel) {
      kernel.requestExecute({ code: '%pip install ' + input, silent: true });
    }
  });
}

// Construct markdown syntax of installed packages for record-keeping
function addPackagesCell(packages: Array<string>): string {
  return 'You may need to install the following packages:' + packages.map(pkg => ' `' + pkg + '`,');
}

// Check if the searched package is already installed to avoid duplicates
function isInstalled(input: string, packages: Array<string>): boolean {
  return packages.indexOf(input) >= 0; 
}

// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [packages, setPackages] = useState([]);
  // const request = require('request');

  // request('http://stackabuse.com', function(err: any, res: any, body: any) {  
  //     console.log(body);
  // });
  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Package Name'
        type='text'
        name='packageName'
        required
      />
      <button onClick={() => {addPackagesCell(packages); if (!isInstalled(input, packages)) {installPackage(input); setPackages(packages.concat([input]));}}}>
        Install
      </button>
      <p>Installed</p>
      {packages.map(pkg => <span key={pkg}>{pkg} </span>)}

    </div>
  );
}