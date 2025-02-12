import express,{Request,Response} from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { HotelType } from '../models/hotel';
import Hotel from '../models/hotel';
const router=express.Router();

const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5MB
    }
})


// api/my-hotels
router.post("/",
    upload.array("imageFiles",6),
    async(req:Request,res:Response)=>{
        try{
            const imageFiles=req.files as Express.Multer.File[];
            const newHotel:HotelType=req.body;


            const uploadPromises=imageFiles.map(async(image)=>{
                const b64=Buffer.from(image.buffer).toString("base64")
                let dataURI="data:" + image.mimetype + ";base64," + b64;
                const res=await cloudinary.v2.uploader.upload(dataURI)
                return res.url;
            });

            const imageUrls=await Promise.all(uploadPromises);
            newHotel.imageUrls=imageUrls;
            newHotel.lastUpdated=new Date();
            newHotel.userId=req.userId as string;

            const hotel=new Hotel(newHotel);
            await hotel.save()

            res.status(201).send(hotel);


        }catch(e){
            console.log("Error creating hotel:",e);
            res.status(500).json({message:"something went wrong"});
        }
})