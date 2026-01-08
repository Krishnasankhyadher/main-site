import { v2 as cloudinary } from "cloudinary";
import productmodel from "../models/productmodel.js";

const addproduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      subcategory,
      size,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

   

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageurl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const productdata = {
      name,
      description,
      price: Number(price),
      image: imageurl,
      category,
      subcategory,
      sizes: JSON.parse(size),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
    };
 



    const product = new productmodel(productdata)
    await product.save()

    res.json({success:true, message:"product added"})

 
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const listproduct = async (req, res) => {
    try {
        const products =await productmodel.find({})
        res.json({success:true, products})
    } catch (error) {
         console.log(error);
    res.json({ success: false, message: error.message });
  }
    }

const removeproduct = async (req, res) => {
    try {
        await productmodel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"product removed"})
    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }
};
const singleproduct = async (req, res) => {
try {
      const {productid}=req.body 
    const product= await productmodel.findById(productid)
    res.json({success:true, product})
} catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
}
  
};
const editproduct = async (req, res) => {
  try {
 

    const {
      productid,
      name,
      description,
      price,
      category,
      subcategory,
      size,
      bestseller,
    } = req.body;

    const product = await productmodel.findById(productid);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Handle new images (optional)
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    let imageurl = product.image; // default = old images

    if (images.length > 0) {
      imageurl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.sizes = size ? JSON.parse(size) : product.sizes;
    product.bestseller =
      bestseller !== undefined ? bestseller === "true" : product.bestseller;
    product.image = imageurl;

    await product.save();

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { addproduct, singleproduct, listproduct, removeproduct, editproduct };
