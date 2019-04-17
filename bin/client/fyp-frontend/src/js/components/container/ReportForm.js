import React from 'react'
import { DialogTitle, DialogActions, DialogContentText, DialogContent, TextField, Button } from '@material-ui/core'
import axios from 'axios'


class ReportForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            content: '',
        }
        this.handleTitleChange = this.handleTitleChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }
    handleContentChange(e) {
        this.setState({ content: e.target.value })
    }
    handleClear() {
        this.setState({
            title: '',
            content: ''
        })
    }
    handleSubmit(event) {
        event.preventDefault()
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        let data = {
            'task': this.props.taskinfo.task_id,
            'report_title': this.state.content,
            'text': this.state.title
        }
        axios.post(
            'http://localhost:8000/api/addnewreport/',
            data,
            config,
        ).then(res => {
            this.setState({ title: '', content: '' })
            this.props.handlecloseform() // closes dialog form. function passed as prop from parent
        }).catch((err) => {
            console.log('err', err)
        })
    }

    render() {
        return (
            <React.Fragment>
                <DialogTitle>{"New Report Form"}</DialogTitle>
                    <form>
                    <DialogContent>
                        <DialogContentText>This report( with id: {this.props.taskinfo.task_id}) is due on {this.props.taskinfo.due_date}</DialogContentText>
                        <br/>
                        <TextField 
                                required
                                multiline
                                rows="5"
                                label="Done"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                                fullWidth={true}
                            />
                            <br/>
                            <TextField
                                required
                                multiline
                                rows="5"
                                label="Todo"
                                value={this.state.content}
                                onChange={this.handleContentChange}
                                fullWidth={true}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClear} color="primary">
                        Clear
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary" autoFocus>
                        Submit
                        </Button>
                    </DialogActions>
                    </form>
            </React.Fragment>
        )
    }
}

export default ReportForm