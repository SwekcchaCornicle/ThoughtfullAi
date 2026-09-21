function Sidebar({
  page,
  setPage,
  categories,
  setSelectedCategory,
}) {
  const goToCategory = (category) => {
    setSelectedCategory(category);
    setPage("explore");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        🧠 <span>ThoughtSpace</span>
      </div>

      <nav className="navigation">
        <div
          className={`nav-item ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          🏠 <span>Home</span>
        </div>

        <div
          className={`nav-item ${page === "messages" ? "active" : ""}`}
          onClick={() => setPage("messages")}
        >
          💬 <span>Messages</span>
        </div>

        <div
          className={`nav-item ${page === "explore" ? "active" : ""}`}
          onClick={() => {
            setSelectedCategory(null);
            setPage("explore");
          }}
        >
          🔎 <span>Explore</span>
        </div>
      </nav>

      <div className="section-title">CATEGORIES</div>

      <nav className="categories">
        {categories.map((category) => (
          <div
            className="nav-item"
            key={category.name}
            onClick={() => goToCategory(category)}
          >
            {category.icon}
            <span>{category.name}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div
          className={`nav-item ${page === "profile" ? "active" : ""}`}
          onClick={() => setPage("profile")}
        >
          👤 <span>Profile</span>
        </div>

        <div
          className={`nav-item ${page === "settings" ? "active" : ""}`}
          onClick={() => setPage("settings")}
        >
          ⚙️ <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
