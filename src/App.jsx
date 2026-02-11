import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 Floating Heart Animation Logic */
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

const style = document.createElement("style");
style.innerHTML = `
  @keyframes float {
    to { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
  }
  body { margin: 0; padding: 0; overflow-x: hidden; }
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
  const [currentGif, setCurrentGif] = useState("https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif");
  const [errorMsg, setErrorMsg] = useState("");

  const linkRef = useRef(null);

  const loveQuotes = [
    { msg: "You just made me the happiest person alive 💖", gif: "https://media.tenor.com/9T_0PjD8_80AAAAi/happy-cat-jumping.gif" },
    { msg: "Forever starts now 💍", gif: "https://media.tenor.com/mO_S6fU_880AAAAi/cat-love.gif" },
    { msg: "You + Me = Always 💞", gif: "https://media.tenor.com/X5K7eN_880AAAAi/peach-goma.gif" }
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

  function handleGenerateLink() {
    if (!name.trim()) return;
    const link = `${window.location.origin}?name=${encodeURIComponent(name.trim())}`;
    setMagicLink(link);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);
    const choice = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    setQuote(choice.msg);
    setCurrentGif(choice.gif);

    try {
      await supabase.from("valentine_response2").insert([{
        name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES! 🎉"
      }]);
    } catch (e) { setErrorMsg("Database connection error"); }

    const interval = setInterval(createHeart, 150);
    setTimeout(() => clearInterval(interval), 5000);
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
        name: recipientName, answered_yes: false, no_count: newCount, no_message: "Said No"
      }]);
    } catch (e) { console.log("Supabase error ignored"); }
  }

  useEffect(() => {
    const urlName = new URLSearchParams(window.location.search).get("name");
    if (urlName) {
      setRecipientName(urlName);
      setCurrentGif("https://media.tenor.com/mU_S6fU_880AAAAi/cat-waiting.gif");
    }
    const heartInterval = setInterval(createHeart, 800);
    return () => clearInterval(heartInterval);
  }, []);

  return (
    <div style={styles.container}>
      {/* 1. WELCOME - ENTER NAME */}
      {!recipientName && !submitted && (
        <div style={styles.card}>
          <h1 style={styles.title}>Valentine Proposal 💌</h1>
          <img src="https://media.tenor.com/IC_v7_379eAAAAAi/cat-hello.gif" style={styles.gif} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Who is the lucky person?" style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Magic Link ✨</button>
        </div>
      )}

      {/* 2. COPY LINK DESIGN */}
      {submitted && !recipientName && (
        <div style={styles.card}>
          <h2 style={{color: '#ff4d6d'}}>Link Created! 😻</h2>
          <img src="https://media.tenor.com/vFKqnCdLPNOKcAAC/cat-kiss.gif" style={styles.gif} />
          <p style={{color: '#666'}}>Copy this link and send it to your crush:</p>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={styles.linkInput} />
            <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Link Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
          </div>
        </div>
      )}

      {/* 3. THE ACTUAL PROPOSAL CARD */}
      {recipientName && !answered && !finalNo && (
        <div style={styles.card}>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          <p style={styles.quote}>{quote || "I have a special question for you..."}</p>
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.08)})`}}>NO 💔</button>
          </div>
        </div>
      )}

      {/* 4. FINAL RESULTS (YES/NO) */}
      {(answered || finalNo) && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? "SUCCESS! 🎉" : "HEART BROKEN... 😭"}</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          <p style={styles.quote}>{quote}</p>
          {answered && <p style={{color: '#ff4d6d', fontSize: '14px'}}>They said yes! My heart is full. 💖</p>}
        </div>
      )}
      {errorMsg && <p style={styles.error}>{errorMsg}</p>}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", textAlign: "center", maxWidth: "450px", width: "100%", position: 'relative', zIndex: 10 },
  title: { fontSize: "1.8rem", color: "#ff4d6d", marginBottom: "20px" },
  big: { fontSize: "2.2rem", color: "#ff4d6d", marginBottom: "20px", lineHeight: '1.2' },
  input: { padding: "15px", width: "85%", fontSize: "16px", borderRadius: "15px", border: "2px solid #ffb6c1", marginBottom: "20px", outline: "none", textAlign: 'center' },
  mainBtn: { padding: "12px 30px", fontSize: "18px", borderRadius: "15px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer", fontWeight: "bold", boxShadow: '0 4px 15px rgba(255, 77, 109, 0.4)' },
  linkBox: { background: "#fff5f7", padding: "12px", borderRadius: "15px", display: "flex", border: "2px dashed #ff4d6d", marginTop: "20px", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", color: "#ff4d6d", flex: 1, padding: "5px", fontSize: '14px', outline: 'none' },
  copyBtn: { padding: "8px 15px", borderRadius: "10px", backgroundColor: "#ff4d6d", color: "white", border: "none", cursor: "pointer", fontWeight: 'bold' },
  gif: { width: "220px", height: "180px", objectFit: 'cover', borderRadius: "20px", marginBottom: "20px", boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  buttons: { display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginTop: "25px" },
  yes: { padding: "15px 40px", fontSize: "22px", borderRadius: "15px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", boxShadow: '0 5px 0 #2e7d32' },
  no: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" },
  quote: { fontSize: "19px", color: "#ff4d6d", fontWeight: "bold", margin: "15px 0" },
  error: { position: 'fixed', bottom: '20px', color: 'red', fontWeight: 'bold', background: 'white', padding: '5px 15px', borderRadius: '10px' }
};  