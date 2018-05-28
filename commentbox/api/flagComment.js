const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_KEY
});

function log(fn, message) {

    console.log(message);
    return fn;
}

module.exports = function flagComment(comment, callback) {

    client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then(log(space => space.getEnvironment('master'), 'get space'))
        .then(log(environment => environment.getEntry(comment), 'get environment'))
        .then(entry => {

            entry.fields.flagged = {
                'en-US': true
            };
            return entry.update();
        })
        .then((entry) => callback(null, entry))
        .catch(callback);
};
