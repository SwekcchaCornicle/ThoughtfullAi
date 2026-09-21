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
}) {

  const categoryQuestions =
    questions[selectedSubcategory] || [];


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

        {categoryQuestions.length === 0 ? (

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

          categoryQuestions.map(
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
                    💭 {question.thoughts} thoughts
                  </span>

                </div>


<button
  type="button"
  className="collaborate-button"
  onClick={() => {
    setSelectedQuestion(question.text);
    openCollaborate("categoryQuestions");
  }}
>
  Collaborate
</button>

              </div>

            )
          )

        )}

      </div>

    </section>
  );
}


export default CategoryQuestions;