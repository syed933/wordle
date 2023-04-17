import React, { useEffect, useMemo, useRef, useState } from "react";
import myWordList from "../components/English";
import { useRouter } from "next/router";
import Box from "@/components/Box";
import Keyboard from "@/components/Keyboard";
import ReactConfetti from "react-confetti";
import Header from "@/components/Header";

function buildRow(currentWord, row, id, len) {
  let out = [];
  let not = [];

  if (row === undefined) {
    for (let i = 0; i < len; i++) {
      let box_id = i + len * id;
      out.push(<Box letter=" " key={box_id} />);
    }
  } else {
    for (let i = 0; i < len; i++) {
      let box_id = i + len * id;
      if (row[i] === undefined) {
        out.push(<Box letter=" " key={box_id} />);
      } else {
        let char = row[i].toUpperCase();
        let char_c =
          currentWord === undefined ? "" : currentWord[i].toUpperCase();

        if (char === char_c) {
          out.push(<Box letter={char} key={box_id} type="right" />);
        } else {
          if (
            currentWord === undefined
              ? false
              : currentWord.match(row[i].toUpperCase())
          ) {
            out.push(<Box letter={char} key={box_id} type="w_placed" />);
          } else {
            not.push(char);
            out.push(<Box letter={char} key={box_id} type="wrong" />);
          }
        }
      }
    }
  }
  return { out, not };
}

const Game = () => {
  const router = useRouter();

  const { words } = router.query;

  const width = Number(words);
  const height = Number(words);
  +1;

  const [currentWord, setCurrentWord] = useState("");

  const [rows, setRows] = useState([]);

  const [input, setInput] = useState("");

  const [win, setWin] = useState(false);

  const [notPresent, setNotPresent] = useState([]);

  const notPres = useRef([]);

  useEffect(() => {
    const listener = (e) => {
      console.log(e.key);
      if (e.key === "Enter") {
        console.log("hitting");
        push_rows();
        return;
      }
      if (e.key === "Backspace") {
        setInput((curr) => curr.slice(0, curr.length - 1));
        return;
      }
      setInput((curr) => curr + e.key.toUpperCase());
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  const validWords = useMemo(() => {
    return Object.keys(myWordList)
      .filter((word) => word.length === width)
      .map((word) => word.toUpperCase());
  }, [words]);

  useEffect(() => {
    setCurrentWord(validWords[Math.floor(Math.random() * validWords.length)]);
  }, [validWords]);

  console.log("currentWord", currentWord);
  console.log("rows", rows);

  function hasWon() {
    return win;
  }

  function hasLost() {
    return !win && rows.length === Number(words) + 1;
  }

  function push_rows() {
    if (!hasWon() && !hasLost() && input.length == Number(words)) {
      let r = rows;
      r.push(input);
      setRows(r);
      if (input.toUpperCase() === currentWord) {
        setWin(true);
      }
      setInput("");
    }
  }

  const restart = () => {
    router.back();
  };

  return (
    <div>
      <Header />
      {hasWon() && (
        <div className="m-5 shadow-lg p-4 rounded-md transition-all 300ms cursor-pointer bg-green-400 animate-bounce w-100 h-240">
          <ReactConfetti
            width={1000}
            height={900}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              gravity: "1",
              wind: ".1",
            }}
          />
          <p>Congratulations! You Won!</p>
          <button onClick={restart}>Restart</button>
        </div>
      )}
      {hasLost() && (
        <div>
          <div className="m-5 shadow-lg p-4 rounded-md transition-all 300ms cursor-pointer bg-red-400 animate-pulse">
            You lost, try again...?
          </div>
          <button onClick={restart}>Restart</button>
        </div>
      )}
      <div className="flex items-center justify-center p-6 flex-col">
        <div className="flex w-max flex-col rounded border border-slate-600 p-4 shadow">
          <button>New</button>
          <h1
            className={`mb-6 mt-2 text-center text-xl font-bold transition-colors ${(() => {
              if (hasWon()) {
                return "text-green-600";
              } else if (hasLost()) {
                return "text-red-600";
              } else {
                return "text-black";
              }
            })()}`}
          >
            {(() => {
              if (hasWon()) {
                return "You Won";
              } else if (hasLost()) {
                return "You Loose";
              } else {
                return "Wordle";
              }
            })()}
          </h1>
          <div
            className={`grid select-none gap-4 ${(() => {
              if (words == 5) {
                return "grid-cols-5";
              } else if (words == 6) {
                return "grid-cols-6";
              } else {
                return "grid-cols-7";
              }
            })()}`}
          >
            {(() => {
              let lines = [];
              for (let r = 0; r < Number(words) + 1; r++) {
                let { out, not } = buildRow(
                  currentWord,
                  rows[r],
                  r,
                  Number(words),
                  setNotPresent
                );
                lines.push(out);
                notPres.current = [...notPres.current, ...new Set(not)];
              }
              return lines;
            })()}
            <input
              type="text"
              placeholder={
                hasWon() || hasLost() ? "Try again" : "Type a word here"
              }
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              disabled
              onKeyDown={(e) => {
                if (e.key && e.key == "Enter") {
                  push_rows();
                }
              }}
              className="col-span-5 h-16 appearance-none rounded border border-slate-600 bg-slate-200 pl-4 text-left text-black"
            />
            {/* <button
              onClick={push_rows}
              className="h-16 w-16 rounded border border-slate-600 bg-slate-200 text-black transition-colors hover:bg-slate-400 "
            >
              Enter
            </button> */}
          </div>
        </div>
        <Keyboard
          push_rows={push_rows}
          setInput={setInput}
          notPresent={[...new Set(notPres.current)]}
        />
      </div>
    </div>
  );
};

export default Game;
