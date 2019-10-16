// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Token } from '@phosphor/coreutils';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';

import { ISearchProvider, IPackageInstallerConstructor } from './interfaces';

/* tslint:disable */
/**
 * The search provider registry token.
 */
export const IPackageInstallerRegistry = new Token<IPackageInstallerRegistry>(
  '@jupyterlab/packageinstaller:IPackageInstallerRegistry'
);
/* tslint:enable */

export interface IPackageInstallerRegistry {
  /**
   * Add a provider to the registry.
   *
   * @param key - The provider key.
   * @returns A disposable delegate that, when disposed, deregisters the given search provider
   */
  register(key: string, provider: IPackageInstallerConstructor<any>): IDisposable;

  /**
   * Returns a matching provider for the widget.
   *
   * @param widget - The widget to search over.
   * @returns the search provider, or undefined if none exists.
   */
  getProviderForWidget(widget: any): ISearchProvider<any> | undefined;

  /**
   * Signal that emits when a new search provider has been registered
   * or removed.
   */
  changed: ISignal<IPackageInstallerRegistry, void>;
}