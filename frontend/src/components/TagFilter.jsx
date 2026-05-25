const TagFilter = ({ tags, selected, onSelect }) => {
  return (
    <select value={selected} onChange={(e) => onSelect(e.target.value)}>
      <option value="">All</option>
      {tags.map((tag) => (
        <option key={tag}>{tag}</option>
      ))}
    </select>
  );
};

export default TagFilter;