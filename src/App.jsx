import React, { useState, useEffect } from 'react';
import './normalize.css';
import './App.scss';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ThemeToggle } from './themeToggle.jsx';

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 800;

  const [emojiKeywords, setEmojiKeywords] = useState([]);
  const [emojiIcons, setEmojiIcons] = useState([]);
  const [haiku, setHaiku] = useState('');

  useEffect(() => {
    generateHaiku();
  }, [emojiKeywords]);

  const smarten = (string) => {
    string = string.replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018'); // opening singles
    string = string.replace(/'/g, '\u2019'); // closing singles & apostrophes
    string = string.replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c'); // opening doubles
    string = string.replace(/"/g, '\u201d'); // closing doubles
    string = string.replace(/--/g, '\u2014'); // em-dashes

    return string;
  };

  const generateHaiku = () => {
    if (emojiKeywords.length > 0) {
        fetch(`${import.meta.env.VITE_SITE_URL}/api?keywords=${emojiKeywords}/`, {
          method: 'GET',
          mode: 'cors' })
        .then(response => response.json())  
        .then(function (response) {
          setHaiku({
            response: smarten(`${response.choices[0].message.content}`),
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const addEmojis = (emoji) => {
    setEmojiKeywords([...emojiKeywords, ...emoji.keywords]);
    setEmojiIcons([...emojiIcons, emoji.native]);
    generateHaiku(emoji);
  };

  const handleClear = () => {
    setEmojiKeywords([]);
    setEmojiIcons([]);
    setHaiku('');
  };
  return (
    <>
      <div className='themeToggle'>
        <ThemeToggle />
      </div>
      <div className='instructions'>
        ChatGPT will generate a haiku for you (as best as it can) based on the
        emojis you choose!
      </div>
      <div className='emojiList'>{emojiIcons} </div>
      <Picker
        data={data}
        onEmojiSelect={(emoji) => addEmojis(emoji)}
        emojiButtonSize={isMobile ? 40 : 80}
        emojiSize={isMobile ? 35 : 75}
        searchPosition='none'
        navPosition='none'
        maxFrequentRows={0}
      />

      <div className='container'>
        <div className='haiku'>{haiku ? haiku.response : null}</div>{' '}
        {emojiIcons.length >= 1 ? (
          <button type='button' className='clear' onClick={handleClear}>
            🗑
          </button>
        ) : null}
      </div>
      <p className='credit'>
        made with <span></span> by{' '}
        <a href='http://www.zaiz.ai'>Zainab Ismail</a>
      </p>
    </>
  );
}

export default App;
