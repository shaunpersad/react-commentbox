import React from 'react';

import CommentBox from './CommentBox.jsx';
import '../styles/CommentBox.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authorName: '',
            authorNameIsSet: false
        };
        this.onChangeAuthorName = this.onChangeAuthorName.bind(this);
        this.onSubmitAuthorName = this.onSubmitAuthorName.bind(this);
        this.getComments = this.getComments.bind(this);
        this.comment = this.comment.bind(this);
        this.reply = this.reply.bind(this);
        this.flag = this.flag.bind(this);
        this.disabledComponent = this.disabledComponent.bind(this);
    }

    onChangeAuthorName(e) {

        this.setState({
            authorName: e.currentTarget.value
        });
    }

    onSubmitAuthorName(e) {

        e.preventDefault();

        this.setState({
            authorNameIsSet: true
        });
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

    disabledComponent() {

        return (
            <form onSubmit={this.onSubmitAuthorName}>
                <input
                    type="text"
                    placeholder="Enter your name to post a comment"
                    value={this.state.authorName}
                    onChange={this.onChangeAuthorName}
                />
                <button type="submit">Submit</button>
            </form>
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
                    disabled={!this.state.authorNameIsSet}
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