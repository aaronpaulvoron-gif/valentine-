import { useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [response, setResponse] = useState(null);

  /* -------------------- STEP 1: GENERATE MAGIC LINK -------------------- */
  function handleGenerateLink() {
    if (!name) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name)}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  /* -------------------- STEP 2: RECIPIENT SEES YES/NO -------------------- */
  function handleYesNo(answer) {
    setAnswered(true);
    setResponse(answer);

    const noCount = answer === "no" ? 1 : 0;

    supabase
      .from("valentine_response")
      .insert([
        {
          name: recipientName,
          answered_yes: answer === "yes",
          no_count: noCount,
        },
      ])
      .then(({ error }) => {
        if (error) console.error(error);
      });
  }

  /* -------------------- CHECK URL PARAMS -------------------- */
  const urlParams = new URLSearchParams(window.location.search);
  const urlName = urlParams.get("name");

  // If opened with magic link, recipientName is prefilled
  if (urlName && recipientName !== urlName) setRecipientName(urlName);

  return (
    <div style={styles.container}>
      {/* STEP 1: Input name and generate link */}
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

      {/* Show the generated magic link */}
      {magicLink && submitted && !urlName && (
        <>
          <h2>Send this link to {name} 💘</h2>
          <p style={styles.link}>{magicLink}</p>
        </>
      )}

      {/* STEP 2: Recipient YES/NO page */}
      {urlName && !answered && (
        <>
          <h1>{recipientName}, will you be my Valentine? 💘</h1>
          <div style={styles.buttons}>
            <button onClick={() => handleYesNo("yes")} style={styles.yes}>
              YES 💕
            </button>
            <button onClick={() => handleYesNo("no")} style={styles.no}>
              NO 😈
            </button>
          </div>
        </>
      )}

      {/* After recipient answers */}
      {answered && (
        <h2>
          {recipientName} said {response.toUpperCase()} 💖
        </h2>
      )}
    </div>
  );
}

/* -------------------- STYLES -------------------- */
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
    borderRadius: "12px",
    cursor: "pointer",
    padding: "10px 20px",
    fontSize: "18px",
  },
  no: {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
