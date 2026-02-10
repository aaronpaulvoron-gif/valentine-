import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/* -------------------- HEART PARTICLE EFFECT -------------------- */
function createHeart(x, y) {
  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.position = "fixed";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.fontSize = Math.random() * 50 + 10 + "px";
  heart.style.pointerEvents = "none";
  heart.style.opacity = 1;
  heart.style.transition = "all 1s linear";
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.style.transform = `translateY(-100px) scale(0)`;
    heart.style.opacity = 0;
  }, 0);
  setTimeout(() => heart.remove(), 1000);
}

export default function App() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yes, setYes] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🎤 Karaoke
  const lyrics = [
    "Basta’t isipin di magbabago damdamin ko sa’yo",
    "Araw-gabi",
    "Nasa isip ka",
    "Napapanagip ka",
    "Kahit san man magpunta",
    "Araw-gabi",
    "Nalalasing sa tuwa",
    "Kapag kapiling ka",
    "Araw-gabi tayong dalawa",
  ];
  const [currentLine, setCurrentLine] = useState(-1);

  const yesSize = 20 + noCount * 15;

  /* -------------------- LOCAL STORAGE -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("valentineData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setNoCount(parsed.noCount || 0);
      setYes(parsed.answeredYes || false);
      if (parsed.name) setStarted(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "valentineData",
      JSON.stringify({
        name,
        noCount,
        answeredYes: yes,
      })
    );
  }, [name, noCount, yes]);

  /* -------------------- SUPABASE ACTIONS -------------------- */
  async function saveResponse(answer, countOverride) {
    if (!name) return;

    const payload = {
      name,
      no_count: countOverride ?? noCount,
      answered_yes: answer === "yes",
    };

    try {
      const { error } = await supabase
        .from("valentine_response")
        .insert([payload]);

      if (error) throw error;
      fetchResponses();
    } catch (err) {
      console.error("Supabase insert error:", err);
    }
  }

  async function fetchResponses() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("valentine_response")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      const unique = {};
      data.forEach((r) => {
        unique[r.name] = r;
      });
      setResponses(Object.values(unique));
    } catch (err) {
      console.error("Supabase fetch error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchResponses();
  }, []);

  /* -------------------- HANDLERS -------------------- */
  function handleYes() {
    setYes(true);
    saveResponse("yes", noCount);

    // 💖 Hearts
    const mouseMoveHandler = (e) => createHeart(e.clientX, e.clientY);
    document.addEventListener("mousemove", mouseMoveHandler);
    setTimeout(() => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    }, 5000);

    // 🎤 Karaoke highlight
    let i = 0;
    setCurrentLine(0);
    const interval = setInterval(() => {
      i++;
      if (i >= lyrics.length) {
        clearInterval(interval);
      } else {
        setCurrentLine(i);
      }
    }, 1800);
  }

  function handleNo() {
    setNoCount((prev) => {
      const next = prev + 1;
      saveResponse("no", next);
      return next;
    });

    setShowNo(true);
    setTimeout(() => setShowNo(false), 800);
  }

  function handleBack() {
    setStarted(false);
    setYes(false);
    setNoCount(0);
    setCurrentLine(-1);
    localStorage.removeItem("valentineData");
  }

  /* -------------------- UI -------------------- */
  return (
    <div style={styles.container}>
      {!started ? (
        <>
          <img
            src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
            alt="hi cat"
            style={styles.catGif}
          />
          <h1>Enter your name 💌💌💌</h1>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            style={styles.input}
          />
          <button
            onClick={() => name && setStarted(true)}
            style={styles.start}
          >
            Continue 💖
          </button>
        </>
      ) : yes ? (
        <>
          <h1>YAAAAAY 💕</h1>
          <p>{name} said YES 😘</p>
          <img
            src="https://media.giphy.com/media/W1hd3uXRIbddu/giphy.gif"
            alt="kitty kiss"
            style={styles.img}
          />

          {/* 🎤 Karaoke Lyrics */}
          <div style={styles.karaokeBox}>
            {lyrics.map((line, index) => (
              <p
                key={index}
                style={{
                  ...styles.lyricLine,
                  ...(index === currentLine ? styles.activeLyric : {}),
                }}
              >
                {line}
              </p>
            ))}
          </div>

          <button onClick={handleBack} style={styles.back}>
            ⬅ Back
          </button>
        </>
      ) : (
        <>
          {showNo && <div style={styles.noScreen}>NO 😭</div>}

          <h1>{name}, will you be my Valentine date? 💘</h1>

          <div style={styles.buttons}>
            <button
              onClick={handleYes}
              style={{
                ...styles.yes,
                fontSize: `${yesSize}px`,
                padding: `${10 + noCount * 2}px ${20 + noCount * 4}px`,
              }}
            >
              YES 💕
            </button>

            <button onClick={handleNo} style={styles.no}>
              No 😈
            </button>
          </div>

          <button onClick={handleBack} style={styles.back}>
            ⬅ Back
          </button>

          <div style={styles.responses}>
            <h2>All Valentine Responses 💌</h2>
            {loading ? (
              <p>Loading...</p>
            ) : responses.length === 0 ? (
              <p>No responses yet!</p>
            ) : (
              <ul>
                {responses.map((r) => (
                  <li key={r.id}>
                    {r.name} said {r.answered_yes ? "YES, Ayieet 💕" : "NO, gi reject louya uy😭"} (No clicked{" "}
                    {r.no_count} times)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------- STYLES -------------------- */
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  catGif: {
    width: "150px",
    marginBottom: "15px",
    borderRadius: "10px",
  },
  noScreen: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "white",
    fontSize: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  input: {
    padding: "10px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  start: {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  back: {
    marginTop: "15px",
    padding: "8px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#6c757d",
    color: "white",
  },
  buttons: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  yes: {
    backgroundColor: "#ff4d6d",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
  },
  no: {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#adb5bd",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  img: {
    width: "250px",
    marginTop: "20px",
  },
  responses: {
    marginTop: "30px",
    textAlign: "left",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.3)",
    padding: "15px",
    borderRadius: "10px",
  },

  // 🎤 Karaoke styles
  karaokeBox: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(255,255,255,0.65)",
    borderRadius: "15px",
    maxWidth: "420px",
  },
  lyricLine: {
    fontSize: "18px",
    color: "#555",
    margin: "6px 0",
    transition: "all 0.4s ease",
  },
  activeLyric: {
    color: "#b0003a",
    fontWeight: "bold",
    fontSize: "22px",
    textShadow: "0 0 8px rgba(255,77,109,0.8)",
  },
};
