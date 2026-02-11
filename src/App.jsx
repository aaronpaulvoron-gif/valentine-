import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

// Heart floating animation
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

// CSS animations
const style = document.createElement("style");
style.innerHTML = `
@keyframes float { to { transform: translateY(-120vh); opacity: 0; } }
@keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-10px); } 50% { transform: translateX(10px); } 75% { transform: translateX(-10px); } 100% { transform: translateX(0); } }
@keyframes jump { 0% { transform: translate(0, 0); } 50% { transform: translate(var(--jump-x), var(--jump-y)); } 100% { transform: translate(0, 0); } }
`;
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
  const [notification, setNotification] = useState(null);
  const [lastYesPos, setLastYesPos] = useState(null);

  const yesBtnRef = useRef(null);
  const [yesJumpKey, setYesJumpKey] = useState(0);
  const [yesJumpStyle, setYesJumpStyle] = useState({});

  // YES button random positions
  const positions = [
    { x: "-300px", y: "-200px" },
    { x: "300px", y: "-200px" },
    { x: "-350px", y: "150px" },
    { x: "350px", y: "150px" },
    { x: "0px", y: "-300px" },
    { x: "-400px", y: "0px" },
    { x: "400px", y: "0px" },
    { x: "0px", y: "300px" },
  ];

  // NO messages
  const noMessages = [
    "Are you sure? 🥺", "Wait wait… think again 😢", "My heart just cracked 💔",
    "What if I promise to be cute forever? 🐱", "I’ll buy you snacks 😭🍫",
    "Please don’t do this to me 🥹", "I already told my cat about us… 🐈",
    "My mom thinks we’re dating 😖", "I’ll cry rn 😭😭😭", "I’ll wait forever if I have to 💘",
    "Life is hard… 😞", "I feel so lonely… 🥺", "The sky looks gray today… 🌧️",
    "I wrote a sad poem for you… ✍️", "All my chocolate melted 💔🍫"
  ];

  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);

    if (!supabase) return;

    await supabase.from("valentine_respone").insert([
      { name: recipientName, answered_yes: true, no_count: noCount, no_message: null }
    ]);

    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4500);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);

    const sadQuote = noMessages[Math.min(newCount - 1, noMessages.length - 1)];

    if (!supabase) return;
    await supabase.from("valentine_respone").insert([
      { name: recipientName, answered_yes: false, no_count: newCount, no_message: sadQuote }
    ]);

    if (newCount >= 10) setMaxNoReached(true);

    // Move YES button randomly, not repeating last position
    let nextPosIndex;
    do {
      nextPosIndex = Math.floor(Math.random() * positions.length);
    } while (lastYesPos === nextPosIndex);
    setLastYesPos(nextPosIndex);
    setYesJumpStyle({
      "--jump-x": positions[nextPosIndex].x,
      "--jump-y": positions[nextPosIndex].y,
      animation: "jump 0.6s ease",
    });
    setYesJumpKey(k => k + 1);
  }

  function handleCopyLink() { navigator.clipboard.writeText(magicLink); }

  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => { if (urlName) setRecipientName(urlName); }, [urlName]);

  // Real-time notifications
  useEffect(() => {
    if (!submitted) return;

    const channel = supabase.channel("valentine-channel").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "valentine_respone" },
      payload => {
        const { name: responderName, answered_yes, no_count, no_message } = payload.new;
        if (answered_yes) {
          setNotification(`${responderName} said YES! 💖`);
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        } else {
          setNotification(`No ${no_count}: "${no_message}" 😢`);
        }
      }
    ).subscribe();

    return () => supabase.removeChannel(channel);
  }, [submitted]);

  const yesScale = Math.min(1 + noCount * 0.1, 1.3);

  return (
    <div style={styles.container}>
      {/* Notification bar */}
      {!urlName && submitted && notification && (
        <div style={styles.notificationBar}>{notification}</div>
      )}

      {!urlName && !submitted && (
        <>
          <h1 style={styles.headline}>Type your crush's name 💌</h1>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name..."
            style={styles.input}
            autoFocus
          />
          <button onClick={handleGenerateLink} style={styles.button}>Generate Magic Link</button>
        </>
      )}

      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.headline}>Send this link to {name} 💘</h2>
          <div style={styles.linkBox}>
            <p style={styles.link}>{magicLink}</p>
            <button onClick={handleCopyLink} style={styles.copyBtn}>Copy</button>
          </div>
        </>
      )}

      {urlName && !answered && (
        <>
          <h1 style={styles.headline}>{recipientName}, will you be my Valentine? 💘</h1>
          <div style={styles.buttons}>
            <button
              ref={yesBtnRef}
              key={yesJumpKey}
              onClick={handleYes}
              style={{ ...styles.yes, transform: `scale(${yesScale})`, ...yesJumpStyle }}
            >
              YES 💕
            </button>
            <button onClick={handleNo} style={styles.no}>NO 😈</button>
          </div>
        </>
      )}

      {answered && (
        <>
          <h1 style={styles.headline}>
            {recipientName} SAID YES 💖💖💖
          </h1>
          <img
            src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
            alt="cute cat"
            style={{ width: "260px", marginTop: "20px" }}
          />
        </>
      )}

      {maxNoReached && (
        <h1 style={styles.headline}>
          {recipientName} said NO 😢 "{noMessages[Math.floor(Math.random() * noMessages.length)]}"
        </h1>
      )}
    </div>
  );
}

// Styles (all in one)
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
  link: { color: "#b3003b", fontSize: "18px", margin: 0, flex: "1 1 auto", paddingRight: "15px" },
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
  buttons: { display: "flex", gap: "40px", marginTop: "40px", justifyContent: "center", alignItems: "center", minHeight: "80px", position: "relative" },
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
  notificationBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    backgroundColor: "#ff4d6d",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    padding: "12px 20px",
    zIndex: 9999,
    userSelect: "none",
  },
};
