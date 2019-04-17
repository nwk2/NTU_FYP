import React from 'react'
import { CssBaseline } from '@material-ui/core';
import LoadingCircle from './LoadingCircle';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios'
import dateFns from 'date-fns'

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

class ReportContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reportdata: null
        }
    }
    componentDidMount() {
        const token = localStorage.getItem('token')
        let config = { headers: JSON.parse(token) }
        axios.get(
            'http://localhost:8000/api/userproject',
            config
        ).then(res => {
            //console.log(res.data)
            this.setState({ reportdata: res.data })
        }).catch((err) => {
            console.log('err', err)
        })
    }
    render() {
        const { classes } = this.props
        if (this.state.reportdata === null) {
            return <LoadingCircle />
        } else {
            let data = this.state.reportdata[0].project.tasks
            return (
                <React.Fragment>
                    <CssBaseline />
                    <Grid container spacing={40} className={classes.cardGrid}>
                    {data.map(item => (
                        (item.reports === null) ? null
                        :
                        <Grid item key={item.task_id} xs={12} md={6}>
                            <Card className={classes.card}>
                            <div className={classes.cardDetails}>
                            <CardContent>
                            <Typography variant="h6" paragraph>
                                Tasks Done:<br/>
                            </Typography>
                            <Typography variant="subtitle1" paragraph>
                                {item.reports.report_title}
                            </Typography>
                            <Typography variant="h6" paragraph>
                                Todo:<br/>
                            </Typography>
                            <Typography variant="subtitle1" paragraph>
                                {item.reports.text}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                Report Timestamp {dateFns.format(new Date(item.reports.timestamp), 'DD/MM/YYYY')}
                            </Typography>
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

export default withStyles(styles)(ReportContainer)