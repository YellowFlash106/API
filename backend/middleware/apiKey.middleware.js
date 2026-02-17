module.exports = (req, res, next) =>{

    const header = req.headers.authorization;

    if(!header) return res.status(401).send("API key required");
    const apiKey = header.split(" ")[1];

    if(apiKey !== "test-api-key"){
        return res.status(403).send("Invalid apikey");
    }
    next();
}