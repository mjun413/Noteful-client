import React, { Component } from  'react';
import { withRouter } from 'react-router-dom';
import './NotefulForm.css'
import config from '../config';
import NotefulContext from '../NotefulContext';
import NotePageNav from '../NotePageNav/NotePageNav';
import ValidationError from "../ValidationError";

class AddFolderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            folder: "Enter folder name here and hit enter",
            touch: false
        }
    }

    static contextType = NotefulContext;

    validateFolder = () => {
        const name = this.state.folder.trim();
        if (name.length === 0) {
            return "Name is required";
        } else if (name.length < 3) {
            return "Name must be at least 3 characters long";
        }
    };


    handleSubmit = e => {
        e.preventDefault();

        if (this.validateFolder()) {
            return;
        }

        fetch(config.API_FOLDER_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({name: this.state.folder}),
          headers: {
            'content-type': 'application/json'
          }
        }).then(newFolder => newFolder.json())
            .then(newFolder => {
              this.context.addFolder(newFolder);
              this.props.history.push('/');
            })
    };
    render() {
        return (
            <>
              <NotePageNav />
              <form class="Noteful-form" onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.folder} onChange={ e => this.setState({folder: e.target.value})}
                       onFocus={() => !this.state.touch && this.setState({folder: "", touch: true})} />
                <ValidationError message={this.validateFolder()}/>
              </form>
            </>
        )
    }
}

export default withRouter(AddFolderForm);
