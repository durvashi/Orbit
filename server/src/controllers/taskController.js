import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Helper: confirm the user can access a given project
const userCanAccessProject = (project, user) => {
  if (user.role === 'admin') return true;
  return project.members.some((m) => m.equals(user._id));
};

// @desc    Get tasks (optionally filtered by project / status / assignee)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { project, status, assignee, mine } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (assignee) query.assignee = assignee;
    if (mine === 'true') query.assignee = req.user._id;

    // Restrict to projects the user is allowed to see
    if (req.user.role !== 'admin') {
      const accessible = await Project.find({
        members: req.user._id,
      }).select('_id');
      const ids = accessible.map((p) => p._id);
      query.project = query.project
        ? query.project
        : { $in: ids };
    }

    const tasks = await Task.find(query)
      .populate('assignee', 'name email avatarColor')
      .populate('createdBy', 'name email avatarColor')
      .populate('project', 'name status')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (project member)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignee, status, priority, dueDate } =
      req.body;

    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!userCanAccessProject(proj, req.user)) {
      return res
        .status(403)
        .json({ message: 'You cannot add tasks to this project' });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee: assignee || null,
      createdBy: req.user._id,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarColor')
      .populate('createdBy', 'name email avatarColor')
      .populate('project', 'name status');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (project member)
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!userCanAccessProject(task.project, req.user)) {
      return res
        .status(403)
        .json({ message: 'You cannot modify this task' });
    }

    const fields = [
      'title',
      'description',
      'assignee',
      'status',
      'priority',
      'dueDate',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignee', 'name email avatarColor')
      .populate('createdBy', 'name email avatarColor')
      .populate('project', 'name status');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (admin, project owner, or task creator)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = task.project.owner.equals(req.user._id);
    const isCreator = task.createdBy.equals(req.user._id);

    if (!isAdmin && !isOwner && !isCreator) {
      return res.status(403).json({
        message:
          'Only an admin, the project owner, or the task creator can delete this task',
      });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard statistics for the current user
// @route   GET /api/tasks/stats/overview
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    let projectFilter = {};
    if (req.user.role !== 'admin') {
      projectFilter = { members: req.user._id };
    }

    const projects = await Project.find(projectFilter).select('_id');
    const projectIds = projects.map((p) => p._id);

    const taskQuery =
      req.user.role === 'admin'
        ? {}
        : { project: { $in: projectIds } };

    const allTasks = await Task.find(taskQuery);

    const now = new Date();
    const stats = {
      totalProjects: projects.length,
      totalTasks: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'todo').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      done: allTasks.filter((t) => t.status === 'done').length,
      overdue: allTasks.filter(
        (t) =>
          t.dueDate &&
          t.status !== 'done' &&
          new Date(t.dueDate) < now
      ).length,
      assignedToMe: allTasks.filter(
        (t) => t.assignee && t.assignee.equals(req.user._id)
      ).length,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};
