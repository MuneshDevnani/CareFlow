import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Task from './models/Task';
import ActivityLog from './models/ActivityLog';
import connectDB from './config/database';

dotenv.config();

const users = [
    {
        name: 'Dr. Sarah Chen',
        email: 'admin@careflow.dev',
        password: 'Admin123!',
        role: 'admin',
    },
    {
        name: 'Nurse James Wilson',
        email: 'staff@careflow.dev',
        password: 'Staff123!',
        role: 'staff',
    },
];

const taskTemplates = [
    { title: 'Review lab results for Patient #1042', description: 'CBC and metabolic panel results pending review from morning draw.', status: 'open', priority: 'high' },
    { title: 'Schedule follow-up: Mrs. Rodriguez', description: 'Post-surgery follow-up appointment needed within 2 weeks.', status: 'open', priority: 'medium' },
    { title: 'Update medication list – Room 204', description: 'Patient started on new antibiotic. Update the EHR and pharmacy records.', status: 'in_progress', priority: 'high' },
    { title: 'Prepare discharge summary: Mr. Thompson', description: 'Patient cleared for discharge. Prepare summary and home care instructions.', status: 'in_progress', priority: 'medium' },
    { title: 'Order imaging: Chest X-ray for Room 112', description: 'Physician ordered portable chest X-ray for pneumonia monitoring.', status: 'open', priority: 'high' },
    { title: 'Staff meeting notes – Feb 2026', description: 'Compile and distribute meeting notes from the weekly all-hands.', status: 'done', priority: 'low' },
    { title: 'Restock supply room B', description: 'Gauze, IV kits, and gloves running low. Submit restock request.', status: 'done', priority: 'medium' },
    { title: 'Patient education: Diabetes management', description: 'Prepare educational materials for newly diagnosed Type 2 patient.', status: 'open', priority: 'medium' },
    { title: 'Verify insurance pre-auth: Surgery #8821', description: 'Confirm pre-authorization for scheduled knee replacement on 2/28.', status: 'in_progress', priority: 'high' },
    { title: 'Complete annual compliance training', description: 'HIPAA and infection control modules due by end of month.', status: 'open', priority: 'low' },
    { title: 'Calibrate blood pressure monitors – Floor 3', description: 'Monthly calibration check on all portable BP monitors.', status: 'done', priority: 'low' },
    { title: 'Wound care assessment: Bed 7', description: 'Daily wound assessment and dressing change for post-op patient.', status: 'in_progress', priority: 'medium' },
    { title: 'Contact pharmacy re: drug interaction alert', description: 'System flagged potential interaction between Warfarin and new antibiotic.', status: 'open', priority: 'high' },
    { title: 'Update patient whiteboard – ICU', description: 'Refresh care team names, diet status, and activity level for all ICU patients.', status: 'done', priority: 'low' },
    { title: 'Arrange interpreter for appointment 2/25', description: 'Spanish-language interpreter needed for cardiology consult Tuesday.', status: 'open', priority: 'medium' },
];

const activityTemplates = [
    'task_created',
    'task_updated',
    'task_created',
    'task_updated',
    'task_created',
    'task_deleted',
    'task_updated',
    'task_created',
    'task_updated',
    'task_created',
];

async function seed() {
    try {
        await connectDB();
        console.log('🌱 Seeding database...\n');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Task.deleteMany({}),
            ActivityLog.deleteMany({}),
        ]);
        console.log('   Cleared existing data');

        // Create users
        const createdUsers = await User.create(users);
        const admin = createdUsers[0];
        const staff = createdUsers[1];
        console.log(`   Created ${createdUsers.length} users`);
        console.log(`     → Admin: ${admin.email} / Admin123!`);
        console.log(`     → Staff: ${staff.email} / Staff123!\n`);

        // Create tasks
        const now = new Date();
        const tasks = taskTemplates.map((t, i) => ({
            ...t,
            createdBy: i % 3 === 0 ? admin._id : staff._id,
            assignedTo: i % 2 === 0 ? staff._id : admin._id,
            dueDate: new Date(now.getTime() + (i - 5) * 24 * 60 * 60 * 1000), // some past, some future
        }));
        const createdTasks = await Task.create(tasks);
        console.log(`   Created ${createdTasks.length} tasks`);

        // Create activity logs
        const activities = activityTemplates.map((action, i) => ({
            action,
            details: `${action.replace('_', ' ')} "${createdTasks[i % createdTasks.length].title}"`,
            performedBy: i % 2 === 0 ? admin._id : staff._id,
            relatedTask: createdTasks[i % createdTasks.length]._id,
            createdAt: new Date(now.getTime() - i * 3600 * 1000),
        }));
        await ActivityLog.create(activities);
        console.log(`   Created ${activities.length} activity log entries`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
