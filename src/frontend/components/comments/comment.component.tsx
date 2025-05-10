export function Comment({ answerId }: any) {
    return (
        <div className="comment">
            { answerId && <span class="answer"></span> }
            <span className="body"></span>
            <div className="form-row">
                <span className="create-date"></span>
                <span id="author"></span>
            </div>
            <button id="answerComment">Ответить</button>
        </div>
    )
}