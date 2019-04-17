import React from 'react'
import Cell from './Cell'
import LoadingCircle from './LoadingCircle'
import dateFns from 'date-fns'
import axios from 'axios'

const projectdata = [
    {
        "project": {
            "project_id": 3,
            "tasks": [
                {
                    "task_id": 3,
                    "reports": {
                        "task": 3,
                        "report_title": "Report 1 title",
                        "text": "some text asdsad",
                        "timestamp": "2019-02-28T15:51:35.468908Z",
                        "author": 2
                    },
                    "due_date": "2019-02-18",
                    "project": 3
                },
                {
                    "task_id": 6,
                    "reports": null,
                    "due_date": "2019-02-28",
                    "project": 3
                }
            ],
            "project_title": "Web-based project management system",
            "project_description": "updfates description",
            "start": "2018-08-13",
            "end": "2019-11-16"
        }
    }
]

class Calendar extends React.Component {
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
            this.setState({ projectdata: res.data })
        }).catch((err) => {
            console.log('err', err)
        })
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
                  <Cell
                    className="cell"
                    key={day.toString()}
                    date={day}
                    tasks={this.state.projectdata[0].project.tasks}
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
        if (this.state.projectdata === null) {
            return <LoadingCircle />
        } else {
        return (
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
        )
        }
    }
}

export default Calendar