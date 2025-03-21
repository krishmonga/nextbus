import mongoose from "mongoose";

const busSchema = mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
});

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
