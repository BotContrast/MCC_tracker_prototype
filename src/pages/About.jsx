export default function About() {
  return (
    <main className="hero">
      <div className="content">
        <h1>
          MCC Player Tracker
        </h1>

        <p className="subtitle">
          The best place to view your stats from Halo: The Master Chief Collection
        </p>

        <div className="center-text">
          <h2>
            About MCC Tracker
          </h2>

          <p>
            MCC Tracker is a website designed to provide an easy way to view
            and track player statistics from Halo: The Master Chief Collection.
            The website brings statistics from the different games included
            in MCC together in one place, allowing players to view their
            campaign and multiplayer performance without having to navigate
            through multiple menus or services.
          </p>

          <h2>
            Data Updates
          </h2>

          <p>
            Player statistics are not necessarily updated in real time. When a
            player is searched for or their profile is refreshed, the tracker
            retrieves the latest available statistics from its connected data
            source and updates the information displayed on the website. This
            prototype currently uses mock data and can be connected to the REST
            API later.
          </p>
        </div>
      </div>
    </main>
  );
}