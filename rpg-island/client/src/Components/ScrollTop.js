import React from "react";

const ScrollTop = ({}) => {
  const handleScrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <a id="back-to-top" onClick={handleScrollTop}>
      👆🏼
    </a>
  );
};

export default ScrollTop;
