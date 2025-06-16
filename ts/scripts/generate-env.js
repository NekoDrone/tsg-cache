const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");

const envVars = {};
envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
    }
});

const samEnv = {
    Parameters: envVars,
};

fs.writeFileSync("env.json", JSON.stringify(samEnv, null, 2));
console.log("Generated env.json from .env");
