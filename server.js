const path = require("path");
const fs = require("fs");
const express = require("express");
const config = require("./config");
const app = express();

function resolvePath(filepath) {
    if (filepath[0] === '~') {
        return path.join(
            process.env.HOME, 
            filepath.slice(1));
    } else if (filepath[0] !== "/") {
        return path.resolve(__dirname, filepath);
    }

    return filepath;
}

const picamPath = path.join(
    resolvePath(config.PICAM_PATH),
    "hooks");

function writeHook(hook, res) {
    fs.writeFile(path.join(picamPath, hook), null, (err) => {
        if (err) {
            return res.json(err);
        }
        
        res.json({ ok: true, command: hook })
    })
}

app.use(express.static("public"));

app.post("/commands/mute", (req, res, next) => {
    writeHook("mute", res);
});

app.post("/commands/unmute", (req, res) => {
    writeHook("unmute", res);
});

app.post("/commands/start_record", (req, res) => {
    writeHook("start_record", res);
});

app.post("/commands/stop_record", (req, res) => {
    writeHook("stop_record", res);
});

app.listen(5001, () => {
    console.log("Listening on port 5001");
});