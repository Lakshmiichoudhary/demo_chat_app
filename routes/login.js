const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/login", (req, res, next) => {
    res.send(`<form action="/" method="post">
    <input type="text" name="username" placeholder="Enter your username"><button type="submit">Send</button>
    </form>`);
});

router.post("/", (req, res, next) => {
    const { username } = req.body;
    // Store username in browser's local storage
    res.setHeader('Set-Cookie', `username=${username}`);
    // Redirect user to "/" and show send message form
    res.redirect("/");
});

router.get("/", (req, res, next) => {
    // Read messages from file and display them
    fs.readFile("messages.json", "utf8", (err, data) => {
        if (err) {
            return console.error(err);
        }
        const messages = JSON.parse(data);
        let messageHTML = "";
        for (const key in messages) {
            if (messages.hasOwnProperty(key)) {
                const { username, message } = messages[key];
                messageHTML += `<p><strong>${username}:</strong> ${message}</p>`;
            }
        }
        res.send(messageHTML);
    });
});

router.post("/send", (req, res, next) => {
    const { username } = req.cookies;
    const { message } = req.body;
    // Store message in a file
    fs.readFile("messages.json", "utf8", (err, data) => {
        if (err) {
            return console.error(err);
        }
        const messages = JSON.parse(data);
        const messageId = Date.now().toString();
        messages[messageId] = { username, message };
        fs.writeFile("messages.json", JSON.stringify(messages), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log("Message saved!");
            // Send response
            res.json({ id: messageId, message: { username, message } });
        });
    });
});

module.exports = router;
