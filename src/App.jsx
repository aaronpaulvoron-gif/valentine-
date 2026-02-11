import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* ----------------- Heart animation ----------------- */
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

/* ----------------- CSS Animations ----------------- */
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

/* ----------------- Main App Component ----------------- */
export default function App() {
  const [name, setName] = useState(""); // name input for link generation
  const [magicLink, setMagicLink] = useState(""); // generated link
  const [submitted, setSubmitted] = useState(false); // form submitted state
  const [recipientName, setRecipientName] = useState(""); // name from URL
  const [answered, setAnswered] = useState(false); // YES clicked
  const [noCount, setNoCount] = useState(0); // NO counter
  const [finalNo, setFinalNo] = useState(false); // NO limit reached
  const [quote, setQuote] = useState(""); // quote to display
  const [errorMsg, setErrorMsg] = useState(""); // Supabase error message

  const yesRef = useRef(null);
  const noRef = useRef(null);
  const linkRef = useRef(null);

  /* ----------------- Quotes ----------------- */
  const loveQuotes = [
    "You just made me the happiest person alive 💖",
    "Forever starts now 💍",
    "You + Me = Always 💞",
    "This is the best YES ever 😘",
    "My heart is officially yours 💓",
  ];

  const cuteReconsider = [
    "Are you sure? 🥺",
    "Think again 💕",
    "I’ll still wait 💘",
    "Maybe reconsider? 😢",
    "Please don’t go 😭",
    "I promise it’ll be fun 💞",
  ];

  const sadQuotes = [
    "That hurt a little 🥺",
    "Ouch… my heart 💔",
    "I’ll wait forever 💘",
    "You’re breaking my heart 😭",
  ];

  /* ----------------- Generate Magic Link ----------------- */
  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  /* ----------------- Handle YES ----------------- */
  async function handleYes() {
    try {
      const randomLove = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
      setQuote(randomLove);
      setAnswered(true);

      // Supabase insert
      const { error } = await supabase.from("valentine_repone").insert([
        { name: recipientName, answered_yes: true, no_count: noCount, no_message: null },
      ]);
      if (error) throw error;

      // Hearts and confetti
      const interval = setInterval(createHeart, 120);
      setTimeout(() => clearInterval(interval), 4000);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      setErrorMsg("Supabase insert failed. Please check your table & RLS policy.");
    }
  }

  /* ----------------- Handle NO ----------------- */
  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);

    // Decide message
    let msg = "";
    if (newCount < 10) {
      msg = cuteReconsider[Math.floor(Math.random() * cuteReconsider.length)];
    } else {
      msg = sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
      setFinalNo(true);
    }
    setQuote(msg);

    // Supabase insert
    try {
      const { error } = await supabase.from("valentine_repone").insert([
        { name: recipientName, answered_yes: false, no_count: newCount, no_message: msg },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMsg("Supabase insert failed. Please check your table & RLS policy.");
    }

    // Animate YES button
    if (yesRef.current) {
      const base = 170;
      const grow = Math.min(newCount * 7, 50);
      yesRef.current.style.width = base + grow + "px";
      yesRef.current.style.boxShadow = `0 0 ${10 + grow}px rgba(255,77,109,0.7)`;
    }

    // Animate NO button
    if (noRef.current) {
      noRef.current.style.animation = "shake 0.4s";
      setTimeout(() => { if (noRef.current) noRef.current.style.animation = "none"; }, 400);
    }
  }

  /* ----------------- Get name from URL ----------------- */
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get("name");

  useEffect(() => {
    if (urlName) setRecipientName(urlName);
  }, [urlName]);

  /* ----------------- Copy Magic Link ----------------- */
  function copyLink() {
    navigator.clipboard.writeText(magicLink);
    if (linkRef.current) {
      linkRef.current.focus();
      linkRef.current.select();
    }
  }

  /* ----------------- JSX ----------------- */
  return (
    <div style={styles.container}>
      {/* Create Proposal */}
      {!urlName && !submitted && (
        <>
          <h1 style={styles.title}>Create a Valentine Proposal 💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter their name..."
            style={styles.input}
          />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Generate Magic Link ✨</button>
        </>
      )}

      {/* Show Magic Link */}
      {magicLink && submitted && !urlName && (
        <>
          <h2 style={styles.title}>Send this to your crush 💘</h2>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={{ border: "none", background: "transparent", color: "#ff4d6d", width: "300px" }} />
            <button onClick={copyLink} style={styles.copyBtn}>Copy</button>
          </div>
        </>
      )}

      {/* Question Page */}
      {urlName && !answered && !finalNo && (
        <>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine?</h1>
          {quote && <p style={styles.quote}>{quote}</p>}

          <div style={styles.buttons}>
            <button ref={yesRef} onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button ref={noRef} onClick={handleNo} style={styles.no}>NO 💔</button>
          </div>
          <p style={styles.counter}>NO pressed: {noCount} / 10</p>
        </>
      )}

      {/* Final NO */}
      {finalNo && (
        <div style={{ textAlign: "center" }}>
          <h1 style={styles.big}>{recipientName} rejected you after 10 tries 😭💔</h1>
          <img src="https://c.tenor.com/5qOkgZVjP1UAAAAi/crying-cat.gif" style={{ width: "300px", marginTop: "20px" }} />
          <p style={styles.quote}>{quote}</p>
        </div>
      )}

      {/* YES */}
      {answered && (
        <>
          <h1 style={styles.big}>{recipientName} SAID YES 💖💖💖</h1>
          <p style={styles.quote}>{quote}</p>
        </>
      )}

      {/* Error */}
      {errorMsg && <p style={{ color: "white" }}>{errorMsg}</p>}
    </div>
  );
}

/* ----------------- Styles ----------------- */
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
  quote: { fontSize: "20px", color: "white", fontWeight: "bold" },
  counter: { marginTop: "15px", color: "white" },
};
