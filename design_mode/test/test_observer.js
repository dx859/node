const Fober = require('../observer/firstObserver');
const Sober = require('../observer/secondObserver');
const Oble  = require('../observer/observable');

var fobel = new Fober(),
    sober = new Sober(),
    oble  = new Oble();

oble.addObser(fobel);
oble.addObser(sober);

oble.doAction();
