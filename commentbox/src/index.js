import React from 'react';
import ReactDOM from 'react-dom';
import { createClient } from 'contentful';

import registerServiceWorker from './registerServiceWorker';

import MyCommentBox from './components/MyCommentBox.jsx';


function postData(url, data) {

    return fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors'
    }).then(response => response.json()); // parses response to JSON
}

const contentfulClient = createClient({
    space: process.env.REACT_APP_SPACE_ID,
    accessToken: process.env.REACT_APP_ACCESS_TOKEN,
    host: process.env.REACT_APP_HOST
});

const blogPostId = process.env.REACT_APP_BLOG_POST_ID;

ReactDOM.render(React.createElement(MyCommentBox, { postData, contentfulClient, blogPostId }), document.getElementById('root'));
registerServiceWorker();
