const express = require('express')
const mangaRouter = require('./routes/mangaRoutes')
const adminRouter = require('./routes/adminRoutes')
const adminLoginRouter = require('./routes/adminLoginRoutes')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "Invalid JSON syntax!" })
  }
  next()
})

app.use("/admin", adminRouter)
app.use("/admin", adminLoginRouter)
app.use("/manga", mangaRouter)

// using route() method to get the invalid routes
app.route('*')
  .get((req, res) => {
    res.status(400).send("Invalid route!")
  })
  .put((req, res) => {
    res.status(400).send("Invalid route!")
  })
  .post((req, res) => {
    res.status(400).send("Invalid route!")
  })
  .delete((req, res) => {
    res.status(400).send("Invalid route!")
  })

app.listen(8000, () => {
  console.log(process.env.JWT_SECRET)
  console.log("Server is running on 8000...")
})
