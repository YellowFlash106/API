import { useNavigate } from "react-router-dom";
import { useNotes } from "../context";
import { NoteEditor } from "../components";

const CreateNote = () => {
  const { createNote } = useNotes();
  const nav = useNavigate();

  const handleSave = (data) => {
    createNote(data);
    nav("/");
  };

  return <NoteEditor onSave={handleSave} />;
};

export default CreateNote;