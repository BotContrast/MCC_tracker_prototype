export default function GameSidebar({
  games,
  selectedGame,
  onSelect
}) {
  return (
    <aside className="sidebar">
      {games.map((game) => (
        <button
          key={game.id}
          className={`game-link ${
            selectedGame === game.id ? "active" : ""
          }`}
          onClick={() => onSelect(game.id)}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/${game.image}`}
            alt={game.name}
          />

          <span>
            {game.name}
          </span>
        </button>
      ))}
    </aside>
  );
}