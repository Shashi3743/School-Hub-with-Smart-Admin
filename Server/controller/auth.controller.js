// middleware/authMiddleware.js
import pkg from 'jsonwebtoken';
const { verify } = pkg;



export function authCheck(req, res) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = verify(token, process.env.JWTSECRET);
      req.user = decoded; 
     res.status(200).json({...decoded})
    } catch (error) {
        console.log("Error", error)
      res.status(401).json({ message: 'Token is not valid' });
    }
  }



