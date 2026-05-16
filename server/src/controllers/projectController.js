import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all projects the user belongs to
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    // Admins see every project; members see only those they belong to
    const filter =
      req.user.role === 'admin' ? {} : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role')
      .sort({ createdAt: -1 });

    // Attach lightweight task counts to each project
    const withCounts = await Promise.all(
      projects.map(async (p) => {
        const tasks = await Task.find({ project: p._id }).select('status');
        return {
          ...p.toObject(),
          taskCount: tasks.length,
          completedCount: tasks.filter((t) => t.status === 'done').length,
        };
      })
    );

    res.json(withCounts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project by id
// @route   GET /api/projects/:id
// @access  Private (member of project)
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some((m) =>
      m._id.equals(req.user._id)
    );
    if (!isMember && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You do not have access to this project' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (admin only)
export const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: Array.isArray(members) ? members : [],
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (admin or owner)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only the owner or an admin can edit this project' });
    }

    const { name, description, status, members } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (Array.isArray(members)) project.members = members;

    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project (and its tasks)
// @route   DELETE /api/projects/:id
// @access  Private (admin only)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project and its tasks were deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private (admin or owner)
export const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only the owner or an admin can manage members' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.some((m) => m.equals(userId))) {
      return res
        .status(400)
        .json({ message: 'User is already a member of this project' });
    }

    project.members.push(userId);
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (admin or owner)
export const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Only the owner or an admin can manage members' });
    }

    if (project.owner.equals(req.params.userId)) {
      return res
        .status(400)
        .json({ message: 'The project owner cannot be removed' });
    }

    project.members = project.members.filter(
      (m) => !m.equals(req.params.userId)
    );
    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor role');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};
