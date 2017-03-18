
exports.showIndex = function(req, res) {
    res.render('index');
};

exports.showAlbum = function(req, res) {
    res.send('相册：' + req.params.albumName);
};