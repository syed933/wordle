import React from "react";

const Keyboard = (props) => {
  const keyRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  console.log("notpresent", props.notPresent);

  return (
    <div id="keyboard-container" className="w-[500px] flex flex-col pt-11">
      {keyRows.map((row, i) => {
        return (
          <div
            id="row-container"
            key={i}
            className="flex content-center justify-center"
          >
            {row.map((character, j) => {
              return (
                <div
                  key={j}
                  className={`bg-gray-200 ${
                    props.notPresent.includes(character) ? "bg-slate-400" : ""
                  } w-full h-full m-1 p-5 rounded-md uppercase flex justify-center items-center cursor-pointer hover:scale-110 hover:ease-in-out duration-300 active:scale-95`}
                  id="keyword-button"
                  onClick={() => {
                    // if (props.notPresent.includes(character)) {
                    //   return;
                    // }
                    if (character === "DELETE") {
                      props.setInput((curr) => curr.slice(0, curr.length - 1));
                      return;
                    }
                    if (character === "ENTER") {
                      props.push_rows();
                      return;
                    }
                    props.setInput((curr) => curr + character);
                  }}
                >
                  {character}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
