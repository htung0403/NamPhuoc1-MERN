const express = require("express");
const { verifyToken } = require("../utils/verifyUser.js");
const { errorHandler } = require("../utils/error.js");
const { supabase, tables } = require("../config/supabase.js");

const router = express.Router();
const HOME_IMAGES_KEY = "home-images";

router.get("/home-images", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(tables.settings)
      .select("value")
      .eq("key", HOME_IMAGES_KEY)
      .maybeSingle();

    if (error) {
      return next(errorHandler(500, error.message));
    }

    res.status(200).json({ value: data?.value || null });
  } catch (error) {
    next(error);
  }
});

router.put("/home-images", verifyToken, async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update settings"));
  }

  try {
    const { value } = req.body;

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return next(errorHandler(400, "Invalid home image settings"));
    }

    const { data, error } = await supabase
      .from(tables.settings)
      .upsert({ key: HOME_IMAGES_KEY, value }, { onConflict: "key" })
      .select("value")
      .single();

    if (error) {
      return next(errorHandler(500, error.message));
    }

    res.status(200).json({ value: data.value });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
