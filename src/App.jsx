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
  const [currentGif, setCurrentGif] = useState("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif");

  // --- 20 ENGLISH + 10 TAGALOG KILIG ---
  const kiligQuotes = [
    "You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart. 💌", "Everything is sweeter with you. 🍬", "Luckiest person in the world! 🏆", "My heart is dancing! 💃", "Falling for you more. 🍂", "Greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "Missing puzzle piece. 🧩", "World is brighter. 💡", "I'm yours forever. 🏷️",
    "Kinikilig ako sobra! 💓", "Ikaw lang talaga ang pangarap ko. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari sa akin. 🥇", "Sumasayaw ang puso ko! 💃", "Ikaw ang aking paboritong pahinga. 🏠", "Mahal na mahal kita. 🌙", "Bawal na ang bawian, akin ka na! 💍"
  ];

  // --- 20 ENGLISH + 10 TAGALOG CUTE NO ---
  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/media/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Think again 💕", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/media/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Please don't... 😭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Malulungkot ako... 🥀", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Bibigyan kita ng chocolate! 🍫", gif: "https://i.giphy.com/media/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Maging mabuti akong partner! 🐕", gif: "https://i.giphy.com/media/11pxf8LidG76XC/giphy.gif" },
    { msg: "Baguhin mo na ang isip mo! ✨", gif: "https://i.giphy.com/media/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Last chance... ⏳", gif: "https://i.giphy.com/media/Yycc82XEuWDaLLi2GV/giphy.gif" },
    { msg: "Wait lang, sure ka? 😿", gif: "https://i.giphy.com/media/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Think uli! 💭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Don't break my heart. 🔨", gif: "https://i.giphy.com/media/26gs6vWcJJ7m/giphy.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" },
    { msg: "You're the only one. 🌹", gif: "https://i.giphy.com/media/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "I'll give you cuddles! 🧸", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Sure ka na ba talaga? 🥺", gif: "https://i.giphy.com/media/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Pag-isipan mo uli, please. 💕", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Wag mo namang gawin sa akin 'to! 😭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Malulungkot ako nang sobra... 🥀", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Bawal na ang ayaw, ha? 💍", gif: "https://i.giphy.com/media/jpbnoe3UIa8TUBSO9X/giphy.gif" }
  ];

  const handleResponse = async (isYes) => {
    const list = isYes ? kiligQuotes : ["My heart just shattered. 💔"];
    const selectedQuote = list[Math.floor(Math.random() * list.length)];

    if (isYes) {
      setAnswered(true);
      setQuote(selectedQuote);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
      setFinalNo(true);
      setQuote(selectedQuote);
    }

    // --- SAVE TO SUPABASE SO YOU CAN SEE IT ---
    await supabase.from("valentine_response2").insert([
      { name: recipientName, answered_yes: isYes, no_count: noCount, no_message: isYes ? "YES!" : "Final No" }
    ]);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    const n = params.get("name");

    if (result === "yes") {
      setIsSuccessMode(true);
      setRecipientName(params.get("from") || "Someone");
      confetti({ particleCount: 200, spread: 100 });
    } else if (n) {
      setRecipientName(n);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {isSuccessMode ? (
          <div>
            <h1 style={styles.title}>MISSION SUCCESS! 🏆</h1>
            <img src="https://i.giphy.com/media/MDJ9IbM3vuzY2qEqaS/giphy.gif" style={styles.gif} />
            <h2 style={{color: '#333'}}>{recipientName} SAID YES!</h2>
            <p style={styles.finalQuote}>"Check your Supabase dashboard for the logs!"</p>
            <p style={{color: '#ff4d6d', fontWeight: 'bold'}}>Happy Valentine's 2026! 🌹</p>
          </div>
        ) : !recipientName ? (
          !submitted ? (
            <>
              <h1 style={styles.title}>Valentine 2026 💌</h1>
              <img src="https://i.giphy.com/media/C1asB6XJjAnS0/giphy.gif" style={styles.gif} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Crush Name..." style={styles.input} />
              <button onClick={() => {
                setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
                setSubmitted(true);
              }} style={styles.mainBtn}>Create Magical Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Link Created! 🚀</h2>
              <div style={styles.linkBox}>
                <input readOnly value={magicLink} style={styles.linkInput} />
                <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
              </div>
              <p style={styles.instruction}>Send this to {name}. Their answer will be saved in your database!</p>
            </>
          )
        ) : (
          <>
            <h1 style={styles.title}>{answered ? "YES! 🎉" : finalNo ? "💔" : `Hi ${recipientName}!`}</h1>
            <img src={currentGif} style={styles.gif} />
            <p style={styles.proposalText}>{answered ? "You made me the luckiest!" : finalNo ? "My heart..." : "Will you be my Valentine? 💘"}</p>
            <p style={styles.quoteDisplay}>{quote}</p>

            {!answered && !finalNo ? (
              <div style={styles.btnGroup}>
                <button onClick={() => handleResponse(true)} style={styles.yesBtn}>YES 💕</button>
                <button
                  onClick={() => {
                    const nc = noCount + 1;
                    setNoCount(nc);
                    if (nc >= 15) handleResponse(false);
                    else {
                        setQuote(cuteNoMessages[nc % 20].msg);
                        setCurrentGif(cuteNoMessages[nc % 20].gif);
                    }
                  }}
                  style={{...styles.noBtn, transform: `scale(${Math.max(0.3, 1 - noCount*0.07)})` }}
                >NO</button>
              </div>
            ) : (
              <div style={styles.responseBox}>
                <p style={styles.successText}>Response Sent Successfully! ✅</p>
                <p style={{fontSize: '0.8rem', color: '#666'}}>You can now close this tab.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(to bottom, #ff9a9e, #fecfef)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: "35px", borderRadius: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", textAlign: "center", maxWidth: "400px", width: "90%", border: '2px solid white' },
  title: { color: "#ff4d6d", fontSize: "2.2rem", marginBottom: "15px", fontWeight: 'bold' },
  gif: { width: "100%", borderRadius: "20px", marginBottom: "15px", boxShadow: '0 5px 15px rgba(0,0,0,0.1)' },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ffb6c1", marginBottom: "15px", boxSizing: 'border-box', outline: 'none' },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", width: "100%", padding: "15px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: '1rem' },
  linkBox: { display: "flex", background: "#fdf0f2", padding: "10px", borderRadius: "10px", border: "1px dashed #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "0.7rem", color: '#ff4d6d' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: 'pointer' },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "15px 40px", borderRadius: "15px", fontSize: "1.3rem", cursor: "pointer", fontWeight: 'bold', boxShadow: '0 5px 15px rgba(76,175,80,0.4)' },
  noBtn: { background: "#f44336", color: "white", border: "none", padding: "10px 20px", borderRadius: "15px", cursor: "pointer", marginLeft: "10px", fontWeight: 'bold' },
  quoteDisplay: { color: "#ff4d6d", fontWeight: "bold", fontStyle: "italic", margin: "10px 0", minHeight: '40px' },
  instruction: { fontSize: '0.8rem', marginTop: '15px', color: '#888' },
  finalQuote: { fontSize: '1.2rem', color: '#ff4d6d', margin: '20px 0', fontWeight: 'bold' },
  proposalText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333' },
  successText: { color: '#2ecc71', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '20px' }
};