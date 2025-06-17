import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(9, "phone number is too short"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type LoginType = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z.string().min(2, "Name is too short"),
  phone: z.string().min(9, "Phone number is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  invitationCode: z.string().optional(),
  transactionPassword: z
    .string()
    .min(8, "Transaction password must be at least 8 characters long")
    .optional(),

  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long"),
});
export type SignupType = z.infer<typeof signupSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  photo: z.any().optional(), // Accept any file type, validation can be handled elsewhere
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long")
    .optional(),
});
export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const createGroupSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  isPublic: z.boolean(),
});
export type CreateGroupType = z.infer<typeof createGroupSchema>;
export const depositSchema = z.object({
  amount: z.coerce // Use z.coerce for string-to-number conversion from form input
    .number({
      required_error: "Amount is required.",
      invalid_type_error: "Amount must be a number.",
    })
    .positive({ message: "Amount must be greater than 0." }),
  // method: z.string().min(1, "Payment method is required."), // Add this back if your backend uses it
  photo: z
    .string() // Expecting a raw Base64 string
    .min(1, "Payment proof photo is required."),
  // Optional: Add a regex or custom refinement to check if it's a valid Base64 string
  // .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, "Invalid Base64 format")
});
export type DepositType = z.infer<typeof depositSchema>;

export const withdrawSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  transactionPassword: z
    .string()
    .min(8, "Transaction password must be at least 8 characters long"),
});
export type WithdrawType = z.infer<typeof withdrawSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number is too short"),
  // photo: z.any().optional(), // Accept any file type, validation can be handled elsewhere
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long")
    .optional(),
});

export const depositHistorySchema = z.object({
  searchTerm: z.string().optional(),
  currentPage: z.coerce.number().int().positive().optional(),
  row: z.coerce.number().int().positive().optional(),
});
export type DepositHistoryType = z.infer<typeof depositHistorySchema>;

export const withdrawHistorySchema = z.object({
  searchTerm: z.string().optional(),
  currentPage: z.coerce.number().int().positive().optional(),
  row: z.coerce.number().int().positive().optional(),
});
export type WithdrawHistoryType = z.infer<typeof withdrawHistorySchema>;

export const productSchema = z.object({
  // id: z.string(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  orderNumber: z
    .number()
    .int()
    .min(1, "Order number must be a positive integer"),
});
export type ProductType = z.infer<typeof productSchema>;

export const companyAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  account: z.string().min(1, "Account is required"),
});
export type companyAccountType = z.infer<typeof companyAccountSchema>;
