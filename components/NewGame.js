import React, { useState } from "react";
import { useRouter } from "next/router";
import Directions from "./Directions";

function NewGame() {
  const router = useRouter();
  const [wordSize, setWordSize] = useState(5);

  const wordCounts = [5, 6, 7];

  const startGame = () => {
    router.push(`/game?words=${wordSize}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl mt-8">Configure your Wordle Game!</h2>
      <Directions />
      <label className="pt-5 pb-2">Choose a width:</label>
      <select
        className="cursor-pointer w-28 bg-gray-300 py-2 px-1 rounded-md"
        name="width"
        id="width"
        onChange={(e) => setWordSize(e.target.value)}
      >
        {wordCounts.map((wordCount) => {
          if (wordSize === wordCount) {
            return (
              <option value={wordCount} selected>
                {wordCount}
              </option>
            );
          }
          return <option value={wordCount}>{wordCount}</option>;
        })}
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
        onClick={startGame}
      >
        Start Game!
      </button>
    </div>
  );
}

export default NewGame;
