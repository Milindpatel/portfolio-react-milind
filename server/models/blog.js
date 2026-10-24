const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  title: { type: String, required: true, trim: true, maxlength: 96 },
  subTitle: { type: String, required: true, trim: true, maxlength: 256 },
  story: { type: String, required: true },
  // Stored as millisecond strings for compatibility with existing data.
  createdAt: { type: String, default: () => String(Date.now()) },
  updatedAt: { type: String, default: () => String(Date.now()) },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  author: { type: String, required: true },
});

blogSchema.statics.editableFields = ['title', 'subTitle', 'story', 'status'];

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
