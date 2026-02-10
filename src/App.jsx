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

/* Animation */
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
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);

  const [noCount, setNoCount] = useState(0);

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
    "I’ll wait forever if I have to 💘",
    "This NO button is fake anyway 😈",
    "You can’t say NO 😺",
    "Are you trying to break my heart? 💔",
    "Think of the puppies 🐶",
    "I even learned your favorite song 🎵",
    "I’ll be sad forever… 🥹",
  ];

  /* STEP 1: Generate Magic Link */
  function handleGenerateLink() {
    if (!name) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name)}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  /* STEP 2: YES BUTTON */
  async function handleYes() {
    setAnswered(true);

    if (!supabase) {
      console.error("Supabase client not initialized!");
      setSupabaseMissing(true);
      return;
    }

    const { data, error } = await supabase
      .from("valentine_respone")
      .insert([
        {
          name: recipientName,
          answered_yes: true,
          no_count: noCount,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      setSupabaseError(true);
    } else {
      console.log("Inserted:", data);
    }

    // Heart fireworks
    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4500);
  }

  /* STEP 2: NO BUTTON (cute trap) */
  function handleNo() {
    setNoCount((prev) => prev + 1);
  }

  /* URL PARAMS */
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  const yesScale = 1 + noCount * 0.3;
  const noMessage = noMessages[Math.min(noCount, noMessages.length - 1)];

  /* If Supabase missing, show message but app still works */
  if (supabaseMissing) {
    return (
      <div style={styles.container}>
        <h1>Oops! Supabase not configured 😿</h1>
        <p>
          Make sure your <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> environment variables are set.
        </p>

        {!urlName && !submitted && (
          <>
            <h1>Type your crush's name 💌</h1>
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
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {!urlName && !submitted && (
        <>
          <h1>Type your crush's name 💌</h1>
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
          <h2>Send this link to {name} 💘</h2>
          <p style={styles.link}>{magicLink}</p>
        </>
      )}

      {urlName && !answered && (
        <>
          <h1>{recipientName}, will you be my Valentine? 💘</h1>

          {noCount > 0 && <p style={styles.noMessage}>{noMessage}</p>}

          <div style={styles.buttons}>
            <button
              onClick={handleYes}
              style={{
                ...styles.yes,
                transform: `scale(${yesScale})`,
              }}
            >
              YES 💕
            </button>

            <button onClick={handleNo} style={styles.no}>
              NO 😈
            </button>
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
              <h1>{recipientName} SAID YES 💖💖💖</h1>
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
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    overflow: "hidden",
  },
  input: {
    padding: "10px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
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
  link: {
    color: "#333",
    wordBreak: "break-all",
    marginTop: "10px",
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
    borderRadius: "14px",
    cursor: "pointer",
    padding: "18px 36px",
    fontSize: "24px",
    transition: "transform 0.3s ease",
  },
  no: {
    fontSize: "16px",
    padding: "10px 18px",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  noMessage: {
    marginTop: "10px",
    fontSize: "18px",
    color: "#7a003c",
    fontWeight: "bold",
  },
};
