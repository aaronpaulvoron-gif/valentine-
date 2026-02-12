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
  const [isResultView, setIsResultView] = useState(false);
  const [resultStatus, setResultStatus] = useState("");
  const [replyLink, setReplyLink] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- EMOJI LOGIC ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      createParticle(e.clientX, e.clientY, ["✨", "💖", "🌸", "⭐"][Math.floor(Math.random() * 4)]);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const createParticle = (x, y, char) => {
    const el = document.createElement("div");
    el.innerText = char;
    el.style.position = "fixed";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.pointerEvents = "none";
    el.style.fontSize = "20px";
    el.style.animation = "fadeUp 1s forwards";
    el.style.zIndex = "9999";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  };

  const handleTyping = (e) => {
    setName(e.target.value);
    const rect = e.target.getBoundingClientRect();
    createParticle(rect.left + Math.random() * rect.width, rect.top, ["🎈", "💌", "🌈", "✨"][Math.floor(Math.random() * 4)]);
  };

  // --- 150 QUOTES (STRICTLY THE SAME) ---
  const kiligQuotes = ["You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart. 💌", "Everything is sweeter with you. 🍬", "Luckiest person in the world! 🏆", "My heart is dancing! 💃", "Falling for you more. 🍂", "Greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "Missing puzzle piece. 🧩", "World is brighter. 💡", "I'm yours forever. 🏷️", "You're the melody to my song. 🎵", "Forever isn't long enough. ⏳", "You're my greatest blessing. 🙏", "I'm so lucky to have you. 🍀", "Peanut butter to my jelly. 🥜", "My heart is finally complete. 🧩", "You're my dream come true. 🌠", "I'll choose you every day. 🗓️", "Head over heels! 🤸", "You're my anchor. ⚓", "More than words can say. 🗣️", "My happy ending. 📖", "My soul found its match. 🔥", "You're my treasure. 💎", "I promise to cherish you. 🤝", "You're my everything. 🌌", "My world revolves around you. 🪐", "I found home in you. 🏠", "You're the best part of me. 🌟", "So proud to be yours. 🏆", "Kinikilig ako sobra! 💓", "Ikaw lang talaga ang pangarap ko. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari. 🥇", "Sumasayaw ang puso ko! 💃", "Ikaw ang aking paboritong pahinga. 🏠", "Mahal na mahal kita sobra. 🌙", "Bawal na ang bawian, akin ka na! 💍"];
  const convincingQuotes = ["Are you sure? 🥺", "Think again 💕", "Look at this face... 😿", "Please don't... 😭", "I'll be so sad... 🥀", "Don't do this to me! 💔", "I'll give you chocolate! 🍫", "Wait, stay here! ⏳", "Why so mean? 😿", "Pretty please? 🥺", "I'll be a good partner! 😇", "Just one 'Yes'? ☝️", "I'm crying inside. 💧", "Don't break my spirit. ✨", "I'll treat you like a queen. 👑", "We'd be so cute! 🐣", "I'll write you poems! ✍️", "I'll cook for you! 🍳", "Don't friendzone me. 🚧", "My heart is heavy. ⚓", "Cuddles forever? 🧸", "Please change your mind! 🔄", "You're my sunshine. ☀️", "My heart is shattered. 🔨", "Maybe a coffee date? ☕", "I'll give you the world. 🌍", "Don't walk away. 🚶‍♂️", "My heart is yours. 🔐", "I'll protect you. 🛡️", "You're my only choice. 🎯", "Is that final? 🧐", "I'm losing hope... 🕯️", "I'm staring at your pic. 📸", "You're the one. 🌹", "My soul is sad. ☁️", "I'll be your best friend too. 👫", "Think of the memories! 🎞️", "I'll never let you down. 🤝", "You make me better. 🌟", "Give me a chance? 🎲", "Sure ka na ba talaga? 🥺", "Pag-isipan mo uli, please. 💕", "Sige na, wag ka nang tumanggi. 🥺", "Wag mo namang gawin sa akin 'to! 😭", "Malulungkot ako nang sobra... 🥀", "Bawal na ang ayaw, ha? 💍", "Treat kita kahit saan! 🍕", "Promise, di ka magsisisi. 🤞", "Tingnan mo naman itong mukha ko. 😿", "Wag ganyan, Valentine's naman oh! 🌹"];
  const sadQuotes = ["My heart just shattered into pieces. 💔", "I guess I'll just be alone forever. 😿", "Mission failed. Heart broken. 📉", "The silence is so loud. 🌑", "Why does it hurt so much? 😭", "Maybe in another universe. 🌌", "I'll just listen to sad songs now. 🎧", "Hello darkness, my old friend. 🌑", "Even the stars look sad tonight. ✨", "I guess I wasn't enough. 🥀", "Goodbye, my love. 🎬", "It's just rain on my face. 🌧️", "My soul is tired. 💤", "A table for one, please. 🍦", "Back to the single life. 🚶", "My heart is a ghost town. 👻", "Ouch... that really stung. 🩹", "I'll just talk to my plants. 🪴", "Friendzone accepted. 🏳️", "I'll never forget you. 🗝️", "Wishing you the best. 🥀", "My heart feels like a lead weight. ⚓", "The light just went out. 🕯️", "Everything is grey now. 🌪️", "I'll be okay... eventually. 🩹", "Don't worry about me. 🥀", "I'll just keep my feelings inside. 🤐", "A part of me left with you. 🧩", "I'll miss what we could have been. 🎞️", "It was a beautiful dream. 🌠", "I hope you find happiness. 😊", "I'll be in the background. 👤", "The end of my fairy tale. 📖", "Coldest winter of my life. ❄️", "My heart is on 'do not disturb'. 📵", "Just another sad story. 📝", "I'll survive. 🌵", "Empty spaces in my heart. 🕳️", "I'll just keep walking. 👟", "Signing off... ✌️", "Wasak na wasak ang puso ko. 💔", "Iiyak na lang ako sa tabi. 😿", "Sana hindi na lang ako nagtanong. 😭", "Ang sakit naman nito. 🥀", "Hanggang dito na lang ba tayo? 🎬", "Paalam, aking sinta. 🌹", "Bakit mo ako sinaktan? 💔", "Mag-iisa na lang ako muli. 🚶", "Sana maging masaya ka. 😊", "Salamat na lang sa lahat. 🥀"];

  const handleResponse = async (isYes) => {
    const list = isYes ? kiligQuotes : sadQuotes;
    const finalQuote = list[Math.floor(Math.random() * list.length)];
    await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: isYes, no_count: noCount, no_message: isYes ? "YES!" : "Final No" }]);
    const resLink = `${window.location.origin}?view_result=true&status=${isYes ? 'yes' : 'no'}&from=${encodeURIComponent(recipientName)}`;
    setReplyLink(resLink);
    if (isYes) {
      setAnswered(true); setQuote(finalQuote);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    } else {
      setFinalNo(true); setQuote(finalQuote);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view_result")) {
      setIsResultView(true);
      setResultStatus(params.get("status"));
      setRecipientName(params.get("from"));
    } else if (params.get("name")) {
      setRecipientName(params.get("name"));
    }
  }, []);

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeUp { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-50px); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .yes-btn:hover { animation: pulse 0.6s infinite; background: #388e3c !important; }
        .no-btn:hover { transform: translate(2px, 2px); background: #c62828 !important; }
      `}</style>

      <div style={styles.card}>
        {isResultView ? (
          <div>
            <div style={styles.emojiHero}>{resultStatus === "yes" ? "🥰💍🎉" : "🥀🌑💔"}</div>
            <h1 style={styles.title}>{resultStatus === "yes" ? "SHE/HE SAID YES!" : "Answer Received"}</h1>
            <p style={styles.finalQuote}>"{quote}"</p>
            <button onClick={() => window.location.href = window.location.origin} style={styles.backBtn}>← Restart Magic</button>
          </div>
        ) : !recipientName ? (
          !submitted ? (
            <>
              <h1 style={styles.title}>Valentine 2026 💌</h1>
              <div style={styles.emojiHero}>✍️✨🧸</div>
              <input value={name} onInput={handleTyping} placeholder="Type name here..." style={styles.input} />
              <button onClick={() => {
                setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
                setSubmitted(true);
              }} style={styles.mainBtn}>Create Magical Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Ready to Send! 🚀</h2>
              <div style={styles.emojiHero}>🎁💝📫</div>
              <div style={styles.linkBox}>
                <input readOnly value={magicLink} style={styles.linkInput} />
                <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
              </div>
              <button onClick={() => setSubmitted(false)} style={styles.backBtn}>← Change Name</button>
            </>
          )
        ) : (
          <>
            <h1 style={styles.title}>{answered ? "Magic Sent! ✨" : finalNo ? "Sent 🥀" : `Hi ${recipientName}!`}</h1>
            <div style={styles.emojiHero}>{answered ? "💖🥂🌈" : finalNo ? "🌑🥀💨" : "💌❓👀"}</div>
            {!answered && !finalNo ? (
              <>
                <p style={styles.proposalText}>Will you be my Valentine? 💘</p>
                <p style={styles.quoteDisplay}>{quote || "A magical question awaits..."}</p>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleResponse(true)} className="yes-btn" style={styles.yesBtn}>YES 💕</button>
                  <button
                    onClick={() => {
                      if (noCount < 10) {
                        setNoCount(noCount + 1);
                        setQuote(convincingQuotes[noCount % convincingQuotes.length]);
                      } else { handleResponse(false); }
                    }}
                    className="no-btn"
                    style={{...styles.noBtn, transform: `scale(${Math.max(0.4, 1 - noCount*0.07)})` }}
                  >NO</button>
                </div>
              </>
            ) : (
              <div style={styles.responseBox}>
                <p style={styles.stepTitle}>Copy and send this back!</p>
                <div style={styles.linkBox}>
                  <input readOnly value={replyLink} style={styles.linkInput} />
                  <button onClick={() => {navigator.clipboard.writeText(replyLink); alert("Reply Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "#fff0f3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", overflow: 'hidden' },
  card: { background: "white", padding: "40px", borderRadius: "40px", boxShadow: "0 25px 70px rgba(255, 77, 109, 0.2)", textAlign: "center", maxWidth: "400px", width: "85%", animation: "float 4s ease-in-out infinite" },
  emojiHero: { fontSize: "60px", marginBottom: "20px" },
  title: { color: "#ff4d6d", fontSize: "1.8rem", fontWeight: 'bold' },
  input: { width: "100%", padding: "15px", borderRadius: "15px", border: "3px solid #ffb6c1", fontSize: "1rem", outline: "none", transition: "0.3s" },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", width: "100%", padding: "16px", borderRadius: "15px", fontWeight: "bold", cursor: "pointer", marginTop: "15px", fontSize: "1.1rem" },
  linkBox: { display: "flex", background: "#fff5f6", padding: "12px", borderRadius: "15px", border: "2px dashed #ff4d6d", marginTop: "20px" },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "0.75rem", color: '#ff4d6d' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: 'pointer' },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "15px 40px", borderRadius: "20px", fontSize: "1.3rem", cursor: "pointer", fontWeight: "bold", transition: "0.3s" },
  noBtn: { background: "#f44336", color: "white", border: "none", padding: "10px 25px", borderRadius: "20px", cursor: "pointer", marginLeft: "15px", transition: "0.3s" },
  quoteDisplay: { color: "#ff4d6d", fontStyle: "italic", margin: "20px 0", fontSize: '0.95rem' },
  backBtn: { background: "none", color: "#ff4d6d", border: "none", marginTop: "20px", cursor: 'pointer', textDecoration: 'underline' },
  proposalText: { fontSize: "1.2rem", fontWeight: "bold", color: "#333" }
};