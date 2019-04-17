import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Navbar from './js/components/container/Navbar'
import axios from 'axios';
import Projects from './js/components/container/Projects'
import Calendar from './js/components/container/Calendar'
import LoginForm from './js/components/container/LoginForm'
import ReportContainer from './js/components/container/ReportContainer'

import SupervisorProjectView from './js/components/container/supervisorview/SupervisorProjectView'
import SupervisorCalendar from './js/components/container/supervisorview/SupervisorCalendar'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      token: '',
      open: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleSubmit(event, credentials) {
    var self = this;
    event.preventDefault();
    axios.post('http://localhost:8000/api/login', credentials)
      .then(function (response) {
        //store token as string in localStorage and later parse
        //it back as object when using token from localStorage.get()
        //(https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage)
        localStorage.setItem('token', JSON.stringify(response.data));
        self.setState({
            logged_in: true,
            token: JSON.stringify(response.data)
        })
      })
      .catch(function (error) {
        console.log(error);
        self.setState({ open: true })
      });   
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
  handleLogout() {
    localStorage.removeItem('token');
    this.setState({
        logged_in: false,
        token: ''
    })
  }

  render() {
    const { classes } = this.props;
    const token = localStorage.getItem('token')
    const tokenStr = JSON.stringify(token)
    console.log(token)
    if (this.state.logged_in !== true) {
      return (
        <React.Fragment>
          <Router>
          <Route path="/" render={(props) => <LoginForm {...props} handleSubmit={this.handleSubmit} /> } />
          </Router>

          {/* snackbar to display login error */}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Login Error. Invalid Credentials</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />

        </React.Fragment>
      )
    } else if (token === "{\"Authorization\":\"Token 60b12bfb70d314c7cb7d79f2a1526eed7ac38ec5\"}" ) {
      console.log(tokenStr)
      return (
        <Router>
          <React.Fragment>
            <Navbar handleLogout={this.handleLogout}>
              <Route exact path="/" component={SupervisorProjectView} />
              <Route path="/projects" component={SupervisorProjectView} />
              <Route path="/calendar" component={SupervisorCalendar} />
            </Navbar>
          </React.Fragment>
        </Router>
      )
    } else return (
      <Router>
          <React.Fragment>
            <Navbar handleLogout={this.handleLogout}>
              <Route exact path="/" component={Projects} />
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/calendar" component={Calendar} />
              <Route path="/login" render={(props) => <LoginForm {...props} handleSubmit={this.handleSubmit} handleLogout={this.handleLogout}/> } />
              <Route path="/reports" component={ReportContainer} />
            </Navbar>
          </React.Fragment>
        </Router>
    )
  }
}

//export default App;

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);