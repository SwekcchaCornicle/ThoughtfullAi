import { useEffect, useState } from "react";

const questions = {

  AI: [
    {
      id: 1,
      text:
        "Will AI replace traditional software development workflows?",
      author: "Rahul",
      thoughts: 12,
    },

    {
      id: 2,
      text:
        "How can startups adopt AI without huge infrastructure costs?",
      author: "Ananya",
      thoughts: 8,
    },
  ],


  AWS: [
    {
      id: 3,
      text:
        "Is serverless a better choice for early-stage startups?",
      author: "Vikram",
      thoughts: 15,
    },

    {
      id: 4,
      text:
        "ECS or Kubernetes — when should a startup make the switch?",
      author: "Priya",
      thoughts: 9,
    },
  ],


  Cloud: [
    {
      id: 5,
      text:
        "How much cloud infrastructure does a growing startup really need?",
      author: "Arjun",
      thoughts: 7,
    },
  ],


  Software: [
    {
      id: 6,
      text:
        "Should teams prioritize speed or clean architecture?",
      author: "Neha",
      thoughts: 11,
    },
  ],


  Cybersecurity: [
    {
      id: 7,
      text:
        "What cybersecurity practices should every startup have?",
      author: "Rohan",
      thoughts: 6,
    },
  ],
};


function CategoryQuestions({
  selectedCategory,
  selectedSubcategory,
  setPage,
  openCollaborate,
  setSelectedQuestion,
  apiUrl,
  token,
}) {

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const categoryQuestions =
    questions[selectedSubcategory] || [];

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setHasLoaded(false);
    setLoadError("");
    fetch(
      `${apiUrl}/thoughts?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load posts.");
        if (isCurrent) {
          setPosts(data.posts || []);
          setNextCursor(data.nextCursor || "");
          setHasLoaded(true);
        }
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [apiUrl, selectedCategory, selectedSubcategory, token]);

  const displayQuestions = hasLoaded && posts.length > 0
    ? posts.map((post) => ({
        ...post,
        text: post.thought,
        author: post.author,
        id: post.id,
      }))
    : hasLoaded ? [] : categoryQuestions;


  const handleCollaborate = (question) => {

    setSelectedQuestion(
      question.text
    );

    openCollaborate(
      question.text
    );
  };


  return (
    <section className="category-questions-page">

      {/* BACK */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          setPage("explore")
        }
      >
        ← Back to Explore
      </button>


      {/* HEADER */}

      <div className="category-question-header">

        <h1>
          {selectedSubcategory}
        </h1>

        <p>
          Open questions people are thinking about
        </p>

      </div>


      {/* QUESTIONS */}

      <div className="question-list">

        {isLoading ? (
          <div className="empty-questions"><p>Loading thoughts...</p></div>
        ) : loadError ? (
          <div className="empty-questions"><p>{loadError}</p></div>
        ) : displayQuestions.length === 0 ? (

          <div className="empty-questions">

            <h3>
              No questions yet
            </h3>

            <p>
              Be the first person to start
              a conversation in this topic.
            </p>

          </div>

        ) : (

          displayQuestions.map(
            (question) => (

              <div
                className="question-card"
                key={question.id}
              >

                <h2>
                  {question.text}
                </h2>


                <div className="question-meta">

                  <span>
                    👤 {question.author}
                  </span>

                  <span>
                    💭 {question.thoughts || 0} thoughts
                  </span>

                </div>


<button
  type="button"
  className="collaborate-button"
  onClick={() => {
    setSelectedQuestion(question.text);
    openCollaborate(
      "categoryQuestions",
      question.mode || "collaborative",
      question.id
    );
  }}
>
  {question.mode === "individual" ? "Read / Analyze" : "Collaborate"}
</button>

              </div>

            )
          )

        )}

      </div>

      {nextCursor && (
        <button
          type="button"
          className="collaborate-button"
          onClick={async () => {
            const response = await fetch(
              `${apiUrl}/thoughts?category=${encodeURIComponent(selectedCategory)}&subcategory=${encodeURIComponent(selectedSubcategory)}&limit=10&cursor=${encodeURIComponent(nextCursor)}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            setPosts((current) => [...current, ...(data.posts || [])]);
            setNextCursor(data.nextCursor || "");
          }}
        >
          Load more
        </button>
      )}

    </section>
  );
}


export default CategoryQuestions;