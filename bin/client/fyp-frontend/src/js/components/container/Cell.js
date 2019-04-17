import React from 'react'
import dateFns, { isSameDay } from 'date-fns'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import ReportModal from './ReportModal'
import ReportForm from './ReportForm'
import axios from 'axios'

const styles = theme => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 0,
    },
  });

class Cell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            tasks: this.props.tasks,
        }
        this.handleOpenReport = this.handleOpenReport.bind(this)
        this.handleCloseReport = this.handleCloseReport.bind(this)
        this.handleCloseForm = this.handleCloseForm.bind(this)
    }
    handleOpenReport() {
        this.setState({ open: true })
    }
    handleCloseReport() {
        this.setState({ open: false })
    }
    formatDate(date) {
        return dateFns.format(date, "D/M")
    }
    handleCloseForm() {
        this.setState({ open: false })
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        axios.get(
            'http://localhost:8000/api/userproject/',
            config
        ).then(res => {
            var response = res.data
            this.setState({ tasks: response[0].project.tasks }) // updates tasks and cell rerenders
        }).catch((err) => {
            console.log('err', err)
        })
    }
    render() {
        let tasks = this.state.tasks
        let date = this.props.date
        let chip
        if (!tasks || !tasks.length) {
            return null
        } else {
            for (var i=0; i<tasks.length; i++) {
                //convert task due date from string to obj
                let dateArray = tasks[i].due_date.split('-')
                let taskDueDateObj = new Date(dateArray[0], dateArray[1]-1, dateArray[2])
                var result = isSameDay(date, taskDueDateObj)
                if (result) {
                    const { classes } = this.props;
                    if (tasks[i].reports === null) {
                        if (new Date() <= taskDueDateObj) {
                            chip = <React.Fragment>
                                    <Chip
                                    label="Pending Report"
                                    onClick={this.handleOpenReport}
                                    className={classes.chip}
                                    style={{width: '100%'}}
                                    />
                                    <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                    >
                                    <ReportForm taskinfo={tasks[i]}/>
                                    </Dialog>
                                   </React.Fragment>
                        } else if (new Date() > taskDueDateObj) {
                            chip =<React.Fragment>
                                <Chip
                                label="No Submission"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="secondary"
                                variant="outlined"
                                style={{width: '100%'}}
                                />
                                <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                    >
                                    <ReportForm
                                        taskinfo={tasks[i]}
                                        handlecloseform={this.handleCloseForm}/>
                                </Dialog>
                                </React.Fragment>
                        }
                    } else {
                        if (new Date(tasks[i].reports.timestamp) <= date) {
                             chip =    
                                <React.Fragment>
                                <Chip
                                label="On Time"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="primary"
                                style={{width: '100%'}}
                                />
                                <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                >
                                <ReportModal reportData={tasks[i].reports}/>
                                </Dialog>
                                </React.Fragment>

                        } else if (new Date(tasks[i].reports.timestamp) > date) {
                            chip = 
                                <React.Fragment>
                                <Chip
                                label="Late Submission"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="secondary"
                                style={{width: '100%'}}
                                />
                                <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                >
                                <ReportModal reportData={tasks[i].reports}/>
                                </Dialog>
                                </React.Fragment>
                            
                        }
                    }
                }
            }
        }
        return (
                <div className="cell">
                    <span className="date">
                        {this.formatDate(this.props.date)}
                    </span>
                    {chip}
                </div>
        )
    }
}

export default withStyles(styles)(Cell);