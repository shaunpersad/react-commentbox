const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_KEY
});

module.exports = function createComment(body, authorName, blogPostId, parentCommentId, callback) {

    client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then(space => space.getEnvironment('master'))
        .then(environment => environment.createEntry('comment', {
            fields: {
                body: {
                    'en-US': body
                },
                author: {
                    'en-US': `${authorName}`
                },
                blogPost: {
                    'en-US': {
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: blogPostId
                        }
                    }
                },
                parentComment: {
                    'en-US': {
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: parentCommentId
                        }
                    }
                }
            }
        }))
        .then(entry => entry.publish())
        .then((entry) => callback(null, entry))
        .catch(callback);
};