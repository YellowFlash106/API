import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const createNote = (note) => {
    setNotes([...notes, { ...note, id: uuid(), createdAt: Date.now() }]);
  };

  const updateNote = (id, updated) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updated } : n)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, createNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);