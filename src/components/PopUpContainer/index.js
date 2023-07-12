import React, { useEffect, useState } from 'react';
import HashLoader from 'react-spinners/HashLoader';
import './index.css';
import { AiOutlineClose, AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';

const PopUpContainer = (props) => {
  const { toggleModal, categoryId } = props;

  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  let speechSynthesisUtterance = null;

  const closePopUp = () => {
    speechSynthesis.cancel();
    if (speechSynthesisUtterance) {
      speechSynthesisUtterance.onend = null;
      speechSynthesisUtterance = null;
    }
    toggleModal();
  };

  const playAudio = () => {
    setPlaying(true);
    speechSynthesisUtterance = new SpeechSynthesisUtterance(joke);
    speechSynthesisUtterance.onend = () => {
      setPlaying(false);
      speechSynthesisUtterance = null;
    };
    speechSynthesis.speak(speechSynthesisUtterance);
  };

  const pauseAudio = () => {
    setPlaying(false);
    speechSynthesis.cancel();
  };

  useEffect(() => {
    let unSubscribed = false;
    fetch(`https://api.chucknorris.io/jokes/random?category=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!unSubscribed) {
          setJoke(data.value);
          setLoading(false);
        }
      });

    return () => {
      unSubscribed = true;
    };
  }, [categoryId]);

  const getApiData = async () => {
    setLoading(true);
    try {
      const url = `https://api.chucknorris.io/jokes/random?category=${categoryId}`;
      const response = await fetch(url);
      const fetchedData = await response.json();
      setJoke(fetchedData.value);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setLoading(false);
    }
  };

  const nextButton = () => {
    speechSynthesis.cancel();
    if (speechSynthesisUtterance) {
      speechSynthesisUtterance.onend = null;
      speechSynthesisUtterance = null;
    }
    setPlaying(false);
    setLoading(true);
    getApiData();
  };

  const name = categoryId;
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="modal-content">
      <h2 className="popUp-heading">{capitalized}</h2>
      <div className="popup-description-container">
        {loading ? (
          <HashLoader color="#36d7b7" />
        ) : (
          <p className="popUp-description">"{joke}"</p>
        )}
        <div>
          <button className="next-button" onClick={nextButton}>
            Next Joke
          </button>
          {playing ? (
            <button className="play-pause-button" onClick={pauseAudio}>
              <AiOutlinePauseCircle className="icon2" />
            </button>
          ) : (
            <button className="play-pause-button" onClick={playAudio}>
              <AiOutlinePlayCircle className="icon2" />
            </button>
          )}
        </div>
      </div>

      <button className="close-modal" onClick={closePopUp}>
        <AiOutlineClose className="icon" />
      </button>
    </div>
  );
};

export default PopUpContainer;
