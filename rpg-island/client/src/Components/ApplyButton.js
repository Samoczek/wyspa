import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

const ApplyButton = ({ postId, userId, postname, postUserId, postscenario, postdate }) => {
  const [cookies] = useCookies(["UserId"]);

  const handleApply = async () => {
    if (!cookies.UserId) {
      toast.error("Musisz być zalogowany, aby zapisać się do ogłoszenia.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return; 
    }

    const cookieUserId = cookies.UserId;

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

        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 3000,
        });

        console.log(response.data.message);
      } catch (error) {
        console.error(
          "Błąd podczas zapisywania użytkownika do ogłoszenia:",
          error
        );

        toast.error("Użytkownik został już zapisany do tego ogłoszenia.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } else {
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
