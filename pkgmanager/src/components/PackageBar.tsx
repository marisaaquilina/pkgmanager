
import { Kernel } from '@jupyterlab/services';

//import { NotebookActions } from '@jupyterlab/notebook';
declare var require: any;

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

function getCurrentKernelId(): string {
  const request = require('request');

request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err: any, res: any, body: any) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});
  return '';
}

//Execute a silent pip install in the current active kernel using a line magic
function runPip(input: string, install: boolean, notebookName: string): void {
  let pipCommand: string = '%pip '
  Kernel.getSpecs().then(kernelSpecs => {
    console.log('Default spec:', kernelSpecs.default);
    console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
  });
  Kernel.listRunning().then(kernelModels => {
    install ? pipCommand += 'install ' : pipCommand += 'uninstall -y ';
    console.log(kernelModels, kernelModels[0])
    const kernel = Kernel.connectTo(kernelModels[0]);
    if (kernel) {
      kernel.requestExecute({ code: pipCommand + input, silent: true }).onIOPub = msg => {console.log(msg.content);};

    }
  });
 
}

// Check if the searched package is already installed to avoid duplicates
function isInstalled(input: string, packages: Array<string>): boolean {
  return packages.indexOf(input) >= 0; 
}

// Scrape available packages on PyPI using CORS
// function getAvailablePackages(): any {
//   const proxyurl = "https://cors-anywhere.herokuapp.com/";
//   const url = "https://pypi.org/simple/"; // site that doesn’t send Access-Control-*
//   fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
//   .then(response => response.text())
//   .then(contents => {
//     var div = document.createElement("div");
//     div.innerHTML = contents;
//     var anchors = div.getElementsByTagName("a");
//     const options = [];
//     for (var i = 0; i < anchors.length; i++) {
//         const packageName = anchors[i].textContent;
//         options.push({value: packageName, label: packageName });
//     }
//     return options;
//   })
//   .catch(() => {console.log("Can’t access " + url + " response. Blocked by browser?"); return {};})
// }

// Render a component to search for a package to install
export function PackageSearcher(props: any) {
  const [input, setInput] = useState('');
  const [packages, setPackages] = useState([]);
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
      <button onClick={() => {if (!isInstalled(input, packages)) {runPip(input, true, props.notebookName); getCurrentKernelId(); setPackages(packages.concat([input]));}}}>
        Install
      </button>
      <button onClick={() => {if (isInstalled(input, packages)) {runPip(input, false, props.notebookName); }}}>
        Uninstall
      </button>
      <p>{props.notebookName}</p>
      {packages.map(pkg => <span key={pkg}>{pkg} </span>)}
      <div style={{padding: 20}}></div>
    </div>
  );
}