export const filterNotes = (notes, query, tag) => {
  return notes.filter((note) => {
    const matchesQuery =
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase());

    const matchesTag = tag ? note.tags.includes(tag) : true;

    return matchesQuery && matchesTag;
  });
};