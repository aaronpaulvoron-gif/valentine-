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

  // --- 20 ENGLISH + 10 TAGALOG KILIG ---
  const kiligQuotes = [
    "You're my favorite notification. 😍", "My heart is doing flips! 💖", "Life is better with you by my side. 💍", "You're the person I've been waiting for. 🌎", "I can't stop smiling because of you. 😊", "You are my sunshine on a rainy day. ☀️", "Is this a dream? Don't wake me up. ✨", "You + Me = Forever. 💞", "My soulmate finally said yes! 🥂", "I'll make you happy every single day. 🌹", "You have my whole heart, always. 💌", "Everything is sweeter with you. 🍬", "I'm the luckiest person in the world! 🏆", "My heart is dancing with joy! 💃", "I'm falling for you more every second. 🍂", "You are my greatest adventure. 🗺️", "I love you to the moon and back! 🌙", "You are my missing puzzle piece. 🧩", "The world is brighter with you in it. 💡", "I'm yours forever and ever. 🏷️",
    "Kinikilig ako sobra, hindi ko mapigilan! 💓", "Ikaw lang talaga ang pangarap ko, promise. 🤞", "Sa'yo lang tumitibay ang puso ko. 💌", "Pangarap lang kita dati, ngayon akin ka na. 🌠", "Ang tamis ng buhay kapag kasama kita. 🧁", "Ikaw ang pinakamagandang nangyari sa akin. 🥇", "Sumasayaw ang puso ko sa sobrang saya! 💃", "Ikaw ang aking paboritong pahinga at tahanan. 🏠", "Mahal na mahal kita, higit pa sa inaakala mo. 🌙", "Bawal na ang bawian, akin ka na talaga! 💍"
  ];

  // --- 20 ENGLISH + 10 TAGALOG SAD ---
  const sadQuotes = [
    "My heart just shattered. 💔", "I'll be crying in the corner. 😿", "Table for one, please. 🍦", "Mission failed, heart broken. 📉", "Why does love hurt like this? 😭", "Maybe in another lifetime. 🌌", "Love feels like a sad song. 🥀", "Hello darkness, my old friend. 🌑", "Even my cat is sad for me. 🐈‍⬛", "Is this how the story ends? 🎬", "It's just rain on my face. 🌧️", "My soul is just a little tired. 💤", "I guess I'm not the one. 🥀", "Pain level: 100/100. 🤒", "You stepped on my heart. 👞", "Back to the single life. 🚶", "I'll just talk to my plants. 🪴", "Friendzone accepted. 🏳️", "Ouch... that really stung. 🩹", "My heart is a ghost town. 👻",
    "Ang sakit naman nito, sobra. 😭", "Hindi ako umiiyak, napuwing lang. 🌧️", "Napagod na ang puso ko sa kakahintay. 💤", "I guess hindi talaga ako para sa'yo. ✨", "Dinurog mo ang puso ko. 👞", "Buti pa yung halaman, nakikinig. 🪴", "Ouch... ba't ganun ang ending natin? 🩹", "Nawawala na ako sa sobrang lungkot. 🌊", "Baka sa ibang universe, tayo na. 🪐", "Wala na, finish na talaga. 🛣️"
  ];

  // --- 20 ENGLISH + 10 TAGALOG CUTE NO MESSAGES ---
  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Think again 💕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Please don't... 😭", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "I'll be so sad... 🥀", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Don't do this to me! 💔", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/BEob5qwFkSJ7G/giphy.gif" },
    { msg: "I'll give you chocolate! 🍫", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Is that your final answer? 🧐", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGm8Aun8A1v32/giphy.gif" },
    { msg: "You're breaking my heart! 🔨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26gs6vWcJJ7m/giphy.gif" },
    { msg: "I'll be a good dog! 🐕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/11pxf8LidG76XC/giphy.gif" },
    { msg: "Change your mind! ✨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Last chance... ⏳", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Yycc82XEuWDaLLi2GV/giphy.gif" },
    { msg: "Why so mean? 😿", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "I'll wait forever. 🕒", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { msg: "Pretty please? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/N67vK9L8FIBP2/giphy.gif" },
    { msg: "My heart is crying. 🌧️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Don't leave me hanging! 🎣", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Say yes instead! 🎈", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif" },
    { msg: "I'm your biggest fan! 📣", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/H7kfFDSPyrOXYY6InW/giphy.gif" },
    { msg: "I'll be very sad... 😞", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/7SF5scGB2AFrO/giphy.gif" },
    { msg: "Sure ka na ba talaga? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Pag-isipan mo uli, please. 💕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Tingnan mo naman itong mukha ko... 😿", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Wag mo namang gawin sa akin 'to! 😭", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Malulungkot ako nang sobra... 🥀", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/9Y5BbDSkSTiY8/giphy.gif" },
    { msg: "Bibigyan kita ng maraming chocolate! 🍫", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Maging mabuti akong partner, promise! 🐕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/11pxf8LidG76XC/giphy.gif" },
    { msg: "Baguhin mo na ang isip mo! ✨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Bawal na ang ayaw, ha? 💍", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Sige na, please? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/N67vK9L8FIBP2/giphy.gif" }
  ];

  // SENDER LOGIC
  function handleGenerateLink() {
    if (!name.trim()) return;
    const targetName = name.trim();
    setMagicLink(`${window.location.origin}?name=${encodeURIComponent(targetName)}`);
    setSubmitted(true);
    setStatus(`Waiting for ${targetName}... 👀`);

    supabase.channel('responses').on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'valentine_response2' },
      (payload) => {
        const data = payload.new;
        if (data.name.toLowerCase() === targetName.toLowerCase()) {
          if (data.answered_yes || data.no_message === "Final No") {
            setSenderCountdown(5);
            setStatus("RESPONSE RECEIVED! Revealing in...");
          } else {
            setStatus(`${data.name} is thinking... (Clicked No ${data.no_count} times)`);
          }
        }
      }
    ).subscribe();
  }

  // SENDER COUNTDOWN
  useEffect(() => {
    if (senderCountdown === null) return;
    if (senderCountdown === 0) {
      supabase.from("valentine_response2").select("*").eq("name", name).order("created_at", { ascending: false }).limit(1)
        .then(({ data }) => {
          if (data && data[0].answered_yes) {
            setAnswered(true);
            setStatus("YES! 🎉💖");
            setQuote(kiligQuotes[Math.floor(Math.random() * kiligQuotes.length)]);
            confetti({ particleCount: 150, spread: 70 });
          } else {
            setFinalNo(true);
            setStatus("No... 💔");
            setQuote(sadQuotes[Math.floor(Math.random() * sadQuotes.length)]);
          }
          setSenderCountdown(null);
        });
      return;
    }
    const timer = setTimeout(() => setSenderCountdown(senderCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [senderCountdown]);

  // RECIPIENT LOGIC
  async function handleYes() {
    setAnswered(true);
    setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif");
    setQuote(kiligQuotes[20]);
    confetti({ particleCount: 100, spread: 60 });
    await supabase.from("valentine_response2").insert([{ name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES!" }]);
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount >= 10) {
      setFinalNo(true);
      setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26gs6vWcJJ7m/giphy.gif");
      setQuote(sadQuotes[20]);
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
              <h2 style={{color: '#ff4d6d'}}>{senderCountdown !== null ? "WAIT FOR IT..." : "Link Ready! 🚀"}</h2>
              <p style={styles.statusText}>{status}</p>
              {senderCountdown !== null && <div style={styles.countdownText}>{senderCountdown}</div>}
              {senderCountdown === null && !answered && !finalNo && (
                <div style={styles.linkBox}>
                  <input readOnly value={magicLink} style={styles.linkInput} />
                  <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Copied to clipboard! 🐾");}} style={styles.copyBtn}>Copy</button>
                </div>
              )}
              {answered && <div><h1 style={{color: '#4caf50'}}>YES! 🎉</h1><p style={styles.quote}>{quote}</p><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif" style={styles.gif}/></div>}
              {finalNo && <div><h1 style={{color: '#6c757d'}}>No... 💔</h1><p style={styles.quote}>{quote}</p></div>}
            </>
          )}
        </div>
      )}

      {recipientName && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? "YES! 🎉" : finalNo ? "Oh... 💔" : `${recipientName}, will you be my Valentine? 💘`}</h1>
          <img src={currentGif} style={styles.gif} onError={(e) => e.target.src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHVxdXo5N3J6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/H7kfFDSPyrOXYY6InW/giphy.gif"} />
          {!answered && !finalNo ? (
            <>
              <p style={styles.quote}>{quote || "I have a special question..."}</p>
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
  card: { background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "420px", width: "100%" },
  gif: { width: "100%", height: "200px", borderRadius: "20px", objectFit: 'cover', marginBottom: '15px' },
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