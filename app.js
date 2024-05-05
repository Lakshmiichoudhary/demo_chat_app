const express = require("express")
const bodyparser = require("body-parser")

const app = express()

app.use(bodyparser.urlencoded({extended:false}))

const loginRoute = require("./routes/login")

app.use(loginRoute)

app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not found</h1>')
})


app.listen(3000)