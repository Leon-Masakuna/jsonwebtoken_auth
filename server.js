const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const users = require("./data/users");

const port = process.env.PORT || 5000;

app.use(express.json());

function verifyUser(req, res, next){
    const idToken = req.headers.authorization;
    jwt.verify(idToken, publicKey, (err, decoded) => {
        if(err){
            return res.status(401).send("L'utilisateur n'est pas autorisé")
        }
        req.userToken = decoded
        next();
    })
}

app.get('/', verifyUser, (req, res) => {
    res.send(req.userToken)
})

const privateKey = process.env.PRIVATE_KEY
const publicKey = process.env.PUBLIC_KEY

app.post('/auth', (req, res) => {

    const { name, password } = req.body;
    const user = users.find((user) => user.name === name && user.password === password)

    if(user){
        const token = jwt.sign({name}, privateKey, {algorithm: "RS256"})
        return res.send(token);
    }
        res.status(404).send("L'utilisateur n'est pas trouvé")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
