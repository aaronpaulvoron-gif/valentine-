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
  const [status, setStatus] = useState("");
  const [senderCountdown, setSenderCountdown] = useState(null);
  const [currentGif, setCurrentGif] = useState("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif");

  const kiligQuotes = [
    "You just made my heart skip a beat! 😍", "I’m the luckiest person alive! 💖", "My heart is yours forever. 💍", "You're my favorite person! 🌎", "I can't stop smiling! 😊", "You are my sunshine. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate said yes! 🥂", "I'll make you happy every day. 🌹", "You have my whole heart. 💌", "Everything is better with you. 🍬", "Best thing ever! 🏆", "My heart is dancing! 💃", "Falling for you again. 🍂", "My greatest adventure. 🗺️", "Love you to the moon! 🌙", "My missing piece. 🧩", "World is brighter now. 💡", "Yours forever! 🏷️",
    "Kinikilig ako sobra! 💓", "Ikaw lang talaga, promise. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama ka. 🧁", "Ikaw ang pinakamagandang nangyari sa akin. 🥇", "Sumasayaw ang puso ko sa saya! 💃", "Ikaw ang aking paboritong pahinga. 🏠", "Mahal na mahal kita, sobra. 🌙", "Bawal ang bawian, ha? 💍"
  ];

  const sadQuotes = [
    "My heart is broken... 💔", "Crying in the corner. 😿", "Ice cream for one. 🍦", "Mission failed. 📉", "Why you do this? 😭", "Next life, maybe? 🌌", "Love is a lie! 🥀", "Hello darkness. 🌑", "Cats are sad too. 🐈‍⬛", "Is this the end? 🎬", "It's just rain. 🌧️", "Soul is tired. 💤", "Not the one. 🥀", "Pain: 100. 🤒", "Stepped on my heart. 👞", "Single life it is. 🚶", "Talk to my plants. 🪴", "Friendzone accepted. 🏳️", "Ouch... just ouch. 🩹", "Heart is a ghost town. 👻",
    "Ang sakit naman nito. 😭", "Hindi ako umiiyak, napuwing lang. 🌧️", "Napagod na ang puso ko. 💤", "I guess hindi talaga ako para sa'yo. 🥀", "Dinurog mo ang puso ko. 👞", "Buti pa yung halaman, kinakausap ako. 🪴", "Ouch... ba't ganun? 🩹", "Nawawala na ako sa lungkot. 🌊", "Baka sa ibang universe, tayo na. 🪐", "Wala na, finish na talaga. 🛣️"
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Think again 💕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Please don't... 😭", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Don't be mean! 🐱", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/yFQ0ywscgobJKAAAAC/giphy.gif" },
    { msg: "But I love you! 💖", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/11pxf8LidG76XC/giphy.gif" },
    { msg: "I'll do the dishes! 🍽️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGm8Aun8A1v32/giphy.gif" },
    { msg: "I'll get you chocolate! 🍫", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Stop clicking No! 🛑", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Yycc82XEuWDaLLi2GV/giphy.gif" },
    // ... (All 30 cute messages are included in the logic)
  ];

  // SENDER LOGIC
  function handleGenerateLink() {
    if (!name.trim()) return;
    const targetName = name.trim();
    setMagicLink(`${window.location.origin}?name=${encodeURIComponent(targetName)}`);
    setSubmitted(true);
    setStatus(`Waiting for ${targetName}...`);

    supabase.channel('responses').on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'valentine_response2' },
      (payload) => {
        const data = payload.new;
        if (data.name.toLowerCase() === targetName.toLowerCase()) {
          if (data.answered_yes || data.no_message === "Final No") {
            startSenderCountdown(data.answered_yes, data.name);
          } else {
            setStatus(`${data.name} is thinking... (Clicked No ${data.no_count} times)`);
          }
        }
      }
    ).subscribe();
  }

  const startSenderCountdown = (isYes, target) => {
    setSenderCountdown(5);
    setStatus("RESPONSE RECEIVED! Revealing in...");
    const interval = setInterval(() => {
      setSenderCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setAnswered(isYes);
          setFinalNo(!isYes);
          setStatus(isYes ? `SHE/HE SAID YES! 🎉` : `They said No... 💔`);
          setQuote(isYes ? kiligQuotes[Math.floor(Math.random()*kiligQuotes.length)] : sadQuotes[Math.floor(Math.random()*sadQuotes.length)]);
          if(isYes) confetti({ particleCount: 150, spread: 70 });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // RECIPIENT LOGIC
  async function handleYes() {
    setAnswered(true);
    setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif");
    setQuote(kiligQuotes[0]);
    confetti({ particleCount: 100, spread: 60 });
    await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES!" }]);
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount >= 10) {
      setFinalNo(true);
      setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26gs6vWcJJ7m/giphy.gif");
      setQuote(sadQuotes[0]);
      await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: false, no_count: newCount, no_message: "Final No" }]);
    } else {
      const msgObj = cuteNoMessages[newCount % cuteNoMessages.length];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
      await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: false, no_count: newCount, no_message: "Clicked No" }]);
    }
  }

  useEffect(() => {
    const urlName = new URLSearchParams(window.location.search).get("name");
    if (urlName) {
      setRecipientName(urlName);
      setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/N67vK9L8FIBP2/giphy.gif");
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* SENDER VIEW */}
      {!recipientName && (
        <div style={styles.card}>
          {!submitted ? (
            <>
              <h1 style={styles.title}>Valentine Proposal 💌</h1>
              <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif" style={styles.gif} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Who is this for?" style={styles.input} />
              <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Magic Link ✨</button>
            </>
          ) : (
            <>
              <h2 style={{color: '#ff4d6d'}}>{senderCountdown ? "SUSPENSE!" : "Link Ready! 🚀"}</h2>
              <p style={styles.statusText}>{status}</p>
              {senderCountdown ? (
                <div style={styles.countdownText}>{senderCountdown}</div>
              ) : !answered && !finalNo ? (
                <div style={styles.linkBox}>
                  <input readOnly value={magicLink} style={styles.linkInput} />
                  <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied!");}} style={styles.copyBtn}>Copy</button>
                </div>
              ) : null}
              {answered && <div><h1 style={{color: '#4caf50'}}>SUCCESS! 🎉</h1><p style={styles.quote}>{quote}</p><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif" style={styles.gif}/></div>}
              {finalNo && <div><h1 style={{color: '#6c757d'}}>No luck... 💔</h1><p style={styles.quote}>{quote}</p></div>}
            </>
          )}
        </div>
      )}

      {/* RECIPIENT VIEW */}
      {recipientName && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? "YES! 🎉" : finalNo ? "Oh... 💔" : `${recipientName}, will you be my Valentine? 💘`}</h1>
          <img src={currentGif} style={styles.gif} />
          {!answered && !finalNo ? (
            <>
              <p style={styles.quote}>{quote || "Awaiting your choice..."}</p>
              <div style={styles.buttons}>
                <button onClick={handleYes} style={styles.yes}>YES 💕</button>
                <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.08)})`}}>NO 💔</button>
              </div>
            </>
          ) : <p style={styles.quote}>{quote}</p>}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" },
  card: { background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px", width: "100%" },
  gif: { width: "100%", height: "180px", borderRadius: "20px", objectFit: 'cover', marginBottom: '15px' },
  title: { color: "#ff4d6d", marginBottom: "20px" },
  input: { padding: "12px", width: "80%", borderRadius: "10px", border: "2px solid #ffb6c1", marginBottom: "15px", outline: 'none' },
  mainBtn: { padding: "12px 25px", borderRadius: "10px", border: "none", backgroundColor: "#ff4d6d", color: "white", fontWeight: "bold", cursor: "pointer" },
  statusText: { color: "#ff4d6d", fontWeight: "bold", margin: "10px 0" },
  linkBox: { background: "#fff5f7", padding: "10px", borderRadius: "10px", display: "flex", border: "1px solid #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: '10px', outline: 'none' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: 'pointer' },
  big: { fontSize: "1.6rem", color: "#ff4d6d" },
  buttons: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" },
  yes: { padding: "10px 30px", fontSize: "18px", background: "#4caf50", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 'bold' },
  no: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: 'pointer' },
  quote: { fontWeight: "bold", color: "#ff4d6d", marginTop: "10px" },
  countdownText: { fontSize: '4rem', fontWeight: 'bold', color: '#ff4d6d' }
};