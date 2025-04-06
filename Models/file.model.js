const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: String,
    public_Id: String,
    img_url: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Corrected ref to 'User'
});

const File = mongoose.model('File', fileSchema);


module.exports = File