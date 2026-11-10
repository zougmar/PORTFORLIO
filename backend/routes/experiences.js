import express from 'express';
import { body, validationResult } from 'express-validator';
import Experience from '../models/Experience.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const existingEntries = [
  {
    seedKey: 'teacher',
    type: 'experience',
    order: 0,
    title: 'Computer Science Teacher',
    titleFr: "Professeur d'Informatique",
    titleAr: 'مدرس علوم الحاسوب',
    organization: 'Professional Training Center CEFP, Casablanca',
    organizationFr: 'Centre de Formation Professionnelle CEFP, Casablanca',
    organizationAr: 'مركز التكوين المهني CEFP، الدار البيضاء',
    period: 'August 2025 – Present',
    periodFr: 'Août 2025 – Présent',
    periodAr: 'أغسطس 2025 – حالياً',
    description: 'Teach Excel and office automation. Create practical exercises and student projects. Introduce basic data management and spreadsheet concepts.',
    descriptionFr: 'Enseigner Excel et la bureautique. Créer des exercices pratiques et des projets étudiants. Introduire les concepts de base de gestion de données et de tableur.',
    descriptionAr: 'تدريس Excel والأتمتة المكتبية. إنشاء تمارين عملية ومشاريع طلابية. تقديم مفاهيم أساسية لإدارة البيانات وجداول البيانات.'
  },
  {
    seedKey: 'internship',
    type: 'experience',
    order: 1,
    title: 'Web Development Internship',
    titleFr: 'Stage en Développement Web',
    titleAr: 'تدريب تطوير الويب',
    organization: 'MonarkIT, Marrakech',
    organizationFr: 'MonarkIT, Marrakech',
    organizationAr: 'MonarkIT، مراكش',
    period: 'July 2023 – September 2023',
    periodFr: 'Juillet 2023 – Septembre 2023',
    periodAr: 'يوليو 2023 – سبتمبر 2023',
    description: 'Built and deployed web projects. Fixed bugs and improved features. Worked on both front-end and back-end tasks.',
    descriptionFr: 'Création et déploiement de projets web. Correction de bugs et amélioration des fonctionnalités. Travail sur les tâches front-end et back-end.',
    descriptionAr: 'بناء ونشر مشاريع ويب. إصلاح الأخطاء وتحسين الميزات. العمل على مهام الواجهة الأمامية والخلفية.'
  },
  {
    seedKey: 'freelancer',
    type: 'experience',
    order: 2,
    title: 'IT Technician Freelancer',
    titleFr: 'Technicien Informatique Freelance',
    titleAr: 'فني IT مستقل',
    location: 'Zagora & Casablanca',
    locationFr: 'Zagora et Casablanca',
    locationAr: 'زاكورة والدار البيضاء',
    period: '2022 – Present',
    periodFr: '2022 – Présent',
    periodAr: '2022 – حالياً',
    description: 'Installed software and fixed computer issues. Set up systems and improved computer performance.',
    descriptionFr: 'Installation de logiciels et résolution de problèmes informatiques. Configuration de systèmes et amélioration des performances informatiques.',
    descriptionAr: 'تثبيت البرامج وإصلاح مشاكل الكمبيوتر. إعداد الأنظمة وتحسين أداء الكمبيوتر.'
  },
  {
    seedKey: 'project',
    type: 'experience',
    order: 3,
    title: 'Final Year Project',
    titleFr: "Projet de Fin d'Études",
    titleAr: 'مشروع نهاية الدراسة',
    location: 'Ouarzazate',
    locationFr: 'Ouarzazate',
    locationAr: 'ورزازات',
    period: '2024',
    periodFr: '2024',
    periodAr: '2024',
    description: 'Built a website for a local company. Added features based on client needs.',
    descriptionFr: "Création d'un site web pour une entreprise locale. Ajout de fonctionnalités selon les besoins du client.",
    descriptionAr: 'بناء موقع ويب لشركة محلية. إضافة ميزات بناءً على احتياجات العميل.'
  }
];

const ensureExistingEntries = async () => {
  const count = await Experience.countDocuments();
  if (count > 0) return;

  await Experience.insertMany(existingEntries);
};

const editableFields = (body) => {
  const payload = { ...body };
  ['_id', '__v', 'createdAt', 'updatedAt', 'seedKey'].forEach((field) => {
    delete payload[field];
  });
  return payload;
};

router.get('/', async (req, res, next) => {
  try {
    await ensureExistingEntries();
    const entries = await Experience.find().sort({ order: 1, createdAt: 1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, admin, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').optional({ values: 'falsy' }).isIn(['experience', 'education']).withMessage('Type must be experience or education')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = editableFields(req.body);
    if (!payload.type) payload.type = 'experience';
    if (payload.order === undefined || payload.order === '') {
      payload.order = await Experience.countDocuments();
    }

    const entry = await Experience.create(payload);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const entry = await Experience.findByIdAndUpdate(
      req.params.id,
      editableFields(req.body),
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const entry = await Experience.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
