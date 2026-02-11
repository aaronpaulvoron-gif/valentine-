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
  heart.style.zIndex = "999";
  heart.style.animation = "float 3s linear forwards";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}

const style = document.createElement("style");
style.innerHTML = `@keyframes float { to { transform: translateY(-120vh); opacity: 0; } }`;
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
  // STARTING GIF (Welcoming Cat)
  const [currentGif, setCurrentGif] = useState("https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif");
  const [errorMsg, setErrorMsg] = useState("");

  const linkRef = useRef(null);

  const loveQuotes = [
    { msg: "You just made me the happiest person alive 💖", gif: "https://media.tenor.com/9T_0PjD8_80AAAAi/happy-cat-jumping.gif" },
    { msg: "Forever starts now 💍", gif: "https://media.tenor.com/mO_S6fU_880AAAAi/cat-love.gif" },
    { msg: "You + Me = Always 💞", gif: "https://media.tenor.com/X5K7eN_880AAAAi/peach-goma.gif" },
    { msg: "Best YES ever! 😘", gif: "https://media.tenor.com/vFKqnCdLPNOKcAAC/cat-kiss.gif" }
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://media.tenor.com/Y-S_8fU_880AAAAi/sad-cat.gif" },
    { msg: "Think again 💕", gif: "https://media.tenor.com/Z-S_8fU_880AAAAi/cat-please.gif" },
    { msg: "I’ll still wait 💘", gif: "https://media.tenor.com/A-S_8fU_880AAAAi/cat-crying.gif" },
    { msg: "Look at this face... 😿", gif: "https://media.tenor.com/u_S_8fU_880AAAAi/cat-sad-eyes.gif" },
    { msg: "Please? 😭", gif: "https://media.tenor.com/7SF5scqy2lld6AAAAC/cat-begging.gif" },
    { msg: "I'll bring treats! 🐟", gif: "https://media.tenor.com/3oEduQAsYcJKQH2XsIAAAC/cat-snack.gif" },
    { msg: "Don't be mean! 🐱", gif: "https://media.tenor.com/yFQ0ywscgobJKAAAAC/cat-angry.gif" },
    { msg: "Last chance! 🥺", gif: "https://media.tenor.com/8vQSQ3cNXuDGoAAAAC/cat-stare.gif" },
    { msg: "I'm gonna cry... 😭", gif: "https://media.tenor.com/5qOkgZVjP1UAAAAi/crying-cat.gif" }
  ];

  const sadFinalQuotes = [
    "My heart is officially broken... 💔",
    "I guess I'll just be alone forever 😭",
    "That hurt a lot. 😿"
  ];

  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);
    const randomChoice = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    setQuote(randomChoice.msg);
    setCurrentGif(randomChoice.gif);

    try {
      const { error } = await supabase.from("valentine_response2").insert([
        {
          name: recipientName || "Someone",
          answered_yes: true,
          no_count: noCount,
          no_message: "Said Yes! 🎉"
        }
      ]);
      if (error) throw error;
    } catch (err) {
      setErrorMsg("Save failed. Check Supabase columns!");
    }

    const interval = setInterval(createHeart, 120);
    setTimeout(() => clearInterval(interval), 4000);
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);

    if (newCount >= 10) {
      setFinalNo(true);
      const finalSad = sadFinalQuotes[Math.floor(Math.random() * sadFinalQuotes.length)];
      setQuote(finalSad);
      setCurrentGif("https://media.tenor.com/0_S_8fU_880AAAAi/cat-break-heart.gif"); // UNIQUE FINAL GIF
    } else {
      const msgObj = cuteNoMessages[(newCount - 1)];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
    }

    try {
      await supabase.from("valentine_response2").insert([
        {
          name: recipientName,
          answered_yes: false,
          no_count: newCount,
          no_message: quote || "Pressed No"
        }
      ]);
    } catch (err) { console.error(err); }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get("name");
    if (urlName) {
      setRecipientName(urlName);
      setCurrentGif("https://media.tenor.com/mU_S6fU_880AAAAi/cat-waiting.gif");
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. WELCOME SCREEN */}
      {!recipientName && !submitted && (
        <div style={styles.card}>
          <h1 style={styles.title}>Create a Valentine Proposal 💌</h1>
          <img src="https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif" style={styles.gif} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter their name..." style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Generate Link ✨</button>
        </div>
      )}

      {/* 2. LINK BOX (Redesigned) */}
      {submitted && !recipientName && (
        <div style={styles.card}>
          <h2 style={{color: '#ff4d6d'}}>Your Magic Link is Ready! 💘</h2>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={styles.linkInput} />
            <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Link Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
          </div>
          <p style={{fontSize: '13px', marginTop: '15px', color: '#666'}}>Send this link to your crush and wait for the "Yes"!</p>
        </div>
      )}

      {/* 3. THE PROPOSAL SCREEN */}
      {recipientName && !answered && !finalNo && (
        <div style={styles.card}>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          {quote && <p style={styles.quote}>{quote}</p>}
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.1)})`}}>NO 💔</button>
          </div>
          <p style={{marginTop: '15px', fontSize: '12px', color: '#888'}}>Attempts: {noCount}/10</p>
        </div>
      )}

      {/* 4. FINAL SCREENS (Yes or Final No) */}
      {(answered || finalNo) && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? "SHE SAID YES! 🎉" : "REJECTED... 😭"}</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          <p style={styles.quote}>{quote}</p>
        </div>
      )}

      {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "#f8bbd0", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Comic Sans MS', cursive, sans-serif" },
  card: { background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 15px 35px rgba(255, 77, 109, 0.2)", textAlign: "center", maxWidth: "450px", width: "100%" },
  title: { fontSize: "1.8rem", color: "#ff4d6d", marginBottom: "20px" },
  big: { fontSize: "2rem", color: "#ff4d6d", marginBottom: "20px" },
  input: { padding: "15px", width: "85%", fontSize: "16px", borderRadius: "15px", border: "2px solid #ff4d6d", marginBottom: "20px", outline: "none", textAlign: 'center' },
  mainBtn: { padding: "12px 30px", fontSize: "18px", borderRadius: "15px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer", fontWeight: "bold" },
  linkBox: { background: "#fff0f3", padding: "12px", borderRadius: "15px", display: "flex", border: "2px dashed #ff4d6d", marginTop: "20px", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", color: "#ff4d6d", flex: 1, padding: "5px", fontSize: '14px' },
  copyBtn: { padding: "8px 15px", borderRadius: "10px", backgroundColor: "#ff4d6d", color: "white", border: "none", cursor: "pointer", fontWeight: 'bold' },
  gif: { width: "220px", height: "200px", objectFit: 'cover', borderRadius: "20px", marginBottom: "20px" },
  buttons: { display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginTop: "20px" },
  yes: { padding: "15px 35px", fontSize: "22px", borderRadius: "15px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", boxShadow: '0 5px 0 #2e7d32' },
  no: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" },
  quote: { fontSize: "20px", color: "#ff4d6d", fontWeight: "bold", margin: "10px 0" },
  errorBanner: { position: 'fixed', bottom: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 20px', borderRadius: '10px' }
};