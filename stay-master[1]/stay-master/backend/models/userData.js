import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

const userDataModel = mongoose.models.UserData || mongoose.model("UserData", userDataSchema);
export default userDataModel


