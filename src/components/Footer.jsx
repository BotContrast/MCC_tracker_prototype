export default function Footer({ onAbout }) {
  return (
    <footer>
      <div className="footer-left">
        <button
          className="about-btn"
          onClick={onAbout}
        >
          About
        </button>
      </div>

      <div className="footer-right">
        Halo: The Master Chief Collection © Microsoft Corporation.
        MCC Player Tracker was created under Microsoft's Game Content
        Usage Rules using assets from Halo: The Master Chief Collection
        and is not endorsed by or affiliated with Microsoft.
      </div>
    </footer>
  );
}