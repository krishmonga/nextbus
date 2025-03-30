import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generatetoken.js";
//registering the user 
export const registerUser = async (req, res) => {
  console.log("Incoming Request Body:", req.body);  

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({ 
       id: user._id,
       name: user.name, 
       email: user.email, 
       token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};
//login 
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ 
       id: user._id, 
       name: user.name,
       email: user.email, 
       token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
