import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} My Notes App</p>
    </footer>
  );
}

export default Footer;
