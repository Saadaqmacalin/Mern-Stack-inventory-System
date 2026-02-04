import Joi from "joi";

const customerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Customer name is required",
  }),
  email: Joi.string().email().optional().allow(""),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
  }),
  address: Joi.string().optional().allow("")
});

export { customerSchema };
