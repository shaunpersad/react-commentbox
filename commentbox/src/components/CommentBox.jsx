import React from 'react';

class CommentBox extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            comments: null,
            comment: '',
            reply: '',
            commentIdToReplyTo: null,
            contractedComments: {},
        };

        this.load = this.load.bind(this);
        this.onUpVote = this.onUpVote.bind(this);
        this.onDownVote = this.onDownVote.bind(this);
        this.onToggleContract = this.onToggleContract.bind(this);
        this.onShowReply = this.onShowReply.bind(this);
        this.onHideReply = this.onHideReply.bind(this);
        this.onComment = this.onComment.bind(this);
        this.onReply = this.onReply.bind(this);
        this.renderComment = this.renderComment.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onChangeReply = this.onChangeReply.bind(this);
        this.joinRepliesToComments = this.joinRepliesToComments.bind(this);
        this.onFlag = this.onFlag.bind(this);
    }

    componentDidMount() {

        this.load();
    }

    load() {

        return this.props.getComments().then(comments => {

            this.setState({
                comments,
                comment: '',
                reply: '',
                commentIdToReplyTo: null
            });
        });
    }

    onUpVote(e) {

        this.props.upVote(e.currentTarget.value);
    }

    onDownVote(e) {

        this.props.downVote(e.currentTarget.value);
    }

    onToggleContract(e) {

        const commentId = e.currentTarget.value;

        this.setState({
            contractedComments: Object.assign({}, this.state.contractedComments, {
                [commentId]: !this.state.contractedComments[commentId]
            })
        })
    }

    onShowReply(e) {

        const reply = this.state.commentIdToReplyTo !== e.currentTarget.value ? '' : this.state.reply;

        this.setState({
            reply,
            commentIdToReplyTo: e.currentTarget.value
        });
    }

    onHideReply(e) {

        this.setState({
            reply: '',
            commentIdToReplyTo: null
        });
    }

    onComment(e) {
        
        e.preventDefault();

        this.props.comment(this.state.comment).then(this.load);
    }

    onReply(e) {

        e.preventDefault();

        this.props.reply(this.state.reply, this.state.commentIdToReplyTo).then(this.load);
    }

    onChangeComment(e) {

        this.setState({
            comment: e.currentTarget.value
        });
    }

    onChangeReply(e) {

        this.setState({
            reply: e.currentTarget.value
        });
    }

    onFlag(e) {

        this.props.flag(e.currentTarget.value).then(this.load);
    }

    renderComment(comment) {

        const classNames = ['comment'];

        if (this.state.commentIdToReplyTo === comment.id) {
            classNames.push('replying-to');
        }
        if (comment.belongsToAuthor) {
            classNames.push('belongs-to-author');
        }

        return (
            <li className={classNames.join(' ')} key={comment.id}>
                <div className={`level-${comment.level}`} style={{paddingLeft: this.props.levelPadding * comment.level}}>
                    <div className="comment-content">
                        <div className="comment-body">
                            {comment.bodyDisplay}
                        </div>
                        <div className="comment-footer">
                            {
                                this.props.usersHaveAvatars ?
                                    (
                                        <img className="user-avatar" src={comment.userAvatarUrl} />
                                    ) : null
                            }
                            <span className="user-name">{comment.userNameDisplay}</span>
                            <span className="timestamp">{comment.timestampDisplay}</span>
                            {
                                (comment.replies.length > 0) ?
                                    (
                                        <button className="toggle" value={comment.id} onClick={this.onToggleContract}>
                                            {
                                                this.state.contractedComments[comment.id] ?
                                                this.props.expandButtonContent :
                                                this.props.contractButtonContent
                                            }
                                        </button>
                                    ) : null
                            }
                            {
                                (!comment.flagged) ?
                                    (
                                        <button className="flag" value={comment.id} onClick={this.onFlag}>
                                            {this.props.flagButtonContent}
                                        </button>
                                    ) :
                                    (
                                        <span className="flagged">
                                            {this.props.flaggedContent}
                                        </span>
                                    )
                            }
                            {
                                (this.state.commentIdToReplyTo === comment.id) ?
                                    (
                                        <button className="hide-reply" value={comment.id} onClick={this.onHideReply}>
                                            {this.props.hideReplyButtonContent}
                                        </button>

                                    ) : (
                                        <button className="show-reply" value={comment.id} onClick={this.onShowReply}>
                                            {this.props.showReplyButtonContent}
                                        </button>
                                    )
                            }

                        </div>
                    </div>
                    <div className="reply">
                        {
                            (this.state.commentIdToReplyTo === comment.id) ?
                                (
                                    <div className="form-wrapper">
                                        <form onSubmit={this.onReply}>
                                            <div className="form-element">
                                                <textarea
                                                    name="reply"
                                                    rows={7}
                                                    value={this.state.reply}
                                                    onChange={this.onChangeReply}
                                                />
                                            </div>
                                            <div>
                                                <button type="submit">{this.props.postReplyButtonContent}</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
            </li>
        );

    }

    joinRepliesToComments(comment) {

        const comments = [ comment ];

        if (!this.state.contractedComments[comment.id]) {

            comment.replies.forEach(comment => {

                this.joinRepliesToComments(comment).forEach(comment => {

                    comments.push(comment);
                });
            });
        }

        return comments;
    }

    get comments() {

        if (!this.state.comments) {
            return (
                <li className="loading">
                    {this.props.loadingContent}
                </li>
            );
        }

        const comments = [];

        this.state.comments.forEach(comment => {

            this.joinRepliesToComments(comment).forEach(comment => {

                comments.push(this.renderComment(comment));
            });
        });

        return comments;
    }


    render() {

        return (
            <div className="commentbox">
                <div className="header">
                    <form onSubmit={this.onComment}>
                        <div className="form-element">
                            <textarea name="comment" rows={7} value={this.state.value} onChange={this.onChangeComment} />
                        </div>
                        <div>
                            <button type="submit">{this.props.postCommentButtonContent}</button>
                        </div>
                    </form>
                </div>
                <div className="body">
                    <ul className="comments">
                        {this.comments}
                    </ul>
                </div>
            </div>
        );
    }


    static upVote(commentId) {

    }

    static downVote(commentId) {

    }

    static getComments() {

    }

    static comment(commentBody) {

    }

    static reply(replyBody, commentIdToReplyTo) {

    }

    static flag(commentId) {

    }

    static get defaultProps() {

        const {
            upVote,
            downVote,
            getComments,
            comment,
            reply,
            flag
        } = this;

        return {
            usersHaveAvatars: true,
            levelPadding: 15,
            loadingContent: (
                <span>Loading...</span>
            ),
            expandButtonContent: '[+]',
            contractButtonContent: '[-]',
            showReplyButtonContent: 'reply',
            hideReplyButtonContent: 'cancel',
            postReplyButtonContent: 'Post Reply',
            postCommentButtonContent: 'Post Comment',
            flagButtonContent: 'flag',
            flaggedContent: '(flagged)',
            upVote,
            downVote,
            getComments,
            comment,
            reply,
            flag
        };
    }
}

export default CommentBox;