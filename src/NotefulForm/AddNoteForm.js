import React, { Component } from  'react';
import { withRouter } from 'react-router-dom';
import './NotefulForm.css'
import config from '../config';
import NotefulContext from '../NotefulContext';
import ValidationError from "../ValidationError";

class AddNoteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            folderId: ''
        }
    }

    static contextType = NotefulContext;

    validateName = () => {
        const name = this.state.name.trim();
        if (name.length === 0) {
            return "Name is required";
        } else if (name.length < 3) {
            return "Name must be at least 3 characters long";
        }
    };

    validateFolderId = () => {
        return this.state.name.folderId;
    };

    handleSubmit = e => {
        e.preventDefault();

        if (this.validateName() || this.validateFolderId()) {
            return;
        }

        fetch(config.API_NOTE_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                folderId: this.state.folderId,
                // folderId: e.target.runtime.value,
                name: this.state.name,
                content: e.target.content.value,
                modified: Date.now()
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(newNote => newNote.json())
            .then(newNote => {
            this.context.addNote(newNote);
            this.props.history.push('/');
        })
    };


    render() {
        return (
            <section className='NotePageMain'>
                <form className="Noteful-form add-note" onSubmit={this.handleSubmit}>
                    <label>
                        Select folder:
                        <select value={this.state.folderId} onChange={e => this.setState({folderId: e.target.value})}>
                            {this.context.folders.map(folder =>
                                <option value={folder.id}>{folder.name}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Name:
                        <input type="text" value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
                        <ValidationError message={this.validateName()}/>
                    </label>
                    <label>
                        Content:
                        <textarea name="content"/>
                    </label>
                    <button>Submit</button>
                </form>
            </section>
        )
    }
}

export default withRouter(AddNoteForm);