import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyButton = ({ postId, userId, postname, postUserId, postscenario, postdate }) => {
  const handleApply = async () => {
    try {
      const response = await axios.post("http://localhost:8000/apply", {
        postId,
        userId,
        postname,
        postscenario,
        postdate,
        postUserId,
      });

      // Wyświetl komunikat po udanym zapisaniu się
      toast.success(response.data.message, {
        position: "bottom-right",
        autoClose: 3000, // zamknięcie po 3000 milisekundach (3 sekundy)
      });

      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Błąd podczas zapisywania użytkownika do ogłoszenia:",
        error
      );

      // Wyświetl komunikat w przypadku błędu
      toast.error("Wystąpił błąd podczas zapisywania się. Spróbuj ponownie.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <button className="ApplyButton" onClick={handleApply}>
      Zapisz się
    </button>
  );
};

export default ApplyButton;
