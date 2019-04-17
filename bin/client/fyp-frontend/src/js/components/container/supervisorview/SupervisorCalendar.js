import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SupervisorCell from './SupervisorCell'
import LoadingCircle from '../LoadingCircle'
import dateFns from 'date-fns'
import axios from 'axios'
import { Dialog, DialogContent, TextField, MenuItem, Fab, DialogActions, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    fab: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
    },
  });

class SupervisorCalendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectdata: null,
            tasks: [],
            projectOption: 0,
            dateOption: dateFns.format(new Date(), 'YYYY-MM-DD'),
            open: false
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChangeProjectOption = this.handleChangeProjectOption.bind(this)
        this.handleChangeDateOption = this.handleChangeDateOption.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleOpen() {
        this.setState({ open: true })
    }
    handleClose() {
        this.setState({ open: false })
    }
    handleChangeProjectOption(e) {
        this.setState({ projectOption: e.target.value })
    }
    handleChangeDateOption(e) {
        this.setState({ dateOption: e.target.value })
        console.log(e.target.value)
        let newObj = new Date(e.target.value)
        console.log(newObj)
    }
    handleSubmit(e) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        let data = {
            'due_date': this.state.dateOption,
            'project': this.state.projectOption
        }
        axios.post(
            'http://localhost:8000/api/addtask/',
            data,
            config,
        ).then(res => {
            this.setState({
                projectOption: 0,
                dateOption: dateFns.format(new Date(), 'YYYY-MM-DD'),
                open: false
            })
            this.getData()
        })
    }
    getData() {
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        axios.get(
            'http://localhost:8000/api/admincalendar/',
            config
        ).then(res => {
            this.setState({ tasks: res.data })
        }).catch((err) => {
            console.log('err', err)
        })
        axios.get(
            'http://localhost:8000/api/userproject/',
            config
        ).then(res => {
            this.setState({ projectdata: res.data })
        }).catch((err) => {
            console.log('err', err)
        })
    }
    componentDidMount() {
        this.getData()
    }
    renderCells() {
        const rows = [];
        let days = [];
        //console.log(this.state.projectdata[0])
        let startArr = this.state.projectdata[0].project.start.split('-')
        let startDateObj = dateFns.startOfWeek(new Date(startArr[0], startArr[1]-1, startArr[2]), {weekStartsOn: 1}).toString()
        let startDate = new Date(startDateObj)
        let day = startDate;
        let endArr = this.state.projectdata[0].project.end.split('-')
        let endDateObj = dateFns.startOfWeek(new Date(endArr[0], endArr[1]-1, endArr[2]), {weekStartsOn: 1}).toString()
        let endDate = new Date(endDateObj)
        let temp = 1;
        while (day <= endDate) {
            // "week 1 2 3 cells"
            if (temp < 8) { // before recess week
                days.push( // REMOVE THE WRAPPING DIV IN NEXT LINE??
                        <div className="week">
                            <span className="date">Week {temp}</span>
                        </div>
                    )
                temp++;    
            } else if (temp === 8 | temp === 30) { // recess week cell
                days.push(
                        <div className="week">
                            <span className="date">Recess</span>
                        </div>
                    )
                temp++;
            } else if (temp > 8 && temp <= 14) { // sem 1 after recess week
                days.push(
                        <div className="week">
                            <span className="date">Week {temp-1}</span>
                        </div>
                    )
                temp++;  
            } else if (temp >= 15 && temp <=22) { // hols
                days.push(
                        <div className="week" style={{color: "grey"}}>
                            <span className="date">Break</span>
                        </div>
                    )
                temp++;  
            } else if (temp >= 23 && temp <=29) { // hols
                days.push(
                        <div className="week">
                            <span className="date">Week {temp-22}</span>
                        </div>
                    )
                temp++;  
            } else if (temp > 30) { // hols
                days.push(
                        <div className="week">
                            <span className="date">Week {temp-23}</span>
                        </div>
                    )
                temp++;  
            }
            // monday to fri cells
            for (let i=0; i<7; i++) {
                days.push(   
                  <SupervisorCell
                    className="cell"
                    key={day.toString()}
                    date={day}
                    tasks={this.state.tasks}
                />
                
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>
      }
    render() {
        const { classes } = this.props
        if (this.state.projectdata === null) {
            return <LoadingCircle />
        } else {
        return (
            <React.Fragment>
            <div className="calendar">
                <div className="row">
                    <div className="week-0"></div>
                    <div className="header">Mon</div>
                    <div className="header">Tue</div>
                    <div className="header">Wed</div>
                    <div className="header">Thur</div>
                    <div className="header">Fri</div>
                    <div className="header">Sat</div>
                    <div className="header">Sun</div>
                </div>
                {this.renderCells()}
            </div>
            <Fab onClick={this.handleOpen} color="primary" aria-label="Add" className={classes.fab}><AddIcon /></Fab>
            <Dialog open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth={true}>
                <DialogContent>
                    <form noValidate>
                        Add New Task
                        <TextField
                            label="Select Project"
                            select
                            value={this.state.projectOption}
                            onChange={this.handleChangeProjectOption}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem key={0} value={0}>None</MenuItem>
                            <MenuItem key={3} value={3}>A Web-based Project Management System</MenuItem>
                            <MenuItem key={4} value={4}>Big Data Visualisation</MenuItem>
                        </TextField>
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{shrink:true}}
                            value={this.state.dateOption}
                            onChange={this.handleChangeDateOption}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                    Close
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary" autoFocus>
                    Agree
                    </Button>
                </DialogActions>
            </Dialog>
            </React.Fragment>
        )
        }
    }
}

SupervisorCalendar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SupervisorCalendar);