function Discussion({
  thought,
  chatType,
  setPage,
  communityThought,
  setCommunityThought,
  communityThoughts,
  postCommunityThought,
  handleFileSelect,
}) {
  return (
    <section className="discussion-page">
      <button
        className="back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>

      <div className="discussion-top-category">💻 TECH · AWS</div>

      <h1 className="discussion-title">
        {thought || "Should startups use Kubernetes or ECS?"}
      </h1>

      <div className="discussion-meta">
        👤 You
        <span>•</span>
        {chatType}
        <span>•</span>
        Open Question
      </div>

      <div className="discussion-divider"></div>

      <div className="conversation-section">
        <h2>💭 What do you think?</h2>

        <div className="community-input">
          <textarea
            value={communityThought}
            onChange={(e) => setCommunityThought(e.target.value)}
            placeholder="Share your thoughts with the community..."
          />

          <div className="community-input-footer">
            <div className="attachments">
              <label className="attachment-button">
                🖼️
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "image")}
                />
              </label>

              <label className="attachment-button">
                🎙️
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileSelect(e, "audio")}
                />
              </label>

              <label className="attachment-button">
                🎥
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileSelect(e, "video")}
                />
              </label>
            </div>

            <button
              className="post-thought-button"
              onClick={postCommunityThought}
            >
              Post Thought
            </button>
          </div>
        </div>
      </div>

      <div className="community-section">
        <div className="community-header">
          <h2>💬 Community Thoughts</h2>
          <span>{communityThoughts.length} thoughts</span>
        </div>

        {communityThoughts.map((item) => (
          <div className="thought-card" key={item.id}>
            <div className="thought-user">
              <div className="user-avatar">{item.avatar}</div>

              <div>
                <strong>{item.name}</strong>
                <small>{item.time}</small>
              </div>
            </div>

            <p>{item.text}</p>

            <div className="thought-actions-row">
              <button>💡 {item.type}</button>
              <button>👍 Agree</button>
              <button>💬 Reply</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Discussion;
