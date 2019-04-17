import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
//import LoadingCircle from './LoadingCircle';
import Loader from './Loader';

// const projectdata = [
//     {
//         "id": 1,
//         "project": {
//             "project_id": 3,
//             "project_title": "Web-based project management system",
//             "project_description": "updfates description",
//             "start": "2018-08-13",
//             "end": "2019-11-16"
//         }
//     }
// ]

const styles = theme => ({
    layout: {
      width: 'auto',
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
        width: 1100,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    toolbarMain: {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    toolbarTitle: {
      flex: 1,
    },
    toolbarSecondary: {
      justifyContent: 'space-between',
    },
    mainFeaturedPost: {
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      marginBottom: theme.spacing.unit * 4,
    },
    mainFeaturedPostContent: {
      padding: `${theme.spacing.unit * 6}px`,
      [theme.breakpoints.up('md')]: {
        paddingRight: 0,
      },
    },
    mainGrid: {
      marginTop: theme.spacing.unit * 3,
    },
    card: {
      display: 'flex',
    },
    cardDetails: {
      flex: 1,
    },
    cardMedia: {
      width: 160,
    },
    markdown: {
      padding: `${theme.spacing.unit * 3}px 0`,
    },
    sidebarAboutBox: {
      padding: theme.spacing.unit * 2,
      backgroundColor: theme.palette.grey[200],
    },
    sidebarSection: {
      marginTop: theme.spacing.unit * 3,
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing.unit * 8,
      padding: `${theme.spacing.unit * 6}px 0`,
    },
  });


class Projects extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectdata: null
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        axios.get(
            'http://localhost:8000/api/userproject/',
            config
        ).then(res => {
            //console.log(res.data)
            this.setState({ projectdata: res.data })
        }).catch((err) => {
            console.log('err', err)
        })
    }
    render() {
        const { classes } = this.props;

        if (this.state.projectdata === null) {
          return <Loader />
        } else {
        return(
            <React.Fragment>
                <CssBaseline />
                Projects
                <Grid container spacing={40} className={classes.cardGrid}>
                    {this.state.projectdata.map(item => (
                    <Grid item key={item.project.project_id} xs={12} md={6}>
                        <Card className={classes.card}>
                        <div className={classes.cardDetails}>
                            <CardContent>
                            <Typography component="h2" variant="h5">
                                Title: {item.project.project_title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Start date: {item.project.start}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                End date: {item.project.end}
                            </Typography>
                            <Typography variant="subtitle1" paragraph>
                                Project Description: {item.project.project_description}
                            </Typography>
                            {/* <Typography variant="subtitle1" color="primary">
                                View Project...
                            </Typography> */}
                            </CardContent>
                        </div>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </React.Fragment>
          )
        }
    }
}

export default withStyles(styles)(Projects)