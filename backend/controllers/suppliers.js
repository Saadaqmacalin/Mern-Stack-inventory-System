import { STATES } from "mongoose";
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
      error: error.message,
    });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Suppliers.find({});
    if (!suppliers || suppliers === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not Found a supplier",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ TotalSuppliers: suppliers.length, suppliers });
  } catch (error) {
    console.error(`error ocured while getting all the suppliers: ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "something went wronge while getting the suppliers",
      error: error.message,
    });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Suppliers.findById(id);
    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Supplier not found",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "here is your supplier", supplier });
  } catch (error) {
    console.error(`error ocured while getting a single supplier : ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wronge while getting a supplier",
      error: error.message,
    });
  }
};

const UpdateSupplier = async (req, res) => {
  try {
    const { id } = req.param;
    const { companyName, email, phone, address, category, status } = req.body;
    if ((!companyName, !email, !phone, !address, !category, !status)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "please profide at least one feild to " });
    }
    const supplier = await Suppliers.findByIdAndUpdate(
      id,
      {
        companyName,
        email,
        phone,
        address,
        category,
        status,
      },
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Not Found the supplier you want to update" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Supplier updated successfully", supplier });
  } catch (error) {
    console.error(`error ocured while while updating a supplier`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wronge while updatting a supplier",
      error: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.body;
    const supplier = await Suppliers.findByIdAndDelete(id);
    if (!supplier) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not Found the supplier you want to delete",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "the supplier has been deleted successfully" });
  } catch (error) {
    console.error(`error ocured while deleting a supplier: ${error}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR),
      json({
        message: "Something went wronge while deleting a supplier",
        error: error.message,
      });
  }
};

export default {
  addSuppliers,
  getSuppliers,
  getSupplierById,
  UpdateSupplier,
  deleteSupplier
};
