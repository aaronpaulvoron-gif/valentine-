import { useState, useEffect } from "react";
import { supabase } from "./supabase";

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

/* --Animation-- */
const style = document.createElement("style");
style.innerHTML = `
@keyframes float {
  to {
    transform: translateY(-120vh);
    opacity: 0;
  }
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
  const [yesPosition, setYesPosition] = useState({ top: 0, left: 0 });

  const [returnLink, setReturnLink] = useState("");

  const [supabaseError, setSupabaseError] = useState(false);
  const [supabaseMissing, setSupabaseMissing] = useState(false);

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
    "Last chance… choose wisely 💘",
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
      setSupabaseMissing(true);
      return;
    }

    const { error } = await supabase
      .from("valentine_respone")
      .insert([
        {
          name: recipientName,
          answered_yes: true,
          no_count: noCount,
        },
      ]);

    if (error) {
      setSupabaseError(true);
    }

    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4500);

    // Generate return link
    const link = `${window.location.origin}?name=${encodeURIComponent(
      recipientName
    )}&accepted=true`;

    setReturnLink(link);
  }

  /* NO BUTTON - Only 10 chances */
  function handleNo() {
    if (noCount >= 10) return;

    setNoCount((prev) => prev + 1);

    // Move YES randomly
    setYesPosition({
      top: Math.random() * 200 - 100,
      left: Math.random() * 200 - 100,
    });
  }

  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  const yesScale = 1 + noCount * 0.25;
  const noMessage = noMessages[Math.min(noCount, 9)];

  return (
    <div style={styles.container}>
      {!urlName && !submitted && (
        <>
          <h1 style={styles.title}>Type your crush's name 💌</h1>
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
          <h2 style={styles.subtitle}>Send this link 💘</h2>
          <p style={styles.link}>{magicLink}</p>
        </>
      )}

      {urlName && !answered && (
        <>
          <h1 style={styles.question}>
            {recipientName}, will you be my Valentine? 💘
          </h1>

          {noCount > 0 && noCount <= 10 && (
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

            {noCount < 10 && (
              <button onClick={handleNo} style={styles.no}>
                NO 😈
              </button>
            )}
          </div>
        </>
      )}

      {answered && (
        <>
          {supabaseError ? (
            <p style={styles.noMessage}>
              ❌ Could not save your response 😿
            </p>
          ) : (
            <>
              <h1 style={styles.success}>
                {recipientName} SAID YES 💖
              </h1>

              <img
                src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
                alt="cute cat"
                style={{ width: "260px", marginTop: "20px" }}
              />

              <h3 style={{ marginTop: "30px" }}>
                Send this to the person who sent you this proposal 💌
              </h3>

              <p style={styles.link}>{returnLink}</p>
            </>
          )}
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
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    padding: "20px",
    overflow: "hidden",
    color: "white",
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "600",
  },
  question: {
    fontSize: "42px",
    fontFamily: "'Great Vibes', cursive",
  },
  success: {
    fontSize: "40px",
    fontFamily: "'Great Vibes', cursive",
  },
  input: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    marginBottom: "15px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#ff4d6d",
    color: "white",
    cursor: "pointer",
  },
  link: {
    marginTop: "10px",
    background: "rgba(255,255,255,0.2)",
    padding: "10px",
    borderRadius: "10px",
    wordBreak: "break-all",
  },
  buttons: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  yes: {
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "18px",
    cursor: "pointer",
    padding: "18px 36px",
    fontSize: "24px",
    transition: "all 0.3s ease",
  },
  no: {
    fontSize: "16px",
    padding: "10px 18px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  noMessage: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "600",
  },
};
