const mongoose = require('mongoose');
const uri = "mongodb+srv://loginPortalDB:0hviN0ZBHvD5YhiT@cluster0.esindl2.mongodb.net/passport-jwt?retryWrites=true&w=majority";
mongoose.connect(uri)
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const passportModel = mongoose.model("User", userSchema);

const saveInDb = async (req) => {
    const passportModel = mongoose.model("User", userSchema);
    let data = new passportModel({ username: req.username, email: req.email, password: req.password });
    let result = await data.save();
    return result;
}

const updateInDb = async (req) => {
    const passportModel = mongoose.model("User", userSchema);
    let data = await passportModel.updateOne(
        { username: req.username },
        {
            $set: { password: req.password }
        }
    );
    return data;
}

const deleteFromDb = async (req) => {
    const passportModel = mongoose.model("User", userSchema);
    let data = await passportModel.deleteOne({ username: req.username });
    return data;
}

const findInDb = async (req) => {
    const passportModel = mongoose.model("User", userSchema);
    let data = await passportModel.find({ username: req.username });
    return data;
}

module.exports = {
    saveInDb,
    updateInDb,
    deleteFromDb,
    findInDb,
    userModel: passportModel
}