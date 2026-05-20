const express = require("express");
const path = require("path");
const { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { verifyToken } = require("../utils/verifyUser.js");
const { errorHandler } = require("../utils/error.js");

const router = express.Router();

const PDF_BUCKET = process.env.R2_BUCKET;
const PDF_UPLOAD_LIMIT = 20 * 1024 * 1024;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");

const requiredEnv = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_BASE_URL",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

const r2Client =
  missingEnv.length === 0
    ? new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

const sanitizeFileName = (fileName = "document.pdf") => {
  const parsedName = path.parse(decodeURIComponent(fileName));
  const baseName = parsedName.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${baseName || "document"}.pdf`;
};

const ensureR2Configured = () => {
  if (missingEnv.length > 0 || !r2Client) {
    throw errorHandler(500, `Thiếu cấu hình R2: ${missingEnv.join(", ")}`);
  }
};

const getR2KeyFromPublicUrl = (url = "") => {
  if (!R2_PUBLIC_BASE_URL || !url.startsWith(`${R2_PUBLIC_BASE_URL}/`)) {
    return "";
  }

  return decodeURIComponent(url.slice(R2_PUBLIC_BASE_URL.length + 1).split(/[?#]/)[0]);
};

router.post(
  "/pdf",
  verifyToken,
  express.raw({ type: "application/pdf", limit: PDF_UPLOAD_LIMIT }),
  async (req, res, next) => {
    try {
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return next(errorHandler(400, "Chưa chọn tệp PDF"));
      }

      ensureR2Configured();

      const headerFileName = req.get("X-File-Name") || "document.pdf";
      const fileName = sanitizeFileName(headerFileName);
      const storageKey = `documents/${new Date().toISOString().slice(0, 7)}/${Date.now()}-${fileName}`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: PDF_BUCKET,
          Key: storageKey,
          Body: req.body,
          ContentType: "application/pdf",
          CacheControl: "public, max-age=3600",
        })
      );

      res.status(200).json({
        url: `${R2_PUBLIC_BASE_URL}/${storageKey}`,
        path: storageKey,
        bucket: PDF_BUCKET,
        size: req.body.length,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/pdf", verifyToken, express.json(), async (req, res, next) => {
  try {
    const { path: storagePath } = req.body;

    if (!storagePath) {
      return next(errorHandler(400, "storage path is required"));
    }

    ensureR2Configured();

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: PDF_BUCKET,
        Key: storagePath,
      })
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/pdf/*", async (req, res, next) => {
  try {
    ensureR2Configured();

    const storagePath = req.params[0];
    if (!storagePath) {
      return next(errorHandler(400, "storage path is required"));
    }

    const result = await r2Client.send(
      new GetObjectCommand({
        Bucket: PDF_BUCKET,
        Key: storagePath,
      })
    );

    res.setHeader("Content-Type", result.ContentType || "application/pdf");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Accept-Ranges", "bytes");
    if (result.ContentLength) {
      res.setHeader("Content-Length", result.ContentLength);
    }

    result.Body.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post("/pdf-proxy", express.json(), async (req, res, next) => {
  try {
    ensureR2Configured();

    const storagePath = getR2KeyFromPublicUrl(req.body.url);
    if (!storagePath) {
      return next(errorHandler(400, "R2 PDF URL không hợp lệ"));
    }

    res.status(200).json({
      url: `/api/storage/pdf/${encodeURI(storagePath)}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
