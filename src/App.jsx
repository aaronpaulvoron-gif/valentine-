import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import confetti from "canvas-confetti";

/* 💖 Floating Heart Logic */
function createHeart() {
  const heart = document.createElement("div");
  heart.innerText = "💖";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = window.innerHeight + "px";
  heart.style.fontSize = Math.random() * 30 + 20 + "px";
  heart.style.zIndex = "999";
  heart.style.animation = "float 4s linear forwards";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

const style = document.head.appendChild(document.createElement("style"));
style.innerHTML = `@keyframes float { to { transform: translateY(-120vh) rotate(360deg); opacity: 0; } }`;

export default function App() {
  const [name, setName] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [answered, setAnswered] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [finalNo, setFinalNo] = useState(false);
  const [quote, setQuote] = useState("");
  const [currentGif, setCurrentGif] = useState("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif");

  const linkRef = useRef(null);

  const kiligQuotes = [
    "You just made my heart skip a beat! 😍", "I’m the luckiest person alive! 💖", "My heart is yours forever. 💍",
    "You're my favorite person! 🌎", "I can't stop smiling! 😊", "You are my sunshine. ☀️",
    "Kinikilig ako, sobra! 💓", "Ikaw lang talaga, promise. ✨", "Kahit kailan, ikaw lang ang pipiliin ko. 💞",
    "Salamat sa pag-'Yes', mahal ko! 🥂", "Gagawin ko ang lahat para mapasaya ka. 🌹", "Sa'yo lang tumitibay ang puso ko. 💌",
    "Everything is better with you. 🍬", "Ikaw ang pinakamagandang nangyari sa akin. 🏆", "Sumasayaw ang puso ko sa saya! 💃",
    "Falling for you all over again. 🍂", "Ikaw ang aking paboritong pahinga. 🗺️", "Mahal na mahal kita, higit pa sa inaakala mo. 🌙",
    "Kilig to the bones! 🧩", "Ikaw ang liwanag sa mundo ko. 💡", "I'm yours, bawal ang bawian! 🏷️",
    "You're my happily ever after. 📖", "I'm so into you. 🔥", "Ang tamis ng buhay kapag kasama ka. 🧁",
    "Pangarap lang kita dati, ngayon akin ka na. 🌠", "I found home in you. 🏠", "Ikaw ang tanging rason ng ngiti ko. ☝️",
    "Sabay tayong tatanda, ha? 👵👴", "I love you more than pizza! 🍕", "Today is the best day ever! 🎊"
  ];

  const sadQuotes = [
    "My heart is officially broken... 💔", "Crying in the corner. 😿", "Ice cream for one. 🍦",
    "Mission failed. 📉", "Ang sakit naman nito. 😭", "Next life, baka pwede na tayo? 🌌",
    "Love is a lie! 🥀", "Hello darkness, my old friend. 🌑", "Pati yung pusa, malungkot na rin. 🐈‍⬛",
    "Hanggang dito na lang ba tayo? 🎬", "Hindi ako umiiyak, napuwing lang. 🌧️", "Napagod na ang puso ko. 💤",
    "I guess hindi talaga ako ang para sa'yo. 🥀", "Heart: 0, Pain: 100. 🤒", "Dinurog mo ang puso ko. 👞",
    "Single life it is then. 🚶", "Buti pa yung halaman, kinakausap ako. 🪴", "Friendzone accepted, pero masakit pa rin. 🏳️",
    "Ouch... ba't ganun? 🩹", "My heart is a ghost town. 👻", "404 Feelings not found. 🚫",
    "I'll be okay (kahit hindi naman talaga). 🤥", "Nawawala na ako sa gitna ng dagat. 🌊", "Inasahan ko na 'to, pero masakit pa rin. 👓",
    "Baka sa ibang universe, tayo na. 🪐", "Masaya naman nung una, ba't ganito? 🎈", "Iiyak muna ako ng isang taon. 🗓️",
    "Makakahanap pa ba ako ng tulad mo? 🎤", "Paalam, aking mahal. 🕊️", "Wala na, finish na. 🛣️"
  ];

  const cuteNoMessages = [
    { msg: "Are you sure? 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/OPU6wUKARA8AU/giphy.gif" },
    { msg: "Sure ka na ba talaga? 💕", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/mlvseq9nOe4QXCLXdM/giphy.gif" },
    { msg: "Look at this face... 😿", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Pag-isipan mo namang mabuti... 😭", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o72F8t9TDi2xVnxOE/giphy.gif" },
    { msg: "Hala, ba't 'No' ang pinindot mo? 🐱", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/yFQ0ywscgobJKAAAAC/giphy.gif" },
    { msg: "Isang chance naman diyan! 💖", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/jpbnoe3UIa8TUBSO9X/giphy.gif" },
    { msg: "Parang awa mo na... 🥺", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/11pxf8LidG76XC/giphy.gif" },
    { msg: "Mababait naman ako, ah! 😇", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/8vQSQ3cNXuDGo/giphy.gif" },
    { msg: "Huwag mo akong iwan! 🚶‍♂️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/ph6ewybTID3uE/giphy.gif" },
    { msg: "Nagbibiro ka lang, 'di ba? 😅", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/1S6Nxq39XURK6iU2oH/giphy.gif" },
    { msg: "Piliin mo naman ako... 🤔", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/K976vN0Wf7WDe/giphy.gif" },
    { msg: "Sayang naman tayo! 👩‍❤️‍👨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/X3Yj4Xf6NMVfE/giphy.gif" },
    { msg: "May kulang ba sa akin? 💨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/6t8gK6uS3b3i/giphy.gif" },
    { msg: "Lahat gagawin ko para sa'yo! 🍽️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGm8Aun8A1v32/giphy.gif" },
    { msg: "Kahit isang 'Yes' lang? ☝️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vVzH2FxMo7NTq/giphy.gif" },
    { msg: "Treat kita ng milktea! 🍫", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Z7Xm7rI3S2yPe/giphy.gif" },
    { msg: "Ang puso ko... 💘", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/kEtmNqxYvBf8I/giphy.gif" },
    { msg: "Maling button yata napindot mo... 🧶", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/E8OyB7fmX9XSo/giphy.gif" },
    { msg: "Mahal kita, please! ♾️", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/XID67rLzH2v9m/giphy.gif" },
    { msg: "Tumingin ka sa mga mata ko... 👀", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" },
    { msg: "Bawiin mo na yung 'No'! 🔄", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/6lScd4x2D5Oko/giphy.gif" },
    { msg: "Loading ang love ko for you... ⏳", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/uSQUzM7u9uAnu/giphy.gif" },
    { msg: "Binabasag mo puso ko... 🔨", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/pWd3gD5uxp5Pa/giphy.gif" },
    { msg: "I'll be your pet! 🐶", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/1S6Nxq39XURK6iU2oH/giphy.gif" },
    { msg: "Please, sabihin mo nang 'Yes'! 📢", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/7SF5scqy2lld6/giphy.gif" },
    { msg: "Nakikiusap ako sa'yo! 🙏", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/TydZAWYL_TWP6/giphy.gif" },
    { msg: "Huwag mo akong paiyakin... 💦", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/AauJWfW8T7UAg/giphy.gif" },
    { msg: "Last chance para maging mabait! 🌈", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/fXnRObM88R76E/giphy.gif" },
    { msg: "Grabe naman ito... 😤", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif" },
    { msg: "Tama na ang 'No'! 🛑", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/Yycc82XEuWDaLLi2GV/giphy.gif" }
  ];

  function handleGenerateLink() {
    if (!name.trim()) return;
    setMagicLink(`${window.location.origin}?name=${encodeURIComponent(name.trim())}`);
    setSubmitted(true);
  }

  async function handleYes() {
    setAnswered(true);
    setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM3vuzY2qEqaS/giphy.gif");
    setQuote(kiligQuotes[Math.floor(Math.random() * kiligQuotes.length)]);
    try {
      await supabase.from("valentine_response2").insert([{
        name: recipientName, answered_yes: true, no_count: noCount, no_message: "YES! 💖"
      }]);
    } catch (e) { console.error(e); }
    const int = setInterval(createHeart, 150);
    setTimeout(() => clearInterval(int), 5000);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

  async function handleNo() {
    const newCount = noCount + 1;
    setNoCount(newCount);
    if (newCount >= 10) {
      setFinalNo(true);
      setQuote(sadQuotes[Math.floor(Math.random() * sadQuotes.length)]);
      setCurrentGif("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26gs6vWcJJ7m/giphy.gif");
    } else {
      const msgObj = cuteNoMessages[Math.floor(Math.random() * cuteNoMessages.length)];
      setQuote(msgObj.msg);
      setCurrentGif(msgObj.gif);
    }
    try {
      await supabase.from("valentine_response2").insert([{
        name: recipientName, answered_yes: false, no_count: newCount, no_message: "Said No"
      }]);
    } catch (e) { console.error(e); }
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
      {!recipientName && !submitted && (
        <div style={styles.card}>
          <h1 style={styles.title}>Valentine Proposal 💌</h1>
          <div style={styles.gifContainer}><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C1asB6XJjAnS0/giphy.gif" style={styles.gif} /></div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter their name..." style={styles.input} />
          <button onClick={handleGenerateLink} style={styles.mainBtn}>Create Magic Link ✨</button>
        </div>
      )}

      {submitted && !recipientName && (
        <div style={styles.card}>
          <h2 style={{color: '#ff4d6d'}}>Handa na ito! 😻</h2>
          <div style={styles.gifContainer}><img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG56YXo1Z3p6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6YXp6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/vFKqnCdLPNOKcAAC/giphy.gif" style={styles.gif} /></div>
          <p style={{color: '#666', fontSize: '14px'}}>Copy and send this to {name}:</p>
          <div style={styles.linkBox}>
            <input ref={linkRef} value={magicLink} readOnly style={styles.linkInput} />
            <button onClick={() => {navigator.clipboard.writeText(magicLink); alert("Naka-copy na! 🐾");}} style={styles.copyBtn}>Copy</button>
          </div>
        </div>
      )}

      {recipientName && !answered && !finalNo && (
        <div style={styles.card}>
          <h1 style={styles.big}>{recipientName}, will you be my Valentine? 💘</h1>
          <div style={styles.gifContainer}><img src={currentGif} style={styles.gif} /></div>
          <p style={styles.quote}>{quote || "I have a special question..."}</p>
          <div style={styles.buttons}>
            <button onClick={handleYes} style={styles.yes}>YES 💕</button>
            <button onClick={handleNo} style={{...styles.no, transform: `scale(${Math.max(0.4, 1 - noCount*0.08)})`}}>NO 💔</button>
          </div>
        </div>
      )}

      {(answered || finalNo) && (
        <div style={styles.card}>
          <h1 style={styles.big}>{answered ? `${recipientName} SAID YES! 🎉` : `${recipientName} Rejected... 😭`}</h1>
          <div style={styles.gifContainer}><img src={currentGif} style={styles.gif} /></div>
          <p style={styles.quote}>{quote}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", width: "100vw", background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" },
  card: { background: "rgba(255, 255, 255, 0.95)", padding: "35px", borderRadius: "30px", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "420px", width: "100%" },
  gifContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  gif: { width: "200px", height: "170px", objectFit: 'cover', borderRadius: "20px" },
  title: { fontSize: "1.7rem", color: "#ff4d6d", marginBottom: "20px" },
  big: { fontSize: "2rem", color: "#ff4d6d", marginBottom: "20px", lineHeight: '1.2' },
  input: { padding: "14px", width: "85%", borderRadius: "15px", border: "2px solid #ffb6c1", marginBottom: "20px", textAlign: 'center', outline: 'none' },
  mainBtn: { padding: "12px 30px", fontSize: "17px", borderRadius: "15px", border: "none", backgroundColor: "#ff4d6d", color: "white", cursor: "pointer", fontWeight: "bold" },
  linkBox: { background: "#fff5f7", padding: "10px", borderRadius: "15px", display: "flex", border: "2px dashed #ff4d6d", marginTop: "10px", alignItems: 'center' },
  linkInput: { border: "none", background: "transparent", color: "#ff4d6d", flex: 1, padding: "5px", fontSize: '13px', outline: 'none' },
  copyBtn: { padding: "8px 15px", borderRadius: "10px", backgroundColor: "#ff4d6d", color: "white", border: "none", cursor: "pointer" },
  buttons: { display: "flex", gap: "20px", justifyContent: "center", alignItems: "center", marginTop: "20px" },
  yes: { padding: "15px 40px", fontSize: "22px", borderRadius: "15px", backgroundColor: "#4caf50", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" },
  no: { padding: "10px 20px", fontSize: "16px", borderRadius: "10px", backgroundColor: "#6c757d", color: "white", border: "none", cursor: "pointer" },
  quote: { fontSize: "18px", color: "#ff4d6d", fontWeight: "bold", margin: "10px 0" }
};