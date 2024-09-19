import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Settings } from "@/models/Settings";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if(method === 'GET'){ 
        res.json(await Settings.find());  
    }

    if (method === 'POST'){
        const {_id,product,price} = req.body;
        const SettingsDoc = await Settings.create({product,price,});
        res.json(SettingsDoc);
    }

    if(method === 'PUT'){
        const {product,price,} = req.body;
        await Settings.updateOne({}, {product,price});
        res.json(true);
        
    }
} 