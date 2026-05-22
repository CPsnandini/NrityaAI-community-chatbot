import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./logo.svg";

function App() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);

  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [likes, setLikes] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("nritya_username") || "Guest Artist"
  );

  // FETCH CHANNELS
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = () => {
    axios
      .get("http://127.0.0.1:8000/channels")
      .then((res) => {
        setChannels(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // CREATE CHANNEL
  const createChannel = () => {
    if (!channelName.trim()) return;

    axios
      .post(
        `http://127.0.0.1:8000/channels?name=${channelName}&description=${channelDesc}`,
      )
      .then(() => {
        setChannelName("");
        setChannelDesc("");
        setShowCreate(false);
        fetchChannels();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // JOIN CHANNEL
  const joinChannel = (channelId) => {
    axios
      .post(`http://127.0.0.1:8000/join?user_id=1&channel_id=${channelId}`)
      .then(() => {
        alert("Joined channel!");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // FETCH POSTS
  const fetchPosts = async (channelId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/posts/${channelId}`);

      setPosts(res.data);

      // FETCH COMMENTS + LIKES
      res.data.forEach(async (post) => {
        const commentsRes = await axios.get(
          `http://127.0.0.1:8000/comments/${post.id}`,
        );

        const likesRes = await axios.get(
          `http://127.0.0.1:8000/likes/${post.id}`,
        );

        setComments((prev) => ({
          ...prev,
          [post.id]: commentsRes.data,
        }));

        setLikes((prev) => ({
          ...prev,
          [post.id]: likesRes.data.likes,
        }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE POST
  const createPost = () => {
    if (!newPost.trim()) return;

    axios
      .post(
        `http://127.0.0.1:8000/post?content=${newPost}&user_id=1&channel_id=${selectedChannel.id}`,
      )
      .then(() => {
        setNewPost("");
        fetchPosts(selectedChannel.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // LIKE POST
  const likePost = async (postId) => {
    await axios.post(`http://127.0.0.1:8000/like?user_id=1&post_id=${postId}`);

    const res = await axios.get(`http://127.0.0.1:8000/likes/${postId}`);

    setLikes((prev) => ({
      ...prev,
      [postId]: res.data.likes,
    }));
  };

  // COMMENT POST
  const addComment = async (postId) => {
    const content = commentInputs[postId];

    if (!content?.trim()) return;

    const formattedContent = `[${username}]: ${content}`;

    await axios.post(
      `http://127.0.0.1:8000/comment?content=${encodeURIComponent(formattedContent)}&user_id=1&post_id=${postId}`,
    );

    const res = await axios.get(`http://127.0.0.1:8000/comments/${postId}`);

    setComments((prev) => ({
      ...prev,
      [postId]: res.data,
    }));

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  // CHATBOT
  const askChatbot = () => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    axios
      .post(`http://127.0.0.1:8000/chat?question=${question}`)
      .then((res) => {
        const botMessage = {
          sender: "bot",
          text: res.data.response,
        };

        setMessages((prev) => [...prev, botMessage]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Error getting response",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
        setQuestion("");
      });
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo-section">
          {selectedChannel && (
            <button
              className="back-nav-btn"
              onClick={() => {
                setSelectedChannel(null);
                setShowCreate(false);
              }}
              title="Back to Communities"
            >
              ← Back
            </button>
          )}
          <img src={logo} alt="logo" className="logo" />

          <div>
            <div className="logo-title">NrityaAI</div>
            <div className="logo-subtitle">
              Preserving Art. Empowering Talent.
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {!selectedChannel && (
            <button
              className="plus-btn"
              onClick={() => setShowCreate(true)}
              title="Create Channel"
            >
              +
            </button>
          )}
          <button className="about-btn">About Us</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main-container">
        <div className="page-title">NrityaAI COMMUNITY</div>

        <div className="page-subtitle">
          Connect with Bharatanatyam artists !
        </div>

        {/* CREATE CHANNEL MODAL */}
        {!selectedChannel && showCreate && (
          <div className="modal-overlay" onClick={() => setShowCreate(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setShowCreate(false)}>
                ×
              </button>

              <h2 className="modal-title">Create New Channel</h2>

              <input
                className="input-field"
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />

              <input
                className="input-field"
                placeholder="Description"
                value={channelDesc}
                onChange={(e) => setChannelDesc(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box" }}
              />

              <button 
                className="gold-btn" 
                onClick={createChannel}
                style={{ width: "100%", marginTop: "10px" }}
              >
                Create Channel
              </button>
            </div>
          </div>
        )}

        {/* CHANNELS PAGE */}
        {!selectedChannel && (
          <div className="channels-grid">
            {channels.map((channel) => (
              <div
                className="channel-card"
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel);
                  fetchPosts(channel.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="channel-title">{channel.name}</div>

                <div className="channel-desc">{channel.description}</div>

                <button
                  className="gold-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinChannel(channel.id);
                  }}
                >
                  Join Channel
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CHANNEL VIEW */}
        {selectedChannel && (
          <div className="posts-section">
            <h2 style={{ color: "gold" }}>Posts in {selectedChannel.name}</h2>

            <input
              className="input-field"
              placeholder="Write a post..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />

            <button className="gold-btn" onClick={createPost}>
              Post
            </button>

            <br />
            <br />

            {posts.map((post) => (
              <div className="post-card" key={post.id}>
                <div className="post-content">{post.content}</div>

                <br />

                <div className="post-time">{post.created_at}</div>

                <div className="post-actions">
                  <button
                    className="gold-btn"
                    onClick={() => likePost(post.id)}
                  >
                    👍 {likes[post.id] || 0}
                  </button>

                  <button className="gold-btn">
                    💬 {comments[post.id]?.length || 0}
                  </button>
                </div>

                {/* COMMENTS */}
                <div className="comment-box">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "#ccc" }}>Commenting as:</span>
                    <input
                      type="text"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 215, 0, 0.3)",
                        borderRadius: "8px",
                        color: "gold",
                        padding: "6px 12px",
                        fontSize: "14px",
                        outline: "none",
                        width: "150px"
                      }}
                      value={username}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUsername(val);
                        localStorage.setItem("nritya_username", val);
                      }}
                      placeholder="Your name"
                    />
                  </div>

                  <input
                    className="input-field"
                    placeholder="Add comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    className="gold-btn"
                    onClick={() => addComment(post.id)}
                  >
                    Add Comment
                  </button>

                  <br />
                  <br />

                  {comments[post.id]?.map((comment) => {
                    const match = comment.content.match(/^\[(.*?)\]:\s*(.*)$/s);
                    let author = "Anonymous Artist";
                    let text = comment.content;
                    if (match) {
                      author = match[1];
                      text = match[2];
                    }

                    return (
                      <div
                        key={comment.id}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          padding: "12px 15px",
                          borderRadius: "12px",
                          marginBottom: "10px",
                          borderLeft: "3px solid gold",
                        }}
                      >
                        <div style={{ fontWeight: "bold", color: "gold", fontSize: "14px", marginBottom: "4px" }}>
                          👤 {author}
                        </div>
                        <div style={{ color: "#eee", fontSize: "15px" }}>
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CHAT BUTTON */}
      <div className="chat-toggle" onClick={() => setChatOpen(!chatOpen)}>
        💬
      </div>

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>NrityaAI Assistant</span>
            <button className="chat-close-btn" onClick={() => setChatOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="bot-msg">AI is thinking...</div>}
          </div>

          <div className="chat-input-area">
            <input
              className="input-field"
              placeholder="Ask about Bharatanatyam..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              className="gold-btn"
              style={{ width: "100%" }}
              onClick={askChatbot}
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
