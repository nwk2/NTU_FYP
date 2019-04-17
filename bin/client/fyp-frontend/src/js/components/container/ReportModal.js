import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

class ReportModal extends React.Component {
    render() {
        return (
            <div>
                <DialogTitle id="alert-dialog-title">View Report</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Done:
                    </DialogContentText> 
                    {this.props.reportData.report_title}
                    <DialogContentText id="alert-dialog-description">
                        Todos:
                    </DialogContentText>
                    {this.props.reportData.text}
                </DialogContent>
            </div>
        )
    }
}

export default ReportModal