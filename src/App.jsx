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
`;
document.head.appendChild(style);

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [finalNo, setFinalNo] = useState(false);
  const [quote, setQuote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const yesRef = useRef(null);
  const noRef = useRef(null);

  const loveQuotes = [
    "You just made me the happiest person alive 💖",
    "Forever starts now 💍",
    "You + Me = Always 💞",
    "This is the best YES ever 😘",
    "My heart is officially yours 💓",
  ];

  const sadQuotes = [
    "That hurt a little 🥺",
    "Ouch… my heart 💔",
    "Please reconsider 😢",
    "I’ll wait forever 💘",
    "You’re breaking my heart 😭",
  ];

  const handleGenerateLink = () => {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(
      name.trim()
    )}`;
    setMagicLink(link);
    setSubmitted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(magicLink).then(() => {
      const el = document.getElementById("linkBox");
      el.style.background = "#ffe6e6";
      el.style.color = "#ff4d6d";
      el.select?.();
      window.getSelection()?.removeAllRanges();
    });
  };

  const handleYes = async () => {
    try {
      const randomLove =
        loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
      setQuote(randomLove);
      setAnswered(true);

      const { error } = await supabase.from("valentine_repone").insert([
        {
          name: recipientName,
          answered_yes: true,
          no_count: noCount,
          no_message: null,
        },
      ]);

      if (error) throw error;

      const interval = setInterval(createHeart, 120);
      setTimeout(() => clearInterval(interval), 4000);

      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      setErrorMsg("Supabase insert failed.");
    }
  };

  const handleNo = async () => {
    if (finalNo) return;

    const newCount = noCount + 1;
    setNoCount(newCount);

    if (newCount < 10) {
      setQuote("Please reconsider... 💌");
    } else {
      setQuote(sadQuotes[Math.floor(Math.random() * sadQuotes.length)]);
      setFinalNo(true);
    }

    try {
      const { error } = await supabase.from("valentine_repone").insert([
        {
          name: recipientName,
          answered_yes: false,
          no_count: newCount,
          no_message: newCount < 10 ? "Please reconsider 💌" : quote,
        },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMsg("Supabase insert failed.");
    }

    if (yesRef.current) {
      const base = 170;
      const grow = Math.min(newCount * 7, 50);
      yesRef.current.style.width = base + grow + "px";
      yesRef.current.style.boxShadow = `0 0 ${10 + grow}px rgba(255,77,109,0.7)`;
    }

    if (noRef.current) {
      noRef.current.style.animation = "shake 0.4s";
      setTimeout(() => {
        if (noRef.current) noRef.current.style.animation = "none";
      }, 400);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    if (urlName) setRecipientName(urlName);
  }, []);

  return (
    <div style={styles.container}>
      {!recipientName && !submitted && (
        <>
          <h1 style={styles.title}>Create a Valentine Proposal 💌</h1>
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

      {magicLink && submitted && !recipientName && (
        <>
          <h2 style={styles.title}>Send this to your crush 💘</h2>
          <div
            id="linkBox"
            onClick={handleCopyLink}
            style={styles.linkBox}
            title="Click to copy!"
          >
            {magicLink}
          </div>
        </>
      )}

      {recipientName && !answered && !finalNo && (
        <>
          <h1 style={styles.big}>
            {recipientName}, will you be my Valentine?
          </h1>

          {quote && <p style={styles.quote}>{quote}</p>}

          <div style={styles.buttons}>
            <button ref={yesRef} onClick={handleYes} style={styles.yes}>
              YES 💕
            </button>

            <button ref={noRef} onClick={handleNo} style={styles.no}>
              NO 💔
            </button>
          </div>

          <p style={styles.counter}>NO pressed: {noCount} / 10</p>
        </>
      )}

      {finalNo && (
        <div style={{ textAlign: "center" }}>
          <h1 style={styles.big}>
            {recipientName} rejected you after 10 tries 😭💔
          </h1>
          <img
            src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
            alt="Crying cat"
            style={{ width: "300px", borderRadius: "20px", marginTop: "20px" }}
          />
        </div>
      )}

      {answered && (
        <>
          <h1 style={styles.big}>
            {recipientName} SAID YES 💖💖💖
          </h1>
          <p style={styles.quote}>{quote}</p>
        </>
      )}

      {errorMsg && <p style={{ color: "white" }}>{errorMsg}</p>}
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
  },
  title: {
    fontSize: "2.5rem",
    color: "white",
    marginBottom: "20px",
  },
  big: {
    fontSize: "3.2rem",
    color: "white",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
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
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttons: {
    display: "flex",
    gap: "100px",
    marginTop: "40px",
  },
  yes: {
    width: "170px",
    height: "70px",
    fontSize: "22px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  no: {
    width: "130px",
    height: "55px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#6c757d",
    color: "white",
    cursor: "pointer",
  },
  quote: {
    fontSize: "20px",
    color: "white",
    fontWeight: "bold",
    marginTop: "20px",
  },
  counter: {
    marginTop: "15px",
    color: "white",
  },
};
