import Suppliers from "../Models/suppliers.js";
import { StatusCodes } from "http-status-codes";

const addSuppliers = async (req, res) => {
  try {
    const { companyName, email, phone, address, category, status } =
      req.body || {};
    if (!companyName || !email || !phone || !address || !category || !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All feilds must be profiveded",
      });
    }
    const supplier = await Suppliers.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({
      message: "supplier added successfully",
      supplier,
    });
  } catch (error) {
    console.error(`error ocured while adding supplier: ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wronge while adding a supplier",
    });
  }
};

const getSuliers = async (req,res)=>{

}

export default{
    addSuppliers
}