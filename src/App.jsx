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

  // --- FULL 20 ENGLISH + 10 TAGALOG KILIG QUOTES ---
  const kiligQuotes = [
    "You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart, always. 💌", "Everything is sweeter with you. 🍬", "I'm the luckiest person in the world! 🏆", "My heart is dancing with joy! 💃", "I'm falling for you more every second. 🍂", "You are my greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "You are my missing puzzle piece. 🧩", "The world is brighter with you in it. 💡", "I'm yours forever and ever. 🏷️",
    "Kinikilig ako sobra, hindi ko mapigilan! 💓", "Ikaw lang talaga ang pangarap ko, promise. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari sa akin. 🥇", "Sumasayaw ang puso ko sa sobrang saya! 💃", "Ikaw ang aking paboritong pahinga at tahanan. 🏠", "Mahal na mahal kita, higit pa sa inaakala mo. 🌙", "Bawal na ang bawian, akin ka na talaga! 💍"
  ];

  // --- FULL 20 ENGLISH + 10 TAGALOG SAD QUOTES ---
  const sadQuotes = [
    "My heart just shattered. 💔", "I'll be crying in the corner. 😿", "Table for one, please. 🍦", "Mission failed, heart broken. 📉", "Why does love hurt like this? 😭", "Maybe in another lifetime. 🌌", "Love feels like a sad song. 🥀", "Hello darkness, my old friend. 🌑", "Even my cat is sad for me. 🐈‍⬛", "Is this how the story ends? 🎬", "It's just rain on my face. 🌧️", "My soul is just a little tired. 💤", "I guess I'm not the one. 🥀", "Pain level: 100/100. 🤒", "You stepped on my heart. 👞", "Back to the single life. 🚶", "I'll just talk to my plants. 🪴", "Friendzone accepted. 🏳️", "Ouch... that really stung. 🩹", "My heart is a ghost town. 👻",
    "Ang sakit naman nito, sobra. 😭", "Hindi ako umiiyak, napuwing lang. 🌧️", "Napagod na ang puso ko sa kakahintay. 💤", "I guess hindi talaga ako para sa'yo. ✨", "Dinurog mo ang puso ko. 👞", "Buti pa yung halaman, nakikinig. 🪴", "Ouch... ba't ganun ang ending natin? 🩹", "Nawawala na ako sa sobrang lungkot. 🌊", "Baka sa ibang universe, tayo na. 🪐", "Wala na, finish na talaga. 🛣️"
  ];

  // --- FULL 20 ENGLISH + 10 TAGALOG CUTE NO MESSAGES ---
  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/media/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Think again 💕", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/media/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Please don't... 😭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "I'll be so sad... 🥀", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "I'll give you chocolate! 🍫", gif: "https://i.giphy.com/media/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "I'll be a good dog! 🐕", gif: "https://i.giphy.com/media/11pxf8LidG76XC/giphy.gif" },
    { msg: "Is that your final answer? 🧐", gif: "https://i.giphy.com/media/3o7TKMGm8Aun8A1v32/giphy.gif" },
    { msg: "You're breaking my heart! 🔨", gif: "https://i.giphy.com/media/26gs6vWcJJ7m/giphy.gif" },
    { msg: "Change your mind! ✨", gif: "https://i.giphy.com/media/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Last chance... ⏳", gif: "https://i.giphy.com/media/Yycc82XEuWDaLLi2GV/giphy.gif" },
    { msg: "Why so mean? 😿", gif: "https://i.giphy.com/media/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "I'll wait forever. 🕒", gif: "https://i.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/media/N67vK9L8FIBP2/giphy.gif" },
    { msg: "My heart is crying. 🌧️", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Think uli! 💭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Sure ka na ba talaga? 🥺", gif: "https://i.giphy.com/media/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Pag-isipan mo uli, please. 💕", gif: "https://i.giphy.com/media/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Wag mo namang gawin sa akin 'to! 😭", gif: "https://i.giphy.com/media/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Malulungkot ako nang sobra... 🥀", gif: "https://i.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" }
  ];

  // --- SENDER LISTENER + BACKUP POLLING ---
  useEffect(() => {
    if (!submitted || !name) return;
    const checkDb = async () => {
      const { data } = await supabase.from("valentine_response2").select("*").eq("name", name.trim()).order("created_at", { ascending: false }).limit(1);
      if (data?.[0]?.answered_yes || data?.[0]?.no_message === "Final No") {
        if (senderCountdown === null && !answered && !finalNo) setSenderCountdown(5);
      }
    };
    const channel = supabase.channel('room1').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'valentine_response2' }, (payload) => {
      if (payload.new.name.trim().toLowerCase() === name.trim().toLowerCase()) setSenderCountdown(5);
    }).subscribe();
    const interval = setInterval(checkDb, 2000);
    return () => { supabase.removeChannel(channel); clearInterval(interval); };
  }, [submitted, name]);

  // --- COUNTDOWN REVEAL ---
  useEffect(() => {
    if (senderCountdown === 0) {
      supabase.from("valentine_response2").select("*").eq("name", name.trim()).order("created_at", { ascending: false }).limit(1).then(({ data }) => {
        if (data?.[0]?.answered_yes) {
          setAnswered(true); setQuote(kiligQuotes[Math.floor(Math.random() * 20)]); confetti();
        } else {
          setFinalNo(true); setQuote(sadQuotes[Math.floor(Math.random() * 20)]);
        }
        setSenderCountdown(null);
      });
    }
    if (senderCountdown === null) return;
    const t = setTimeout(() => setSenderCountdown(senderCountdown - 1), 1000);
    return () => clearTimeout(t);
  }, [senderCountdown]);

  const handleGenerateLink = () => {
    if (!name.trim()) return;
    setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
    setSubmitted(true);
    setStatus(`Waiting for ${name.trim()}... 👀`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!recipientName ? (
          !submitted ? (
            <>
              <h1>Valentine 💌</h1>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Crush name..." style={styles.input}/>
              <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Link ✨</button>
            </>
          ) : (
            <>
              <h2>{senderCountdown !== null ? "REVEALING..." : "Waiting..."}</h2>
              <p>{status}</p>
              {senderCountdown !== null && <div style={styles.countdown}>{senderCountdown}</div>}
              {!answered && !finalNo && senderCountdown === null && (
                <div style={styles.linkBox}>
                  <input readOnly value={magicLink} style={styles.linkInput}/>
                  <button onClick={()=>{navigator.clipboard.writeText(magicLink); alert("Copied! 🐾")}}>Copy</button>
                </div>
              )}
              {answered && <h1>YES! 🎉💖</h1>}
              {finalNo && <h1>💔</h1>}
            </>
          )
        ) : (
          <>
            <h1>{recipientName}, be mine? 💘</h1>
            <img src={currentGif} style={styles.gif}/>
            <p>{quote}</p>
            {!answered && !finalNo && (
              <div style={styles.btnGroup}>
                <button onClick={async ()=>{setAnswered(true); confetti(); await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES!" }]);}} style={styles.yesBtn}>YES 💕</button>
                <button onClick={async ()=>{
                  const newC = noCount + 1; setNoCount(newC);
                  if (newC >= 10) { setFinalNo(true); await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: false, no_count: newC, no_message: "Final No" }]); }
                  else { const m = cuteNoMessages[newC % cuteNoMessages.length]; setQuote(m.msg); setCurrentGif(m.gif); await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: false, no_count: newC, no_message: "No Click" }]); }
                }} style={{...styles.noBtn, transform: `scale(${Math.max(0.4, 1 - noCount*0.1)})`}}>NO</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fbc2eb", fontFamily: "sans-serif" },
  card: { background: "white", padding: "30px", borderRadius: "20px", textAlign: "center", width: "350px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  input: { padding: "10px", width: "80%", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" },
  mainBtn: { background: "#ff4d6d", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" },
  yesBtn: { background: "#4caf50", color: "white", border: "none", padding: "10px 25px", borderRadius: "10px", cursor: "pointer", fontSize: "18px" },
  noBtn: { background: "#6c757d", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", marginLeft: "10px" },
  gif: { width: "100%", borderRadius: "10px", marginBottom: "10px" },
  countdown: { fontSize: "4rem", color: "#ff4d6d", fontWeight: "bold" },
  linkBox: { display: "flex", background: "#eee", padding: "5px", borderRadius: "5px" },
  linkInput: { border: "none", background: "transparent", flex: 1, fontSize: "10px" }
};