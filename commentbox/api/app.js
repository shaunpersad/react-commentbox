const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const createComment = require('./createComment');

const app = express();

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());

app.post('/create-comment', (req, res) => {

    const { body, authorName, blogPostId, parentCommentId } = req.body;

    createComment(body, authorName, blogPostId, parentCommentId, (err) => {

        if (err) {
            console.log('err', JSON.parse(err.message).details.errors);
            return res.status(500).send({ message: 'error' });
        }
        return res.status(200).send({ message: 'ok' });
    });
});


app.listen(1337, () => {

    console.log('listening');
});