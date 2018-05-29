# commentbox
A generic comment box made in React

## Installation
```bash
npm install react-commentbox --save
```

## Usage
This component has the following default props:
```js
const defaultProps = {
    disabled: true, // disabled when there's no user/author name present
    usersHaveAvatars: false, // if true, your comments must have a userAvatarUrl field 
    levelPadding: 25, // how much to indent each nested comment
    loadingContent: 'Loading...', // can be a string or a component
    expandButtonContent: '[+]', // can be a string or a component
    contractButtonContent: '[-]', // can be a string or a component
    showReplyButtonContent: 'reply', // can be a string or a component
    hideReplyButtonContent: 'cancel', // can be a string or a component
    postReplyButtonContent: 'Post Reply', // can be a string or a component
    postCommentButtonContent: 'Post Comment', // can be a string or a component
    flagButtonContent: 'flag', // can be a string or a component
    flaggedContent: '(flagged)', // can be a string or a component
    disabledComponent: React.Component, // what to show when the user isn't logged in or there's no author info to use
    normalizeComment: (comment) => { // turns your comment object into an object the component expects
        return {
            id,
            flagged,
            bodyDisplay,
            userNameDisplay,
            timestampDisplay,
            belongsToAuthor,
            parentCommentId            
        };
    },
    getComments: () => new Promise(), // replace with a function call that fetches comments
    comment: (body) => new Promise(), // replace with a function call that creates a comment
    reply: (body, commentId) => new Promise(), // replace with a function call that creates a reply to a comment
    flag: (commentId) => new Promise() // replace with a function call to flag a comment
};
```

- The `getComments` function should resolve to an array of comments. Each element in that array is run through the supplied
`normalizeComment` function.
- the `comment` function should be replaced with your ajax call to create the comment. It doesn't need to resolve to anything.
- the `reply` function is similar to the `comment` function, except it gives you the `commentId` of the comment the reply is for.
- the `flag` function should be another ajax call to flag that comment.
- comments eventually need an author to attribute themselves to. You manage that on your own via the `disabled` and `disabledComponent` props.

## Example
The below example is an "anonymous" comment implementation, where you just need to type in an author name at the time of posting.
You'll usually want to replace that logic with a login implementation.

This example assumes your comments are coming from Contentful, thus the `normalizeComment` is catered to that use case.

It also assumes that the `/create-comment` and `/flag-comment` endpoints exist. You can find a full, working example
of how to implement these endpoints in Express.js in the `commentbox/api` directory.

```jsx harmony
import React from 'react';
import CommentBox from 'react-commentbox';

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

        return this.props.postData('/create-comment', {
            body,
            authorName: this.state.authorName,
            blogPostId: this.props.blogPostId
        });
    }

    reply(body, commentId) {

        return this.props.postData('/create-comment', {
            body,
            authorName: this.state.authorName,
            blogPostId: this.props.blogPostId,
            parentCommentId: commentId
        });
    }

    flag(commentId) {

        return this.props.postData('/flag-comment', {
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
```
