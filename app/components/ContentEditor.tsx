import * as React from 'react';
import { notice } from '../utils/notification';

declare var ContentTools: any;
declare var require: any;

export interface IContentEditorProps {
  text: string;
  onSave(text: string): void;
}

export interface IContentEditorState {
  text?: string;
  editor?: any;
}

export default class ContentEditor extends React.Component<IContentEditorProps, IContentEditorState> {
  constructor(props: IContentEditorProps) {
    super(props);

    this.state = {
      text: null,
      editor: null
    };
  }

  public componentDidMount() {
    this.loadEditor().then(() => {
      this.setState({
        editor: new ContentTools.EditorApp.get()
      }, () => {
        this.state.editor.init('[data-editable]', 'data-editable');
        this.state.editor.addEventListener('saved', (event) => {
          this.editorChange(event.detail().regions['text-component']);
        });
      });
    });
  }

  public componentWillReceiveProps(props) {
    this.setState({
      text: props.text || ''
    });
  }

  public componentWillUnmount() {
    if (this.state.editor) {
      this.state.editor.removeEventListener('saved');
      this.state.editor.destroy();
      this.setState({
        editor: null
      });
    }
  }

  public render(): JSX.Element {
    const innerHtml = {
      __html: `<div data-editable="text-component">${this.state.text ? this.state.text : ''}</div>`
    };

    return (
      <div key="text-component" className="text-component" dangerouslySetInnerHTML={innerHtml} />
    );
  }

  private editorChange(text) {
    this.setState(text ? { text } : {}, () => {
      this.save();
      // HACK: Reselect the region DOM elements for the editor after state change.
      this.state.editor._domRegions = document.querySelectorAll('[data-editable]'); // eslint-disable-line
    });
  }

  private save() {
    if (typeof this.state.text === 'undefined') {
      notice('No changes are found. Skipped saving.');

      return;
    }
    this.props.onSave(this.state.text);
  }

  private loadEditor() {
    return new Promise((resolve, reject) => {
      try {
        require.ensure([], () => {
          require('ContentTools');
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
