import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // ✅ Unique ID for each task
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  randomTime: { type: String, required: true },
});

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [taskSchema], // ✅ Now tasks will have a unique _id
  },
  { timestamps: true }
);

listSchema.index({ userId: 1, name: 1 }, { unique: true });

const List = mongoose.model("List", listSchema);
export default List;
