const Badge = ({ type, text }) => {
  const styles = {
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    rejected: "bg-red-500/15 text-red-400 border border-red-500/25",
    default: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/25"
  };
  const selectedStyle = styles[type] || styles.default;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${selectedStyle}`}>
      {text}
    </span>
  );
};

export default Badge;
