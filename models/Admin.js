const { Schema, models, model, default: mongoose } = require("mongoose");

const AdminSchema = new Schema({
    mail: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

export const Admin = models?.Admin || model('Admin', AdminSchema);