const slugify = require('slugify');
const Blog = require('../models/blog');
const { pick, sanitizeStory } = require('../services/sanitize');

// Guards against double submits: the editor sends a random lockId per page
// and a second create with the same id within a few seconds is rejected.
const recentLocks = new Map();
const LOCK_MS = 5000;

function acquireLock(lockId) {
  const now = Date.now();
  for (const [id, at] of recentLocks) if (now - at > LOCK_MS) recentLocks.delete(id);
  if (!lockId) return true;
  if (recentLocks.has(lockId)) return false;
  recentLocks.set(lockId, now);
  return true;
}

async function uniqueSlug(title, excludeId) {
  const base = slugify(title, { lower: true, strict: true }) || 'post';
  let slug = base;
  for (let n = 2; await Blog.exists({ slug, _id: { $ne: excludeId } }); n++) {
    slug = `${base}-${n}`;
  }
  return slug;
}

function cleanInput(body) {
  const data = pick(body, Blog.editableFields);
  if (data.story !== undefined) data.story = sanitizeStory(data.story);
  return data;
}

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 }).select('-__v');
  res.json(blogs);
};

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' }).select('-__v');
  if (!blog) return res.status(404).json({ title: 'Not found' });
  res.json(blog);
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).select('-__v');
  if (!blog) return res.status(404).json({ title: 'Not found' });
  res.json(blog);
};

exports.getUserBlogs = async (req, res) => {
  const blogs = await Blog.find({ userId: req.auth.sub }).sort({ createdAt: -1 }).select('-__v');
  res.json(blogs);
};

exports.createBlog = async (req, res) => {
  if (!acquireLock(req.query.lockId)) {
    return res.status(409).json({ message: 'Blog is getting saved!' });
  }

  const blog = new Blog(cleanInput(req.body));
  blog.status = 'draft';
  blog.userId = req.auth.sub;
  blog.author = req.auth.name || req.auth.nickname || 'Anonymous';
  await blog.save();
  res.status(201).json(blog);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ title: 'Not found' });

  blog.set(cleanInput(req.body));
  if (blog.status === 'published' && !blog.slug) {
    blog.slug = await uniqueSlug(blog.title, blog._id);
  }
  blog.updatedAt = String(Date.now());
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const deleted = await Blog.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ title: 'Not found' });
  res.json({ status: 'deleted' });
};
