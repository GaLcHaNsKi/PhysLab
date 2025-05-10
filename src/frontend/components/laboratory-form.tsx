export function LabForm({ labId }: any) {
    return (
        <form class="auth-form" id="create-lab-form" labId={labId}>
            <div class="form-row">
                <label htmlFor="name"><span class="required-field">Название</span>:</label>
                <input type="text" name="name" max-length="100" class="width-100per" required />
            </div>
            <div class="form-column">
                <label htmlFor="description">Описание:</label>
                <textarea name="description" class="height-50vh"></textarea>
            </div>
            <div class="title-with-tool-button">
                <label htmlFor="visibility">Видимость:</label>
                <select name="visibility">
                    <option value="PUBLIC">Публичная</option>
                    <option value="PRIVATE">Приватная</option>
                </select>
            </div>
            <div class="form-column">
                <button type="reset">Сбросить</button>
                <button type="button" id="submit">{labId? "Сохранить": "Создать"}</button>
            </div>
            <span class="error-message" id="error-message"></span>
        </form>
    )
}