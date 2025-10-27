// import jwt from "jsonwebtoken";
// import { createError } from "./error.js";
// import Cookies from 'js-cookie';
// export const verifyToken = (req, res, next) => {

//   // Extract the access token from the request cookies
//   const token = req.cookies.access_token;
 
//   // Check if the access token is present
  
//   if (!token)
//   { 
//     console.log("praveen"+token);
//     return next(createError(401, "You are not authenticated!"));
//   }
  
//    // Verify the access token using the provided JWT secret
//   jwt.verify(token, process.env.JWT, (err, user) => {

//     // Check if there is an error in token verification
//     if (err) return next(createError(403, "Token is not valid!"));

//    // If token is valid, attach the decoded user information to the request object
//     req.user = user;
//     next()
//   });
// };
