import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

// Floating hearts effect
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

// Animations
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
}
@keyframes jump {
  0% { transform: transform(0,0); }
  50% { transform: translate(var(--jump-x), var(--jump-y)); }
  100% { transform: transform(0,0); }
}
`;
document.head.appendChild(style);

export default function App() {
  // States
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

  const [yesJumpKey, setYesJumpKey] = useState(0);
  const [yesJumpStyle, setYesJumpStyle] = useState({});

  const yesBtnRef = useRef(null);

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

  // First person generates the magic link
  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(
      name.trim()
    )}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  // YES clicked by second person
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
    }

    // Hearts animation
    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4500);

    // Confetti
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

  // NO clicked by second person
  function handleNo() {
    if (noCount < 10) {
      const newCount = noCount + 1;
      setNoCount(newCount);
      if (newCount === 10) setMaxNoReached(true);

      const btn = yesBtnRef.current;
      if (btn) {
        const btnWidth = btn.offsetWidth;
        const btnHeight = btn.offsetHeight;
        const maxX = window.innerWidth - btnWidth;
        const maxY = window.innerHeight - btnHeight;

        // Generate a random position far from NO button (big jump)
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        setYesJumpStyle({
          position: "fixed",
          top: `${randomY}px`,
          left: `${randomX}px`,
          animation: "jump 0.6s ease",
        });
        setYesJumpKey((k) => k + 1);
      }
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(magicLink);
  }

  // Get recipient name from URL
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  const yesScale = 1 + noCount * 0.3;
  const noMessage = noMessages[Math.min(noCount, noMessages.length - 1)];

  // Listen to Supabase for YES responses (first person notification)
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
      {/* First person view */}
      {!urlName && !submitted && (
        <>
          <h1 style={styles.headline}>Type your crush's name 💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            style={styles.input}
            autoFocus
          />
          <button onClick={handleGenerateLink} style={styles.button}>
            Generate Magic Link
          </button>

          {notification && (
            <div style={styles.notificationBar}>{notification}</div>
          )}
        </>
      )}

      {/* First person copy link view */}
      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.headline}>Send this link to {name} 💘</h2>
          <div style={styles.linkBox}>
            <p style={styles.link}>{magicLink}</p>
            <button
              onClick={handleCopyLink}
              style={styles.copyBtn}
              aria-label="Copy magic link"
            >
              Copy
            </button>
          </div>
        </>
      )}

      {/* Second person view */}
      {urlName && !answered && (
        <>
          <h1 style={styles.headline}>
            {recipientName}, will you be my Valentine? 💘
          </h1>
          {noCount > 0 && <p style={styles.noMessage}>{noMessage}</p>}

          <div style={styles.buttons}>
            <button
              ref={yesBtnRef}
              key={yesJumpKey}
              onClick={handleYes}
              style={{
                ...styles.yes,
                transform: `scale(${yesScale})`,
                ...yesJumpStyle,
              }}
              aria-label="Yes button"
            >
              YES 💕
            </button>
            <button onClick={handleNo} style={styles.no} aria-label="No button">
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

      {/* Response view */}
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
    userSelect: "none",
  },
  input: {
    padding: "10px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    width: "280px",
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
    userSelect: "none",
  },
  linkBox: {
    border: "2px solid #ff4d6d",
    borderRadius: "12px",
    padding: "12px 20px",
    marginTop: "10px",
    maxWidth: "80vw",
    wordBreak: "break-word",
    backgroundColor: "rgba(255, 77, 109, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    userSelect: "all",
  },
  link: {
    color: "#b3003b",
    fontSize: "18px",
    margin: 0,
    flex: "1 1 auto",
    paddingRight: "15px",
  },
  copyBtn: {
    backgroundColor: "#ff4d6d",
    border: "none",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    userSelect: "none",
    flexShrink: 0,
    boxShadow: "0 4px 8px rgba(255,77,109,0.5)",
    transition: "background-color 0.3s ease",
  },
  buttons: {
    display: "flex",
    gap: "40px",
    marginTop: "40px",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80px",
    position: "relative",
  },
  yes: {
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    padding: "18px 36px",
    fontSize: "24px",
    userSelect: "none",
    boxShadow: "0 4px 8px rgba(255,77,109,0.4)",
    transition: "transform 0.3s ease",
    position: "relative",
  },
  no: {
    fontSize: "18px",
    padding: "14px 28px",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease",
  },
  noMessage: {
    marginTop: "15px",
    fontSize: "18px",
    color: "#7a003c",
    fontWeight: "bold",
  },
  sadMessage: {
    marginTop: "25px",
    fontSize: "20px",
    color: "#ff1a75",
    fontWeight: "bold",
    animation: "shake 0.6s",
  },
  notificationBar: {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ff4d6d",
    color: "white",
    padding: "10px 20px",
    borderRadius: "12px",
    fontSize: "18px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  notification: {
    marginTop: "25px",
    fontSize: "20px",
    color: "#ff1a75",
    fontWeight: "bold",
  },
};
