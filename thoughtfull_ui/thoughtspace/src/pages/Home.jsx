function Home({
  thought,
  setThought,
  chatType,
  setChatType,
  startConversation,
  openCollaborate,
  handleFileSelect,
  attachedFile,
  fileType,
  removeAttachment,
  isAnalyzing,
  analysisError,
  setSelectedQuestion,
}) {
  return (
    <section className="content">

      {/* =================================
          WELCOME
      ================================= */}

      <h1>
        Good afternoon 👋
      </h1>

      <p className="subtitle">
        What's on your mind?
      </p>


      {/* =================================
          THOUGHT BOX
      ================================= */}

      <div className="thought-box">

        <textarea
          value={thought}
          onChange={(e) =>
            setThought(e.target.value)
          }
          placeholder="Dump a thought, question or scenario..."
        />


        <div className="thought-actions">

          {/* ATTACHMENTS */}

          <div className="attachments">

            <label className="attachment-button">
              🖼️

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileSelect(e, "image")
                }
              />
            </label>


            <label className="attachment-button">
              🎙️

              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  handleFileSelect(e, "audio")
                }
              />
            </label>


            <label className="attachment-button">
              🎥

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleFileSelect(e, "video")
                }
              />
            </label>

          </div>


          {/* TYPE */}

          <div className="post-types">

            <button
              type="button"
              className={
                chatType === "Individual"
                  ? "type-button active-type"
                  : "type-button"
              }
              onClick={() =>
                setChatType("Individual")
              }
            >
              Individual
            </button>


            <button
              type="button"
              className={
                chatType === "Corporate"
                  ? "type-button active-type"
                  : "type-button"
              }
              onClick={() =>
                setChatType("Corporate")
              }
            >
              Corporate
            </button>


            <button
              type="button"
              className="start-button"
              onClick={startConversation}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Start Chat →"}
            </button>

          </div>

        </div>


        {/* ATTACHMENT PREVIEW */}

        {attachedFile && (
          <div className="attachment-preview">

            <div>

              <span className="attachment-preview-icon">

                {fileType === "image" && "🖼️"}

                {fileType === "audio" && "🎙️"}

                {fileType === "video" && "🎥"}

              </span>


              <div>

                <strong>
                  {attachedFile.name}
                </strong>

                <small>
                  {(
                    attachedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB
                </small>

              </div>

            </div>


            <button
              type="button"
              onClick={removeAttachment}
              className="remove-attachment"
            >
              ✕
            </button>

          </div>
        )}

      </div>

      {analysisError && (
        <p className="analysis-error" role="alert">
          {analysisError}
        </p>
      )}


      {/* =================================
          OPEN DISCUSSIONS
      ================================= */}

      <div className="feed-header">

        <h2>
          Open Discussions
        </h2>

        <button
          type="button"
          className="sort-button"
        >
          Latest ▾
        </button>

      </div>


      {/* =================================
          DISCUSSION 1
      ================================= */}

      <div className="discussion-card">

        <div className="discussion-category">
          💻 TECH · AWS
        </div>

        <h3>
          Is Kubernetes overkill for a small startup?
        </h3>

        <p>
          I'm trying to understand whether a startup
          really needs Kubernetes or if simpler services
          would be better.
        </p>


        <div className="discussion-footer">

          <span>
            💬 17 thoughts
          </span>

          <span>
            👥 5 contributors
          </span>


          <button
            type="button"
            className="collaborate-button"
            onClick={() => {
              setSelectedQuestion(
                "Is Kubernetes overkill for a small startup?"
              );

              openCollaborate("home");
            }}
          >
            Collaborate
          </button>

        </div>

      </div>


      {/* =================================
          DISCUSSION 2
      ================================= */}

      <div className="discussion-card">

        <div className="discussion-category">
          🏠 LIVING · WORK
        </div>

        <h3>
          Does working remotely actually make us more productive?
        </h3>

        <p>
          Different people seem to have completely
          different experiences with remote work.
        </p>


        <div className="discussion-footer">

          <span>
            💬 24 thoughts
          </span>

          <span>
            👥 8 contributors
          </span>


          <button
            type="button"
            className="collaborate-button"
            onClick={() => {
              setSelectedQuestion(
                "Does working remotely actually make us more productive?"
              );

              openCollaborate("home");
            }}
          >
            Collaborate
          </button>

        </div>

      </div>

    </section>
  );
}

export default Home;