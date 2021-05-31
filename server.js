const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ type: 'application/json' }));

app.post('/analyze', (req, res) => {

    //Extract the text string from the body of the POST request and convert all characters to lower case
    const text = req.body.text.toLowerCase();

    if (req.body.text) {
        withSpaces = text.length;

        if (text.match(/[\s]/g)) {//matches strings with multiple words divided by whitespaces
            withoutSpaces = withSpaces - text.match(/[\s]/g).length;
        } else {
            withoutSpaces = withSpaces;
        }

        if (text.match(/^\s+$/)) {//matches strings that contain any number of whitespaces and nothing else
            wordCount = 0;
        } else {
            wordCount = text.match(/\w+/g).length;
        };

        //Create an array from the lower-cased text string
        var initialArray = Array.from(text);

        //Create a new array with just letters of the English alphabet sorted in an alphabetical order. Remove all special characters and whitespaces
        var characterArray = initialArray.filter(item => item.match(/[^\s\döäÄÖ~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?\-_^|¢£¤¥¦§¨©ª«»¬®¯°±¹²³´µ¶·¸º¼½¾¿÷]/)).sort();

        //Reduce the letters array to unique letters with the number of occurencies for each letter
        var characterCountObj = characterArray.reduce(function (acc, curr) {
            if (acc[curr]) {
                acc[curr] += 1;
            } else {
                acc[curr] = 1;
            }
            return acc;
        }, {});

        //Transform the array entries to objects to match the required output format
        characterCount = Object.entries(characterCountObj).map(([letter, num]) => ({ [letter]: num }));
    } else {
        withSpaces = 0;
        withoutSpaces = 0;
        wordCount = 0;
        characterCount = [];
    };

    const response = {
        "textLength": { "withSpaces": withSpaces, "withoutSpaces": withoutSpaces },
        "wordCount": wordCount,
        "characterCount": characterCount
    };

    res.send(response);
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started successfully on port " + port + "!");
});