import React from 'react';
import ReactDOM from 'react-dom';
import { createClient } from 'contentful';

import registerServiceWorker from './registerServiceWorker';

import CommentBox from './components/CommentBox.jsx';

import '../styles/CommentBox.css';

function postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    }).then(response => response.json()); // parses response to JSON
}

function responseToComments(response) {

    const comments = [];
    const references = {};

    response.items.forEach(item => {

        const { id, createdAt } = item.sys;
        const { body, author, parentComment, flagged } = item.fields;

        references[id] = {
            id,
            flagged,
            bodyDisplay: body,
            userNameDisplay: author,
            timestampDisplay: createdAt.split('T')[0],
            replies: [],
            level: 0,
            belongsToAuthor: Number(author) === 1
        };

        if (parentComment) {
            references[parentComment.sys.id].replies.push(references[id]);
            references[id].level = references[parentComment.sys.id].level + 1;
        } else {
            comments.push(references[id]);
        }
    });

    return comments;
}

const client = createClient({
    space: process.env.REACT_APP_SPACE_ID,
    accessToken: process.env.REACT_APP_ACCESS_TOKEN,
    host: process.env.REACT_APP_HOST
});

const props = {
    usersHaveAvatars: false,
    getComments() {

        return client.getEntries({
            'order': 'sys.createdAt',
            'content_type': process.env.REACT_APP_COMMENT_CONTENT_TYPE_ID,
            'fields.blogPost.sys.id': process.env.REACT_APP_BLOG_POST_ID,
        }).then((response) => {

            return responseToComments(response);

        }).catch(console.error);
    },
    comment(body) {

        return postData('http://localhost:1337/create-comment', {
            body,
            author: 1,
            blogPost: process.env.REACT_APP_BLOG_POST_ID
        });
    },
    reply(body, commentId) {

        return postData('http://localhost:1337/create-comment', {
            body,
            author: 1,
            blogPost: process.env.REACT_APP_BLOG_POST_ID,
            parentComment: commentId
        });
    },
    flag(commentId) {

        return postData('http://localhost:1337/flag-comment', {
            comment: commentId
        });
    }
};

ReactDOM.render(React.createElement(CommentBox, props), document.getElementById('root'));
registerServiceWorker();
