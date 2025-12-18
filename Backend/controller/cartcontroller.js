
import usermodel from '../models/usermodel.js'



const addtocart = async (req, res) => {
  try {
    const { itemid, size } = req.body;
    const userid = req.user.id;

    if (!itemid || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required"
      });
    }

    const userdata = await usermodel.findById(userid);
    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartdata = userdata.cartdata || {};

    if (!cartdata[itemid]) {
      cartdata[itemid] = {};
    }

    cartdata[itemid][size] = 1; // only 1 allowed (frontend already restricts)

    await usermodel.findByIdAndUpdate(userid, { cartdata });

    res.json({ success: true, message: "Added to cart" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatecart = async (req, res) => {
  try {
    const { itemid, size, quantity } = req.body;
    const userid = req.user.id;

    const userdata = await usermodel.findById(userid);
    if (!userdata) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartdata = userdata.cartdata || {};

    if (!cartdata[itemid]) {
      cartdata[itemid] = {};
    }

    if (quantity === 0) {
      delete cartdata[itemid][size];
      if (Object.keys(cartdata[itemid]).length === 0) {
        delete cartdata[itemid];
      }
    } else {
      cartdata[itemid][size] = quantity;
    }

    await usermodel.findByIdAndUpdate(userid, { cartdata });

    res.json({ success: true, message: "Cart updated" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getusercart = async (req, res) => {
  try {
    const userid = req.user.id;

    const userdata = await usermodel.findById(userid);

    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      cartdata: userdata.cartdata || {}
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {getusercart,updatecart,addtocart}