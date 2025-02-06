import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    isSubscribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    SubscribedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;