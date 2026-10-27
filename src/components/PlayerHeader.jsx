import NamePlate from "./NamePlate";

function PlayerHeader({ player }) {
  return (
    <header className="player-header">
      <NamePlate
        rankImage={player.rank}
        nameplateImage={player.nameplate}
        gamertag={player.gamertag}
      />
    </header>
  );
}

export default PlayerHeader;