const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    assignedTo: {
      type: String,
      default: '',
      trim: true,
    },

    category: {
      type: String,
      default: 'General',
      enum: ['Development', 'Design', 'Testing', 'Research']
    },

    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],
    },

    priority: {
      type: String,
      default: 'Medium',
      enum: ['Low', 'Medium', 'High'],
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual 'id'
taskSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Clean JSON response
taskSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;

    if (ret.userId && typeof ret.userId === 'object') {
      ret.userId = ret.userId.toString();
    }

    return ret;
  },
});

module.exports = mongoose.model('Task', taskSchema);