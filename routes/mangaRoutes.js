const express = require('express')
const routes = express()
const mangaController = require('../controller/mangaController')
const BuyMangaController = require('../controller/buyMangaController')
const createValidation = require('../middleware/validation')
const checkLogin = require('../middleware/checkLogin')
const buyMangaController = require('../controller/buyMangaController')


routes.get("/all", checkLogin, mangaController.getAll)
routes.get("/detail/:id", mangaController.getOneById)
routes.delete("/delete", mangaController.deleteOneById)
routes.put("/up/:id", checkLogin, createValidation.create, mangaController.create, mangaController.updateOneById)
routes.post("/create", checkLogin, createValidation.create, mangaController.create, mangaController.add)
routes.get("/sortbyid", mangaController.sortById)
routes.get("/sortbyname", mangaController.sortDataByName)
routes.get("/stockandprice/:stock/:price", mangaController.getByPriceAndStock)

routes.get("/buy/:userId/:mangaId", buyMangaController.buyMangaFunc)

module.exports = routes