import { asyncHandler } from "../utils/asyncHandler.js";  
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js"; 
import {uploadonCloudinary} from "../utils/cloudinary.js"; // Assuming you have a cloudinary setup for file uploads
import ApiResponse from "../utils/ApiResponse.js"; // Importing ApiResponse class

const registerUser  = asyncHandler(async (req, res) => {
   // get user details from frontend
   // vaildation-not empty
   // check if user already exists: username or email
   // check for images , check for avatar
   // upload them to cloudinary,avatar
   // create user object - create entry in database
   // remove password and refresh token from response
   // check for user creation
   // return response
   

   const {username, email, fullname, password} = req.body 
   console.log("email", email);

   // if (fullname === ""){
   //    throw new ApiError("Fullname is required", 400);
   // }

   if (
      [fullname, username, email, password].some(field => field?.trim() === "" )
   ) {
      throw new ApiError("All fields are required", 400);
   }
   
   const existedUser = User.findOne({$or: [{username}, {email}]})
   

   if (existedUser) {
      throw new ApiError("User with email or username already exists", 409);
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if (!avatarLocalPath) {
      throw new ApiError("Avatar is required", 400);
   }

   const avatar =await uploadonCloudinary(avatarLocalPath)
   const coverImage =  await uploadonCloudinary(coverImageLocalPath) ;

   if (!avatar) {
      throw new ApiError("Failed to upload avatar", 500);
   }

   User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
   // res.status(200).json({
   //      message:"ok"
   //   })
})

   const createdUser = await User.findById(user._id).select("-password -refreshToken");

   if (!createdUser) {
      throw new ApiError("Something went wrong while registering the user", 500);
   }

   return res.status(201).json( 
      new ApiResponse(200, createdUser,"User registered successfully" )
   );
})

export { registerUser };