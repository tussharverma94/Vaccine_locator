const express = require("express")
const app = express()
const main_route = require("./Routes/route")
// const adult = require("./Routes/adult")
const SERVER_PORT = process.env.PORT || 4444

app.set("view engine", "hbs")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/", main_route)

app.listen(SERVER_PORT, () =>{
    console.log("Server Started at : http://localhost:" + SERVER_PORT)
})