function CollaborateModal({
  collaborationOptions,
  canCollaborate,
  toggleOption,
  onClose,
  onStartCollaboration,
}) {

  return (
    <div className="modal-overlay">

      <div className="collaborate-modal">

        {/* CLOSE */}

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>


        {/* HEADER */}

        <h2>
          Collaborate
        </h2>

        <p className="modal-subtitle">
          Choose how you want to explore this discussion.
        </p>


        {/* =================================
          COLLABORATE
        ================================= */}

        {canCollaborate && (
        <button
          type="button"
          className={
            collaborationOptions.community
              ? "collaboration-option selected"
              : "collaboration-option"
          }
          onClick={() =>
            toggleOption("community")
          }
        >

          <div className="option-checkbox">

            {collaborationOptions.community
              ? "✓"
              : ""}

          </div>

          <div className="option-icon">
            👥
          </div>

          <div className="option-content">

            <strong>
              Collaborate
            </strong>

            <span>
              Post your thought and discuss it with other people.
            </span>

          </div>

        </button>
        )}


        {/* =================================
            AI
        ================================= */}

        <button
          type="button"
          className={
            collaborationOptions.ai
              ? "collaboration-option selected"
              : "collaboration-option"
          }
          onClick={() =>
            toggleOption("ai")
          }
        >

          <div className="option-checkbox">

            {collaborationOptions.ai
              ? "✓"
              : ""}

          </div>

          <div className="option-icon">
            🤖
          </div>

          <div className="option-content">

            <strong>
              AI Analysis
            </strong>

            <span>
              Summarize the discussion and find patterns.
            </span>

          </div>

        </button>


        {/* =================================
          READ ONLY
        ================================= */}

        <button
          type="button"
          className={
            collaborationOptions.read
              ? "collaboration-option selected"
              : "collaboration-option"
          }
          onClick={() =>
            toggleOption("read")
          }
        >

          <div className="option-checkbox">

            {collaborationOptions.read
              ? "✓"
              : ""}

          </div>

          <div className="option-icon">
            ⚡
          </div>

          <div className="option-content">

            <strong>
              Read Only
            </strong>

            <span>
              View the post and related comments without posting.
            </span>

          </div>

        </button>


        {/* =================================
            ATTACHMENT INFORMATION
        ================================= */}

        <div className="modal-add-section">

          <h3>
            Add something to the discussion
          </h3>

          <div className="modal-attachment-options">

            <div className="modal-attachment-item">
              🖼️
              <span>Image</span>
            </div>

            <div className="modal-attachment-item">
              🎙️
              <span>Audio</span>
            </div>

            <div className="modal-attachment-item">
              🎥
              <span>Video</span>
            </div>

          </div>

        </div>


        {/* START */}

        <button
          type="button"
          className="start-collaboration-button"
          onClick={
            onStartCollaboration
          }
        >
          Start Collaboration →
        </button>

      </div>

    </div>
  );
}


export default CollaborateModal;