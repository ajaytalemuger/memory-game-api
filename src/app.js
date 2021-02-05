const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const short = require('short-uuid');
const requestValidation = require('./validations/request.validation');

const difficultyToNumOfCardsMap = {
    "easy": 10,
    "medium": 20,
    "hard": 50
}

var corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));

app.get("/getGameCardValue", requestValidation.validateFileId, requestValidation.validateCardId, (req, res) => {
    const fileId = req.query.fileId;
    const cardId = req.query.cardId;
    fs.readFile(path.join(__dirname, '../game-boards/' + fileId + '.json'), (err, data) => {
        if (err) {
            res.status(500).send({ message: "error while getting card value" });
        }
        const jsonData = JSON.parse(data);
        res.send({ cardValue: jsonData[cardId] });
    });
});

app.put("/createGameBoard", requestValidation.validateDifficulty, (req, res) => {
    const difficulty = req.query.difficulty;
    const cardMap = getCardMap(difficulty);
    const newFileId = getNewFileId();

    fs.writeFile(path.join(__dirname, '../game-boards/' + newFileId + '.json'), JSON.stringify(cardMap), (err) => {
        if (err) {
            res.status(500).send({ message: "error while creating game board" });
        }
        res.send(
            {
                fileId: newFileId,
                numberOfCards: difficultyToNumOfCardsMap[difficulty],
                maxSelectableCards: 2
            });
    });
});


function generateCharacterSet(charStart, charEnd) {
    let charArray = [];
    for (let i = charStart.charCodeAt(0); i <= charEnd.charCodeAt(0); i++) {
        charArray.push(String.fromCharCode(i));
    }
    return charArray;
}

function getCardMap(difficulty) {
    const numOfCards = difficultyToNumOfCardsMap[difficulty];
    const charSet = generateCharacterSet('A', 'Z');
    firstSet = shuffleArray([...Array(numOfCards / 2).keys()]);
    secondSet = shuffleArray([...Array(numOfCards / 2).keys()]);
    let cardMap = {};
    for (let i = 0; i < firstSet.length; i++) {
        cardMap[firstSet[i]] = charSet[i];
        cardMap[secondSet[i] + firstSet.length] = charSet[i];
    }
    return cardMap;
}

function shuffleArray(array) {
    let m = array.length;
    let t;
    let i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function getNewFileId() {
    return short().new();
}

app.listen(PORT, () => {
    console.log('app listening at port: ' + PORT);
})