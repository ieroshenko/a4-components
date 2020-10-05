import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Redirect} from "react-router-dom";
import Run from "../entities/Run";
import RunItem from "../components/RunItem"


const HomePage = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(-1)
    const [runs, setRuns] = useState([]);
    const [userName, setUserName] = useState("");
    const [miles, setMiles] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        Axios.get('/api/authCheck').then((res) => {
            setIsAuthenticated(1);
            setUserName(res.data.user.username);
        }).catch((e) => {
            setIsAuthenticated(0);
        })

        Axios.get('/api/runs').then((res) => {
            console.log(res);
            if (res.data.runs.length) {
                setRuns(res.data.runs);
            }
        }).catch((e) => console.log(e));
    }, []);

    const addNewRun = () => {
        // make api request
        Axios.post('/api/runs', {miles: miles, mph: speed, notes: notes}).then((res) => {
            // if all good, add locally
            let run = new Run(res.data.id, miles, speed, notes, res.data.caloriesBurnt);

            // copy array
            let updatedRuns = [...runs];
            updatedRuns.push(run);

            console.log(updatedRuns);

            setRuns(updatedRuns);
        }).catch((e) => {
            console.log(e);
        });
    }

    const deleteRun = (runId) => {
        Axios.delete((`/api/runs/${runId}`)).then((res) => {
            // should be good
            let updatedRuns = runs.filter((run) => run._id !== runId);
            setRuns(updatedRuns);
        }).catch((e) => {
            console.log(e);
        })
    }

    const handleLogout = () => {
        window.open("/auth/logout", "_self");
    };

    return (
        <>
            {isAuthenticated === -1 ? <div>Waiting</div> :
                (isAuthenticated === 1 ? (


                        <div>
                            <div className="header">
                                <div className="headerCont text">{userName}</div>
                                <h4 className="headerCont text">JUST RUN</h4>
                                <button className="headerCont logout" onClick={handleLogout}>LOGOUT</button>
                            </div>
                            <div className="content-container">
                                <div className="form-container">
                                    <h2>Add new run!</h2>
                                    <form className="form">
                                        <div className="form-row">
                                            <label>How many miles?</label>
                                            <input type="number" name="miles"
                                                   onChange={event => setMiles(Number(event.target.value))}/>
                                        </div>
                                        <div className="form-row">
                                            <label>How fast in mph?</label>
                                            <input type="number" name="miles"
                                                   onChange={event => setSpeed(Number(event.target.value))}/>
                                        </div>
                                        <div className="form-row">
                                            <label>Any notes?</label>
                                            <input type="text" name="miles"
                                                   onChange={event => setNotes(event.target.value)}/>
                                        </div>
                                    </form>
                                    <button className="form-button" onClick={addNewRun}>Track</button>
                                </div>

                                <table className="data">
                                    <tr>
                                        <td className="data-label num">Miles</td>
                                        <td className="data-label num">Mph</td>
                                        <td className="data-label txt">Notes</td>
                                        <td className="data-label num">Calories</td>
                                        <td className="data-label btns">Operations</td>
                                    </tr>


                                    {runs.map((run) => <RunItem key={run._id} run={run} deleteRun={deleteRun}/>)}
                                </table>
                            </div>
                        </div>

                    ) :
                    <Redirect to={{pathname: '/login'}}/>)}
        </>
    )
}

export default HomePage
