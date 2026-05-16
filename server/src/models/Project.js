import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'on-hold', 'completed', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Ensure the owner is always part of the members list
projectSchema.pre('save', function (next) {
  if (!this.members.some((m) => m.equals(this.owner))) {
    this.members.push(this.owner);
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
