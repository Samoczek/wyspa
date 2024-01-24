import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowDetailsButton = ({ postId, onClose }) => {
  const [ onePost, setPost ] = useState(null);
  const [showDetails, setShowDetails] = useState(null);

  const getPost = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/onePost/${postId}`);

      setPost(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
  }, [postId]);

  const handleClose = () => {
    setShowDetails(false);
    onClose(); 
  };


  return (
    <div className="details">
            <div className="close-icon" onClick={handleClose}>
        ⓧ
      </div>

      <div>
        <p>Nazwa posta: {onePost?.nazwa_systemu}</p>
        <p>Opis posta: {onePost?.opis}</p>
        <p>Scenariusz posta: {onePost?.scenariusz}</p>
        <p>
            <div className="photo-container">
              <img src={onePost?.url} alt="Obrazek!" className="profile-photo" />
            </div>
        </p>
      </div>
    </div>
  );
};

export default ShowDetailsButton;
