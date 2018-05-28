const contentful = require('contentful-management');
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_KEY
});

module.exports = function createComment(body, author, blogPost, parentComment, callback) {

    client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then(space => space.getEnvironment('master'))
        .then(environment => environment.createEntry(process.env.REACT_APP_COMMENT_CONTENT_TYPE_ID, {
            fields: {
                body: {
                    'en-US': body
                },
                author: {
                    'en-US': `${author}`
                },
                blogPost: {
                    'en-US': {
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: blogPost
                        }
                    }
                },
                parentComment: {
                    'en-US': {
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: parentComment
                        }
                    }
                }
            }
        }))
        .then((entry) => callback(null, entry))
        .catch(callback);
};