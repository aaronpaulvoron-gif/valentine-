import { useState, useEffect, useRef } from "react";
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
  const [status, setStatus] = useState("Waiting for her response... 👀");
  const [currentGif, setCurrentGif] = useState("https://i.giphy.com/C1asB6XJjAnS0.gif");

  const linkRef = useRef(null);

  const kiligQuotes = [
    "You just made my heart skip a beat! 😍",
    "I’m the luckiest person alive! 💖",
    "My heart is yours forever. 💍",
    "You're my favorite person! 🌎",
    "I can't stop smiling! 😊",
    "You are my sunshine. ☀️",
    "Is this a dream? ✨",
    "You + Me = Forever. 💞",
    "My soulmate said yes! 🥂",
    "I'll make you happy every day. 🌹",
    "You have my whole heart. 💌",
    "Everything is better with you. 🍬",
    "Best thing ever! 🏆",
    "My heart is dancing! 💃",
    "Falling for you again. 🍂",
    "My greatest adventure. 🗺️",
    "Love you to the moon! 🌙",
    "My missing piece. 🧩",
    "World is brighter now. 💡",
    "Yours forever! 🏷️",
    "Kinikilig ako sobra! 💓",
    "Ikaw lang talaga, promise. 🤞",
    "Sa'yo lang tumitibay ang puso ko. 💌",
    "Pangarap lang kita dati, ngayon akin ka na. 🌠",
    "Ang tamis ng buhay kapag kasama ka. 🧁",
    "Ikaw ang pinakamagandang nangyari sa akin. 🥇",
    "Sumasayaw ang puso ko sa saya! 💃",
    "Ikaw ang aking paboritong pahinga. 🏠",
    "Mahal na mahal kita, sobra. 🌙",
    "Bawal ang bawian, ha? 💍"
  ];

  const sadQuotes = [
    "My heart is broken... 💔",
    "Crying in the corner. 😿",
    "Ice cream for one. 🍦",
    "Mission failed. 📉",
    "Why you do this? 😭",
    "Next life, maybe? 🌌",
    "Love is a lie! 🥀",
    "Hello darkness. 🌑",
    "Cats are sad too. 🐈‍⬛",
    "Is this the end? 🎬",
    "It's just rain. 🌧️",
    "Soul is tired. 💤",
    "Not the one. 🥀",
    "Pain: 100. 🤒",
    "Stepped on my heart. 👞",
    "Single life it is. 🚶",
    "Talk to my plants. 🪴",
    "Friendzone accepted. 🏳️",
    "Ouch... just ouch. 🩹",
    "Heart is a ghost town. 👻",
    "Ang sakit naman nito. 😭",
    "Hindi ako umiiyak, napuwing lang. 🌧️",
    "Napagod na ang puso ko. 💤",
    "I guess hindi talaga ako para sa'yo. 🥀",
    "Dinurog mo ang puso ko. 👞",
    "Buti pa yung halaman, kinakausap ako. 🪴",
    "Ouch... ba't ganun? 🩹",
    "Nawawala na ako sa lungkot. 🌊",
    "Baka sa ibang universe, tayo na. 🪐",
    "Wala na, finish na talaga. 🛣️"
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/OPU6wUKARA8AU.gif" },
    { msg: "Think again 💕", gif: "https://i.giphy.com/mlvseq9nOe4QXCLXdM.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/vFKqnCdLPNOKcAAC.gif" },
    { msg: "Please don't... 😭", gif: "https://i.giphy.com/3o72F8t9TDi2xVnxOE.gif" },
    { msg: "Don't be mean! 🐱", gif: "https://i.giphy.com/yFQ0ywscgobJKAAAAC.gif" },
    { msg: "But I love you! 💖", gif: "https://i.giphy.com/jpbnoe3UIa8TUBSO9X.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/11pxf8LidG76XC.gif" },
    { msg: "I'll be so good! 😇", gif: "https://i.giphy.com/8vQSQ3cNXuDGo.gif" },
    { msg: "Don't go... 🚶‍♂️", gif: "https://i.giphy.com/ph6ewybTID3uE.gif" },
    { msg: "You're kidding, right? 😅", gif: "https://i.giphy.com/1S6Nxq39XURK6iU2oH.gif" },
    { msg: "Wait, think about it! 🤔", gif: "https://i.giphy.com/K976vN0Wf7WDe.gif" },
    { msg: "But we're so cute! 👩‍❤️‍👨", gif: "https://i.giphy.com/X3Yj4Xf6NMVfE.gif" },
    { msg: "Is it my breath? 💨", gif: "https://i.giphy.com/6t8gK6uS3b3i.gif" },
    { msg: "I'll do the dishes! 🍽️", gif: "https://i.giphy.com/3o7TKMGm8Aun8A1v32.gif" },
    { msg: "Just one chance? ☝️", gif: "https://i.giphy.com/vVzH2FxMo7NTq.gif" },
    { msg: "I'll get you chocolate! 🍫", gif: "https://i.giphy.com/Z7Xm7rI3S2yPe.gif" },
    { msg: "My heart... 💘", gif: "https://i.giphy.com/kEtmNqxYvBf8I.gif" },
    { msg: "Don't leave me hanging! 🧶", gif: "https://i.giphy.com/E8OyB7fmX9XSo.gif" },
    { msg: "I'll stay forever! ♾️", gif: "https://i.giphy.com/XID67rLzH2v9m.gif" },
    { msg: "Look into my eyes... 👀", gif: "https://i.giphy.com/vFKqnCdLPNOKcAAC.gif" },
    { msg: "Change your mind? 🔄", gif: "https://i.giphy.com/6lScd4x2D5Oko.gif" },
    { msg: "Heart is loading... ⏳", gif: "https://i.giphy.com/uSQUzM7u9uAnu.gif" },
    { msg: "You're breaking it! 🔨", gif: "https://i.giphy.com/pWd3gD5uxp5Pa.gif" },
    { msg: "I'll be your pet! 🐶", gif: "https://i.giphy.com/1S6Nxq39XURK6iU2oH.gif" },
    { msg: "Please, just say yes! 📢", gif: "https://i.giphy.com/7SF5scqy2lld6.gif" },
    { msg: "I'm begging you! 🙏", gif: "https://i.giphy.com/TydZAWYL_TWP6.gif" },
    { msg: "Don't make me cry... 💦", gif: "https://i.giphy.com/AauJWfW8T7UAg.gif" },
    { msg: "Last chance to be kind! 🌈", gif: "https://i.giphy.com/fXnRObM88R76E.gif" },
    { msg: "Oh come on! 😤", gif: "https://i.giphy.com/3o7TKVUn7iM8FMEU24.gif" },
    { msg: "Stop clicking No! 🛑", gif: "https://i.giphy.com/Yycc82XEuWDaLLi2GV.gif" }
  ];

  function handleGenerateLink() {
    if (!name.trim()) return;
    const targetName = name.trim();
    const generatedLink = `${window.location.origin}?name=${encodeURIComponent(targetName)}`;
    setMagicLink(generatedLink);
    setSubmitted(true);

    supabase
      .channel('responses')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'valentine_response2' },
        (payload) => {
          const newData = payload.new;
          if (newData.name.toLowerCase() === targetName.toLowerCase()) {
            if (newData.answered_yes) {
              setStatus(`OMG! ${newData.name} SAID YES! 🎉💖`);
              alert(`🚨 NOTIFICATION: ${newData.name} just said YES!`);
              confetti({ particleCount: 150, spread: 70 });
            } else {
              setStatus(`${newData.name} clicked NO... 🥺 (Attempt ${newData.no_count})`);
            }
          }
        }
      ).subscribe();
  }

  async function handleYes() {
    setAnswered(true);
    setCurrentGif("https://i.giphy.com/MDJ9IbM3vuzY2qEqaS.gif");
    setQuote(kiligQuotes[Math.floor(Math.random() * kiligQuotes.length)]);
    await supabase.from("valentine_response2").insert([{
      name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES! 💖"
    }]);
    confetti({ particleCount: 150, spread: 70 });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount >= 10) {
      setFinalNo(true);
      setQuote(sadQuotes[Math.floor(Math.random() * sadQuotes.length)]);
      setCurrentGif("https://i.giphy.com/26gs6vWcJJ7m.gif");
    } else {
      const msgObj = cuteNoMessages[Math.floor(Math.random() * cuteNoMessages.length)];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
    }
    await supabase.from("valentine_response2").insert([{
      name: recipientName, answered_yes: false, no_count: newCount, no_message: "Clicked No"
    }]);
  }

  useEffect(() => {
    const urlName = new URLSearchParams(window.location.search).get("name");
    if (urlName) {
      setRecipientName(urlName);
      setCurrentGif("https://i.giphy.com/N67vK9L8FIBP2.gif");
    }
  }, []);

  // ✅ GIF fallback handler
  const handleGifError = (e) => {
    e.target.src = ""; // remove broken image
    e.target.alt = "Content Not Available 😿";
    e.target.style.height = "180px";
    e.target.style.display = "flex";
    e.target.style.alignItems = "center";
    e.target.style.justifyContent = "center";
    e.target.style.background = "#f0f0f0";
    e.target.style.color = "#ff4d6d";
    e.target.style.fontWeight = "bold";
    e.target.style.fontSize = "14px";
    e.target.style.borderRadius = "20px";
    e.target.style.textAlign = "center";
  };

  return (
    <div style={styles.container}>
      {!recipientName && !submitted && (
        <div style={styles.card}>
          <h1 style={styles.title}>Valentine Proposal 💌</h1>
          <img src="https://i.giphy.com/C1asB6XJjAnS0.gif" onError={handleGifError} style={styles.gif} />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter crush name..." style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Magic Link ✨</button>
        </div>
      )}

      {submitted && !recipientName && (
        <div style={styles.card}>
          <h2 style={{color: '#ff4d6d'}}>Link Ready! 🚀</h2>
          <p style={styles.statusText}>{status}</p>
          <div style={styles.linkBox}>
            <input readOnly value={magicLink} style={styles.linkInput} />
            <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Link Copied! 🐾");}} style={styles.copyBtn}>Copy</button>
          </div>
          <p style={{fontSize: '11px', marginTop: '10px', color: '#888'}}>Don't close this tab to see the live result!</p>
        </div>
      )}

      {recipientName && !answered && !finalNo && (
        <div style={styles.card}>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <img src={currentGif} onError={handleGifError} style={styles.gif} />
          <p style={styles.quote}>{quote || "I have a special question..."}</p>
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.08)})`}}>NO 💔</button>
          </div>
        </div>
      )}

      {(answered || finalNo) && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? `SEE YOU SOON! 🎉` : `Rejected... 😭`}</h1>
          <img src={currentGif} onError={handleGifError} style={styles.gif} />
          <p style={styles.quote}>{quote}</p>
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
  statusText: { color: "#4caf50", fontWeight: "bold", margin: "10px 0" },
  linkBox: { background: "#fff5f7", padding: "10px", borderRadius: "10px", display: "flex", border: "1px solid #ff4d6d", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: '12px', outline: 'none' },
  copyBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: 'pointer' },
  big: { fontSize: "1.8rem", color: "#ff4d6d" },
  buttons: { display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" },
  yes: { padding: "10px 30px", fontSize: "18px", background: "#4caf50", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: 'bold' },
  no: { padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "10px", cursor: 'pointer' },
  quote: { fontWeight: "bold", color: "#ff4d6d", marginTop: "10px" }
};
