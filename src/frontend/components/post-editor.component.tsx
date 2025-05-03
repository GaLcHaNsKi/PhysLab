export function PostEditor({ labId }: any) {
    return (
        <div className="editor" lab-id={labId}>
            <input type="text" id="post-title"/>
            <textarea name="body" id="post-body" placeholder="Так начните писать!">

            </textarea>
        </div>
    )
}
