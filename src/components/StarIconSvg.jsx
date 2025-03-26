import React from "react";

const StarIconSvg = ({ customClass }) => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      className={`absolute ${customClass}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {" "}
      <path
        d="M100 200C97.1048 105.262 94.738 102.91 0 100C94.738 97.1048 97.0903 94.738 100 0C102.895 94.738 105.262 97.0903 200 100C105.262 102.91 102.91 105.233 100 200Z"
        fill="white"
      />{" "}
    </svg>
  );
};

export default StarIconSvg;
