import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Skill.deleteMany({});

    // Seed Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        titleFr: 'Plateforme E-Commerce',
        titleAr: 'منصة التجارة الإلكترونية',
        description: 'Full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
        descriptionFr: 'Plateforme e-commerce full-stack avec intégration de paiement, authentification utilisateur et tableau de bord administrateur.',
        descriptionAr: 'منصة تجارة إلكترونية كاملة مع تكامل الدفع والمصادقة ولوحة تحكم المسؤول.',
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Stripe'],
        category: 'fullstack',
        featured: true,
        order: 1
      },
      {
        title: 'Task Management App',
        titleFr: 'Application de Gestion de Tâches',
        titleAr: 'تطبيق إدارة المهام',
        description: 'Collaborative task management application with real-time updates and team collaboration features.',
        descriptionFr: 'Application collaborative de gestion de tâches avec mises à jour en temps réel et fonctionnalités de collaboration d\'équipe.',
        descriptionAr: 'تطبيق تعاوني لإدارة المهام مع التحديثات في الوقت الفعلي وميزات التعاون الجماعي.',
        technologies: ['React.js', 'Node.js', 'Socket.io', 'MongoDB'],
        category: 'fullstack',
        featured: true,
        order: 2
      },
      {
        title: 'Portfolio Website',
        titleFr: 'Site Web Portfolio',
        titleAr: 'موقع الويب الشخصي',
        description: 'Modern, responsive portfolio website with multilingual support and admin dashboard.',
        descriptionFr: 'Site web portfolio moderne et responsive avec support multilingue et tableau de bord administrateur.',
        descriptionAr: 'موقع ويب شخصي حديث ومتجاوب مع دعم متعدد اللغات ولوحة تحكم المسؤول.',
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'i18n'],
        category: 'web',
        featured: true,
        order: 3
      }
    ];

    await Project.insertMany(projects);
    console.log('✅ Projects seeded');

    // Seed Skills
    const skills = [
      { name: 'JavaScript', nameFr: 'JavaScript', nameAr: 'جافا سكريبت', category: 'language', proficiency: 90, order: 1 },
      { name: 'Python', nameFr: 'Python', nameAr: 'بايثون', category: 'language', proficiency: 75, order: 2 },
      { name: 'Java', nameFr: 'Java', nameAr: 'جافا', category: 'language', proficiency: 70, order: 3 },
      { name: 'React.js', nameFr: 'React.js', nameAr: 'رياكت', category: 'framework', proficiency: 90, order: 4 },
      { name: 'Next.js', nameFr: 'Next.js', nameAr: 'نكست', category: 'framework', proficiency: 85, order: 5 },
      { name: 'Node.js', nameFr: 'Node.js', nameAr: 'نود', category: 'framework', proficiency: 88, order: 6 },
      { name: 'Express.js', nameFr: 'Express.js', nameAr: 'إكسبريس', category: 'framework', proficiency: 85, order: 7 },
      { name: 'MongoDB', nameFr: 'MongoDB', nameAr: 'مونغو', category: 'database', proficiency: 85, order: 8 },
      { name: 'MySQL', nameFr: 'MySQL', nameAr: 'ماي إس كيو إل', category: 'database', proficiency: 80, order: 9 },
      { name: 'PostgreSQL', nameFr: 'PostgreSQL', nameAr: 'بوستجري', category: 'database', proficiency: 75, order: 10 },
      { name: 'Git/GitHub', nameFr: 'Git/GitHub', nameAr: 'جيت', category: 'tool', proficiency: 90, order: 11 },
      { name: 'Tailwind CSS', nameFr: 'Tailwind CSS', nameAr: 'تيلويند', category: 'tool', proficiency: 88, order: 12 }
    ];

    await Skill.insertMany(skills);
    console.log('✅ Skills seeded');

    console.log('✅ Seed data completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
