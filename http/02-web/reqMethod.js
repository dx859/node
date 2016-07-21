exports.get = function (req, res) {
    res.end('hello world');
};

exports.update = function (req, res) {
    console.log(req.headers);
};

exports.remove = function (req, res) {
    console.log(req.headers);
};

exports.create = function (req, res) {
    console.log(req.headers);
};
