import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 Heart animation */
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

/* Animation CSS */
const style = document.createElement("style");
style.innerHTML = `
@keyframes float { to { transform: translateY(-120vh); opacity: 0; } }
@keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-6px); } 50% { transform: translateX(6px); } 75% { transform: translateX(-6px); } 100% { transform: translateX(0); } }
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
  const linkRef = useRef(null);

  /* LOVE & NO messages with gifs */
  const loveQuotes = [
    "You just made me the happiest person alive 💖",
    "Forever starts now 💍",
    "You + Me = Always 💞",
    "This is the best YES ever 😘",
    "My heart is officially yours 💓",
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif" },
    { msg: "Think again 💕", gif: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif" },
    { msg: "I’ll still wait 💘", gif: "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif" },
    { msg: "Maybe reconsider? 😢", gif: "https://media.giphy.com/media/3oEduQAsYcJKQH2XsI/giphy.gif" },
    { msg: "Please don’t go 😭", gif: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif" },
    { msg: "I promise it’ll be fun 💞", gif: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" },
    { msg: "I’ll bring snacks 🍫", gif: "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif" },
    { msg: "Look at this cute cat 😺", gif: "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" },
    { msg: "I’ll be super cute 🐱", gif: "https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif" },
  ];

  const sadQuotes = [
    "That hurt a little 🥺",
    "Ouch… my heart 💔",
    "I’ll wait forever 💘",
    "You’re breaking my heart 😭",
  ];

  /* Generate magic link */
  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  /* YES button */
  async function handleYes() {
    setAnswered(true);
    const randomLove = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    setQuote(randomLove);

    if (!supabase) {
      setErrorMsg("Supabase client not initialized!");
      return;
    }

    try {
      const { error } = await supabase.from("valentine_response2").insert([
        { name: recipientName, answered_yes: true, no_count: noCount, no_message: null },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase insert error:", err);
      setErrorMsg("Supabase insert failed. Check table & RLS.");
    }

    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4000);
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  }

  /* NO button */
  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);

    let msgObj = null;
    if (newCount <= 9) {
      msgObj = cuteNoMessages[newCount - 1];
    } else {
      const sad = sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
      msgObj = { msg: sad, gif: "https://c.tenor.com/5qOkgZVjP1UAAAAi/crying-cat.gif" };
      setFinalNo(true);
    }

    setQuote(msgObj.msg);

    try {
      const { error } = await supabase.from("valentine_response2").insert([
        { name: recipientName, answered_yes: false, no_count: newCount, no_message: msgObj.msg },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMsg("Supabase insert failed.");
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  function copyLink() {
    navigator.clipboard.writeText(magicLink);
    if (linkRef.current) {
      linkRef.current.focus();
      linkRef.current.select();
    }
  }

  return (
    <div style={styles.container}>
      {/* Step 1: Enter name */}
      {!urlName && !submitted && (
        <>
          <h1 style={styles.title}>Create a Valentine Proposal 💌</h1>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter their name..." style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Generate Magic Link ✨</button>
        </>
      )}

      {/* Step 2: Show magic link */}
      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.title}>Send this to your crush 💘</h2>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={{ border: "none", background: "transparent", color: "#ff4d6d", width: "300px" }} />
            <button onClick={copyLink} style={styles.copyBtn}>Copy</button>
          </div>
        </>
      )}

      {/* Step 3: YES / NO buttons */}
      {urlName && !answered && !finalNo && (
        <>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          {quote && <p style={styles.quote}>{quote}</p>}
          {noCount > 0 && noCount <= 9 && (
            <img src={cuteNoMessages[noCount - 1].gif} alt="cute cat" style={{ width: "260px", marginTop: "15px", borderRadius: "12px" }} />
          )}
          <div style={styles.buttons}>
            <button ref={yesRef} onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button ref={noRef} onClick={handleNo} style={styles.no}>NO 💔</button>
          </div>
          <p style={styles.counter}>NO pressed: {noCount} / 10</p>
        </>
      )}

      {/* Step 4: Final NO */}
      {finalNo && (
        <div style={{ textAlign: "center" }}>
          <h1 style={styles.big}>{recipientName} rejected you after 10 tries 😭💔</h1>
          <img src="https://c.tenor.com/5qOkgZVjP1UAAAAi/crying-cat.gif" style={{ width: "300px", marginTop: "20px" }} />
          <p style={styles.quote}>{quote}</p>
        </div>
      )}

      {/* Step 5: YES */}
      {answered && !finalNo && (
        <>
          <h1 style={styles.big}>{recipientName} SAID YES 💖💖💖</h1>
          <p style={styles.quote}>{quote}</p>
        </>
      )}

      {errorMsg && <p style={{ color: "white" }}>{errorMsg}</p>}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "#f06292", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" },
  title: { fontSize: "2.5rem", color: "white", marginBottom: "20px" },
  big: { fontSize: "3.2rem", color: "white", marginBottom: "20px" },
  input: { padding: "12px", fontSize: "18px", borderRadius: "10px", border: "none", marginBottom: "20px" },
  mainBtn: { padding: "12px 26px", fontSize: "18px", borderRadius: "12px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer" },
  linkBox: { background: "white", padding: "15px 15px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" },
  copyBtn: { padding: "5px 10px", borderRadius: "8px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer" },
  buttons: { display: "flex", gap: "100px", marginTop: "40px" },
  yes: { width: "170px", height: "70px", fontSize: "22px", borderRadius: "16px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer", transition: "all 0.3s ease" },
  no: { width: "130px", height: "55px", fontSize: "18px", borderRadius: "12px", border: "none", backgroundColor: "#6c757d", color: "white", cursor: "pointer" },
  quote: { fontSize: "20px", color: "white", fontWeight: "bold", marginTop: "15px" },
  counter: { marginTop: "15px", color: "white" },
};
