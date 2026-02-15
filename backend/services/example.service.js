exports.runExampleServices = (req, res) =>{
    res.json({
        message: "Example service executed successfully",
        timestamp : new Date()
    });
};