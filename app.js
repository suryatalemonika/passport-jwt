const passport = require("passport");
const express = require("express");
const { userModel, saveInDb, findInDb } = require('./db');
const app = express();
const port = 5001;
const key1 = 'secretkeyportjwt';
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(passport.initialize());

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key1;



passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    user = await userModel.find({ username: jwt_payload.result[0].username })
    if (!user) {
        return done(null, false);
    }
    if (user) {
        return done(null, user);
    } 
}));

app.use(function (err, req, res, next) {
    if (err instanceof passport.UnauthorizedError) {
        console.log(err)
        res.status(401).json({ error: "Unauthorized" });
    } else {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Welcome" })
})

app.get('/find', async (req, res) => {
    let data = await userModel.find({});
    res.json({ data: data })
})

app.post('/register', async (req, res) => {
    let result = await saveInDb(req.body);
    if(result){
        res.json({ message : "user Registered",data: result });
    }
})

app.post('/login', async (req, res) => {
    let result = await findInDb(req.body);
    console.log(result);
    if (result) {
        jwt.sign({ result }, key1, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                res.status(500).json({ error: "Failed to generate token" });
            } else {
                res.json({ message: "logged In", token: token });
            }
        });
    }
})

app.get('/profile', passport.authenticate('jwt', { session: false }),
    function (req, res) {
        res.json({message : "Finaly Working",user:req.user[0]});
    }
);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
