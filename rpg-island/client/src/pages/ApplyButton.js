import React from 'react';
import axios from 'axios';

const ApplyButton = ({ postId, userId }) => {
  const handleApply = async () => {
    try {
      const response = await axios.post('http://localhost:8000/apply', { postId, userId });
      console.log(response.data.message);
    } catch (error) {
      console.error('Błąd podczas zapisywania użytkownika do ogłoszenia:', error);
    }
  };

  return (
    <button onClick={handleApply}>Zapisz się</button>
  );
};

export default ApplyButton;
