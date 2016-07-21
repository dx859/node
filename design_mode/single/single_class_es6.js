var _instance = null;

class Class {
    constructor(time) {
        this.name = 'danli';
        this.time = time;
    }

    show() {
        console.log(this.name, this.time);
    }

}

module.exports = (time) => {

    if (_instance === null) {
        _instance = new Class(time);
    }

    return _instance;

};

