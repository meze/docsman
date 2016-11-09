import React, { PropTypes as T } from 'react';
import { notice } from '../utils/notification';

/* global ContentTools */
export default class ContentEditor extends React.Component {
  static propTypes = {
    onSave: T.func.isRequired,
    text: T.string
  };

  state = {
    text: null,
    editor: null
  };

  componentDidMount() {
    this.loadEditor().then(() => {
      this.setState({
        editor: new ContentTools.EditorApp.get() // eslint-disable-line new-cap
      }, () => {
        this.state.editor.init('[data-editable]', 'data-editable');
        this.state.editor.addEventListener('saved', (event) => {
          this.editorChange(event.detail().regions['text-component']);
        });
      });
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      text: props.text || ''
    });
  }

  componentWillUnmount() {
    if (this.state.editor) {
      this.state.editor.removeEventListener('saved');
      this.state.editor.destroy();
      this.setState({
        editor: null
      });
    }
  }

  editorChange(text) {
    this.setState(text ? { text } : {}, () => {
      this.save();
      // HACK: Reselect the region DOM elements for the editor after state change.
      this.state.editor._domRegions = document.querySelectorAll('[data-editable]'); // eslint-disable-line
    });
  }

  save() {
    if (typeof this.state.text === 'undefined') {
      notice('No changes are found. Skipped saving.');

      return;
    }
    this.props.onSave(this.state.text);
  }

  loadEditor() {
    return new Promise((resolve, reject) => {
      try {
        require.ensure([], (require) => {
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
