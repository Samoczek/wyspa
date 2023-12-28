import React from "react";
import axios from "axios";

const ApplyButton = ({ postId, userId, postname, postUserId }) => {
  const handleApply = async () => {
    try {
      const response = await axios.post("http://localhost:8000/apply", {
        postId,
        userId,
        postname,
        postUserId,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Błąd podczas zapisywania użytkownika do ogłoszenia:",
        error
      );
    }
  };

  return (
    <button className="ApplyButton" onClick={handleApply}>
      Zapisz się
    </button>
  );
};

export default ApplyButton;
