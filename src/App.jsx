import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 Floating Heart Animation */
function createHeart() {
  const heart = document.createElement("div");
  heart.innerText = "💖";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = window.innerHeight + "px";
  heart.style.fontSize = Math.random() * 30 + 20 + "px";
  heart.style.zIndex = "999";
  heart.style.animation = "float 4s linear forwards";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

const style = document.head.appendChild(document.createElement("style"));
style.innerHTML = `@keyframes float { to { transform: translateY(-120vh) rotate(360deg); opacity: 0; } }`;

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [finalNo, setFinalNo] = useState(false);
  const [quote, setQuote] = useState("");
  const [currentGif, setCurrentGif] = useState("https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif");

  const linkRef = useRef(null);

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

  function handleGenerateLink() {
    if (!name.trim()) return;
    setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);
    setCurrentGif("https://media.tenor.com/9T_0PjD8_80AAAAi/happy-cat-jumping.gif");
    setQuote("You just made me the happiest person alive! 💖");
    try {
      await supabase.from("valentine_response2").insert([{
        name: recipientName, answered_yes: true, no_count: noCount, no_message: "Said Yes! 🎉"
      }]);
    } catch (e) { console.error("Database Error:", e); }
    const int = setInterval(createHeart, 150);
    setTimeout(() => clearInterval(int), 5000);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount >= 10) {
      setFinalNo(true);
      setQuote("My heart is officially broken... 💔");
      setCurrentGif("https://media.tenor.com/0_S_8fU_880AAAAi/cat-break-heart.gif");
    } else {
      const msgObj = cuteNoMessages[newCount - 1];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
    }
    try {
      await supabase.from("valentine_response2").insert([{
        name: recipientName, answered_yes: false, no_count: newCount, no_message: "Pressed No"
      }]);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    const urlName = new URLSearchParams(window.location.search).get("name");
    if (urlName) {
      setRecipientName(urlName);
      setCurrentGif("https://media.tenor.com/mU_S6fU_880AAAAi/cat-waiting.gif");
    }
    const heartInterval = setInterval(createHeart, 1000);
    return () => clearInterval(heartInterval);
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. START BOX (Welcome) */}
      {!recipientName && !submitted && (
        <div style={styles.card}>
          <h1 style={styles.title}>Valentine Proposal 💌</h1>
          <div style={styles.gifContainer}>
            <img src="https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif" style={styles.gif} />
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Who is the lucky person?" style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Magic Link ✨</button>
        </div>
      )}

      {/* 2. LINK BOX (Copy) */}
      {submitted && !recipientName && (
        <div style={styles.card}>
          <h2 style={{color: '#ff4d6d'}}>It's Ready! 😻</h2>
          <div style={styles.gifContainer}>
            <img src="https://media.tenor.com/vFKqnCdLPNOKcAAC/cat-kiss.gif" style={styles.gif} />
          </div>
          <p style={{color: '#666', fontSize: '14px'}}>Send this link to your crush:</p>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={styles.linkInput} />
            <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
          </div>
        </div>
      )}

      {/* 3. PROPOSAL BOX */}
      {recipientName && !answered && !finalNo && (
        <div style={styles.card}>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <div style={styles.gifContainer}>
            <img src={currentGif} style={styles.gif} />
          </div>
          <p style={styles.quote}>{quote || "I have a special question for you..."}</p>
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.08)})`}}>NO 💔</button>
          </div>
        </div>
      )}

      {/* 4. FINAL RESULTS */}
      {(answered || finalNo) && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? "SHE SAID YES! 🎉" : "REJECTED... 😭"}</h1>
          <div style={styles.gifContainer}>
            <img src={currentGif} style={styles.gif} />
          </div>
          <p style={styles.quote}>{quote}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "35px", borderRadius: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "420px", width: "100%", zIndex: 10 },
  gifContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  gif: { width: "200px", height: "170px", objectFit: 'cover', borderRadius: "20px", boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  title: { fontSize: "1.7rem", color: "#ff4d6d", marginBottom: "20px" },
  big: { fontSize: "2rem", color: "#ff4d6d", marginBottom: "20px", lineHeight: '1.2' },
  input: { padding: "14px", width: "85%", borderRadius: "15px", border: "2px solid #ffb6c1", marginBottom: "20px", textAlign: 'center', outline: 'none' },
  mainBtn: { padding: "12px 30px", fontSize: "17px", borderRadius: "15px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer", fontWeight: "bold", boxShadow: '0 4px 15px rgba(255, 77, 109, 0.3)' },
  linkBox: { background: "#fff5f7", padding: "10px", borderRadius: "15px", display: "flex", border: "2px dashed #ff4d6d", marginTop: "10px", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", color: "#ff4d6d", flex: 1, padding: "5px", fontSize: '13px', outline: 'none' },
  copyBtn: { padding: "8px 15px", borderRadius: "10px", backgroundColor: "#ff4d6d", color: "white", border: "none", cursor: "pointer", fontWeight: 'bold' },
  buttons: { display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginTop: "20px" },
  yes: { padding: "15px 40px", fontSize: "22px", borderRadius: "15px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", boxShadow: '0 5px 0 #2e7d32' },
  no: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" },
  quote: { fontSize: "18px", color: "#ff4d6d", fontWeight: "bold", margin: "10px 0" }
};