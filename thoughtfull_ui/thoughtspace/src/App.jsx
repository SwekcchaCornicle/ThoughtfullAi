import { useState } from "react";
import "./App.css";

import { categories } from "./data/categories";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import CollaborateModal from "./components/CollaborateModal";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Discussion from "./pages/Discussion";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CategoryQuestions from "./pages/CategoryQuestions";
import Collaboration from "./pages/Collaboration";

function App() {
  // =========================
  // Navigation
  // =========================

  const [page, setPage] = useState("home");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState(null);

  const [selectedQuestion, setSelectedQuestion] =
    useState("");

  const [collaborationBackPage, setCollaborationBackPage] =
  useState("categoryQuestions");


  // =========================
  // Home / Discussion
  // =========================

  const [thought, setThought] = useState("");

  const [chatType, setChatType] =
    useState("Individual");


  // =========================
  // Attachments
  // =========================

  const [attachedFile, setAttachedFile] =
    useState(null);

  const [fileType, setFileType] =
    useState("");


  // =========================
  // Discussion thoughts
  // =========================

  const [communityThought, setCommunityThought] =
    useState("");

  const [communityThoughts, setCommunityThoughts] =
    useState([
      {
        id: 1,
        name: "Ananya",
        avatar: "👩",
        time: "12 min ago",
        text:
          "Kubernetes gives us flexibility, but it also adds operational complexity for smaller teams.",
        type: "Perspective",
      },
      {
        id: 2,
        name: "Rahul",
        avatar: "👨",
        time: "8 min ago",
        text:
          "I would start with ECS and move to Kubernetes only when the requirements justify it.",
        type: "Counterpoint",
      },
    ]);


  // =========================
  // QUESTION-SPECIFIC THOUGHTS
  // =========================
  //
  // Each question has its own thoughts.
  //
  // This is important because:
  //
  // Question A -> gets thoughts A
  // Question B -> gets thoughts B
  //
  // Later this can come from database/API.
  // =========================

  const [questionThoughts, setQuestionThoughts] =
    useState({

      "Is serverless a better choice for early-stage startups?": [
        {
          id: 101,
          name: "Ananya",
          avatar: "👩",
          time: "10 min ago",
          text:
            "Serverless can reduce operational overhead, but costs can become unpredictable at scale.",
          type: "Perspective",
        },
        {
          id: 102,
          name: "Rahul",
          avatar: "👨",
          time: "5 min ago",
          text:
            "I would compare it with ECS before deciding. Serverless isn't always the best option.",
          type: "Counterpoint",
        },
      ],

      "ECS or Kubernetes — when should a startup make the switch?": [
        {
          id: 103,
          name: "Neha",
          avatar: "👩",
          time: "15 min ago",
          text:
            "I would start with ECS and move to Kubernetes when the team actually needs its flexibility.",
          type: "Perspective",
        },
        {
          id: 104,
          name: "Arjun",
          avatar: "👨",
          time: "7 min ago",
          text:
            "Kubernetes makes sense when the infrastructure becomes complex enough to justify the operational cost.",
          type: "Counterpoint",
        },
      ],

      "Is Kubernetes overkill for a small startup?": [
        {
          id: 105,
          name: "Ananya",
          avatar: "👩",
          time: "10 min ago",
          text:
            "Kubernetes provides flexibility, but it can add unnecessary operational complexity for a small team.",
          type: "Perspective",
        },
        {
          id: 106,
          name: "Rahul",
          avatar: "👨",
          time: "5 min ago",
          text:
            "For a small startup, I would first consider ECS or simpler managed services.",
          type: "Counterpoint",
        },
      ],

    });


  // =========================
  // Collaboration
  // =========================

  const [showCollaborate, setShowCollaborate] =
    useState(false);

  const [collaborationOptions, setCollaborationOptions] =
    useState({
      community: true,
      ai: false,
      challenge: false,
    });


  // =========================
  // Start Chat
  // =========================

  const startConversation = () => {

    if (!thought.trim()) {
      alert("Please write something first.");
      return;
    }

    setPage("discussion");
  };


  // =========================
  // Open Collaborate Modal
  // =========================

const openCollaborate = (backPage = "categoryQuestions") => {
  setCollaborationBackPage(backPage);
  setShowCollaborate(true);
};


  // =========================
  // Start Collaboration
  // =========================

const startCollaboration = () => {
  setShowCollaborate(false);

  setPage("collaboration");
};


  // =========================
  // File Selection
  // =========================

  const handleFileSelect = (event, type) => {

    const file = event.target.files[0];

    if (!file) return;

    setAttachedFile(file);

    setFileType(type);
  };


  // =========================
  // Remove Attachment
  // =========================

  const removeAttachment = () => {

    setAttachedFile(null);

    setFileType("");
  };


  // =========================
  // Post Community Thought
  // =========================

  const postCommunityThought = () => {

    if (!communityThought.trim()) {
      alert("Please write your thought first.");
      return;
    }

    const newThought = {
      id: Date.now(),
      name: "You",
      avatar: "👤",
      time: "Just now",
      text: communityThought,
      type: "Your Thought",
    };

    setCommunityThoughts((current) => [
      newThought,
      ...current,
    ]);

    setCommunityThought("");
  };


  // =========================
  // POST THOUGHT ON QUESTION
  // =========================

  const postQuestionThought = (text) => {

    if (!text.trim()) {
      alert("Please write your thought first.");
      return;
    }

    const newThought = {
      id: Date.now(),
      name: "You",
      avatar: "👤",
      time: "Just now",
      text: text,
      type: "Your Thought",
    };

    setQuestionThoughts((current) => {

      const existingThoughts =
        current[selectedQuestion] || [];

      return {
        ...current,

        [selectedQuestion]: [
          newThought,
          ...existingThoughts,
        ],
      };

    });

  };


  // =========================
  // Collaboration Options
  // =========================

  const toggleOption = (option) => {

    setCollaborationOptions((current) => ({

      ...current,

      [option]: !current[option],

    }));

  };


  // =========================
  // Open Subcategory
  // =========================

  const openSubcategory = (
    categoryName,
    subcategoryName
  ) => {

    setSelectedCategory(categoryName);

    setSelectedSubcategory(subcategoryName);

    setPage("categoryQuestions");
  };


  // =========================
  // Render Current Page
  // =========================

  const renderPage = () => {

    switch (page) {

      // =========================
      // HOME
      // =========================

      case "home":

        return (
          <Home
            thought={thought}
            setThought={setThought}

            chatType={chatType}
            setChatType={setChatType}

            startConversation={startConversation}

            openCollaborate={openCollaborate}

            handleFileSelect={handleFileSelect}

            attachedFile={attachedFile}

            fileType={fileType}

            removeAttachment={removeAttachment}
          />
        );


      // =========================
      // EXPLORE
      // =========================

      case "explore":

        return (
          <Explore
            categories={categories}

            setSelectedCategory={
              setSelectedCategory
            }

            openSubcategory={
              openSubcategory
            }
          />
        );


      // =========================
      // CATEGORY QUESTIONS
      // =========================

      case "categoryQuestions":

        return (
          <CategoryQuestions

            selectedCategory={
              selectedCategory
            }

            selectedSubcategory={
              selectedSubcategory
            }

            setPage={setPage}

            openCollaborate={
              openCollaborate
            }

            setSelectedQuestion={
              setSelectedQuestion
            }

          />
        );


      // =========================
      // COLLABORATION
      // =========================

      case "collaboration":
  return (
    <Collaboration
      question={selectedQuestion}
      collaborationOptions={collaborationOptions}
      setPage={setPage}

      communityThoughts={communityThoughts}
      communityThought={communityThought}
      setCommunityThought={setCommunityThought}
      postCommunityThought={postCommunityThought}

      handleFileSelect={handleFileSelect}
      attachedFile={attachedFile}
      fileType={fileType}
      removeAttachment={removeAttachment}
    />
  );

      // =========================
      // DISCUSSION
      // =========================

      case "discussion":

        return (
          <Discussion

            thought={thought}

            chatType={chatType}

            setPage={setPage}

            communityThought={
              communityThought
            }

            setCommunityThought={
              setCommunityThought
            }

            communityThoughts={
              communityThoughts
            }

            postCommunityThought={
              postCommunityThought
            }

            handleFileSelect={
              handleFileSelect
            }

          />
        );


      // =========================
      // MESSAGES
      // =========================

      case "messages":

        return <Messages />;


      // =========================
      // PROFILE
      // =========================

      case "profile":

        return <Profile />;


      // =========================
      // SETTINGS
      // =========================

      case "settings":

        return <Settings />;


      // =========================
      // DEFAULT
      // =========================

      default:

        return (
          <Home

            thought={thought}

            setThought={setThought}

            chatType={chatType}

            setChatType={setChatType}

            startConversation={
              startConversation
            }

            openCollaborate={
              openCollaborate
            }

            handleFileSelect={
              handleFileSelect
            }

            attachedFile={
              attachedFile
            }

            fileType={
              fileType
            }

            removeAttachment={
              removeAttachment
            }

          />
        );

    }
  };


  // =========================
  // UI
  // =========================

  return (

    <div className="app">

      {/* =====================
          SIDEBAR
      ====================== */}

      <Sidebar

        page={page}

        setPage={setPage}

        categories={categories}

        setSelectedCategory={
          setSelectedCategory
        }

      />


      {/* =====================
          MAIN CONTENT
      ====================== */}

      <main className="main">

        <Header />

        {renderPage()}

      </main>


      {/* =====================
          COLLABORATE MODAL
      ====================== */}

      {showCollaborate && (

        <CollaborateModal

          collaborationOptions={
            collaborationOptions
          }

          toggleOption={
            toggleOption
          }

          onClose={() =>
            setShowCollaborate(false)
          }

          onStartCollaboration={
            startCollaboration
          }

        />

      )}

    </div>
  );
}

export default App;