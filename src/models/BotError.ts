import mongoose from "mongoose"
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
    message: mongoose.SchemaTypes.Mixed,
    errorMessage: String,
    time: {
        type: Date,
        default: () => Date.now()
    },
    command: String
})

export default mongoose.model("Error", ErrorSchema);
