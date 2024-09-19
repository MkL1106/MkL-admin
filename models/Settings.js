const { Schema, models, model, default: mongoose } = require("mongoose");

const SettingsSchema  = new Schema({
    product:{type:mongoose.Types.ObjectId, ref:'Product',required: true},
    price: {type: Number, required: true},
});

export const Settings = models?.Settings || model('Settings', SettingsSchema);