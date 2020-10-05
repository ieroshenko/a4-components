export default class Run {
    constructor(id, numMiles, speed, notes, caloriesBurnt) {
        this._id = id;
        this.miles = numMiles;
        this.mph = speed;
        this.notes = notes;
        this.caloriesBurnt = caloriesBurnt;
    }
}
