import React from "react";

const Box = ({ type, letter }) => {
  let case_type = "";

  switch (type) {
    case "edit":
      case_type = "case-b";
      break;
    case "right":
      case_type = "case-g";
      break;
    case "wrong":
      case_type = "case-e";
      break;
    case "w_placed":
      case_type = "case-y";
      break;
    default:
      break;
  }

  return <div className={"case " + case_type}>{letter}</div>;
};

export default Box;
