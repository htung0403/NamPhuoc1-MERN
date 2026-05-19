const express = require("express");
const { verifyToken } = require("../utils/verifyUser.js");
const cloudinary = require("../utils/cloudinary.js");
const { errorHandler } = require("../utils/error.js");
const { supabase, tables } = require("../config/supabase.js");

const router = express.Router();

router.post("/sign", verifyToken, (req, res) => {
  try {
    const { folder, resource_type } = req.body;
    const uploadResourceType = resource_type || "image";
    const format = uploadResourceType === "image" ? "webp" : undefined;

    const timestamp = Math.round(new Date().getTime() / 1000);

    const { eager } = req.body;

    const paramsToSign = {
      timestamp,
      folder: folder || "uploads",
      ...(format ? { format } : {}),
      ...(eager ? { eager } : {}),
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder,
      resource_type: uploadResourceType,
      ...(paramsToSign.format ? { format: paramsToSign.format } : {}),
      ...(paramsToSign.eager ? { eager: paramsToSign.eager } : {}),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo chữ ký Cloudinary" });
  }
});

router.post("/delete", verifyToken, async (req, res, next) => {
  try {
    const { public_id, resource_type } = req.body;

    if (!public_id) {
      return next(errorHandler(400, "public_id is required"));
    }

    const { data: postByImage, error: postByImageError } = await supabase
      .from(tables.posts)
      .select("id,userId,image")
      .ilike("image", `%${public_id}%`)
      .limit(1)
      .maybeSingle();

    if (postByImageError) {
      return next(errorHandler(500, postByImageError.message));
    }

    const { data: postByContent, error: postByContentError } = await supabase
      .from(tables.posts)
      .select("id,userId,content")
      .ilike("content", `%${public_id}%`)
      .limit(1)
      .maybeSingle();

    if (postByContentError) {
      return next(errorHandler(500, postByContentError.message));
    }

    const { data: userByAvatar, error: userByAvatarError } = await supabase
      .from(tables.users)
      .select("id,profilePicture")
      .ilike("profilePicture", `%${public_id}%`)
      .limit(1)
      .maybeSingle();

    if (userByAvatarError) {
      return next(errorHandler(500, userByAvatarError.message));
    }

    const ownerPost = postByImage || postByContent;

    if (!ownerPost && !userByAvatar) {
      return next(errorHandler(404, "Asset not found"));
    }

    const isOwnerPost = ownerPost && parseInt(ownerPost.userId, 10) === req.user.id;
    const isOwnerAvatar = userByAvatar && userByAvatar.id === req.user.id;

    if (!isOwnerPost && !isOwnerAvatar && !req.user.isAdmin) {
      return next(errorHandler(403, "You do not own this asset"));
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
      invalidate: true,
    });

    if (result.result === "ok") {
      res.status(200).json({ result: "ok" });
    } else if (result.result === "not found") {
      res.status(404).json({ result: "not found" });
    } else {
      next(errorHandler(500, "Failed to delete image"));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
