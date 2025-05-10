export function CreateComment({ postId, commentId }: any) {
    return (
        <div className="modal" id="modal-comment">
            <div className="create-comment" postId={postId} commentId={commentId}>
                <textarea id="body" placeholder="Ваш комментарий"></textarea>
                <div className="form-row">
                    <button type="button" id="cancel">Cancel</button>
                    <button type="button" id="send">Send</button>
                </div>
            </div>
        </div>
    )
}