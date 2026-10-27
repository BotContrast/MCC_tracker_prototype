function NamePlate({ rankImage, nameplateImage, gamertag }) {
  return (
    <div className="nameplate-wrap">
      <img
        className="xp-image"
        src={rankImage}
        alt="XP Rank"
      />

      <img
        className="nameplate-image"
        src={nameplateImage}
        alt="Nameplate"
      />

    </div>
  );
}

export default NamePlate;