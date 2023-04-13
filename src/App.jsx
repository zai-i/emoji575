import React, { useState , useEffect } from 'react'
import './App.scss'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Configuration, OpenAIApi } from 'openai';

import { ThemeToggle } from "./themeToggle.jsx";

// This hardcodes insertion of 'User-Agent'
let config = new Configuration({ apiKey: import.meta.env.VITE_OPENAI_API_KEY});

// Delete it
delete config.baseOptions.headers['User-Agent'];

let openai = new OpenAIApi(config);

function App() {

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  const isMobile = width <= 800;

  const [emojiKeywords, setEmojiKeywords] = useState([])
  const [emojiIcons, setEmojiIcons] = useState([])
  const [haiku, setHaiku] = useState('')

  useEffect(() => {
    generateHaiku()
  }, [emojiKeywords]);

  const smarten = (string) => {
    string = string.replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018');      // opening singles
    string = string.replace(/'/g, '\u2019');                            // closing singles & apostrophes
    string = string.replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c'); // opening doubles
    string = string.replace(/"/g, '\u201d');                            // closing doubles
    string = string.replace(/--/g, '\u2014');                           // em-dashes
    
    return string;
  };

  const generateHaiku = () => {
    if (emojiKeywords.length > 0) {
    openai.createCompletion({
      model: 'text-davinci-003', 
      prompt: `Generate one haiku poem from the following keywords: ${emojiKeywords}. The first line of the poem should have 5 syllables in total, the second line of the poem should have 7 syllables in total, and the third line of the poem should have 5 syllables in total. The poem should never exceed 3 lines.`,
      max_tokens: 100,
      temperature: 0.7,
      presence_penalty: 0.6,
    })
    
    .then((response) => {
      setHaiku({
        response: smarten(`${response.data.choices[0].text}`)
      });
    })
  }
  }

  const addEmojis = (emoji) => {
    setEmojiKeywords([...emojiKeywords, ...emoji.keywords])
    setEmojiIcons([...emojiIcons, emoji.native])
    generateHaiku(emoji)
  }

  const handleClear = () => {
    setEmojiKeywords([]);
    setEmojiIcons([])
    setHaiku('')
  }
  return (
  <>
  <div className="themeToggle"><ThemeToggle/></div>
  <div className="instructions">ChatGPT will generate a haiku for you (as best as it can) based on the emojis you choose!</div>
      <div className="emojiList">{emojiIcons} </div>
      <Picker data={data} onEmojiSelect={emoji => addEmojis(emoji)} emojiButtonSize={isMobile ? 40 : 80} emojiSize={isMobile ? 35 : 75} searchPosition="none" navPosition="none" maxFrequentRows={0} />

<div className="container"><div className="haiku">{haiku ? haiku.response : null}</div> {emojiIcons.length >= 1 ? <button type="button" onClick={handleClear}>🗑</button> : null}</div><p className="credit">made with <span></span> by <a href="http://www.zaiz.ai">Zainab Ismail</a></p></>
  )
}

export default App
