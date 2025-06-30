import jwt from 'jsonwebtoken';



export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // console.log("tried");
      
      let token = jwt.sign({
        Email:email,
        Password: password,
        role: 'ADMIN'
      }, process.env.JWTSECRET);
        res.header("Authorization", token);
        res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            role: 'ADMIN'
        }
        });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    // res.send('Admin login');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};