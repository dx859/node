exports.homelist = function(req, res) {
    res.render('location-list', {
        title: 'Home',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [{
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '100m'
        }, {
            name: 'Cafe Hero',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 4,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            distance: '200m'
        }, {
            name: 'Burger Queen',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 2,
            facilities: ['Food', 'Preminum wifi'],
            distance: '250m'
        }]
    });
};

exports.locationInfo = function(req, res) {
    res.render('location-info', { title: 'Location info' });
};

exports.addReview = function(req, res) {
    res.render('location-review-form', { title: 'Add review' });
};
