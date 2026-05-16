import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

dotenv.config();

const day = 86400000;

const run = async () => {
  await connectDB();
  console.log('🌱 Seeding database (rich dataset)...');

  await Task.deleteMany();
  await Project.deleteMany();
  await User.deleteMany();

  // ---- Users ----
  const admin = await User.create({
    name: 'Admin User', email: 'admin@demo.com', password: 'password123',
    role: 'admin', avatarColor: '#6366f1',
  });
  const alice = await User.create({
    name: 'Alice Sharma', email: 'alice@demo.com', password: 'password123',
    role: 'member', avatarColor: '#ec4899',
  });
  const bob = await User.create({
    name: 'Bob Mehta', email: 'bob@demo.com', password: 'password123',
    role: 'member', avatarColor: '#10b981',
  });
  const carol = await User.create({
    name: 'Carol Nair', email: 'carol@demo.com', password: 'password123',
    role: 'member', avatarColor: '#f59e0b',
  });
  const dave = await User.create({
    name: 'Dave Patel', email: 'dave@demo.com', password: 'password123',
    role: 'member', avatarColor: '#3b82f6',
  });

  const everyone = [admin._id, alice._id, bob._id, carol._id, dave._id];

  // ---- Projects ----
  const P = {};
  P.web = await Project.create({
    name: 'Website Redesign',
    description: 'Revamp the marketing site with a new brand identity, faster load times, and a refreshed component library.',
    owner: admin._id, members: [admin._id, alice._id, bob._id, carol._id], status: 'active',
  });
  P.mobile = await Project.create({
    name: 'Mobile App MVP',
    description: 'Ship the first version of the iOS and Android app with auth, core flows, and push notifications.',
    owner: admin._id, members: [admin._id, alice._id, dave._id], status: 'active',
  });
  P.api = await Project.create({
    name: 'API Platform v2',
    description: 'Rebuild the public REST API with versioning, rate limiting, and OpenAPI docs.',
    owner: admin._id, members: [admin._id, bob._id, dave._id], status: 'active',
  });
  P.data = await Project.create({
    name: 'Data Warehouse Migration',
    description: 'Migrate analytics pipelines to the new warehouse and decommission legacy ETL jobs.',
    owner: admin._id, members: [admin._id, carol._id, bob._id], status: 'on-hold',
  });
  P.brand = await Project.create({
    name: 'Q3 Brand Campaign',
    description: 'Cross-channel campaign for the Q3 product launch including video, social, and email.',
    owner: admin._id, members: [admin._id, alice._id, carol._id], status: 'active',
  });
  P.security = await Project.create({
    name: 'Security Audit 2026',
    description: 'Annual third-party penetration test, dependency audit, and remediation tracking.',
    owner: admin._id, members: everyone, status: 'completed',
  });

  const now = Date.now();
  const T = (title, project, assignee, status, priority, dueOffsetDays, description = '') => ({
    title, description, project, assignee, createdBy: admin._id,
    status, priority,
    dueDate: dueOffsetDays === null ? null : new Date(now + dueOffsetDays * day),
  });

  await Task.create([
    // Website Redesign
    T('Design new landing page', P.web._id, alice._id, 'in-progress', 'high', 3, 'Hero, features and pricing sections with the new design system.'),
    T('Set up CI/CD pipeline', P.web._id, bob._id, 'todo', 'medium', -2, 'GitHub Actions: lint, test, build, deploy preview.'),
    T('Write API documentation', P.web._id, alice._id, 'done', 'low', null, 'Document all public endpoints with examples.'),
    T('Migrate blog to new CMS', P.web._id, carol._id, 'todo', 'medium', 9),
    T('Accessibility audit (WCAG AA)', P.web._id, bob._id, 'in-progress', 'high', -1, 'Run axe + manual screen-reader pass on all key pages.'),
    T('Optimize image delivery', P.web._id, alice._id, 'done', 'medium', null),

    // Mobile App MVP
    T('User authentication flow', P.mobile._id, alice._id, 'in-progress', 'high', 5, 'Signup, login, biometric unlock, token refresh.'),
    T('Push notification service', P.mobile._id, dave._id, 'todo', 'high', 7),
    T('Onboarding screens', P.mobile._id, alice._id, 'done', 'medium', null),
    T('Offline mode caching', P.mobile._id, dave._id, 'todo', 'low', 14),
    T('App Store listing & screenshots', P.mobile._id, null, 'todo', 'medium', 10),

    // API Platform v2
    T('Design v2 endpoint contracts', P.api._id, bob._id, 'done', 'high', null),
    T('Implement rate limiting', P.api._id, dave._id, 'in-progress', 'high', 2, 'Token bucket per API key, 1000 req/15min.'),
    T('OpenAPI spec generation', P.api._id, bob._id, 'in-progress', 'medium', 4),
    T('Deprecation plan for v1', P.api._id, dave._id, 'todo', 'medium', -3, 'Sunset timeline and customer comms.'),
    T('Load testing suite', P.api._id, bob._id, 'todo', 'high', 6),

    // Data Warehouse Migration (on-hold)
    T('Inventory legacy ETL jobs', P.data._id, carol._id, 'done', 'medium', null),
    T('Map schema to new warehouse', P.data._id, bob._id, 'in-progress', 'high', -5, 'Blocked pending infra approval.'),
    T('Backfill historical data', P.data._id, carol._id, 'todo', 'high', 20),

    // Q3 Brand Campaign
    T('Concept & moodboard', P.brand._id, alice._id, 'done', 'medium', null),
    T('Produce launch video', P.brand._id, carol._id, 'in-progress', 'high', 8, '60s hero video + 15s social cuts.'),
    T('Email drip sequence', P.brand._id, alice._id, 'todo', 'medium', 12),
    T('Social media calendar', P.brand._id, carol._id, 'todo', 'low', 15),

    // Security Audit 2026 (completed)
    T('External penetration test', P.security._id, dave._id, 'done', 'high', null),
    T('Dependency vulnerability scan', P.security._id, bob._id, 'done', 'high', null),
    T('Remediate critical findings', P.security._id, dave._id, 'done', 'high', null),
    T('Final report & sign-off', P.security._id, admin._id, 'done', 'medium', null),
  ]);

  const taskCount = await Task.countDocuments();
  const projectCount = await Project.countDocuments();

  console.log('✅ Seed complete.');
  console.log(`   ${projectCount} projects, ${taskCount} tasks, 5 users created.`);
  console.log('   Admin   -> admin@demo.com / password123');
  console.log('   Members -> alice@demo.com, bob@demo.com, carol@demo.com, dave@demo.com');
  console.log('   (all member passwords: password123)');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
