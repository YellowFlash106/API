import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const NoteCard = ({ note, onDelete }) => {
  return (
    <div className="card">
      <h3>{note.title}</h3>
      <ReactMarkdown>{note.content.slice(0, 100)}</ReactMarkdown>

      <div>
        {note.tags.map((t) => (
          <span key={t}>#{t} </span>
        ))}
      </div>

      <Link to={`/edit/${note.id}`}>Edit</Link>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
};

export default NoteCard;