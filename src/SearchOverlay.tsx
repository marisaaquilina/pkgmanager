import * as React from 'react';
import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { Signal } from '@phosphor/signaling';
import { Widget } from '@phosphor/widgets';
import { IDisplayState } from './interfaces';
import { SearchInstance } from './searchinstance';
import { PackageSearcher } from './PackageBar';
import StyleClasses from './style';

const PackageBarStyleClasses = StyleClasses.PackageBarStyleClasses;

//const OVERLAY_CLASS = 'jp-DocumentSearch-overlay';

interface ISearchOverlayProps {
  sessionInfo: string;
  overlayState: IDisplayState;
  onCaseSensitiveToggled: Function;
  onRegexToggled: Function;
  onHightlightNext: Function;
  onHighlightPrevious: Function;
  onStartQuery: Function;
  onEndSearch: Function;
  onReplaceCurrent: Function;
  onReplaceAll: Function;
  isReadOnly: boolean;
}

// interface ISearchEntryProps {
//   onCaseSensitiveToggled: Function;
//   onRegexToggled: Function;
//   onKeydown: Function;
//   onChange: Function;
//   onInputFocus: Function;
//   onInputBlur: Function;
//   inputFocused: boolean;
//   caseSensitive: boolean;
//   useRegex: boolean;
//   searchText: string;
//   forceFocus: boolean;
// }

// class SearchEntry extends React.Component<ISearchEntryProps> {
//   constructor(props: ISearchEntryProps) {
//     super(props);
//   }

//   /**
//    * Focus the input.
//    */
//   focusInput() {
//     (this.refs.searchInputNode as HTMLInputElement).focus();
//   }

//   componentDidUpdate() {
//     if (this.props.forceFocus) {
//       this.focusInput();
//     }
//   }

//   render() {
//     return (
//       <div>
//         <input
//           placeholder={this.props.searchText ? null : 'Package Name'}
//           value={this.props.searchText}
//           onChange={e => this.props.onChange(e)}
//           onKeyDown={e => this.props.onKeydown(e)}
//           tabIndex={2}
//           onFocus={e => this.props.onInputFocus()}
//           onBlur={e => this.props.onInputBlur()}
//           ref="searchInputNode"
//         />
//       </div>
//     );
//   }
// }

class SearchOverlay extends React.Component<
  ISearchOverlayProps,
  IDisplayState
> {
  constructor(props: ISearchOverlayProps) {
    super(props);
    this.state = props.overlayState;
  }

  // componentDidMount() {
  //   if (this.state.searchText) {
  //     this._executeSearch(true, this.state.searchText);
  //   }
  // }

  // private _onSearchChange(event: React.ChangeEvent) {
  //   const searchText = (event.target as HTMLInputElement).value;
  //   this.setState({ searchText: searchText });
  // }

  // private _onReplaceChange(event: React.ChangeEvent) {
  //   this.setState({ replaceText: (event.target as HTMLInputElement).value });
  // }

  // private _onSearchKeydown(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this._executeSearch(!event.shiftKey);
  //   } else if (event.keyCode === 27) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this._onClose();
  //   }
  // }

  // private _onReplaceKeydown(event: KeyboardEvent) {
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this.props.onReplaceCurrent(this.state.replaceText);
  //   }
  // }

  // private _executeSearch(goForward: boolean, searchText?: string) {
  //   // execute search!
  //   let query;
  //   const input = searchText ? searchText : this.state.searchText;
  //   try {
  //     console.log(input);
  //     this.setState({ errorMessage: '' });
  //   } catch (e) {
  //     this.setState({ errorMessage: e.message });
  //     return;
  //   }
  //   this.props.onStartQuery(query);
  // }

  private _onClose() {
    // Clean up and close widget.
    this.props.onEndSearch();
  }

  // private _onReplaceToggled() {
  //   this.setState({
  //     replaceEntryShown: !this.state.replaceEntryShown
  //   });
  // }

  // private _onSearchInputFocus() {
  //   if (!this.state.searchInputFocused) {
  //     this.setState({ searchInputFocused: true });
  //   }
  // }

  // private _onSearchInputBlur() {
  //   if (this.state.searchInputFocused) {
  //     this.setState({ searchInputFocused: false });
  //   }
  // }

  render() {
    return [
      <div key={0}>
        <PackageSearcher kernelId={/*session.kernel.id*/null} kernelName={/*session.kernelDisplayName*/this.props.sessionInfo} uninstalledPackage={''} moduleError={false} layouty={/*layout*/null}/>
        <button
          onClick={() => this._onClose()}
          tabIndex={8}
        >
          Close
        </button>
      </div>
    ];
  }
}

namespace createSearchOverlay {
  export interface IOptions {
    sessionInfo: any;
    widgetChanged: Signal<SearchInstance, IDisplayState>;
    overlayState: IDisplayState;
    onCaseSensitiveToggled: Function;
    onRegexToggled: Function;
    onHightlightNext: Function;
    onHighlightPrevious: Function;
    onStartQuery: Function;
    onEndSearch: Function;
    onReplaceCurrent: Function;
    onReplaceAll: Function;
    isReadOnly: boolean;
  }
}

export function createSearchOverlay(
  options: createSearchOverlay.IOptions
): Widget {
  const {
    sessionInfo,
    widgetChanged,
    overlayState,
    onCaseSensitiveToggled,
    onRegexToggled,
    onHightlightNext,
    onHighlightPrevious,
    onStartQuery,
    onReplaceCurrent,
    onReplaceAll,
    onEndSearch,
    isReadOnly
  } = options;
  sessionInfo;
  console.log(sessionInfo);
  const widget = ReactWidget.create(
    <UseSignal signal={widgetChanged} initialArgs={overlayState}>
      {(_, args) => {
        return (
          <SearchOverlay
            sessionInfo={sessionInfo}
            onCaseSensitiveToggled={onCaseSensitiveToggled}
            onRegexToggled={onRegexToggled}
            onHightlightNext={onHightlightNext}
            onHighlightPrevious={onHighlightPrevious}
            onStartQuery={onStartQuery}
            onEndSearch={onEndSearch}
            onReplaceCurrent={onReplaceCurrent}
            onReplaceAll={onReplaceAll}
            overlayState={args}
            isReadOnly={isReadOnly}
          />
        );
      }}
    </UseSignal>
  );
  widget.addClass(PackageBarStyleClasses.overlay);
  return widget;
}