import styles from "./NewNote.css";

function NewNote(): JSX.Element {
  return (
    <form method="post" id="note-form">
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={5} required />
      </p>
      <div className="form-actions">
        <button type="submit">Add Note</button>
      </div>
    </form>
  );
}

export default NewNote;

export function links(): { rel: string; href: string }[] {
  return [{ rel: "stylesheet", href: styles }];
}
