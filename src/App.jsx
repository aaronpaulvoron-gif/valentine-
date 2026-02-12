import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [finalNo, setFinalNo] = useState(false);
  const [quote, setQuote] = useState("");
  const [isSuccessMode, setIsSuccessMode] = useState(false);
  const [replyLink, setReplyLink] = useState("");
  const [currentGif, setCurrentGif] = useState("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif");

  // --- 40 ENGLISH + 10 TAGALOG KILIG (YES) ---
  const kiligQuotes = [
    "You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart. 💌", "Everything is sweeter with you. 🍬", "Luckiest person in the world! 🏆", "My heart is dancing! 💃", "Falling for you more. 🍂", "Greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "Missing puzzle piece. 🧩", "World is brighter. 💡", "I'm yours forever. 🏷️", "You are my favorite thought. 💭", "My world revolves around you. 🪐", "I found home in you. 🏠", "You're the melody to my song. 🎵", "Forever isn't long enough. ⏳", "You're my greatest blessing. 🙏", "I'm so lucky to have you. 🍀", "You're the peanut butter to my jelly. 🥜", "My heart is finally complete. 🧩", "You're my dream come true. 🌠", "I'll choose you every single day. 🗓️", "You make life a beautiful journey. 🗺️", "I'm head over heels for you. 🤸", "You're my anchor. ⚓", "I love you more than words can say. 🗣️", "You're my happy ending. 📖", "My soul found its match. 🔥", "You're my treasure. 💎", "I promise to cherish you. 🤝", "You're my everything. 🌌",
    "Kinikilig ako sobra! 💓", "Ikaw lang talaga ang pangarap ko. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari sa akin. 🥇", "Sumasayaw ang puso ko sa tuwa! 💃", "Ikaw ang aking paboritong pahinga. 🏠", "Mahal na mahal kita sobra. 🌙", "Bawal na ang bawian, akin ka na! 💍"
  ];

  // --- 40 ENGLISH + 10 TAGALOG SAD/CUTE (NO) ---
  const sadQuotes = [
    "Are you sure? 🥺", "Think again 💕", "Look at this face... 😿", "Please don't... 😭", "I'll be so sad... 🥀", "Don't do this to me! 💔", "I'll give you chocolate! 🍫", "Last chance... ⏳", "Why so mean? 😿", "Pretty please? 🥺", "My heart is breaking. 💔", "I'll wait for you. 🕰️", "Don't leave me hanging. 🧶", "You're my only choice. 🎯", "Is that your final answer? 🧐", "I'll be a good partner, promise! 😇", "Just one 'Yes'? ☝️", "I'm crying inside. 💧", "Don't break my spirit. ✨", "I'll treat you like a queen/king. 👑", "We'd be so cute together! 🐣", "I'll write you poems! ✍️", "I'll cook for you! 🍳", "Don't send me to the friendzone. 🚧", "My heart is heavy. ⚓", "I'll give you all the cuddles! 🧸", "Please say yes! 🙏", "I'm staring at your photo... 📸", "You're the only one I want. 🌹", "My soul is sad now. ☁️", "I'll give you the world. 🌍", "Don't walk away. 🚶‍♂️", "My heart belongs to you. 🔐", "I'll protect you. 🛡️", "You're making me blush and cry. 😳", "Please change your mind! 🔄", "I'm losing hope... 🕯️", "You're my sunshine, don't go. ☀️", "My heart is shattered. 🔨", "Maybe just a coffee date? ☕",
    "Sure ka na ba talaga? 🥺", "Pag-isipan mo uli, please. 💕", "Sige na, wag ka nang tumanggi. 🥺", "Wag mo namang gawin sa akin 'to! 😭", "Malulungkot ako nang sobra... 🥀", "Bawal na ang ayaw, ha? 💍", "Treat kita kahit saan! 🍕", "Promise, di ka magsisisi. 🤞", "Tingnan mo naman itong mukha ko. 😿", "Wag ganyan, Valentine's naman oh! 🌹"
  ];

  const cuteGifs = [
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif"
  ];

  const handleResponse = async (isYes) => {
    const list = isYes ? kiligQuotes : sadQuotes;
    const selectedQuote = list[Math.floor(Math.random() * list.length)];

    // SECRET DATABASE LOG
    await supabase.from("valentine_response2").insert([
      { name: recipientName, answered_yes: isYes, no_count: noCount, no_message: isYes ? "YES!" : "Final No" }
    ]);

    if (isYes) {
      setAnswered(true);
      setQuote(selectedQuote);
      setCurrentGif("https://i.giphy.com/media/MDJ9IbM3vuzY2qEqaS/giphy.gif");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
      setFinalNo(true);
      setQuote(selectedQuote);
    }

    // THE THIRD LINK (Triple Handshake)
    const resParam = isYes ? 'yes' : 'no';
    const link = `${window.location.origin}?result=${resParam}&from=${encodeURIComponent(recipientName)}`;
    setReplyLink(link);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    const from = params.get("from");
    const n = params.get("name");

    if (result === "yes") {
      setIsSuccessMode(true);
      setRecipientName(from || "Someone");
    } else if (n) {
      setRecipientName(n);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {isSuccessMode ? (
          <div>
            <h1 style={styles.title}>SUCCESS! 🏆💖</h1>
            <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" style={styles.gif} />
            <h2 style={{color: '#333'}}>{recipientName} SAID YES!</h2>
            <p style={styles.finalQuote}>"Check your database, the log is there!"</p>
            <p style={{color: '#ff4d6d', fontWeight: 'bold'}}>Happy Valentine's 2026! 🌹</p>
          </div>
        ) : !recipientName ? (
          !submitted ? (
            <>
              <h1 style={styles.title}>Valentine 2026 💌</h1>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Crush's Name..." style={styles.input} />
              <button onClick={() => {
                setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
                setSubmitted(true);
              }} style={styles.mainBtn}>Create Magical Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Link Generated! 🚀</h2>
              <div style={styles.linkBox}>
                <input readOnly value={magicLink} style={styles.linkInput} />
                <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
              </div>
              <p style={styles.waitMsg}>Send this and <b>WAIT</b> for them to send you the reply link! ⏳</p>
            </>
          )
        ) : (
          <>
            <h1 style={styles.title}>{answered ? "YES! 🎉" : finalNo ? "Oh... 💔" : `Hi ${recipientName}!`}</h1>
            <img src={currentGif} style={styles.gif} />

            {!answered && !finalNo ? (
              <>
                <p style={styles.proposalText}>Will you be my Valentine? 💘</p>
                <p style={styles.quoteDisplay}>{quote}</p>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleResponse(true)} style={styles.yesBtn}>YES 💕</button>
                  <button
                    onClick={() => {
                      const nc = noCount + 1;
                      setNoCount(nc);
                      if (nc >= 20) handleResponse(false);
                      else {
                        setQuote(sadQuotes[nc % sadQuotes.length]);
                        setCurrentGif(cuteGifs[nc % cuteGifs.length]);
                      }
                    }}
                    style={{...styles.noBtn, transform: `scale(${Math.max(0.3, 1 - noCount*0.07)})` }}
                  >NO</button>
                </div>
              </>
            ) : (
              <div style={styles.responseBox}>
                <p style={styles.stepTitle}>Final Step: Send this back!</p>
                <div style={styles.linkBox}>
                  <input readOnly value={replyLink} style={styles.linkInput} />
                  <button onClick={() => {navigator.clipboard.writeText(replyLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy Reply</button>
                </div>
                <p style={styles.stealthQuote}>"{quote}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: "40px", borderRadius: "35px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", textAlign: "center", maxWidth: "420px", width: "85%", border: '2px solid white' },
  title: { color: "#ff4d6d", fontSize: "1.8rem", fontWeight: 'bold', marginBottom: '10px' },
  gif: { width: "100%", borderRadius: "20px", marginBottom: "20px" },
  input: { width: "100%", padding: "14px", borderRadius: "12px", border: "2px solid #ffb6c1", marginBottom: "15px", boxSizing: 'border-box' },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", width: "100%", padding: "16px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" },
  linkBox: { display: "flex", background: "#fdf0f2", padding: "12px", borderRadius: "12px", border: "1px dashed #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "0.7rem", color: '#ff4d6d', outline: 'none' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: 'pointer' },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "15px 40px", borderRadius: "15px", fontSize: "1.4rem", cursor: "pointer", fontWeight: 'bold' },
  noBtn: { background: "#f44336", color: "white", border: "none", padding: "10px 20px", borderRadius: "15px", cursor: "pointer", marginLeft: "10px" },
  quoteDisplay: { color: "#ff4d6d", fontStyle: "italic", margin: "10px 0", minHeight: '40px' },
  waitMsg: { fontSize: '0.8rem', marginTop: '15px', color: '#666' },
  stepTitle: { fontWeight: 'bold', color: '#333', marginBottom: '10px' },
  stealthQuote: { fontSize: '0.9rem', color: '#ff4d6d', marginTop: '15px', fontWeight: 'bold' },
  finalQuote: { fontSize: '1.1rem', color: '#ff4d6d', margin: '15px 0' },
  proposalText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }
};