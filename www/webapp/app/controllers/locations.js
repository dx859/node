exports.homelist = function(req, res) {
    res.render('location-list', {title: 'Home'});
};

exports.locationInfo = function(req, res) {
    res.render('location-info', {title: 'Location info'});
};

exports.addReview = function(req, res) {
    res.render('location-review-form', { title: 'Add review' });
};