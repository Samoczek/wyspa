import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  let navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );
      setCookie("UserId", response.data.userId);
      setCookie("AuthToken", response.data.token);

      const success = response.status === 201;
      if (success && isSignUp) navigate("/registration");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-modal">
      <div className="close-icon" onClick={handleClose}>
        ⓧ
      </div>

      <h2>{isSignUp ? "Utwórz konto" : "Zaloguj się"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
          minLength={3}
          maxLength={64}
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          pattern="^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit" />
        <p>{error}</p>
      </form>
    </div>
  );
};
export default AuthModal;
