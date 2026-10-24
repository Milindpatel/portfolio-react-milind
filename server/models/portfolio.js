const mongoose = require('mongoose');

const requiredString = (maxlength) => ({ type: String, required: true, trim: true, maxlength });

const portfolioSchema = new mongoose.Schema({
  userId: requiredString(512),
  title: requiredString(256),
  company: requiredString(256),
  location: requiredString(128),
  position: requiredString(256),
  description: requiredString(2048),
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    validate: {
      validator(value) {
        return !value || !this.startDate || value >= this.startDate;
      },
      message: 'End date cannot be before start date',
    },
  },
});

/** Fields a client is allowed to set. */
portfolioSchema.statics.editableFields = ['title', 'company', 'location', 'position', 'description', 'startDate', 'endDate'];

module.exports = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
