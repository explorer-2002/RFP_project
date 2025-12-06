import { Vendor } from "../models/vendors.js";

const vendors = [
    {
        name: "Anmol Tech Supply Co.",
        contact: "7006752892",
        email: "anmoljain806@gmail.com"
    },

    {
        name: "Rajan Enterprises",
        contact: "7780928682",
        email: "rajanjain0006@gmail.com"
    },

    {
        name: "Sanyam Tech.Co",
        contact: "6006793481",
        email: "s63741246@gmail.com"
    }
]

export const storeVendors = async () => {
    const result = await Vendor.insertMany(vendors);
}