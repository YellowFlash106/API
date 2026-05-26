const SearchBar = ({ value, onChange }) => {
  return (
    <input
      placeholder="Search notes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;