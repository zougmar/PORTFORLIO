import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiMail, FiArrowRight, FiX, FiMapPin, FiPhone, FiUser, FiGithub, FiExternalLink, FiStar, FiBriefcase, FiCalendar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProjectCard = ({
  project,
  index,
  title,
  description,
  imageUrl,
  featuredLabel,
  viewCodeLabel,
  viewProjectLabel,
  detailsLabel,
  onOpen,
}) => {
  const cardRef = useRef(null);
  const [glow, setGlow] = useState({ x: 0, y: 0, on: false });

  const handleMove = (event) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      on: true,
    });
  };

  return (
    <motion.article
      ref={cardRef}
      onClick={onOpen}
      onMouseMove={handleMove}
      onMouseLeave={() => setGlow((current) => ({ ...current, on: false }))}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-2xl dark:border-white/10 dark:bg-gray-800 dark:hover:border-primary-400/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-30 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-300"
        style={{
          left: glow.x,
          top: glow.y,
          opacity: glow.on ? 0.4 : 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(186,230,253,0.22) 46%, transparent 72%)',
        }}
      />

      <div className="relative h-52 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800">
            <span className="text-5xl font-semibold text-white/80">{title?.charAt(0) || 'P'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent"></div>
        {project.featured && (
          <div className="absolute top-4 right-4 z-40 flex items-center space-x-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
            <FiStar className="h-3.5 w-3.5" />
            <span>{featuredLabel}</span>
          </div>
        )}
        {project.category && (
          <span className="absolute bottom-4 left-4 z-40 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
            {project.category}
          </span>
        )}
      </div>

      <div className="relative z-40 flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="mb-5 flex flex-wrap gap-2">
          {project.technologies?.slice(0, 4).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-300">{detailsLabel}</span>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:border-white/10 dark:text-gray-200 dark:hover:border-primary-400 dark:hover:text-primary-300"
            >
              <FiGithub className="h-4 w-4" />
              <span>{viewCodeLabel}</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-700"
            >
              <FiExternalLink className="h-4 w-4" />
              <span>{viewProjectLabel}</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const ProjectDetail = ({ project, title, description, images, onClose, viewCodeLabel, viewProjectLabel }) => {
  const [active, setActive] = useState(0);
  const safeIndex = images.length ? Math.min(active, images.length - 1) : 0;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/70 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-950 md:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="bg-gray-100 p-4 dark:bg-gray-900 md:p-6">
          {images.length ? (
            <img
              src={images[safeIndex]}
              alt={title}
              className="h-72 w-full rounded-2xl object-cover md:h-[420px]"
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-800 md:h-[420px]">
              <span className="text-6xl font-semibold text-white/80">{title?.charAt(0) || 'P'}</span>
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${index === safeIndex ? 'border-primary-500' : 'border-transparent'}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
          {project.category && (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
              {project.category}
            </p>
          )}
          <h3 className="mt-3 pr-8 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">{description}</p>
          {project.technologies?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/40 dark:text-primary-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 dark:border-white/10 dark:text-gray-200"
              >
                <FiGithub className="h-4 w-4" />
                {viewCodeLabel}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm text-white"
              >
                <FiExternalLink className="h-4 w-4" />
                {viewProjectLabel}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [cvSettings, setCvSettings] = useState({ cvUrlEn: '', cvUrlFr: '' });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experienceEntries, setExperienceEntries] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [portfolioSettings, setPortfolioSettings] = useState({
    professionalSummary: '',
    professionalSummaryFr: '',
    professionalSummaryAr: '',
    services: []
  });
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    fetchProfileData();
    fetchCVSettings();
    fetchSkills();
    fetchProjects();
    fetchExperiences();
  }, [i18n.language]);

  // Fetch user profile data from backend (public endpoint for portfolio)
  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperienceEntries(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const localizedField = (item, field) => {
    if (i18n.language === 'fr' && item[`${field}Fr`]) return item[`${field}Fr`];
    if (i18n.language === 'ar' && item[`${field}Ar`]) return item[`${field}Ar`];
    return item[field] || '';
  };

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/users/profile/public');
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // If profile not found, use default values
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads, use relative path (same domain)
    // In production, both frontend and backend are on same Vercel domain
    if (imagePath.startsWith('/uploads/')) {
      return imagePath; // Relative path works on same domain
    }
    // Otherwise return as is (for other relative paths)
    return imagePath;
  };

  const fetchCVSettings = async () => {
    try {
      const response = await api.get('/settings');
      setCvSettings({
        cvUrlEn: response.data.cvUrlEn || '',
        cvUrlFr: response.data.cvUrlFr || ''
      });
      setPortfolioSettings({
        professionalSummary: response.data.professionalSummary || '',
        professionalSummaryFr: response.data.professionalSummaryFr || '',
        professionalSummaryAr: response.data.professionalSummaryAr || '',
        services: response.data.services || []
      });
    } catch (error) {
      console.error('Error fetching CV settings:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDownloadCV = (e) => {
    e.preventDefault();
    
    if (!cvSettings.cvUrlEn && !cvSettings.cvUrlFr) {
      alert('CV is not available. Please set it up in the admin panel.');
      return;
    }
    
    if (cvSettings.cvUrlEn && !cvSettings.cvUrlFr) {
      downloadCV('en');
      return;
    }
    if (cvSettings.cvUrlFr && !cvSettings.cvUrlEn) {
      downloadCV('fr');
      return;
    }
    
    setShowLanguageModal(true);
  };

  const downloadCV = (language) => {
    const cvUrl = language === 'en' ? cvSettings.cvUrlEn : cvSettings.cvUrlFr;
    if (!cvUrl) {
      toast.error(`${language === 'en' ? 'English' : 'French'} CV is not available`);
      return;
    }
    
    // If it's a relative path, use it as is (same domain in production)
    // If it's a full URL, use it directly
    const downloadUrl = cvUrl.startsWith('http://') || cvUrl.startsWith('https://')
      ? cvUrl
      : cvUrl; // Relative paths work on same domain
    
    window.open(downloadUrl, '_blank');
    setShowLanguageModal(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getSkillName = (skill) => {
    if (i18n.language === 'fr' && skill.nameFr) return skill.nameFr;
    if (i18n.language === 'ar' && skill.nameAr) return skill.nameAr;
    return skill.name;
  };

  const getCategoryName = (category) => {
    return t(`skills.${category}`);
  };

  const getProjectTitle = (project) => {
    if (i18n.language === 'fr' && project.titleFr) return project.titleFr;
    if (i18n.language === 'ar' && project.titleAr) return project.titleAr;
    return project.title;
  };

  const getProjectDescription = (project) => {
    if (i18n.language === 'fr' && project.descriptionFr) return project.descriptionFr;
    if (i18n.language === 'ar' && project.descriptionAr) return project.descriptionAr;
    return project.description;
  };

  const personalInfo = [
    { icon: FiUser, label: t('about.fullName'), value: profileData?.username || 'Omar Zouglah' },
    { icon: FiUser, label: t('about.jobTitle'), value: profileData?.jobTitle || t('hero.title') },
    { icon: FiMapPin, label: t('about.location'), value: profileData?.location || t('hero.location') },
    { icon: FiMail, label: t('about.email'), value: profileData?.email || 'o.zouglah03@gmail.com' },
    { icon: FiPhone, label: t('about.phone'), value: profileData?.phone || '+212 707625535' }
  ];

  const languages = ['Arabic (Fluent)', 'Amazigh (Fluent)', 'English (Upper-Intermediate)', 'French (Intermediate)'];

  const education = [
    {
      title: t('about.geeks.title'),
      period: t('about.geeks.period'),
      description: t('about.geeks.description')
    },
    {
      title: t('about.alx.title'),
      period: t('about.alx.period'),
      description: t('about.alx.description')
    },
    {
      title: t('about.bachelor.title'),
      period: t('about.bachelor.period'),
      institution: t('about.bachelor.institution')
    },
    {
      title: t('about.ofppt.title'),
      period: t('about.ofppt.period'),
      institution: t('about.ofppt.institution')
    },
    {
      title: t('about.baccalaureate.title'),
      period: t('about.baccalaureate.period'),
      institution: t('about.baccalaureate.institution')
    }
  ];

  const experiences = [
    {
      type: 'experience',
      title: t('experience.teacher.title'),
      company: t('experience.teacher.company'),
      period: t('experience.teacher.period'),
      description: t('experience.teacher.description'),
      icon: FiBriefcase
    },
    {
      type: 'experience',
      title: t('experience.internship.title'),
      company: t('experience.internship.company'),
      period: t('experience.internship.period'),
      description: t('experience.internship.description'),
      icon: FiBriefcase
    },
    {
      type: 'experience',
      title: t('experience.freelancer.title'),
      location: t('experience.freelancer.location'),
      period: t('experience.freelancer.period'),
      description: t('experience.freelancer.description'),
      icon: FiBriefcase
    },
    {
      type: 'project',
      title: t('experience.project.title'),
      location: t('experience.project.location'),
      period: t('experience.project.period'),
      description: t('experience.project.description'),
      icon: FiBriefcase
    }
  ];

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'o.zouglah03@gmail.com',
      link: 'mailto:o.zouglah03@gmail.com'
    },
    {
      icon: FiPhone,
      label: 'Phone',
      value: '+212 707625535',
      link: 'tel:+212707625535'
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: t('hero.location'),
      link: null
    }
  ];

  const categories = ['language', 'framework', 'database', 'tool'];

  const handleContactChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);

    try {
      await api.post('/messages', contactFormData);
      toast.success(t('contact.success'));
      setContactFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('contact.error'));
      console.error('Error sending message:', error);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Omar Zouglah - Full Stack Developer | Software Engineer</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <img
          src="/images/hero-tech-background.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/50 to-gray-950/10"></div>
        <div className="container-custom section-padding relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-primary-300 font-semibold"
              >
                {t('hero.greeting')}
              </motion.p>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
              >
                <span className="gradient-text">{t('hero.name')}</span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl text-white"
              >
                {t('hero.title')}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-200 flex items-center space-x-2"
              >
                <span>📍</span>
                <span>{t('hero.location')}</span>
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300 max-w-xl"
              >
                {t('hero.description')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={handleDownloadCV}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>{t('hero.downloadCV')}</span>
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiMail className="w-5 h-5" />
                  <span>{t('hero.contactMe')}</span>
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="flex items-center space-x-2 px-6 py-3 text-white hover:text-primary-200 transition-colors"
                >
                  <span>{t('hero.viewWork')}</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-20 blur-2xl animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"></div>
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800">
                    <img 
                      src={profileData?.image || "/images/my_image.jpeg"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-400 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-600 rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Summary Section */}
      {(portfolioSettings.professionalSummary || portfolioSettings.professionalSummaryFr || portfolioSettings.professionalSummaryAr || (portfolioSettings.services && portfolioSettings.services.length > 0)) && (
        <section id="professional-summary" className="section-padding bg-[#efe8dc] dark:bg-[#14110e]">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-3xl"
            >
              <div className="absolute bottom-3 left-10 right-0 top-3 translate-x-3 rounded-r-sm bg-[#cfc4b2] shadow-md dark:bg-[#2a241c]"></div>
              <div className="absolute bottom-1.5 left-8 right-0 top-1.5 translate-x-1.5 rounded-r-sm bg-[#f7f1e7] dark:bg-[#3a3228]"></div>

              <div className="relative flex overflow-hidden rounded-r-sm shadow-[0_28px_50px_-18px_rgba(28,22,14,0.55)]">
                <div className="flex w-12 shrink-0 items-center justify-center bg-[#142033] sm:w-16">
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.35em] text-amber-100/80"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {profileData?.username || 'Omar Zouglah'}
                  </span>
                </div>

                <div className="relative flex-1 bg-[#1b2c42] px-6 py-10 text-[#f6edd9] sm:px-12 sm:py-14">
                  <div className="pointer-events-none absolute inset-3 border border-amber-100/25 sm:inset-5"></div>
                  <div className="relative">
                    <p className="text-center text-[11px] font-medium uppercase tracking-[0.42em] text-amber-100/70">
                      What I Offer
                    </p>
                    <h2 className={`mt-4 text-center text-4xl leading-tight sm:text-5xl ${i18n.language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
                      Professional Summary
                    </h2>
                    <div className="mx-auto mt-5 h-px w-24 bg-amber-100/50"></div>
                    <p className="mt-3 text-center text-sm italic text-amber-100/75">
                      {profileData?.jobTitle || 'Full Stack Developer'}
                    </p>

                    {(portfolioSettings.professionalSummary || portfolioSettings.professionalSummaryFr || portfolioSettings.professionalSummaryAr) && (
                      <p className={`mt-8 whitespace-pre-line text-lg leading-8 text-[#f8f1e3]/95 ${i18n.language === 'ar' ? 'font-arabic' : 'font-serif first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:text-amber-100'}`}>
                        {i18n.language === 'fr' && portfolioSettings.professionalSummaryFr
                          ? portfolioSettings.professionalSummaryFr
                          : i18n.language === 'ar' && portfolioSettings.professionalSummaryAr
                          ? portfolioSettings.professionalSummaryAr
                          : portfolioSettings.professionalSummary}
                      </p>
                    )}

                    <p className={`mt-10 text-center text-sm tracking-[0.22em] text-amber-100/80 ${i18n.language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
                      {profileData?.username || 'Omar Zouglah'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {portfolioSettings.services && portfolioSettings.services.length > 0 && (
              <div className="mx-auto mt-12 max-w-3xl">
                <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#6d5b45] dark:text-amber-100/70">
                  Chapters
                </p>
                <div className="space-y-4">
                  {portfolioSettings.services.map((service, index) => {
                    const serviceTitle = i18n.language === 'fr' && service.titleFr
                      ? service.titleFr
                      : i18n.language === 'ar' && service.titleAr
                      ? service.titleAr
                      : service.title;
                    const serviceDescription = i18n.language === 'fr' && service.descriptionFr
                      ? service.descriptionFr
                      : i18n.language === 'ar' && service.descriptionAr
                      ? service.descriptionAr
                      : service.description;

                    return (
                      <motion.article
                        key={index}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                        className="flex gap-4 rounded-sm border border-[#e4d8c4] bg-[#fbf7f0] p-5 dark:border-white/10 dark:bg-[#1c1916]"
                      >
                        <span className={`w-10 shrink-0 text-lg text-[#8a6a3b] dark:text-amber-200/80 ${i18n.language === 'ar' ? 'font-arabic' : 'font-serif'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-[#241c14] dark:text-amber-50">
                            {service.icon ? `${service.icon} ` : ''}{serviceTitle}
                          </h3>
                          <p className="mt-1 leading-7 text-[#5c5146] dark:text-amber-50/70">
                            {serviceDescription}
                          </p>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      <section id="projects" className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">
              {t('projects.subtitle')}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              {t('projects.title')}
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
          </motion.div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                  title={getProjectTitle(project)}
                  description={getProjectDescription(project)}
                  imageUrl={project.image ? getImageUrl(project.image) : (project.images?.[0] ? getImageUrl(project.images[0]) : null)}
                  featuredLabel={t('projects.featured')}
                  viewCodeLabel={t('projects.viewCode')}
                  viewProjectLabel={t('projects.viewProject')}
                  detailsLabel={t('projects.viewDetails')}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          title={getProjectTitle(selectedProject)}
          description={getProjectDescription(selectedProject)}
          images={[selectedProject.image, ...(selectedProject.images || [])].filter(Boolean).map(getImageUrl)}
          onClose={() => setSelectedProject(null)}
          viewCodeLabel={t('projects.viewCode')}
          viewProjectLabel={t('projects.viewProject')}
        />
      )}

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-gray-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">
              {t('about.subtitle')}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              {t('about.title')}
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
          </motion.div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[300px_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto w-full max-w-xs lg:mx-0"
            >
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900">
                <img
                  src={profileData?.image ? getImageUrl(profileData.image) : "/images/my_image.jpeg"}
                  alt={profileData?.username || "Omar Zouglah"}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                {t('about.description')}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-gray-200 pt-8 dark:border-white/10 sm:grid-cols-2">
                {personalInfo.map((info) => (
                  <div key={info.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{info.label}</dt>
                    <dd className="mt-1 text-base text-gray-900 dark:text-white">{info.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mb-4 mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
                {t('about.education')}
              </h3>
              <div className="divide-y divide-gray-200 dark:divide-white/10">
                {education.map((edu, index) => (
                  <div key={index} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{edu.title}</h4>
                      {edu.institution && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{edu.institution}</p>
                      )}
                      {edu.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{edu.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('skills.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('skills.subtitle')}</p>
          </motion.div>

          {loadingSkills ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div>
              {categories.map((category) => {
                const categorySkills = skills.filter((skill) => skill.category === category);
                if (categorySkills.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                  >
                    <h3 className="text-3xl font-bold mb-8 text-center">{getCategoryName(category)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-semibold">{getSkillName(skill)}</h4>
                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('experience.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('experience.subtitle')}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 transform md:-translate-x-1/2"></div>

              {(experienceEntries.length ? experienceEntries.map((item) => ({
                title: localizedField(item, 'title'),
                company: localizedField(item, 'organization'),
                location: localizedField(item, 'location'),
                period: localizedField(item, 'period'),
                description: localizedField(item, 'description'),
                icon: FiBriefcase
              })) : experiences).map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative mb-12 ${
                    index % 2 === 0 ? 'md:pr-1/2 md:pl-0' : 'md:pl-1/2 md:pr-0'
                  }`}
                >
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-1/2 z-10"></div>

                  <div className="ml-16 md:ml-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <exp.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {exp.company && (
                            <div className="flex items-center space-x-1">
                              <FiBriefcase className="w-4 h-4" />
                              <span>{exp.company}</span>
                            </div>
                          )}
                          {exp.location && (
                            <div className="flex items-center space-x-1">
                              <FiMapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{exp.period}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">{t('contact.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {t('contact.description')}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <info.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactFormData.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-5 h-5" />
                  <span>{contactLoading ? t('contact.sending') : t('contact.send')}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Choose CV Language</h3>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {cvSettings.cvUrlEn && (
                  <button
                    onClick={() => downloadCV('en')}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div className="text-left">
                        <p className="font-semibold">English CV</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Download English version</p>
                      </div>
                    </div>
                    <FiDownload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </button>
                )}
                
                {cvSettings.cvUrlFr && (
                  <button
                    onClick={() => downloadCV('fr')}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇫🇷</span>
                      <div className="text-left">
                        <p className="font-semibold">French CV</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Télécharger la version française</p>
                      </div>
                    </div>
                    <FiDownload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
