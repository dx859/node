var _instance = null; // 初始化_instance, 储存Class类和方法

module.exports = function(time) {
    function Class(time) {
        this.name = 'danli';
        this.time = time;
    }
    Class.prototype.show = function() {
        console.log(this.name, this.time);
    };
    this.getInstance = function() {
        if (_instance === null) {
            _instance = new Class(time);
        }
        return _instance;
    };
};
