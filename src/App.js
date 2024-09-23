import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function MaveliBot() {
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState('');

  // Handle user input (English text)
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Submit English input and process it to get a response
  const handleSubmit = async () => {
    await processResponse(userInput);
  };

  // Bot response logic (based on English input)
  const processResponse = async (input) => {
    const predefinedResponses = {
      'hello': 'Hello, Makkale',
      'how are you?': 'Njan Sugamayi Irikunnu, Makkale!',
      'what is your name?': 'Njan Maveli, Ella onam kalathum vannu ente prejakale kanan!',
      'happy onam': 'onam ashamsakal',
    };

    const lowercasedInput = input.toLowerCase();
    const response = predefinedResponses[lowercasedInput];

    if (response) {
      setBotResponse(response);
      speakResponse(response);
    } else {
      // Use Wikipedia API for unknown questions about Onam
      const dynamicResponse = await fetchWikiResponse(input);
      setBotResponse(dynamicResponse);
      speakResponse(dynamicResponse);
    }
  };

  // Fetch response from Wikipedia API with detailed paragraph
  const fetchWikiResponse = async (input) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(input)}&format=json&origin=*`;

    try {
      const searchResponse = await axios.get(searchUrl);
      const searchResults = searchResponse.data.query.search;

      if (searchResults.length > 0) {
        // Get the page ID of the top result
        const pageId = searchResults[0].pageid;

        // Now fetch the detailed content (intro paragraph) using the page ID
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageId}`;
        const extractResponse = await axios.get(extractUrl);
        const page = extractResponse.data.query.pages[pageId];

        if (page.extract) {
          return `Thangal choichathinte utharam: ${page.extract}`;
        } else {
          return "Kshemikkanam enikk athine patti arilla, Makkale!";
        }
      } else {
        return "Kshemikkanam enikk athine patti arilla, Makkale!";
      }
    } catch (error) {
      console.error('Error fetching response from Wikipedia:', error);
      return 'Kshemikkanam enikk athine patti arilla, Makkale!.';
    }
  };

  // Convert bot's response to speech
  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';  // Adjust if needed
    utterance.pitch = 0.8;     // Adjust pitch for Maveli slang
    utterance.rate = 0.9;      // Adjust speed
    synth.speak(utterance);
  };

  return (
    <div className="bot-container">
      <h1>Maveli Bot</h1>
      <input 
        type="text" 
        value={userInput} 
        onChange={handleInputChange} 
        placeholder="Type your message in English" 
      />
      <button onClick={handleSubmit}>Send</button>
      <div className="bot-response">
        Bot says: {botResponse}
      </div>
    </div>
  );
}

export default MaveliBot;
