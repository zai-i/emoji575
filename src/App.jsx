import React, { useState } from 'react'
import './App.css'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Configuration, OpenAIApi } from 'openai';

// This hardcodes insertion of 'User-Agent'
let config = new Configuration({ apiKey: import.meta.env.VITE_OPENAI_API_KEY});

// Delete it
delete config.baseOptions.headers['User-Agent'];

let openai = new OpenAIApi(config);

function App() {
  const [emojiKeywords, setEmojiKeywords] = useState([])
  const [emojiIcons, setEmojiIcons] = useState([])
  const [haiku, setHaiku] = useState('')

  const generateHaiku = () => {
    openai.createCompletion({
      model: 'text-davinci-003', 
      prompt: `generate a haiku poem from the following keywords: ${emojiKeywords}. The first line should have 5 syllables in total, the second line should have 7 syllables in total and the third line should have 5 syllables in total.`,
      max_tokens: 100,
      temperature: 0.7,
      presence_penalty: 0.6,
    })
    
    .then((response) => {
      setHaiku({
        response: `${response.data.choices[0].text}`
      });
    })
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
      <div className="emojiList">{emojiIcons} </div>
      <Picker data={data} onEmojiSelect={emoji => addEmojis(emoji)} emojiButtonSize={40} emojiSize={35} searchPosition="none" navPosition="none" maxFrequentRows={0} />

<div className="haiku">{haiku ? haiku.response : null}</div> <div className="center">{emojiIcons.length >= 1 ? <button type="button" onClick={handleClear}>🗑</button> : null}</div></>
  )
}

export default App
