function Explore({
  categories,
  setSelectedCategory,
  openSubcategory,
}) {

  return (
    <section className="explore-page">

      {/* HEADER */}

      <div className="explore-header">

        <h1>
          Explore
        </h1>

        <p>
          Discover what people are thinking about.
        </p>

        <button
          type="button"
          className="view-categories-button"
        >
          View All Categories
        </button>

      </div>


      <h2 className="choose-topic">
        Choose a topic
      </h2>


      {/* CATEGORY GRID */}

      <div className="category-grid">

        {categories.map(
          (category) => (

            <div
              className="category-card"
              key={category.name}
              onClick={() =>
                setSelectedCategory(
                  category.name
                )
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>


              <h3>
                {category.name}
              </h3>


              <p>
                {category.subcategories.length} topics
              </p>


              <div className="subcategory-list">

                {category.subcategories.map(
                  (subcategory) => (

                    <button
                      type="button"
                      className="subcategory-pill"
                      key={subcategory}
                      onClick={(event) => {

                        event.stopPropagation();

                        openSubcategory(
                          category.name,
                          subcategory
                        );

                      }}
                    >
                      {subcategory}
                    </button>

                  )
                )}

              </div>

            </div>

          )
        )}

      </div>

    </section>
  );
}


export default Explore;