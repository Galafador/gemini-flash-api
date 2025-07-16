const express = require('express')
const dotenv = require('dotenv')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// loads environment variable from dotenv
dotenv.config();

// initialize the express app
const app = express()
app.use(express.json())

// initialize multer for file uploads
const upload = multer({
    dest: 'uploads/'
})

// Check for Gemini API key
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in .env file')
}

// Setup environment
let MODEL_NAME = 'models/gemini-2.5-flash'
const API_KEY = process.env.GEMINI_API_KEY
const PORT = 3000

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: MODEL_NAME })

// helper function to convert an image file to a format that gemini understands
function imageToGenerativePart(file) {
    const imageBuffer = fs.readFileSync(file.path)
    const mimeType = file.mimetype

    if (!mimeType.startsWith('image/')) {
        throw new Error(`Uploaded file is not an image`)
    }
    return {
        inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: mimeType,
        }
    }
}


// Start the server and listen to PORT
app.listen(PORT, () => {
    console.log(`Gemini API server is running at http://localhost:${PORT}`)
})


// End-point to generate texts from prompt
app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        res.json({ output: response.text() })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        console.log("generate-text request completed successfully")
    }
})


// End-point to upload image and receive descriptive text
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const prompt = req.body.prompt || 'Describe this image:'
    const image = imageToGenerativePart(req.file)

    if (!image) {
        throw new Error('Cannot process the image.')
    }
    try {
        const result = await model.generateContent([prompt, image])
        const response = result.response
        res.json({ output: response.text() })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    } finally {
        fs.unlinkSync(req.file.path)
        console.log("generate-from-image request completed successfully")
    }
})


// End-point to upload documents and receive text-based analysis
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const prompt = req.body.prompt || 'Analyze this document:'
    const bufferDocument = fs.readFileSync(req.file.path)
    const base64Data = bufferDocument.toString('base64')
    const documentPart = {
        inlineData: {
            data: base64Data,
            mimeType: req.file.mimetype
        }
    }

    try {
        const result = await model.generateContent([prompt, documentPart])
        const response = result.response
        res.json({ output: response.text() })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    } finally {
        fs.unlinkSync(req.file.path)
        console.log("generate-from-document request completed successfully")
    }
})


// End-point to upload audio files and receive text-based transcription/analysis
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const prompt = req.body.prompt || 'Transcribe or analyze the following audio:'
    const audioBuffer = fs.readFileSync(req.file.path)
    const base64Audio = audioBuffer.toString('base64')
    const audioPart = {
        inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype
        }
    }

    try {
        const result = await model.generateContent([prompt, audioPart])
        const response = result.response
        res.json({ output: response.text() })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    } finally {
        fs.unlinkSync(req.file.path)
        console.log("generate-from-audio request completed successfully")
    }
})

