class AdminLogin {
  async loginAdmin(body) {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "..", "data", "admin.json"),
        {
          encoding: "utf-8",
        }
      );

      const adminArray = JSON.parse(data);
      console.log(adminArray)
      const admin = adminArray.find((element) => element.name === body.name);

      if (admin) {
        const passwordMatch = await bcrypt.compare(body.password, admin.password);

        if (passwordMatch) {
          // now we have to give admin a JWT, so that she can use the token for authentication.
          // npm i jsonwebtoken
          // jwt.sign - data and secret password (resides in the server)
          // so that the data can be signed by this secret code then admin can use the signed code 
          const token = jwt.sign(
            {
              name: admin.name,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '2 days',
            }
          );

          return {
            success: true,
            message: "Successfully logged in!",
            data: token,
          };
        } else {
          return {
            success: false,
            message: "Invalid password!",
          };
        }
      } else {
        return {
          success: false,
          message: "Admin not found!",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Internal server error!",
      };
    }
  }
}

module.exports = new AdminLogin();