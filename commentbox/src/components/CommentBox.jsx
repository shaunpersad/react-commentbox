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

        this.comment = this.comment.bind(this);
        this.reply = this.reply.bind(this);
        this.clearInput = this.clearInput.bind(this);
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
        this.onFlag = this.onFlag.bind(this);
    }

    componentDidMount() {

        this.load();
    }

    comment() {

        return this.props.comment(this.state.comment)
            .then(this.clearInput)
            .then(this.load);
    }

    reply() {

        return this.props.reply(this.state.reply, this.state.commentIdToReplyTo)
            .then(this.clearInput)
            .then(this.load);
    }

    clearInput() {

        return this.setState({
            comment: '',
            reply: '',
            commentIdToReplyTo: null
        });
    }

    load() {

        return this.props.getComments().then(comments => {

            this.setState({ comments });

            return comments;
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

        this.comment();
    }

    onReply(e) {

        e.preventDefault();

        this.reply();
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
        if (comment.flagged) {
            classNames.push('flagged');
        }

        return (
            <div className={classNames.map(className => this.prefix(className)).join(' ')}>
                <div
                    className={this.prefix(`level-${comment.level}`)}
                >
                    <div className={this.prefix('comment-content')}>
                        <div className={this.prefix('comment-body')}>
                            {comment.bodyDisplay}
                        </div>
                        <div className={this.prefix('comment-footer')}>
                            {
                                this.props.usersHaveAvatars ?
                                    (
                                        <img
                                            className={this.prefix('user-avatar')}
                                            src={comment.userAvatarUrl}
                                            alt={comment.userNameDisplay}
                                        />
                                    ) : null
                            }
                            <span className={this.prefix('user-name')}>{comment.userNameDisplay}</span>
                            <span className={this.prefix('timestamp')}>{comment.timestampDisplay}</span>
                            {
                                (comment.replies.length > 0) ?
                                    (
                                        <button
                                            className={this.prefix('toggle')}
                                            value={comment.id}
                                            onClick={this.onToggleContract}
                                        >
                                            {
                                                this.state.contractedComments[comment.id] ?
                                                this.props.expandButtonContent :
                                                this.props.contractButtonContent
                                            }
                                        </button>
                                    ) : null
                            }
                            <button
                                className={this.prefix('flag')}
                                value={comment.id}
                                onClick={this.onFlag}
                                disabled={comment.flagged}
                            >
                                {comment.flagged ? this.props.flagButtonDisabledContent : this.props.flagButtonContent}
                            </button>
                            {
                                (this.state.commentIdToReplyTo === comment.id) ?
                                    (
                                        <button
                                            className={this.prefix('hide-reply')}
                                            value={comment.id}
                                            onClick={this.onHideReply}
                                        >
                                            {this.props.hideReplyButtonContent}
                                        </button>

                                    ) : (
                                        <button
                                            className={this.prefix('show-reply')}
                                            value={comment.id}
                                            onClick={this.onShowReply}
                                        >
                                            {this.props.showReplyButtonContent}
                                        </button>
                                    )
                            }

                        </div>
                    </div>
                    <div className={this.prefix('reply')}>
                        {
                            (this.state.commentIdToReplyTo === comment.id) ?
                                (
                                    <div className={this.prefix('form-wrapper')}>
                                        <form className={this.prefix('reply-form')} onSubmit={this.onReply}>
                                            <div className={this.prefix('form-element')}>
                                                <textarea
                                                    name="reply"
                                                    rows={this.props.textareaRows}
                                                    value={this.state.reply}
                                                    onChange={this.onChangeReply}
                                                    disabled={this.props.disabled}
                                                />
                                            </div>
                                            <div>
                                                {
                                                    (!this.props.disabled) ?
                                                        (
                                                            <button type="submit">{this.props.postReplyButtonContent}</button>
                                                        ) : null
                                                }
                                                {this.props.postButtonExtraContent}
                                            </div>
                                        </form>
                                        {this.props.disabled ? (
                                            <this.props.disabledComponent {...this.props} />
                                        ) : null}
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderComments(comments) {

        return comments.map(comment => {

            return (
                <li key={comment.id} className={this.prefix('comment-and-replies')}>
                    {this.renderComment(comment)}
                    <ul
                        className={this.prefix('replies')}
                        style={{paddingLeft: this.props.levelPadding * (comment.level + 1)}}
                    >
                        {this.state.contractedComments[comment.id] ? null : this.renderComments(comment.replies)}
                    </ul>
                </li>
            );
        });
    }

    get renderedComments() {

        if (!this.state.comments) {
            return (
                <li className={this.prefix('loading')}>
                    {this.props.loadingContent}
                </li>
            );
        }

        const comments = [];
        const references = {};

        this.state.comments.forEach(comment => {

            const {
                id,
                flagged,
                bodyDisplay,
                userAvatarUrl,
                userNameDisplay,
                timestampDisplay,
                belongsToAuthor,
                parentCommentId
            } = this.props.normalizeComment(comment);


            references[id] = {
                id,
                flagged,
                bodyDisplay,
                userAvatarUrl,
                userNameDisplay,
                timestampDisplay,
                belongsToAuthor,
                replies: [],
                level: 0
            };

            if (parentCommentId) {
                references[parentCommentId].replies.push(references[id]);
                references[id].level = references[parentCommentId].level + 1;
            } else {
                comments.push(references[id]);
            }
        });

        return this.renderComments(comments);
    }

    prefix(className) {

        return `${this.props.classPrefix}${className}`;
    }

    render() {

        return (
            <div className={this.props.className}>
                <div className={this.prefix('header')}>
                    <form className={this.prefix('comment-form')} onSubmit={this.onComment}>
                        <div className={this.prefix('form-element')}>
                            <textarea
                                name="comment"
                                rows={this.props.textareaRows}
                                value={this.state.comment}
                                onChange={this.onChangeComment}
                                disabled={this.props.disabled}
                            />
                        </div>
                        <div>
                            {
                                (!this.props.disabled) ?
                                    (
                                        <button type="submit">{this.props.postCommentButtonContent}</button>
                                    ) : null
                            }
                            {this.props.postButtonExtraContent}
                        </div>
                    </form>
                    {this.props.disabled ? (
                        <this.props.disabledComponent {...this.props} />
                    ) : null}
                </div>
                <div className={this.prefix('body')}>
                    <ul className={this.prefix('comments')}>
                        {this.renderedComments}
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

        return new Promise();
    }

    static normalizeComment(comment) {

        return comment;
    }

    static comment(commentBody) {

        return new Promise();
    }

    static reply(replyBody, commentIdToReplyTo) {

        return new Promise();
    }

    static flag(commentId) {

        return new Promise();
    }

    static disabledComponent(props) {

        return (
            <div>
                Replace with a component that logs in your user or gets their name.
            </div>
        );
    }

    static get defaultProps() {

        const {
            upVote,
            downVote,
            getComments,
            normalizeComment,
            comment,
            reply,
            flag,
            disabledComponent
        } = this;

        return {
            classPrefix: 'cb-',
            className: 'commentbox',
            disabled: true,
            usersHaveAvatars: false,
            levelPadding: 25,
            textareaRows: 7,
            loadingContent: 'Loading...',
            expandButtonContent: '[+]',
            contractButtonContent: '[-]',
            showReplyButtonContent: 'reply',
            hideReplyButtonContent: 'cancel',
            postReplyButtonContent: 'Post Reply',
            postCommentButtonContent: 'Post Comment',
            flagButtonContent: 'flag',
            flagButtonDisabledContent: '(flagged)',
            postButtonExtraContent: null,
            disabledComponent,
            upVote,
            downVote,
            getComments,
            normalizeComment,
            comment,
            reply,
            flag
        };
    }
}

export default CommentBox;