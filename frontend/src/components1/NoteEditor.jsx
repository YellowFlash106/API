import { useState } from "react";

const NoteEditor = ({ initial = {}, onSave }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [tags, setTags] = useState(initial.tags?.join(",") || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Markdown content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        placeholder="tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button type="submit">Save</button>
    </form>
  );
};

export default NoteEditor;