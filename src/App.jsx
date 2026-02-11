import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 Floating Hearts */
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
  to {
    transform: translateY(-120vh);
    opacity: 0;
  }
}`;
document.head.appendChild(style);

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");
  const accepted = params.get("accepted");

  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesPosition, setYesPosition] = useState({ top: 0, left: 0 });
  const [sadEnding, setSadEnding] = useState(false);
  const [notification, setNotification] = useState(false);

  const noMessages = [
    "Are you sure? 🥺",
    "Think again please… 💔",
    "You're breaking my heart 😭",
    "What if I buy you food? 🍕",
    "I'll send you memes forever 🥹",
    "Don't do this to us 😭",
    "We’d look cute together 😢",
    "I already imagined our future 💘",
    "Last chance… 😭",
    "This is your FINAL chance… 💔",
  ];

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  /* 🔔 REALTIME LISTENER */
  useEffect(() => {
    if (!submitted) return;

    const channel = supabase
      .channel("realtime-valentine")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "valentine_respone",
        },
        (payload) => {
          if (payload.new.answered_yes === true) {
            setNotification(true);
            confetti({
              particleCount: 200,
              spread: 120,
              origin: { y: 0.6 },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [submitted]);

  function handleGenerateLink() {
    if (!name) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name)}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);

    await supabase.from("valentine_respone").insert([
      {
        name: recipientName,
        answered_yes: true,
        no_count: noCount,
      },
    ]);

    confetti({
      particleCount: 250,
      spread: 150,
      origin: { y: 0.6 },
    });

    const interval = setInterval(createHeart, 100);
    setTimeout(() => clearInterval(interval), 4000);

    setTimeout(() => {
      window.location.href = `${window.location.origin}?accepted=true`;
    }, 2000);
  }

  function handleNo() {
    if (noCount >= 9) {
      setSadEnding(true);
      return;
    }

    setNoCount((prev) => prev + 1);

    setYesPosition({
      top: Math.random() * 600 - 300,
      left: Math.random() * 600 - 300,
    });
  }

  const yesScale = 1 + noCount * 0.35;
  const noMessage = noMessages[Math.min(noCount, 9)];

  /* SUCCESS PAGE */
  if (accepted === "true") {
    return (
      <div style={styles.container}>
        <h1 style={styles.scriptBig}>💖 THEY SAID YES 💖</h1>
        <p style={styles.elegant}>
          Your love story officially begins now…
        </p>
      </div>
    );
  }

  if (sadEnding) {
    return (
      <div style={styles.container}>
        <h1 style={styles.scriptSad}>💔 Maybe Next Time...</h1>
        <p style={styles.elegant}>
          Some love stories need more time.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {notification && (
        <div style={styles.notification}>
          💖 THEY SAID YES 💖
        </div>
      )}

      {!urlName && !submitted && (
        <>
          <h1 style={styles.title}>Create a Valentine Proposal 💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter their name..."
            style={styles.input}
          />
          <button onClick={handleGenerateLink} style={styles.button}>
            Generate Magic Link ✨
          </button>
        </>
      )}

      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.elegant}>Send this to your crush 💘</h2>
          <p style={styles.link}>{magicLink}</p>
        </>
      )}

      {urlName && !answered && (
        <>
          <h1 style={styles.script}>
            {recipientName}, will you be my Valentine?
          </h1>

          {noCount > 0 && (
            <p style={styles.noMessage}>{noMessage}</p>
          )}

          <div style={styles.buttons}>
            <button
              onClick={handleYes}
              style={{
                ...styles.yes,
                transform: `scale(${yesScale})`,
                position: "relative",
                top: yesPosition.top,
                left: yesPosition.left,
              }}
            >
              YES 💕
            </button>

            <button onClick={handleNo} style={styles.no}>
              NO 💔
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontSize: "32px",
    fontFamily: "'Playfair Display', serif",
  },
  script: {
    fontSize: "50px",
    fontFamily: "'Great Vibes', cursive",
  },
  scriptBig: {
    fontSize: "65px",
    fontFamily: "'Great Vibes', cursive",
  },
  scriptSad: {
    fontSize: "60px",
    fontFamily: "'Great Vibes', cursive",
  },
  elegant: {
    fontSize: "22px",
    fontFamily: "'Playfair Display', serif",
  },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    marginTop: "20px",
  },
  button: {
    marginTop: "15px",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
  },
  link: {
    marginTop: "15px",
    background: "rgba(255,255,255,0.2)",
    padding: "10px",
    borderRadius: "10px",
  },
  buttons: {
    display: "flex",
    gap: "40px",
    marginTop: "30px",
  },
  yes: {
    padding: "18px 40px",
    fontSize: "24px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  no: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#6c757d",
    color: "white",
    cursor: "pointer",
  },
  noMessage: {
    marginTop: "15px",
    fontSize: "18px",
  },
  notification: {
    position: "fixed",
    top: "20px",
    backgroundColor: "#ff4d6d",
    padding: "15px 30px",
    borderRadius: "20px",
    fontWeight: "bold",
  },
};
