import React, { useEffect, useState } from "react";

function Collaboration({
  question,
  postId,
  apiUrl,
  token,
  collaborationOptions = {},
  setPage,
  backPage = "categoryQuestions",
  communityThoughts,
  communityThought,
  setCommunityThought,
  postCommunityThought,
  handleFileSelect,
  attachedFile,
  fileType,
  removeAttachment,
}) {
  const [activeMode, setActiveMode] = useState(
    collaborationOptions.community
      ? "community"
      : collaborationOptions.ai
      ? "ai"
      : "read"
  );

  const thoughts = Array.isArray(communityThoughts)
    ? communityThoughts
    : [];
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState("");
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (activeMode !== "ai" || !postId) return;
    setIsLoadingAnalysis(true);
    setAnalysisError("");
    fetch(`${apiUrl}/thoughts/${postId}/analysis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to analyze this thought.");
        setAnalysis(data.analysis);
      })
      .catch((error) => setAnalysisError(error.message))
      .finally(() => setIsLoadingAnalysis(false));
  }, [activeMode, apiUrl, postId, token]);

  return (
    <section className="collaboration-page">

      {/* =========================
          BACK BUTTON
      ========================= */}

<button
  type="button"
  className="back-button"
  onClick={() => setPage(backPage)}
>
  ← Back to Question
</button>


      {/* =========================
          QUESTION
      ========================= */}

      <div className="collaboration-question">

        <div className="collaboration-label">
          COLLABORATING ON
        </div>

        <h1>
          {question || "Discussion"}
        </h1>

      </div>


      {/* =========================
          COLLABORATION MODES
      ========================= */}

      <div className="active-collaboration">

        <span>
          Collaborating through:
        </span>


        {collaborationOptions.community && (
          <button
            type="button"
            className={
              activeMode === "community"
                ? "mode-tag active-mode"
                : "mode-tag"
            }
            onClick={() => setActiveMode("community")}
          >
            👥 Collaborate
          </button>
        )}


        {collaborationOptions.ai && (
          <button
            type="button"
            className={
              activeMode === "ai"
                ? "mode-tag active-mode"
                : "mode-tag"
            }
            onClick={() => setActiveMode("ai")}
          >
            🤖 AI Analysis
          </button>
        )}


        {collaborationOptions.read && (
          <button
            type="button"
            className={
              activeMode === "read"
                ? "mode-tag active-mode"
                : "mode-tag"
            }
            onClick={() => setActiveMode("read")}
          >
            📖 Read Only
          </button>
        )}


        {collaborationOptions.challenge && (
          <button
            type="button"
            className={
              activeMode === "challenge"
                ? "mode-tag active-mode"
                : "mode-tag"
            }
            onClick={() => setActiveMode("challenge")}
          >
            ⚡ Challenge My Thinking
          </button>
        )}

      </div>


      {/* =====================================================
          COMMUNITY MODE
      ===================================================== */}

      {activeMode === "community" &&
        collaborationOptions.community && (

        <div className="collaboration-content">

          <h2 className="section-title">
            Community Thoughts
          </h2>


          <div className="community-thoughts">

            {thoughts.map((item) => (

              <div
                className="community-thought-card"
                key={item.id}
              >

                <div className="thought-user">

                  <span>
                    {item.avatar || "👤"}
                  </span>

                  <strong>
                    {item.name || "User"}
                  </strong>

                </div>


                <p>
                  {item.text}
                </p>


                <span className="thought-time">
                  {item.time || "Just now"}
                </span>

              </div>

            ))}

          </div>


          {/* ADD THOUGHT */}

          <div className="write-thought">

            <h2>
              Add your thought
            </h2>

            <textarea
              value={communityThought}
              onChange={(event) =>
                setCommunityThought(event.target.value)
              }
              placeholder="Share your perspective..."
            />


            {/* ATTACHMENT */}

            {attachedFile && (

              <div className="selected-attachment">

                <span>
                  📎 {attachedFile.name}
                </span>

                <button
                  type="button"
                  onClick={removeAttachment}
                >
                  ✕
                </button>

              </div>

            )}


            {/* FILE BUTTONS */}

            <div className="attachment-actions">

              <label className="attachment-button">

                🖼️ Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleFileSelect(event, "image")
                  }
                />

              </label>


              <label className="attachment-button">

                🎙️ Audio

                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) =>
                    handleFileSelect(event, "audio")
                  }
                />

              </label>


              <label className="attachment-button">

                🎥 Video

                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) =>
                    handleFileSelect(event, "video")
                  }
                />

              </label>

            </div>


            <button
              type="button"
              className="post-thought-button"
              onClick={postCommunityThought}
            >
              Post Thought →
            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          READ ONLY MODE
      ===================================================== */}

      {activeMode === "read" && collaborationOptions.read && (
        <div className="collaboration-content">
          <h2 className="section-title">Post and related comments</h2>

          <div className="community-thoughts">
            {thoughts.map((item) => (
              <div className="community-thought-card" key={item.id}>
                <div className="thought-user">
                  <span>{item.avatar || "👤"}</span>
                  <strong>{item.name || "User"}</strong>
                </div>
                <p>{item.text}</p>
                <span className="thought-time">{item.time || "Just now"}</span>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* =====================================================
          AI ANALYSIS MODE
      ===================================================== */}

      {activeMode === "ai" &&
        collaborationOptions.ai && (

        <div className="ai-analysis-card">

          {isLoadingAnalysis && <p>Analyzing this thought...</p>}
          {analysisError && <p className="analysis-error">{analysisError}</p>}
          {analysis && (
            <div className="ai-analysis-section">
              <h3>Bedrock analysis</h3>
              <p><strong>Category:</strong> {analysis.category}</p>
              <p><strong>Subcategory:</strong> {analysis.subcategory}</p>
              <p><strong>Intent:</strong> {analysis.intent}</p>
              <p><strong>Summary:</strong> {analysis.summary}</p>
              <p><strong>Discussion type:</strong> {analysis.discussion_type}</p>
              <p><strong>Tags:</strong> {analysis.tags.join(", ")}</p>
            </div>
          )}

          <div className="ai-analysis-header">

            <div className="ai-icon">
              🤖
            </div>

            <div>

              <h2>
                AI Analysis
              </h2>

              <p>
                AI has analyzed the discussion and
                identified the key perspectives.
              </p>

            </div>

          </div>


          {/* KEY QUESTION */}

          <div className="ai-analysis-section">

            <h3>
              💭 Question
            </h3>

            <p>
              {question}
            </p>

          </div>


          {/* SUMMARY */}

          <div className="ai-analysis-section">

            <h3>
              🧠 What the discussion suggests
            </h3>

            <p>
              The discussion suggests that there is no
              single infrastructure choice that works
              for every startup. The decision depends on
              team size, traffic, operational complexity,
              cost predictability and future scalability.
            </p>

          </div>


          {/* COMMUNITY PERSPECTIVES */}

          <div className="ai-analysis-section">

            <h3>
              👥 Community Perspectives
            </h3>

            <div className="ai-perspective">

              <strong>
                Perspective 1
              </strong>

              <p>
                Start with ECS and move to Kubernetes
                when the team and infrastructure actually
                require greater flexibility.
              </p>

            </div>


            <div className="ai-perspective">

              <strong>
                Perspective 2
              </strong>

              <p>
                Kubernetes becomes more useful when the
                infrastructure becomes complex enough to
                justify its operational cost.
              </p>

            </div>

          </div>


          {/* ADVANTAGES */}

          <div className="ai-analysis-section">

            <h3>
              ✅ Potential Advantages of Kubernetes
            </h3>

            <ul>

              <li>
                More control over infrastructure
              </li>

              <li>
                Greater flexibility
              </li>

              <li>
                Suitable for complex workloads
              </li>

              <li>
                Large ecosystem and tooling
              </li>

            </ul>

          </div>


          {/* RISKS */}

          <div className="ai-analysis-section">

            <h3>
              ⚠️ Potential Concerns
            </h3>

            <ul>

              <li>
                Higher operational complexity
              </li>

              <li>
                More infrastructure to manage
              </li>

              <li>
                Additional engineering effort
              </li>

              <li>
                May be unnecessary for small workloads
              </li>

            </ul>

          </div>


          {/* AI RECOMMENDATION */}

          <div className="ai-recommendation">

            <h3>
              🤖 AI Recommendation
            </h3>

            <p>
              For an early-stage startup, start with the
              simplest infrastructure that meets the
              current requirements. Consider Kubernetes
              when workload complexity, team size or
              operational requirements justify the
              additional complexity.
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          CHALLENGE MODE
      ===================================================== */}

      {activeMode === "challenge" &&
        collaborationOptions.challenge && (

        <div className="challenge-card">

          <div className="challenge-header">

            <div className="challenge-icon">
              ⚡
            </div>

            <div>

              <h2>
                Challenge My Thinking
              </h2>

              <p>
                Let's question the assumptions behind
                this discussion.
              </p>

            </div>

          </div>


          <div className="challenge-section">

            <h3>
              Your Question
            </h3>

            <p>
              {question}
            </p>

          </div>


          <div className="challenge-section">

            <h3>
              🔍 Assumption
            </h3>

            <p>
              The assumption may be that moving to
              Kubernetes automatically provides a better
              infrastructure solution.
            </p>

          </div>


          <div className="challenge-section">

            <h3>
              ⚡ Counterargument
            </h3>

            <p>
              Kubernetes provides flexibility, but that
              flexibility comes with additional operational
              complexity. For a small team, that complexity
              may outweigh the benefits.
            </p>

          </div>


          <div className="challenge-section">

            <h3>
              🤔 Question to Consider
            </h3>

            <p>
              What specific requirement would justify
              the additional complexity of Kubernetes
              instead of continuing with ECS?
            </p>

          </div>

        </div>
      )}

    </section>
  );
}

export default Collaboration;