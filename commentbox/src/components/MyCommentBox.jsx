import React from 'react';

import CommentBox from './CommentBox.jsx';
import '../styles/CommentBox.css';

class MyCommentBox extends React.Component {

    state = { authorName: '', authorNameIsSet: false };

    onChangeAuthorName = (e) => this.setState({ authorName: e.currentTarget.value });

    onSubmitAuthorName = (e) => {

        e.preventDefault();

        this.setState({ authorNameIsSet: true });
    };

    getComments = () => {

        return this.props.contentfulClient.getEntries({
            'order': 'sys.createdAt',
            'content_type': 'comment',
            'fields.blogPost.sys.id': this.props.blogPostId,
        }).then((response) => {

            return response.items;

        }).catch(console.error);
    };

    normalizeComment = (comment) => {

        const { id, createdAt } = comment.sys;
        const { body, author, parentComment } = comment.fields;

        return {
            id,
            bodyDisplay: body,
            userNameDisplay: author.fields.displayName,
            timestampDisplay: createdAt.split('T')[0],
            belongsToAuthor: false,
            parentCommentId: parentComment ? parentComment.sys.id : null
        };
    };

    comment = (body, parentCommentId) => {

        return this.props.postData('/create-comment', {
            body,
            parentCommentId,
            authorName: this.state.authorName,
            blogPostId: this.props.blogPostId
        });
    };

    disabledComponent = (props) => {

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
    };

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
                    disabledComponent={this.disabledComponent}
                />
            </div>
        );
    };
}

export default MyCommentBox;