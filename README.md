## Express.js RESTful API for interacting with Gemini API
This project is a RESTful API built with ExpressJS that integrates with Google Gemini to generate text based responses based on multitude of inputs
1. Text prompt
2. Image + Text prompt (Image description)
3. Document + Text prompt (Document analysis)
4. Audio + Text prompt (Audio transcription and analysis)

## running the server
1. download or clone the files in this repository
2. install dependencies with ```npm install```
3. get your gemini API key from https://aistudio.google.com/apikey
4. create a .env file, insert into this file ```GEMINI_API_KEY=YOUR_API_KEY``` (replace with api key that you get from above)
5. run with ```npm start```

## endpoints
1. ```/generate-text```: generates text from json formatted prompt. for example:
```   
{
    "prompt": "Explain how LLM works in simple terms"
} 
```
2. ```/generate-from-image```: generates image description based on the inputted image file and text prompt (using form field named 'image' and 'prompt' respectively)
3. ```/generate-from-document```: generates document analysis based on the inputted document file and text prompt (using form field named 'document' and 'prompt' respectively)
4. ```/generate-from-audio```: generates audio transcription / analysis based on the inputted audio file and text prompt (using form field named 'audio' and 'prompt' respectively)
