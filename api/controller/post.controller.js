const slugify = require("slugify");
const { errorHandler } = require("../utils/error.js");
const pako = require("pako");
const { supabase, tables } = require("../config/supabase.js");

const DEFAULT_POST_IMAGE =
  "https://res.cloudinary.com/dj76zuir1/image/upload/v1779141843/ChatGPT_Image_May_19_2026_05_03_45_AM_etbdmu.png";

const resolvePostImage = (image) => {
  if (typeof image !== "string") return DEFAULT_POST_IMAGE;
  const normalizedImage = image.trim();
  return normalizedImage || DEFAULT_POST_IMAGE;
};

module.exports = {
  create: async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const { title, content, image, category, isCompressed, isFile } = req.body;

    let decompressedContent = content;
    if (isCompressed) {
      try {
        const compressedData = Buffer.from(content, "base64");
        const inflatedContent = pako.inflate(compressedData, { to: "string" });
        decompressedContent = JSON.parse(inflatedContent);
      } catch (error) {
        console.error("Error decompressing content:", error);
        return next(errorHandler(400, "Invalid compressed content"));
      }
    }

    const slug = slugify(req.body.title, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    try {
      const { data: savedPost, error } = await supabase
        .from(tables.posts)
        .insert({
          title,
          content: decompressedContent,
          image: resolvePostImage(image),
          category,
          isFile: Boolean(isFile),
          slug,
          userId: req.user.id,
        })
        .select("*")
        .single();

      if (error) {
        return next(errorHandler(500, error.message));
      }

      res.status(201).json(savedPost);
    } catch (error) {
      next(error);
    }
  },

  getposts: async (req, res, next) => {
    try {
      const userId = req.query.userId;
      const postId = req.query.postId;
      const category = req.query.category;
      const slug = req.query.slug;
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

      console.log('Query parameters:', { userId, postId, category, slug, startIndex, limit, sortDirection });

      let query = supabase
        .from(tables.posts)
        .select("*", { count: "exact" })
        .order("createdAt", { ascending: sortDirection === "ASC" });

      if (userId) query = query.eq("userId", userId);
      if (postId) query = query.eq("id", postId);
      if (category) query = query.eq("category", category);
      if (slug) query = query.eq("slug", slug);

      const { data: posts, count: totalPosts, error } = await query.range(
        startIndex,
        startIndex + limit - 1
      );

      if (error) {
        return res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }

      console.log(`Found ${posts.length} posts out of ${totalPosts} total`);

      const normalizedPosts = (posts || []).map((post) => ({
        ...post,
        image: resolvePostImage(post.image),
      }));

      res.status(200).json({
        posts: normalizedPosts,
        totalPosts,
      });
    } catch (error) {
      console.error('Error in getposts:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  getpostsTinTucSuKien: async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === "asc" ? "ASC" : "DESC";

      const { data: posts, count: totalPosts, error } = await supabase
        .from(tables.posts)
        .select("*", { count: "exact" })
        .in("category", ["su-kien", "tin-tuc"])
        .order("updatedAt", { ascending: sortDirection === "ASC" })
        .range(startIndex, startIndex + limit - 1);

      if (error) {
        return next(errorHandler(500, error.message));
      }

      res.status(200).json({
        posts,
        totalPosts,
      });
    } catch (error) {
      next(error);
    }
  },

  deletepost: async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId, 10);
      const { data: post, error: findError } = await supabase
        .from(tables.posts)
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (findError) {
        return next(errorHandler(500, findError.message));
      }

      if (!post) {
        return next(errorHandler(404, "Post not found"));
      }

      if (parseInt(post.userId, 10) !== req.user.id && !req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to delete this post"));
      }

      const { error: deleteError } = await supabase
        .from(tables.posts)
        .delete()
        .eq("id", postId);

      if (deleteError) {
        return next(errorHandler(500, deleteError.message));
      }

      res
        .status(200)
        .json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  updatepost: async (req, res, next) => {
    try {
      const postId = parseInt(req.params.postId, 10);
      const { data: post, error: findError } = await supabase
        .from(tables.posts)
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (findError) {
        return next(errorHandler(500, findError.message));
      }

      if (!post) {
        return next(errorHandler(404, "Post not found"));
      }

      if (parseInt(post.userId, 10) !== req.user.id && !req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to update this post"));
      }

      const { data: updatedPost, error: updateError } = await supabase
        .from(tables.posts)
        .update({
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: resolvePostImage(req.body.image),
          isFile: Boolean(req.body.isFile),
        })
        .eq("id", postId)
        .select("*")
        .single();

      if (updateError) {
        return next(errorHandler(500, updateError.message));
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  },
};
