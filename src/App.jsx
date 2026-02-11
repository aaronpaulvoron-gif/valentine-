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
style.innerHTML = `
@keyframes float { to { transform: translateY(-120vh); opacity: 0; } }
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
  const [currentGif, setCurrentGif] = useState("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/c76IJbxUy6vO/giphy.gif");
  const [errorMsg, setErrorMsg] = useState("");

  const linkRef = useRef(null);

  const loveQuotes = [
    { msg: "You just made me the happiest person alive 💖", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbxxvDUQM/giphy.gif" },
    { msg: "Forever starts now 💍", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKc/giphy.gif" },
    { msg: "You + Me = Always 💞", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/13CoXDiaCcC2EA/giphy.gif" },
    { msg: "This is the best YES ever 😘", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOeZh6/giphy.gif" }
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3oriO0OEd9QIDdllqo/giphy.gif" },
    { msg: "Think again 💕", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26ufdipQqU2lhNA4g/giphy.gif" },
    { msg: "I’ll still wait 💘", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l4FGuhL4U2WyjdkaY/giphy.gif" },
    { msg: "Look at this cute cat 😺", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/JIX9t2j0ZTN9S/giphy.gif" },
    { msg: "I’ll be super cute 🐱", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/13borq7Zo2kulO/giphy.gif" },
    { msg: "Please? 😭", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/7SF5scqy2lld6/giphy.gif" },
    { msg: "I'll bring treats! 🐟", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3oEduQAsYcJKQH2XsI/giphy.gif" },
    { msg: "Don't break my heart..", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/yFQ0ywscgobJK/giphy.gif" },
    { msg: "Last chance! 🥺", gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueHh3bm95YjJ4eG9ueXh3bm95YjJ4eG9ueXh3bm95YjJ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/8vQSQ3cNXuDGo/giphy.gif" }
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
        { name: recipientName || "Secret Crush", answered_yes: true, no_count: noCount }
      ]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMsg("Save failed. Make sure table 'valentine_response2' exists!");
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
      setQuote("Ouch... my heart is broken. 💔");
      setCurrentGif("https://c.tenor.com/5qOkgZVjP1UAAAAi/crying-cat.gif");
    } else {
      const msgObj = cuteNoMessages[newCount - 1];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
    }

    try {
      await supabase.from("valentine_response2").insert([
        { name: recipientName || "Secret Crush", answered_yes: false, no_count: newCount }
      ]);
    } catch (err) {
      console.error(err);
    }
  }

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
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter their name..." style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Generate Link ✨</button>
        </>
      )}

      {submitted && !recipientName && (
        <div style={styles.linkBox}>
          <input ref={linkRef} value={magicLink} readOnly style={styles.linkInput} />
          <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied!");}} style={styles.copyBtn}>Copy</button>
        </div>
      )}

      {recipientName && !answered && !finalNo && (
        <>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          {quote && <p style={styles.quote}>{quote}</p>}
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${1 - noCount*0.05})`}}>NO 💔</button>
          </div>
        </>
      )}

      {(answered || finalNo) && (
        <>
          <h1 style={styles.big}>{answered ? "SHE SAID YES! 🎉" : "REJECTED... 😭"}</h1>
          <img src={currentGif} alt="cat" style={styles.gif} />
          <p style={styles.quote}>{quote}</p>
        </>
      )}
      {errorMsg && <p style={{ color: "yellow", marginTop: "10px" }}>{errorMsg}</p>}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "#f06292", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px", fontFamily: "sans-serif" },
  title: { fontSize: "2rem", color: "white", marginBottom: "20px" },
  big: { fontSize: "2.5rem", color: "white", marginBottom: "20px" },
  input: { padding: "12px", fontSize: "18px", borderRadius: "10px", border: "none", marginBottom: "20px" },
  mainBtn: { padding: "12px 26px", fontSize: "18px", borderRadius: "12px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer" },
  linkBox: { background: "white", padding: "15px", borderRadius: "12px", display: "flex", gap: "10px" },
  linkInput: { border: "none", color: "#ff4d6d", width: "250px" },
  copyBtn: { padding: "5px 10px", borderRadius: "8px", backgroundColor: "#ff4d6d", color: "white", border: "none" },
  gif: { width: "250px", borderRadius: "15px", marginBottom: "20px" },
  buttons: { display: "flex", gap: "20px", alignItems: "center" },
  yes: { padding: "15px 30px", fontSize: "20px", borderRadius: "12px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer" },
  no: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#f44336", color: "white", border: "none", cursor: "pointer" },
  quote: { fontSize: "22px", color: "white", fontWeight: "bold" }
};