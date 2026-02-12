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
  const [currentGif, setCurrentGif] = useState("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif");

  // --- mood-based gif sets ---
  const sadGifs = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/9Y5BbDSkSTiY8/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26gs6vWcJJ7m/giphy.gif"
  ];

  // --- 40 English + 10 Tagalog: KILIG (YES) ---
  const kiligQuotes = [
    "You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart. 💌", "Everything is sweeter with you. 🍬", "Luckiest person in the world! 🏆", "My heart is dancing! 💃", "Falling for you more. 🍂", "Greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "Missing puzzle piece. 🧩", "World is brighter. 💡", "I'm yours forever. 🏷️", "You're the melody to my song. 🎵", "Forever isn't long enough. ⏳", "You're my greatest blessing. 🙏", "I'm so lucky to have you. 🍀", "Peanut butter to my jelly. 🥜", "My heart is finally complete. 🧩", "You're my dream come true. 🌠", "I'll choose you every day. 🗓️", "Head over heels! 🤸", "You're my anchor. ⚓", "More than words can say. 🗣️", "My happy ending. 📖", "My soul found its match. 🔥", "You're my treasure. 💎", "I promise to cherish you. 🤝", "You're my everything. 🌌", "My world revolves around you. 🪐", "I found home in you. 🏠", "You're the best part of me. 🌟", "So proud to be yours. 🏆",
    "Kinikilig ako sobra! 💓", "Ikaw lang talaga ang pangarap ko. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari. 🥇", "Sumasayaw ang puso ko! 💃", "Ikaw ang aking paboritong pahinga. 🏠", "Mahal na mahal kita sobra. 🌙", "Bawal na ang bawian, akin ka na! 💍"
  ];

  // --- 40 English + 10 Tagalog: CONVINCING (The Pleading Phase) ---
  const convincingQuotes = [
    "Are you sure? 🥺", "Think again 💕", "Look at this face... 😿", "Please don't... 😭", "I'll be so sad... 🥀", "Don't do this to me! 💔", "I'll give you chocolate! 🍫", "Last chance to change your mind... ⏳", "Why so mean? 😿", "Pretty please with a cherry on top? 🥺", "I'll be a good partner, promise! 😇", "Just one 'Yes'? ☝️", "I'm crying inside. 💧", "Don't break my spirit. ✨", "I'll treat you like a queen/king. 👑", "We'd be so cute together! 🐣", "I'll write you poems! ✍️", "I'll cook for you! 🍳", "Don't send me to the friendzone. 🚧", "My heart is heavy. ⚓", "I'll give you all the cuddles! 🧸", "Please change your mind! 🙏", "You're the only one I want. 🌹", "My soul is sad now. ☁️", "I'll give you the world. 🌍", "Don't walk away. 🚶‍♂️", "My heart belongs to you. 🔐", "I'll protect you. 🛡️", "Please don't say no. 🥀", "Is that your final answer? 🧐", "I'm staring at your photo... 📸", "You're my only choice. 🎯", "Give us a chance? 🎲", "I'll never let you down. 🤝", "You make me better. 🌟", "I'm losing hope... 🕯️", "Think of the memories! 🎞️", "I'm your biggest fan. 📣", "Don't leave me hanging. 🧶", "You're my sunshine. ☀️",
    "Sure ka na ba talaga? 🥺", "Pag-isipan mo uli, please. 💕", "Sige na, wag ka nang tumanggi. 🥺", "Wag mo namang gawin sa akin 'to! 😭", "Malulungkot ako nang sobra... 🥀", "Bawal na ang ayaw, ha? 💍", "Treat kita kahit saan! 🍕", "Promise, di ka magsisisi. 🤞", "Tingnan mo naman itong mukha ko. 😿", "Wag ganyan, Valentine's naman oh! 🌹"
  ];

  // --- 40 English + 10 Tagalog: SAD (Final No Result) ---
  const sadQuotes = [
    "My heart just shattered into pieces. 💔", "I guess I'll just be alone forever. 😿", "Mission failed. Heart broken. 📉", "The silence is so loud. 🌑", "Why does it hurt so much? 😭", "Maybe in another universe. 🌌", "I'll just listen to sad songs now. 🎧", "Hello darkness, my old friend. 🌑", "Even the stars look sad tonight. ✨", "I guess I wasn't enough. 🥀", "Goodbye, my love. 🎬", "It's just rain on my face, I'm not crying. 🌧️", "My soul is just a little tired. 💤", "A table for one, please. 🍦", "Back to the single life. 🚶", "My heart is a ghost town. 👻", "Ouch... that really stung. 🩹", "I'll just talk to my plants. 🪴", "Friendzone accepted with a heavy heart. 🏳️", "I'll never forget you. 🗝️", "Wishing you the best, I guess. 🥀", "My heart feels like a lead weight. ⚓", "The light just went out. 🕯️", "Everything is grey now. 🌪️", "I'll be okay... eventually. 🩹", "Don't worry about me. 🥀", "I'll just keep my feelings to myself. 🤐", "A part of me left with you. 🧩", "I'll miss what we could have been. 🎞️", "It was a beautiful dream while it lasted. 🌠", "I hope he/she makes you happy. 😊", "I'll be in the background. 👤", "The end of my fairy tale. 📖", "Coldest winter of my life. ❄️", "My heart is on 'do not disturb'. 📵", "Just another sad story. 📝", "I'll survive. 🌵", "Empty spaces in my heart. 🕳️", "I'll just keep walking. 👟", "Signing off... ✌️",
    "Wasak na wasak ang puso ko. 💔", "Iiyak na lang ako sa tabi. 😿", "Sana hindi na lang ako nagtanong. 😭", "Ang sakit naman nito. 🥀", "Hanggang dito na lang ba tayo? 🎬", "Paalam, aking sinta. 🌹", "Bakit mo ako sinaktan nang ganito? 💔", "Mag-iisa na lang ako muli. 🚶", "Sana maging masaya ka sa kanya. 😊", "Salamat na lang sa lahat. 🥀"
  ];

  const handleResponse = async (isYes) => {
    // Secretly save to Supabase
    await supabase.from("valentine_response2").insert([
      { name: recipientName, answered_yes: isYes, no_count: noCount, no_message: isYes ? "YES!" : "Final No after pleading" }
    ]);

    const resultLink = `${window.location.origin}?result=${isYes ? 'yes' : 'no'}&from=${encodeURIComponent(recipientName)}`;
    setReplyLink(resultLink);

    if (isYes) {
      setAnswered(true);
      setQuote(kiligQuotes[Math.floor(Math.random() * kiligQuotes.length)]);
      setCurrentGif("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
      setFinalNo(true);
      setQuote(sadQuotes[Math.floor(Math.random() * sadQuotes.length)]);
      setCurrentGif("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/AauJW0fL3p9E4/giphy.gif");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    const n = params.get("name");
    const from = params.get("from");

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
            <h1 style={styles.title}>MY VALENTINE! 🏆💖</h1>
            <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/ICOgUN76vCifu/giphy.gif" style={styles.gif} />
            <h2 style={{color: '#333'}}>{recipientName} SAID YES!</h2>
            <p style={styles.finalQuote}>"Our journey starts here."</p>
          </div>
        ) : !recipientName ? (
          !submitted ? (
            <>
              <h1 style={styles.title}>Valentine 2026 💌</h1>
              <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif" style={styles.gif} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Crush's Name..." style={styles.input} />
              <button onClick={() => {
                setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
                setSubmitted(true);
              }} style={styles.mainBtn}>Get Proposal Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Send This! 🚀</h2>
              <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/m6OAdJ5T1kK3F8L3rS/giphy.gif" style={styles.gif} />
              <div style={styles.linkBox}>
                <input readOnly value={magicLink} style={styles.linkInput} />
                <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
              </div>
              <p style={styles.waitMsg}>Now wait for them to send the result back! ⏳</p>
            </>
          )
        ) : (
          <>
            <h1 style={styles.title}>{answered ? "YES! 🎉" : finalNo ? "Recorded 💔" : `Hi ${recipientName}!`}</h1>
            <img src={currentGif} style={styles.gif} />

            {!answered && !finalNo ? (
              <>
                <p style={styles.proposalText}>Will you be my Valentine? 💘</p>
                <p style={styles.quoteDisplay}>{quote || "I have a special question..."}</p>
                <div style={styles.btnGroup}>
                  <button onClick={() => handleResponse(true)} style={styles.yesBtn}>YES 💕</button>
                  <button
                    onClick={() => {
                      if (noCount < 10) {
                        setNoCount(noCount + 1);
                        setQuote(convincingQuotes[noCount % convincingQuotes.length]);
                        setCurrentGif(sadGifs[noCount % sadGifs.length]);
                      } else {
                        handleResponse(false);
                      }
                    }}
                    style={{...styles.noBtn, transform: `scale(${Math.max(0.3, 1 - noCount*0.07)})` }}
                  >NO</button>
                </div>
                <p style={styles.clickHint}>{10 - noCount > 0 ? `(Pleading Level: ${noCount}/10)` : "You can say No now if you must... 🥀"}</p>
              </>
            ) : (
              <div style={styles.responseBox}>
                <p style={styles.stepTitle}>Step 2: Copy & Send Back!</p>
                <div style={styles.linkBox}>
                  <input readOnly value={replyLink} style={styles.linkInput} />
                  <button onClick={() => {navigator.clipboard.writeText(replyLink); alert("Reply Copied! 🐾");}} style={styles.copyBtn}>Copy Reply</button>
                </div>
                <p style={styles.finalResultQuote}>"{quote}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", overflow: 'hidden' },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: "30px", borderRadius: "35px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", textAlign: "center", maxWidth: "400px", width: "85%", border: '2px solid white' },
  title: { color: "#ff4d6d", fontSize: "1.6rem", fontWeight: 'bold', marginBottom: '10px' },
  gif: { width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "20px", marginBottom: "15px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ffb6c1", marginBottom: "15px", boxSizing: 'border-box' },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", width: "100%", padding: "14px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  linkBox: { display: "flex", background: "#fdf0f2", padding: "10px", borderRadius: "10px", border: "1px dashed #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "0.7rem", color: '#ff4d6d', outline: 'none' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "5px 10px", borderRadius: "8px", cursor: 'pointer', fontSize: '0.8rem' },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "12px 35px", borderRadius: "15px", fontSize: "1.2rem", cursor: "pointer", fontWeight: 'bold' },
  noBtn: { background: "#f44336", color: "white", border: "none", padding: "8px 18px", borderRadius: "15px", cursor: "pointer", marginLeft: "10px" },
  quoteDisplay: { color: "#ff4d6d", fontStyle: "italic", margin: "10px 0", fontSize: '0.9rem', minHeight: '30px' },
  waitMsg: { fontSize: '0.7rem', color: '#666', marginTop: '10px' },
  clickHint: { fontSize: '0.6rem', color: '#aaa', marginTop: '10px' },
  finalResultQuote: { fontSize: '0.9rem', color: '#ff4d6d', marginTop: '15px', fontWeight: 'bold' },
  stepTitle: { fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' },
  proposalText: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }
};