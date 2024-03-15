import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

const ApplyButton = ({ postId, userId, postname, postUserId, postscenario, postdate }) => {
  const [cookies] = useCookies(["UserId"]);

  const handleApply = async () => {
    // Pobierz userId z ciasteczek
    const cookieUserId = cookies.UserId;

    // Sprawdź czy userId z ciasteczek jest różne od postUserId
    if (cookieUserId !== postUserId) {
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
        toast.error("Użytkownik został już zapisany do tego ogłoszenia.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } else {
      // Wyświetl komunikat jeśli userId z ciasteczek jest taki sam jak postUserId
      toast.error("Nie możesz się zapisać do własnego ogłoszenia.", {
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
