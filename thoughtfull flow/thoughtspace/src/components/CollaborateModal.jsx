function CollaborateModal({
  collaborationOptions,
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
            ASK COMMUNITY
        ================================= */}

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
              Ask Community
            </strong>

            <span>
              Get different perspectives from
              other people.
            </span>

          </div>

        </button>


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
              Let AI Analyze
            </strong>

            <span>
              Understand the discussion,
              summarize and find patterns.
            </span>

          </div>

        </button>


        {/* =================================
            CHALLENGE
        ================================= */}

        <button
          type="button"
          className={
            collaborationOptions.challenge
              ? "collaboration-option selected"
              : "collaboration-option"
          }
          onClick={() =>
            toggleOption("challenge")
          }
        >

          <div className="option-checkbox">

            {collaborationOptions.challenge
              ? "✓"
              : ""}

          </div>

          <div className="option-icon">
            ⚡
          </div>

          <div className="option-content">

            <strong>
              Challenge My Thinking
            </strong>

            <span>
              Find counterarguments,
              assumptions and blind spots.
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