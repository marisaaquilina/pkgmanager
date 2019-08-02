
import { Kernel } from '@jupyterlab/services';

import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export function Dropdown(props: any) {
  //const [selectedOption] = useState('');
  return (
    <Select
        //value={selectedOption}
        //onChange={this.handleChange}
        options={options}
    />
  );
}

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

// Scrape available packages on PyPI using CORS
function getAvailablePackages(): any {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = "https://pypi.org/simple/"; // site that doesn’t send Access-Control-*
  fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
  .then(response => response.text())
  .then(contents => {
    var div = document.createElement("div");
    div.innerHTML = contents;
    var anchors = div.getElementsByTagName("a");
    const options = [];
    for (var i = 0; i < anchors.length; i++) {
        const packageName = anchors[i].textContent;
        options.push({value: packageName, label: packageName });
    }
    return options;
  })
  .catch(() => {console.log("Can’t access " + url + " response. Blocked by browser?"); return {};})
}

// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [packages, setPackages] = useState([]);
  console.log(getAvailablePackages());
  return (
    <div>
      <Dropdown/>
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
      <p>{input}</p>
      <p>.</p><p>.</p><p>.</p><p>.</p><p>.</p><p>.</p>
    </div>
  );
}