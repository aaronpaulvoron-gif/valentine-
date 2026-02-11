import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

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

const style = document.createElement("style");
style.innerHTML = `
@keyframes float {
  to { transform: translateY(-120vh); opacity: 0; }
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-6px); }
  100% { transform: translateX(0); }
}
@keyframes jump {
  0% { transform: translate(0, 0); }
  50% { transform: translate(var(--jump-x), var(--jump-y)); }
  100% { transform: translate(0, 0); }
}
`;
document.head.appendChild(style);

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [quote, setQuote] = useState("");
  const [notification, setNotification] = useState(null);

  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);

  const romanticQuotes = [
    "You just made me the happiest person alive 💖",
    "Best decision ever 😘",
    "Forever starts now 💍",
    "You + Me = Always 💞",
    "My heart is officially yours 💓",
  ];

  const sadQuotes = [
    "That hurt a little 🥺",
    "Ouch… my heart 💔",
    "Please reconsider 😢",
    "I’ll wait forever 💘",
    "You’re breaking my heart 😭",
  ];

  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);

    const randomLove =
      romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
    setQuote(randomLove);

    await supabase.from("valentine_respone").insert([
      {
        name: recipientName,
        answered_yes: true,
        no_count: noCount,
        no_message: null,
      },
    ]);

    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4000);

    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);

    const randomSad =
      sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
    setQuote(randomSad);

    await supabase.from("valentine_respone").insert([
      {
        name: recipientName,
        answered_yes: false,
        no_count: newCount,
        no_message: randomSad,
      },
    ]);

    // YES grows slightly (MAX medium)
    if (yesBtnRef.current) {
      const baseWidth = 170;
      const grow = Math.min(newCount * 8, 50); // max grow 50px
      yesBtnRef.current.style.width = baseWidth + grow + "px";
      yesBtnRef.current.style.boxShadow = `0 0 ${10 + grow}px rgba(255,77,109,0.7)`;
    }

    // NO shakes
    if (noBtnRef.current) {
      noBtnRef.current.style.animation = "shake 0.4s";
      setTimeout(() => {
        if (noBtnRef.current)
          noBtnRef.current.style.animation = "none";
      }, 400);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  return (
    <div style={styles.container}>
      {!urlName && !submitted && (
        <>
          <h1 style={styles.headline}>Create a Valentine Proposal 💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter their name..."
            style={styles.input}
          />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>
            Generate Magic Link ✨
          </button>
        </>
      )}

      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.headline}>Send this to your crush 💘</h2>
          <div style={styles.linkBox}>{magicLink}</div>
        </>
      )}

      {urlName && !answered && (
        <>
          <h1 style={styles.bigQuestion}>
            {recipientName}, will you be my Valentine?
          </h1>

          {quote && <p style={styles.quote}>{quote}</p>}

          <div style={styles.buttons}>
            <button
              ref={yesBtnRef}
              onClick={handleYes}
              style={styles.yes}
            >
              YES 💕
            </button>

            <button
              ref={noBtnRef}
              onClick={handleNo}
              style={styles.no}
            >
              NO 💔
            </button>
          </div>
        </>
      )}

      {answered && (
        <>
          <h1 style={styles.bigQuestion}>
            {recipientName} SAID YES 💖💖💖
          </h1>
          <p style={styles.quote}>{quote}</p>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "#f06292",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
    overflow: "hidden",
  },

  headline: {
    fontSize: "2.5rem",
    color: "white",
    marginBottom: "20px",
  },

  bigQuestion: {
    fontSize: "3.5rem",
    color: "white",
    marginBottom: "20px",
  },

  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    width: "260px",
    textAlign: "center",
  },

  mainBtn: {
    padding: "12px 26px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
  },

  linkBox: {
    background: "white",
    padding: "15px 25px",
    borderRadius: "12px",
    color: "#ff4d6d",
    fontWeight: "bold",
    marginTop: "15px",
  },

  buttons: {
    display: "flex",
    gap: "100px", // BIG GAP so they never touch
    marginTop: "40px",
    alignItems: "center",
    justifyContent: "center",
  },

  yes: {
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "22px",
    width: "170px",
    height: "70px",
    transition: "all 0.3s ease",
  },

  no: {
    fontSize: "18px",
    width: "130px",
    height: "55px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },

  quote: {
    marginTop: "15px",
    fontSize: "20px",
    color: "white",
    fontWeight: "bold",
  },
};
