import React, {useState} from "react";
import Axios from "axios";

const RunItem = (props) => {
    const [miles, setMiles] = useState(props.run.miles);
    const [speed, setSpeed] = useState(props.run.mph);
    const [notes, setNotes] = useState(props.run.notes);
    const [calories, setCalories] = useState(props.run.caloriesBurnt)

    const updateRun = () => {
        Axios.put('/api/runs/update', {id: props.run._id, miles: miles, mph: speed, notes: notes}).then((res) => {
            console.log('yay!');
            setCalories(res.data.caloriesBurnt);
        }).catch((e) => {
            console.log(e);
        })
    }

    return (
        <tr className="data-item">
            <td className="num">
                <input type="number" defaultValue={miles}
                       onChange={event => setMiles(event.target.value)}/>
            </td>
            <td className="num">
                <input type="number" defaultValue={speed}
                       onChange={event => setSpeed(event.target.value)}/>
            </td>
            <td className="txt">
                <input type="text" defaultValue={notes}
                       onChange={event => setNotes(event.target.value)}/>
            </td>
            <td className="num" style={{color: "deeppink"}}>{calories}</td>
            <td className="btns">
                <button className="table-btn" onClick={updateRun}>save</button>
                <button className="table-btn" onClick={() => props.deleteRun(props.run._id)}>delete</button>
            </td>
        </tr>
    );
};

export default RunItem;
