import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiMail, FiArrowRight, FiX, FiMapPin, FiPhone, FiUser, FiGithub, FiExternalLink, FiStar, FiBriefcase, FiCalendar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [cvSettings, setCvSettings] = useState({ cvUrlEn: '', cvUrlFr: '' });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    fetchCVSettings();
    fetchSkills();
    fetchProjects();
  }, [i18n.language]);

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
    { icon: FiUser, label: t('about.fullName'), value: 'Omar Zouglah' },
    { icon: FiUser, label: t('about.title'), value: t('hero.title') },
    { icon: FiMapPin, label: t('about.location'), value: t('hero.location') },
    { icon: FiMail, label: t('about.email'), value: 'o.zouglah03@gmail.com' },
    { icon: FiPhone, label: t('about.phone'), value: '+212 707625535' }
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
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-primary-600 dark:text-primary-400 font-semibold"
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
                className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300"
              >
                {t('hero.title')}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-600 dark:text-gray-400 flex items-center space-x-2"
              >
                <span>📍</span>
                <span>{t('hero.location')}</span>
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 dark:text-gray-400 max-w-xl"
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
                  className="flex items-center space-x-2 px-6 py-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
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
              className="relative"
            >
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-20 blur-2xl animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"></div>
                  <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800">
                    <img 
                      src="/images/my_image.jpeg" 
                      alt="Omar Zouglah" 
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

      {/* Projects Section */}
      <section id="projects" className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('projects.subtitle')}</p>
          </motion.div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  {project.image ? (
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={getImageUrl(project.image)} 
                        alt={getProjectTitle(project)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                          <FiStar className="w-3 h-3" />
                          <span>{t('projects.featured')}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative overflow-hidden flex items-center justify-center">
                      <div className="text-white text-4xl font-bold opacity-50">No Image</div>
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <FiStar className="w-3 h-3" />
                          <span>{t('projects.featured')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{getProjectTitle(project)}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {getProjectDescription(project)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <FiGithub className="w-5 h-5" />
                          <span className="text-sm">{t('projects.viewCode')}</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <FiExternalLink className="w-5 h-5" />
                          <span className="text-sm">{t('projects.viewProject')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('about.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-2 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-20 blur-xl"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"></div>
                <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800">
                  <img 
                    src="/images/my_image.jpeg" 
                    alt="Omar Zouglah" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 lg:order-1"
            >
              <div>
                <h3 className="text-3xl font-bold mb-6">{t('about.personalInfo')}</h3>
                <div className="space-y-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <info.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{info.label}</p>
                        <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">{t('about.languages')}</h3>
                <ul className="space-y-2">
                  {languages.map((lang, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-6">Bio</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {t('about.description')}
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold mb-6">{t('about.education')}</h3>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-primary-600"
                    >
                      <h4 className="text-xl font-semibold mb-2">{edu.title}</h4>
                      <p className="text-primary-600 dark:text-primary-400 mb-2">{edu.period}</p>
                      {edu.institution && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{edu.institution}</p>
                      )}
                      {edu.description && (
                        <p className="text-gray-600 dark:text-gray-400">{edu.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
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

              {experiences.map((exp, index) => (
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
