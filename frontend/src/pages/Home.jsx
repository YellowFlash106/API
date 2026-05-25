import { useState } from "react";
import { useNotes } from "../context";
import { NoteCard, SearchBar, TagFilter } from "../components";
import { filterNotes } from "../utils";

const Home = () => {
  const { notes, deleteNote } = useNotes();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  const allTags = [...new Set(notes.flatMap((n) => n.tags))];
  const filtered = filterNotes(notes, query, tag);

  return (
    <div>
      <h1>Notes</h1>
      <SearchBar value={query} onChange={setQuery} />
      <TagFilter tags={allTags} selected={tag} onSelect={setTag} />

      {filtered.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={deleteNote} />
      ))}
    </div>
  );
};

export default Home;