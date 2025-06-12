import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";

const useAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again",
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // ✅ FIXED HERE
        } else {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again",
            });
        }

        next();
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};

export default useAuth;
