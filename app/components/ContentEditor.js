// @flow
import React from 'react';
import { notice } from '../utils/notification';

declare var ContentTools;

type ContentToolsType = {
  init: (selectior: string, attr: string) => void,
  addEventListener: (event: string, func: (event: any) => void) => void,
  destroy: () => void,
  removeEventListener: (event: string) => void,
  _domRegions: NodeList<HTMLElement>
}

type PropsType = {
  text: ?string,
  onSave: (content: ?string) => void,
}

export default class ContentEditor extends React.Component {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      text: null,
      editor: null
    };
  }

  state: {
    text: ?string,
    editor: ?ContentToolsType
  };

  componentDidMount() {
    this.loadEditor().then(() => {
      this.setState({
        editor: new ContentTools.EditorApp.get() // eslint-disable-line new-cap
      }, () => {
        const editor = this.state.editor;
        if (editor != null) {
          editor.init('[data-editable]', 'data-editable');
          editor.addEventListener('saved', (event) => {
            this.editorChange(event.detail().regions['text-component']);
          });
        }
      });
    });
  }

  componentWillReceiveProps(props: PropsType) {
    this.setState({
      text: props.text || ''
    });
  }

  componentWillUnmount() {
    const editor = this.state.editor;
    if (editor == null) {
      return;
    }
    editor.removeEventListener('saved');
    editor.destroy();
    this.setState({
      editor: null
    });
  }

  props: PropsType;

  editorChange(text: string) {
    this.setState(text ? { text } : {}, () => {
      this.save();
      const editor = this.state.editor;
      if (editor == null) {
        return;
      }
      // HACK: Reselect the region DOM elements for the editor after state change.
      editor._domRegions = document.querySelectorAll('[data-editable]'); // eslint-disable-line
    });
  }

  save() {
    if (typeof this.state.text === 'undefined') {
      notice('No changes are found. Skipped saving.');

      return;
    }

    if (this.props.onSave == null) {
      return;
    }

    this.props.onSave(this.state.text);
  }

  loadEditor() {
    return new Promise((resolve, reject) => {
      try {
        (require : any).ensure([], () => {
          require('ContentTools');
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  render() {
    const innerHtml = {
      __html: `<div data-editable="text-component">${this.state.text ? this.state.text : ''}</div>`
    };

    return (
      <div key="text-component" className="text-component" dangerouslySetInnerHTML={innerHtml} />
    );
  }
}
