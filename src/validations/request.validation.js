const difficultyList = ['easy', 'medium', 'hard'];

function validateFileId(req, res, next) {
    const fileId = req.query.fileId;
    if (!fileId) {
        res.status(400).send({ message: "Invalid file id" });
    } else {
        next();
    }
}

function validateCardId(req, res, next) {
    const cardId = req.query.cardId;
    if (!cardId) {
        res.status(400).send({ message: "Invalid card id" });
    } else {
        next();
    }
}

function validateDifficulty(req, res, next) {
    const difficulty = req.query.difficulty;
    if (!difficulty || !difficultyList.includes(difficulty)) {
        res.status(400).send({ message: "Invalid difficulty" });
    } else {
        next();
    }
}

module.exports = {
    validateFileId,
    validateCardId,
    validateDifficulty
}