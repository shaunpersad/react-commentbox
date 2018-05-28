# commentbox
A generic comment box made in React

## Installation
```bash
npm install react-commentbox --save
```

## Usage
This component has the following props:
```js
const defaultProps = {
    usersHaveAvatars: false, // if true, your comments must have a userAvatarUrl field 
    levelPadding: 15, // how much to indent each nested comment
    loadingContent: 'Loading...', // can be a string or a component
    expandButtonContent: '[+]', // can be a string or a component
    contractButtonContent: '[-]', // can be a string or a component
    showReplyButtonContent: 'reply', // can be a string or a component
    hideReplyButtonContent: 'cancel', // can be a string or a component
    postReplyButtonContent: 'Post Reply', // can be a string or a component
    postCommentButtonContent: 'Post Comment', // can be a string or a component
    flagButtonContent: 'flag', // can be a string or a component
    flaggedContent: '(flagged)', // can be a string or a component
    getComments: () => new Promise(), // replace with a function call that fetches comments
    comment: (body) => new Promise(), // replace with a function call that creates a comment
    reply: (body, commentId) => new Promise(), // replace with a function call that creates a reply to a comment
    flag: (commentId) => new Promise() // replace with a function call to flag a comment
};
```

The `getComments` function should resolve an array of comments. Each comment object should have the following properties:
```js
const comments = [
    {
        id, // a unique id for the comment. used as a "key" prop.
        flagged: false, // if this comment is flagged or not
        bodyDisplay, // the string or component to display as the comment body
        userNameDisplay, // the string or component to display as the user name. goes inside a <span />.
        timestampDisplay, // the string or component to display as the timestamp goes inside a <span />.
        replies: [], // an array of other comment objects just like this one, that are replies to this comment.
        level: 0, // how many levels of nesting is this comment?
        belongsToAuthor: false // did the currently logged in author make this comment?
    }
];
```