import express,{Request,Response} from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { HotelType } from '../shared/types';
import Hotel from '../models/hotel';
import verifyToken from '../middleware/auth';
import { body } from 'express-validator';
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
    verifyToken,[
        body("Name").notEmpty().withMessage('Name is required'),
        body("City").notEmpty().withMessage('City is required'),
        body("Country").notEmpty().withMessage('Country is required'),
        body("Description").notEmpty().withMessage('Decription is required'),
        body("Type").notEmpty().withMessage('Type is required'),
        body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
        body("Facilities").notEmpty().isArray().withMessage('Facilities is required'),
        body("").notEmpty().withMessage('Name is required'),

    ],
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

router.get("/",verifyToken,async(req:Request,res:Response)=>{
    const hotels=await Hotel.find({userId:req.userId});
    res.json(hotels);

    try{

    }catch(error){
        res.status(500).json({message:"Error fetching hotels"})
    }
});

export default router;