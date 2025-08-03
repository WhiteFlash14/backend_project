import { asyncHandler } from "../utils/asyncHandler.js";  
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"; 
import {uploadOnCloudinary} from "../utils/cloudinary.js"; // Assuming you have a cloudinary setup for file uploads
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
   //console.log("email", email);

   // if (fullname === ""){
   //    throw new ApiError("Fullname is required", 400);
   // }

   if (
      [fullname, username, email, password].some(field => field?.trim() === "" )
   ) {
      throw new ApiError("All fields are required", 400);
   }
   
   const existedUser = await User.findOne({$or: [{username}, {email}]})
   

   if (existedUser) {
      throw new ApiError("User with email or username already exists", 409);
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath ;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path;
   }

   if (!avatarLocalPath) {
      throw new ApiError("Avatar is required", 400);
   }

   const avatar =await uploadOnCloudinary(avatarLocalPath)
   const coverImage =  await uploadOnCloudinary(coverImageLocalPath) ;

   if (!avatar) {
      throw new ApiError("Failed to upload avatar", 500);
   }

   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
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