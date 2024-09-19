import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Admin } from "@/models/Admin";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if(method === 'GET'){ 
        res.json(await Admin.find()); 
    }

    if (method === 'POST'){
        const {mail} = req.body;
        const adminDoc = await Admin.create({mail,});
        res.json(adminDoc);
    }  

    if(method === 'DELETE'){
        const {_id} = req.query;
        await Admin.deleteOne({_id});
        res.json('ok')
    }
} 