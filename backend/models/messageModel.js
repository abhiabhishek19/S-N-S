import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
	  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
	  sender: { type: mongoose.Schema.Types.Mixed, ref: "User" }, // Mixed allows "ai" or ObjectId
	  text: String,
	  seen: {
		type: Boolean,
		default: false,
	  },
	  img: {
		type: String,
		default: "",
	  },
	},
	{ timestamps: true }
  );
  

const Message = mongoose.model("Message", messageSchema);

export default Message;