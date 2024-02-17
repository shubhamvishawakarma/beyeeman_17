const mongoose = require('mongoose');
const faqListSchema = new mongoose.Schema({

    question: {
        type: String,
        required: false
    },
    answer: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const faqLitModel = mongoose.model("faqlist", faqListSchema);
module.exports = faqLitModel