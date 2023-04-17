import GameGrid from "@/components/GameGrid";
import Header from "@/components/Header";
import Keyboard from "@/components/Keyboard";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import myWordList from "../components/English.js";
import { useRouter } from "next/router";

export default function Home(props) {
  //Going through our word list and getting 5 letter words

  const router = useRouter();

  const { words } = router.query;

  const width = Number(words);
  const height = Number(words);
  +1;

  //Making sure the word is valid
  const validEnglishWords = Object.keys(myWordList)
    .filter((word) => word.length === width)
    .map((word) => word.toUpperCase());
  //INITIAL CURRENT STATE
  const [mysteryWord, setMysteryWord] = useState(
    validEnglishWords[Math.floor(Math.random() * validEnglishWords.length)]
  );

  console.log("mysteryWord", mysteryWord);

  const [currentRow, setCurrentRow] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  //Using useEffect is great for when you're trying to respond to only specific changes like the keyPress, and then update the state
  const [guessedWords, setGuessedWords] = useState([]);
  const [pressedKey, setPressedKey] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const onKeyPress = (key) => {
    //Do something here with the keypress state from the keyboard
    setPressedKey(key);
  };

  //Whenever pressedKey is updated, update the currentWord/currentRow/otherParts of the state
  //We have a dependency here with pressedKey, so whenever that happens, the state updates
  useEffect(() => {
    if (pressedKey === "") {
      return;
    }
    //ALL EDGE CASES BELOW
    //If the pressed key is a letter
    //If current word is equal to the width, do nothing
    //If current word is less than the width, add character to current word
    if (pressedKey != "ENTER" && pressedKey != "DELETE") {
      //If current word is equal to width do nothing
      if (currentWord == width) {
        //do nothing
        //otherwise add character to current word
      } else {
        setCurrentWord(currentWord + pressedKey);
      }
    }

    if (pressedKey === "DELETE") {
      if (currentWord === "") {
        //do nothing
      } else {
        //Otherwise remove last character
        setCurrentWord(currentWord.slice(0, -1));
      }
    }

    //If the pressed key is the backspace button
    //If current word is empty, do nothing
    //If current word has at least one character, remove last character from current word
    //If THE pressed key is a enter button
    if (pressedKey === "ENTER") {
      if (currentWord.length < width) {
        flash("not enough letters");
        console.log("Not enough letters");
      } else {
        if (validEnglishWords.includes(currentWord)) {
          setCurrentRow(currentRow + 1);
          setGuessedWords(guessedWords.concat(currentWord));
          setCurrentWord("");
        } else {
          flash("Not in Word List");
          console.log("not in word list");
        }
      }
    }
    //If current word is not wide enough, show to the user, not enough letters
    //If current word is equal to the width,
    //If current word is in the dictionary, increment the current row by 1
    //Add the word to the guessedWords
    //set currentWord to "" / empty
    //If current word is not in the dictionary show "not in word list"
    setPressedKey("");
  }, [pressedKey]);

  //Not enough words message, when user doesn't type full length of word list
  const flash = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage("");
    }, 1000);
  };

  const getContent = () => {
    const objectToReturn = {};
    //Words for the current word, we'll loop through them
    for (
      let currentWordIndex = 0;
      currentWordIndex < currentWord.length;
      currentWordIndex++
    ) {
      objectToReturn[`${currentRow},${currentWordIndex}`] = {
        color: "white",
        text: currentWord[currentWordIndex],
      };
    }
    //Input: MOUSE, MATCH
    //Output: M (yellow), O (grey), U (grey), S (grey), E (grey)
    //Loop through each guess word, and assign it a color according to the game rules
    guessedWords.forEach((guessedWord, rowNumber) => {
      //We'll use a forLoop here to loop through each word and get the character and index
      for (
        let guessedWordIndex = 0;
        guessedWordIndex < guessedWord.length;
        guessedWordIndex++
      ) {
        const gridRowNumber = rowNumber;
        const gridColumnNumber = guessedWordIndex;
        //We have our switch statement here
        let character = guessedWord[guessedWordIndex];
        let color;
        if (!mysteryWord.includes(character)) {
          color = "grey";
        } else if (mysteryWord[guessedWordIndex] === character) {
          color = "green";
        } else {
          color = "yellow";
        }
        objectToReturn[`${gridRowNumber},${gridColumnNumber}`] = {
          color: color,
          text: character,
        };
        //Scenario 1: Not in mystery word => set color grey
        //Scenario 2: Is in mystery word but in different position => yellow
        //Scenario 3: Is in mystery word and in correct position => green
      }
    });

    return objectToReturn;

    // return {
    //   "0,0": {
    //     color: "grey",
    //     text: "M",
    //   },
    //   "0,1": {
    //     color: "green",
    //     text: "O",
    //   },
    //   "0,2": {
    //     color: "yellow",
    //     text: "U",
    //   },
    // };
  };

  //Scenario for GAME OVER
  const userWon = guessedWords.includes(mysteryWord);
  const userLost =
    !guessedWords.includes(mysteryWord) && guessedWords.length == height;

  console.log(`${mysteryWord}`);

  return (
    <main className="flex flex-col items-center justify-between">
      <title>Wordle Clone</title>
      <Header />
      {userWon && (
        <div className="m-5 shadow-lg p-4 rounded-md transition-all 300ms cursor-pointer bg-green-400 animate-bounce w-240 h-240">
          <Confetti
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
          Congratulations! You Won!
        </div>
      )}
      {userLost && (
        <div className="m-5 shadow-lg p-4 rounded-md transition-all 300ms cursor-pointer bg-red-400 animate-pulse">
          You lost, try again...?
        </div>
      )}
      {flashMessage != "" && (
        <div className="m-5 shadow-lg p-4 rounded-md transition-all ease-in-out 300ms cursor-pointer bg-red-400 animate-pulse">
          {flashMessage}
        </div>
      )}
      <GameGrid
        height={height}
        width={width}
        currentWord={currentWord}
        guessedWords={guessedWords}
        content={getContent()}
      />
      <Keyboard
        onKeyPress={(key) => {
          onKeyPress(key);
        }}
      />
    </main>
  );
}
