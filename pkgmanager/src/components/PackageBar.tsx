
import { Kernel } from '@jupyterlab/services';

import React, { useState } from 'react';

function kernel(input: string): void {
  Kernel.listRunning().then(kernelModels => {
    console.log(kernelModels, kernelModels[0])
    const kernel = Kernel.connectTo(kernelModels[0]);
    if (kernel) {
      kernel.requestExecute({ code: '%pip install ' + input});
      console.log("Finished '%pip install " + input)
    }
  });
}

export function PackageSearcher() {
  // Declare a new state variable, which we'll call "count"
  const [input, setInput] = useState('');
  return (
    <div>
      <p>You clicked {input} times</p>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="First name"
        type="text"
        name="firstName"
        required
      />
      <button onClick={() => kernel(input)}>
        Click me
      </button>
    </div>
  );
}