import React from 'react';

import CommentBox from './CommentBox.jsx';
import '../styles/CommentBox.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authorName: null
        };
        this.getAuthorName = this.getAuthorName.bind(this);
        this.getComments = this.getComments.bind(this);
        this.comment = this.comment.bind(this);
        this.reply = this.reply.bind(this);
        this.flag = this.flag.bind(this);
        this.disabledComponent = this.disabledComponent.bind(this);
    }

    getAuthorName(postComment) {

        return (e) => {
            this.setState({
                authorName: prompt('Please enter your name:')
            }, postComment);
        };
    }

    getComments() {

        return this.props.contentfulClient.getEntries({
            'order': 'sys.createdAt',
            'content_type': 'comment',
            'fields.blogPost.sys.id': this.props.blogPostId,
        }).then((response) => {

            return response.items;

        }).catch(console.error);
    }

    normalizeComment(comment) {

        const { id, createdAt } = comment.sys;
        const { body, author, parentComment, flagged } = comment.fields;

        return {
            id,
            flagged,
            bodyDisplay: body,
            userNameDisplay: author,
            timestampDisplay: createdAt.split('T')[0],
            belongsToAuthor: false,
            parentCommentId: parentComment ? parentComment.sys.id : null
        };
    }

    comment(body) {

        return this.props.postData('http://localhost:1337/create-comment', {
            body,
            authorName: this.state.authorName,
            blogPostId: this.props.blogPostId
        });
    }

    reply(body, commentId) {

        return this.props.postData('http://localhost:1337/create-comment', {
            body,
            authorName: this.state.authorName,
            blogPostId: this.props.blogPostId,
            parentCommentId: commentId
        });
    }

    flag(commentId) {

        return this.props.postData('http://localhost:1337/flag-comment', {
            commentId: commentId
        });
    }

    disabledComponent({ postComment, postButtonContent }) {

        return (
            <button onClick={this.getAuthorName(postComment)}>{postButtonContent}</button>
        );
    }

    render() {

        return (
            <div>
                <h2>
                    Comments
                </h2>
                <CommentBox
                    usersHaveAvatars={false}
                    disabled={!this.state.authorName}
                    getComments={this.getComments}
                    normalizeComment={this.normalizeComment}
                    comment={this.comment}
                    reply={this.reply}
                    flag={this.flag}
                    disabledComponent={this.disabledComponent}
                />
            </div>
        );
    };
}

export default App;