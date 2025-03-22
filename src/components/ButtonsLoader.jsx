import React from "react";
import { ring } from "ldrs";

ring.register();

// Default values shown

const ButtonsLoader = () => {
  return (
    <>
      <l-ring
        size="16"
        stroke="2"
        bg-opacity="0"
        speed="1.5"
        color="#F1F1F1"
      ></l-ring>
    </>
  );
};

export default ButtonsLoader;
