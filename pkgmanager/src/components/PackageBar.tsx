
import { Kernel } from '@jupyterlab/services';

import React, { useState } from 'react';

function kernel(input: string): void {
  Kernel.listRunning().then(kernelModels => {
    console.log(kernelModels, kernelModels[0])
    const kernel = Kernel.connectTo(kernelModels[0]);
    if (kernel) {
      kernel.requestExecute({ code: '%pip install ' + input, silent: true });
      console.log("Finished '%pip install " + input)
    }
  });
}

export function PackageSearcher() {
   // Declare a new state variable, which we'll call "count"
  const [input, setInput] = useState('');
  let result: string[] = [];
  const [packages, setPackages] = useState(result);
  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Package Name"
        type="text"
        name="packageName"
        required
      />
      
      <button onClick={() => {kernel(input); result.push(input); setPackages(result);}}>
        Install
      </button>
      <p>Current packages: {packages}</p>
    </div>
  );
}