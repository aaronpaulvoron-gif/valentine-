import { useState, useEffect } from "react";
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

  // --- 20 ENGLISH + 10 TAGALOG SAD ---
  const sadQuotes = [
    "My heart just shattered. 💔", "Crying in the corner. 😿", "Table for one. 🍦", "Mission failed. 📉", "Why does love hurt? 😭", "Maybe in another lifetime. 🌌", "Love is a sad song. 🥀", "Hello darkness. 🌑", "Even my cat is sad. 🐈‍⬛", "Is this the end? 🎬", "Just rain on my face. 🌧️", "Soul is tired. 💤", "I'm not the one. 🥀", "Pain level: 100. 🤒", "You stepped on my heart. 👞", "Back to single life. 🚶", "Talking to my plants. 🪴", "Friendzone accepted. 🏳️", "Ouch... that stung. 🩹", "Ghost town heart. 👻",
    "Ang sakit naman nito. 😭", "Hindi ako umiiyak, napuwing lang. 🌧️", "Napagod na ang puso ko. 💤", "I guess hindi talaga ako para sa'yo. ✨", "Dinurog mo ang puso ko. 👞", "Buti pa yung halaman, nakikinig. 🪴", "Ouch... ba't ganun? 🩹", "Nawawala na ako sa lungkot. 🌊", "Baka sa ibang universe, tayo na. 🪐", "Wala na, finish na. 🛣️"
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
    { msg: "I'll be so good to you! 💎", gif: "https://i.giphy.com/media/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Don't break my heart. 🔨", gif: "https://i.giphy.com/media/26gs6vWcJJ7m/giphy.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" },
    { msg: "You're the only one. 🌹", gif: "https://i.giphy.com/media/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Is that your final answer? 🧐", gif: "https://i.giphy.com/media/3o7TKMGm8Aun8A1v32/giphy.gif" },
    { msg: "I'll give you cuddles! 🧸", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Don't say no yet! 🛑", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Heart is loading... ⏳", gif: "https://i.giphy.com/media/Yycc82XEuWDaLLi2GV/giphy.gif" },
    { msg: "One more chance? 💌", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" },
    // TAGALOG START
    { msg: "Sure ka na ba talaga? 🥺", gif: "https://i.giphy.com/media/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Pag-isipan mo uli, please. 💕", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Sige na, wag ka nang tumanggi. 🥺", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" },
    { msg: "Wag mo namang gawin sa akin 'to! 😭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Malulungkot ako nang sobra... 🥀", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Bawal na ang ayaw, ha? 💍", gif: "https://i.giphy.com/media/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Treat kita kahit saan! 🍕", gif: "https://i.giphy.com/media/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Promise, di ka magsisisi. 🤞", gif: "https://i.giphy.com/media/11pxf8LidG76XC/giphy.gif" },
    { msg: "Tingnan mo naman itong mukha ko. 😿", gif: "https://i.giphy.com/media/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Wag ganyan, Valentine's naman oh! 🌹", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" }
  ];

  const handleSendBack = (ans) => {
    const list = ans === 'yes' ? kiligQuotes : sadQuotes;
    const randomQuote = list[Math.floor(Math.random() * list.length)];
    const resParam = ans === 'yes' ? 'yes' : 'no';

    // This creates a link that Person B sends to Person A
    const replyLink = `${window.location.origin}?result=${resParam}&from=${encodeURIComponent(recipientName)}`;

    const message = ans === 'yes'
      ? `HEY! I have an answer for you... IT'S A YES! 💖✨\nCheck this out: ${replyLink}\n\n"${randomQuote}"`
      : `I have an answer... it's a no for now. 💔\nCheck here: ${replyLink}\n\n"${randomQuote}"`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name");
    const result = params.get("result");
    const from = params.get("from");

    if (result === "yes") {
      setIsSuccessMode(true);
      setRecipientName(from || "Someone");
      setQuote(kiligQuotes[Math.floor(Math.random() * 20)]);
      confetti({ particleCount: 200, spread: 100 });
    } else if (n) {
      setRecipientName(n);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {isSuccessMode ? (
          <div style={styles.success}>
            <h1 style={styles.title}>SUCCESS! 🎉💖</h1>
            <img src="https://i.giphy.com/media/MDJ9IbM3vuzY2qEqaS/giphy.gif" style={styles.gif} />
            <h2 style={{color: '#333'}}>{recipientName} SAID YES!</h2>
            <p style={styles.finalQuote}>"{quote}"</p>
            <p>Happy Valentine's Day! 🌹</p>
          </div>
        ) : !recipientName ? (
          !submitted ? (
            <>
              <h1 style={styles.title}>Valentine 2025 💌</h1>
              <img src="https://i.giphy.com/media/C1asB6XJjAnS0/giphy.gif" style={styles.gif} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Crush name..." style={styles.input} />
              <button onClick={() => {
                setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
                setSubmitted(true);
              }} style={styles.mainBtn}>Create Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Link Ready! 🚀</h2>
              <p style={{fontSize: '0.9rem', color: '#666'}}>Send this to {name}:</p>
              <div style={styles.linkBox}>
                <input readOnly value={magicLink} style={styles.linkInput} />
                <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
              </div>
              <p style={styles.instruction}>Once they answer, they'll send a reply back to you! 🐾</p>
            </>
          )
        ) : (
          <>
            <h1 style={styles.title}>{answered ? "YES! 🎉" : finalNo ? "💔" : `Hi ${recipientName}!`}</h1>
            <img src={currentGif} style={styles.gif} />
            <p style={styles.proposalText}>{answered ? "You made my day!" : finalNo ? "Maybe next time..." : "Will you be my Valentine? 💘"}</p>
            <p style={styles.quoteDisplay}>{quote}</p>

            {!answered && !finalNo ? (
              <div style={styles.btnGroup}>
                <button onClick={() => { setAnswered(true); setQuote(kiligQuotes[20]); confetti(); }} style={styles.yesBtn}>YES 💕</button>
                <button
                  onClick={() => {
                    const nc = noCount + 1;
                    setNoCount(nc);
                    if (nc >= 10) { setFinalNo(true); setQuote(sadQuotes[20]); }
                    else { setQuote(cuteNoMessages[nc].msg); setCurrentGif(cuteNoMessages[nc].gif); }
                  }}
                  style={{...styles.noBtn, transform: `scale(${Math.max(0.4, 1 - noCount*0.1)})` }}
                >NO</button>
              </div>
            ) : (
              <div style={styles.responseBox}>
                <p style={{fontSize: '0.8rem', marginBottom: '10px'}}>Step 2: Send this link back to them! 👇</p>
                <button onClick={() => handleSendBack(answered ? 'yes' : 'no')} style={styles.sendBackBtn}>
                  Send Answer Back 💌
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(to bottom, #ff9a9e, #fecfef)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: "35px", borderRadius: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", textAlign: "center", maxWidth: "400px", width: "90%" },
  title: { color: "#ff4d6d", fontSize: "2rem", marginBottom: "15px" },
  gif: { width: "100%", borderRadius: "20px", marginBottom: "15px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ffb6c1", marginBottom: "15px", boxSizing: 'border-box' },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", width: "100%", padding: "15px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  linkBox: { display: "flex", background: "#fdf0f2", padding: "10px", borderRadius: "10px", border: "1px dashed #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "0.7rem", overflow: 'hidden' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: 'pointer' },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "15px 40px", borderRadius: "10px", fontSize: "1.2rem", cursor: "pointer", fontWeight: 'bold' },
  noBtn: { background: "#f44336", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", marginLeft: "10px" },
  quoteDisplay: { color: "#ff4d6d", fontWeight: "bold", fontStyle: "italic", margin: "10px 0" },
  sendBackBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "15px", borderRadius: "50px", width: "100%", fontWeight: "bold", cursor: "pointer", boxShadow: '0 4px 10px rgba(255,77,109,0.3)' },
  instruction: { fontSize: '0.8rem', marginTop: '10px', color: '#888' },
  finalQuote: { fontSize: '1.2rem', color: '#ff4d6d', margin: '20px 0' }
};