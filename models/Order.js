const { Schema,model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items:Object,
    phoneNumber:String,
    duureg:String,
    horoo:String,
    hothon:String,
    bair:String,
    orts:String,
    floor:String,
    toot:String,
    code:String,
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);