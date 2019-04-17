import React from 'react'
import dateFns, { isSameDay } from 'date-fns'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Avatar from '@material-ui/core/Avatar'
import ReportModal from '../ReportModal'
import ReportForm from '../ReportForm'
import axios from 'axios'

const styles = theme => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 1,
    },
  });

class SupervisorCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            tasks: this.props.tasks,
            newtaskform: false
        }
        this.handleOpenReport = this.handleOpenReport.bind(this)
        this.handleCloseReport = this.handleCloseReport.bind(this)
        this.handleCloseForm = this.handleCloseForm.bind(this)
        this.handleOpenTaskForm = this.handleOpenTaskForm.bind(this)
        this.handleCloseTaskForm = this.handleCloseTaskForm.bind(this)
    }
    handleOpenReport() {
        this.setState({ open: true })
    }
    handleCloseReport() {
        this.setState({ open: false })
    }
    handleOpenTaskForm() {
        this.setState({ newtaskform: true })
    }
    handleCloseTaskForm() {
        this.setState({ newtaskform: false })
    }
    formatDate(date) {
        return dateFns.format(date, "D/M")
    }
    handleCloseForm() {
        this.setState({ open: false })
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        axios.get(
            'http://localhost:8000/api/admincalendar/',
            config
        ).then(res => {
            var response = res.data
            this.setState({ tasks: response }) // updates tasks and cell rerenders
        }).catch((err) => {
            console.log('err', err)
        })
    }
    componentWillReceiveProps(props) {
        this.setState({
            tasks: props.tasks
        })
    }
    renderChips() {
        var chips = []
        let tasks = this.state.tasks
        let date = this.props.date
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
                    if (tasks[i].project.project_id===3) {
                        var ava = "WK"
                    } else if (tasks[i].project.project_id===4) {
                        var ava = "JT"
                    }

                    if (tasks[i].reports === null) {
                        if (new Date() <= taskDueDateObj) {
                            chips.push(
                                    <React.Fragment>
                                    <Chip
                                    avatar={<Avatar>{ava}</Avatar>}
                                    label="Pending Report"
                                    onClick={this.handleOpenReport}
                                    className={classes.chip}
                                    />
                                    <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                    >
                                    <ReportForm taskinfo={tasks[i]}/>
                                    </Dialog>
                                    </React.Fragment>
                            )
                        } else if (new Date() > taskDueDateObj) {
                            chips.push(
                                <React.Fragment>
                                <Chip
                                avatar={<Avatar>{ava}</Avatar>}
                                label="No Submission"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="secondary"
                                variant="outlined"
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
                            )
                        }
                    } else {
                        if (new Date(tasks[i].reports.timestamp) <= date) {
                             chips.push(    
                                <React.Fragment>
                                <Chip
                                avatar={<Avatar>{ava}</Avatar>}
                                label="Report Submitted"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="primary"
                                />
                                <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                >
                                <ReportModal reportData={tasks[i].reports}/>
                                </Dialog>
                                </React.Fragment>
                            )

                        } else if (new Date(tasks[i].reports.timestamp) > date) {
                            chips.push( 
                                <React.Fragment>
                                <Chip
                                avatar={<Avatar>{ava}</Avatar>}
                                label="Late Submission"
                                onClick={this.handleOpenReport}
                                className={classes.chip}
                                color="secondary"
                                />
                                <Dialog
                                    open={this.state.open}
                                    onClose={this.handleCloseReport}
                                    fullWidth={true}
                                >
                                <ReportModal reportData={tasks[i].reports}/>
                                </Dialog>
                                </React.Fragment>
                            )
                        }
                    }
                }
            }
        }
        return <React.Fragment>{chips}</React.Fragment>
    }
    render() {
        return (
                <div className="cell" onClick={this.handleOpenTaskForm}>
                    <span className="date">
                        {this.formatDate(this.props.date)}
                    </span>
                    {this.renderChips()}
                </div>
        )
    }
}

export default withStyles(styles)(SupervisorCell);