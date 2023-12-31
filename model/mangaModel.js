const fs = require("fs")
const fsPromise = require("fs").promises
const path = require("path")

class Product {
  // Getting the date
  async getTimeFunc() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const hour = new Date().getHours()
    const minute = new Date().getMinutes()
    const second = new Date().getSeconds()
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    return formattedDate
  }
  // Get all
  async getAll() {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "manga.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        // Just an example of destructuring
        const dataJson = JSON.parse(data)
        const { id, name, price, stock, author } = dataJson[0]
        console.log("id: ", id)
        console.log("name: ", name)
        console.log("price: ", price)

        return {
          success: true,
          message: "Successfully found data!",
          data: dataJson
        }
      })
      .catch((error) => {
        return {
          success: false,
          message: "Cannot find data!"
        }
      })
  }

  // get manga by stock and price
  async getByPriceAndStock(stock, price) {
    // Reading the manga.json file
    return (
      fsPromise
        .readFile(path.join(__dirname, "..", "data", "manga.json"), {
          encoding: "utf-8",
        })
        // Promise resolve
        .then((data) => {
          // Looking for the object in manga.json
          const findData = JSON.parse(data).filter((element) => {
            return element.stock === stock && element.price === price
          })
          // If id is found --
          if (findData.length > 0) {
            return {
              success: true,
              message: "Successfully found data!",
              data: findData
            }
          }
          // If id is not found --
          else {
            return {
              success: false,
              message: "Please enter a valid stock and price!",
            }
          }
        })
        // Promise reject
        .catch((error) => {
          return {
            success: false,
            message: "Internal server error!",
          }
        })
    )
  }

  // Get one by id
  async getOneById(id) {
    // Reading the manga.json file
    return (
      fsPromise
        .readFile(path.join(__dirname, "..", "data", "manga.json"), {
          encoding: "utf-8",
        })
        // Promise resolve
        .then((data) => {
          // Looking for the id in manga.json
          const findData = JSON.parse(data).find((element) => {
            return element.id === id
          })
          // If id is found --
          if (findData) {
            return {
              success: true,
              message: "Successfully found data!",
              data: findData,
            }
          }
          // If id is not found --
          else {
            return {
              success: false,
              message: "Please enter a valid id!",
            }
          }
        })
        // Promise reject
        .catch((error) => {
          return {
            success: false,
            message: "Internal server error!",
          }
        })
    )
  }

  // Delete one by id
  async deleteOneById(id) {
    // Reading the file
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "manga.json"), {
        encoding: "utf-8",
      })
      .then(async (data) => {
        const jsonData = JSON.parse(data)
        const dataToKeep = jsonData.filter((element) => element.id !== id)

        if (dataToKeep.length < jsonData.length) {
          await fsPromise.writeFile(
            path.join(__dirname, "..", "data", "manga.json"),
            JSON.stringify(dataToKeep),
            { encoding: "utf-8" }
          )

          // Append timestamp to the log file
          await fsPromise.appendFile(
            path.join(__dirname, "..", "data", "timestamp_log.log"),
            "Data deleted: " + (await this.getTimeFunc()) + "\n",
            { encoding: "utf-8" }
          )
          return {
            success: true,
            message: "Successfully deleted data!",
            data: dataToKeep,
          }
        } else {
          return {
            success: false,
            message: "ID not found!",
          }
        }
      })
      .catch((error) => {
        return { success: false, message: "Internal server error!" }
      })
  }

  // Update one by id
  async updateOneById(id, updatedManga) {
    // Reading the file
    const data = await fsPromise.readFile(
      path.join(__dirname, "..", "data", "manga.json"),
      {
        encoding: "utf-8",
      }
    )
    const updateManga = JSON.parse(data)
    const idx = updateManga.findIndex((element) => element.id == id)
    if (idx >= 0) {
      updateManga[idx] = { ...updateManga[idx], ...updatedManga }
      console.log(updateManga[idx])

      // Write in the file
      await fsPromise.writeFile(
        path.join(__dirname, "..", "data", "manga.json"),
        JSON.stringify(updateManga),
        { encoding: "utf-8" }
      )
      // Append timestamp to the log file
      await fsPromise.appendFile(
        path.join(__dirname, "..", "data", "timestamp_log.log"),
        "Data updated: " + (await this.getTimeFunc()) + "\n",
        { encoding: "utf-8" }
      )
      return { success: true, message: "Manga updated successfully" }
    } else {
      return { success: false, message: "Enter a valid ID" }
    }
  }

  //add to the json file
  async add(body) {
    try {
      // Read the file
      const data = await fsPromise.readFile(
        path.join(__dirname, "..", "data", "manga.json"),
        {
          encoding: "utf-8",
        }
      )

      if (data) {
        const newManga = body

        const jsonData = JSON.parse(data)
        const lastId = jsonData.length > 0 ? jsonData[jsonData.length - 1].id : 0

        const newData = {
          id: lastId + 1,
          ...newManga,
        }
        jsonData.push(newData)

        // Write in the file
        await fsPromise.writeFile(
          path.join(__dirname, "..", "data", "manga.json"),
          JSON.stringify(jsonData),
          { encoding: "utf-8" }
        )

        // Append timestamp to the log file
        await fsPromise.appendFile(
          path.join(__dirname, "..", "data", "timestamp_log.log"),
          "Data added: " + (await this.getTimeFunc()) + "\n",
          { encoding: "utf-8" }
        )
        return { success: true, message: "Manga added successfully" }
      } else {
        return { success: false, message: "Data not found!" }
      }
    } catch (error) {
      return { success: false, message: "Error reading file or parsing JSON" }
    }
  }

  //sort data by id (ascending order)
  async sortDataById() {
    try {
      const data = await fsPromise.readFile(
        path.join(__dirname, "..", "data", "manga.json"),
        { encoding: "utf-8" }
      )

      const jsonData = JSON.parse(data)

      jsonData.sort((a, b) => {
        const idA = a.id
        const idB = b.id

        if (idA < idB) {
          return -1
        }
        if (idA > idB) {
          return 1
        }
        return 0
      })

      await fsPromise.writeFile(
        path.join(__dirname, "..", "data", "manga.json"),
        JSON.stringify(jsonData),
        { encoding: "utf-8" }
      )

      // Append timestamp to the log file
      await fsPromise.appendFile(
        path.join(__dirname, "..", "data", "timestamp_log.log"),
        "Data sorted by id: " + (await this.getTimeFunc()) + "\n",
        { encoding: "utf-8" }
      )

      return { success: true, message: "Data sorted successfully" }
    } catch (error) {
      return { success: false, message: "Error sorting data" }
    }
  }

  //sort data by name (descending order)
  async sortDataByName() {
    try {
      const data = await fsPromise.readFile(
        path.join(__dirname, "..", "data", "manga.json"),
        { encoding: "utf-8" }
      )

      const jsonData = JSON.parse(data)

      jsonData.sort((a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()

        if (nameA < nameB) {
          return 1
        }
        if (nameA > nameB) {
          return -1
        }
        return 0
      })

      await fsPromise.writeFile(
        path.join(__dirname, "..", "data", "manga.json"),
        JSON.stringify(jsonData),
        { encoding: "utf-8" }
      )

      // Append timestamp to the log file
      await fsPromise.appendFile(
        path.join(__dirname, "..", "data", "timestamp_log.log"),
        "Data sorted by name: " + (await this.getTimeFunc()) + "\n",
        { encoding: "utf-8" }
      )

      return { success: true, message: "Data sorted successfully" }
    } catch (error) {
      return { success: false, message: "Error sorting data" }
    }
  }
}

module.exports = new Product()
