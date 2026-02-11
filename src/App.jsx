import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 HEART FIREWORKS */
function createHeart() {
  const heart = document.createElement("div");
  heart.innerText = "💖";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = window.innerHeight + "px";
  heart.style.fontSize = Math.random() * 30 + 20 + "px";
  heart.style.animation = "float 3s linear forwards";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}

/* Floating & Shake animations */
const style = document.createElement("style");
style.innerHTML = `
@keyframes float {
  to { transform: translateY(-120vh); opacity: 0; }
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [maxNoReached, setMaxNoReached] = useState(false);
  const [supabaseError, setSupabaseError] = useState(false);
  const [supabaseMissing, setSupabaseMissing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Track YES button position
  const [yesPosition, setYesPosition] = useState({
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(1)",
  });

  const noMessages = [
    "Are you sure? 🥺",
    "Wait wait… think again 😢",
    "My heart just cracked 💔",
    "What if I promise to be cute forever? 🐱",
    "I’ll buy you snacks 😭🍫",
    "Please don’t do this to me 🥹",
    "I already told my cat about us… 🐈",
    "My mom thinks we’re dating 😖",
    "I’ll cry rn 😭😭😭",
    "I’ll wait forever if I have to 💘",
  ];

  /* Generate Magic Link */
  function handleGenerateLink() {
    if (!name) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name)}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  /* YES BUTTON */
  async function handleYes() {
    setAnswered(true);

    if (!supabase) {
      console.error("Supabase client not initialized!");
      setSupabaseMissing(true);
      return;
    }

    const { data, error } = await supabase
      .from("valentine_respone")
      .insert([{ name: recipientName, answered_yes: true, no_count: noCount }]);

    if (error) {
      console.error("Supabase insert error:", error);
      setSupabaseError(true);
    } else {
      console.log("Inserted:", data);
    }

    // Heart fireworks
    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4500);

    // Confetti
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

  /* NO BUTTON */
  function handleNo() {
    if (noCount < 10) {
      const newCount = noCount + 1;
      setNoCount(newCount);
      if (newCount === 10) setMaxNoReached(true);

      // Make YES button jump randomly and scale up based on noCount
      const top = Math.random() * 50 + 20 + "%"; // 20% to 70%
      const left = Math.random() * 50 + 10 + "%"; // 10% to 60%
      const scale = 1 + newCount * 0.3;
      setYesPosition({
        top,
        left,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transition: "all 0.5s ease",
      });
    }
  }

  /* URL PARAMS */
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  const noMessage = noMessages[Math.min(noCount, noMessages.length - 1)];

  /* Realtime notifications */
  useEffect(() => {
    if (!submitted) return;
    const channel = supabase
      .channel("valentine-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "valentine_respone" },
        (payload) => {
          const { name, answered_yes } = payload.new;
          if (answered_yes) {
            setNotification(`${name} said YES! 💖`);
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [submitted]);

  if (supabaseMissing)
    return (
      <div style={styles.container}>
        <h1>Oops! Supabase not configured 😿</h1>
        <p>
          Make sure your <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> are set.
        </p>
      </div>
    );

  return (
    <div style={styles.container}>
      {!urlName && !submitted && (
        <>
          <h1 style={styles.headline}>Type your crush's name 💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            style={styles.input}
          />
          <button onClick={handleGenerateLink} style={styles.button}>
            Generate Magic Link
          </button>
        </>
      )}

      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.headline}>Send this link to {name} 💘</h2>
          <div style={styles.linkBox}>
            <p style={styles.link}>{magicLink}</p>
          </div>
          {notification && <p style={styles.notification}>{notification}</p>}
        </>
      )}

      {urlName && !answered && (
        <>
          <h1 style={styles.headline}>
            {recipientName}, will you be my Valentine? 💘
          </h1>
          {noCount > 0 && <p style={styles.noMessage}>{noMessage}</p>}

          <div style={styles.buttons}>
            <button onClick={handleYes} style={{ ...styles.yes, ...yesPosition }}>
              YES 💕
            </button>
            <button onClick={handleNo} style={styles.no}>
              NO 😈
            </button>
          </div>

          {maxNoReached && (
            <p style={styles.sadMessage}>
              🥺 Oh no… you pressed NO 10 times! My heart is broken 💔
            </p>
          )}
        </>
      )}

      {answered && (
        <>
          {supabaseError ? (
            <p style={styles.noMessage}>❌ Could not save your response 😿</p>
          ) : (
            <>
              <h1 style={styles.headline}>{recipientName} SAID YES 💖💖💖</h1>
              <img
                src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
                alt="cute cat"
                style={{ width: "260px", marginTop: "20px" }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: `'Georgia', serif`,
    textAlign: "center",
    padding: "20px",
    overflow: "hidden",
    position: "relative",
  },
  headline: {
    fontFamily: `'Dancing Script', cursive`,
    fontSize: "3rem",
    color: "#ff1a75",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    width: "250px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
  },
  linkBox: {
    border: "2px solid #ff4d6d",
    borderRadius: "12px",
    padding: "12px 20px",
    marginTop: "10px",
    backgroundColor: "#ffe3ea",
    width: "100%",
    maxWidth: "400px",
    wordBreak: "break-word",
    boxShadow: "0 4px 8px rgba(255,77,109,0.3)",
  },
  link: {
    color: "#ff1a75",
    fontWeight: "bold",
    fontSize: "18px",
    userSelect: "all",
    cursor: "pointer",
  },
  buttons: {
    position: "relative",
    width: "280px",
    height: "150px",
    marginTop: "40px",
  },
  yes: {
    position: "absolute",
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    padding: "18px 36px",
    fontSize: "24px",
    transition: "all 0.5s ease",
    userSelect: "none",
  },
  no: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    fontSize: "16px",
    padding: "10px 18px",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    userSelect: "none",
  },
  noMessage: {
    marginTop: "10px",
    fontSize: "18px",
    color: "#7a003c",
    fontWeight: "bold",
  },
  sadMessage: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#ff1a75",
    fontWeight: "bold",
    animation: "shake 0.6s",
  },
  notification: {
    marginTop: "15px",
    fontSize: "20px",
    color: "#ff1a75",
    fontWeight: "bold",
  },
};
