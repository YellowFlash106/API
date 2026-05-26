import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "../context";
import { NoteEditor } from "../components";

const EditNote = () => {
  const { id } = useParams();
  const { notes, updateNote } = useNotes();
  const nav = useNavigate();

  const note = notes.find((n) => n.id === id);

  const handleSave = (data) => {
    updateNote(id, data);
    nav("/");
  };

  return note ? <NoteEditor initial={note} onSave={handleSave} /> : <p>Not found</p>;
};

export default EditNote;