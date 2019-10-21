import { style } from 'typestyle';

export namespace PackageBarStyleClasses {
  export const packageContainer = style({
    padding: '0em 1em',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    borderTop: '1px solid var(--jp-border-color2)',
  });
  export const topBar = style({
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    fontSize: 'var(--jp-ui-font-size1)'
  });
  export const kernelPrompt = style({
    paddingTop: 5,
    fontSize: '10.88px',
    lineHeight: '13px',
    marginBottom: '0.75em',
    color: 'var(--jp-ui-font-color2)'
  })
  export const pipButton = style({
    backgroundColor: 'var(--md-grey-500)',
    color: 'var(--jp-ui-inverse-font-color1)',
    border: 'none',
    margin: 0,
    borderRadius: '2px',
    fontSize: 'var(--jp-ui-font-size0)'
  });
  export const pipInstallButton = style({
    backgroundColor: 'var(--md-blue-500)',
    color: 'var(--jp-ui-inverse-font-color1)',
    border: 'none',
    margin: 0,
    borderRadius: '2px',
    fontSize: 'var(--jp-ui-font-size0)'
  });
  export const errorButton = style({
    backgroundColor: 'white',
    color: 'var(--jp-ui-inverse-font-color1)',
    border: 'none',
    boxShadow: 'none',
  });
  export const errorContainer = style({
    backgroundColor: 'var(--md-orange-100)',
    border: '1px solid var(--md-orange-300)',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
  });
  export const errorContainerActions = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  });
  export const uninstalledPackage = style({
    backgroundColor: 'var(--md-grey-200)',
    padding: '2px 4px',
  });
  export const packageInput = style({
    border: '1px solid var(--md-grey-400)',
    fontSize: 'var(--jp-ui-font-size0)',
  });
  export const logsButton = style({
    backgroundColor: 'white',
    color: 'var(--md-blue-700)',
    border: 'none',
    padding: '8px',
    margin: 0,
    marginTop: 4,
    borderRadius: 2,
    float: 'right',
    fontSize: 'var(--jp-ui-font-size0)',
  });
  export const packageLabel = style({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 10,
    paddingBottom: 2,
  });
  export const title = style({
    fontWeight: 'bold',
    fontSize: 'var(--jp-ui-font-size3)',
    lineHeight: '21px',
    color: 'var(--jp-ui-font-color1)',
  });
  export const flexContainer = style({
    display: 'flex',
  });
  export const messageText = style({
    color: 'var(--jp-ui-font-color2)',
    fontWeight: 'bold',
    fontSize: '10.88px',
    lineHeight: '13px',
    marginBottom: '0.75em',
  });
  export const searchTitle = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: '2.5em',
    textTransform: 'uppercase',
    // color: 'var(--jp-ui-font-color2)',
    fontWeight: 'bold',
    fontSize: 'var(--jp-ui-font-size0)',
    lineHeight: '13px',
    marginBottom: '0.75em',
  });
  export const buttonContainer = style({
    marginLeft: '0.5em',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '0.5em',
  });
  export const loading = style({
    background: 'none',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX:'98%',
    backgroundPositionY: '50%',
    backgroundSize: '20px',
  });
  export const overlay = style({
      position: 'absolute',
      backgroundColor: 'var(--jp-toolbar-background)',
      borderBottom: 'var(--jp-border-width) solid var(--jp-toolbar-border-color)',
      borderLeft: 'var(--jp-border-width) solid var(--jp-toolbar-border-color)',
      top: 0,
      right: 0,
      zIndex: 7,
      minWidth: 300,
      padding: 2,
      fontSize: 'var(--jp-ui-font-size1)'
  })
}