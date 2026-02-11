import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import api from '../utils/api';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
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

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads, construct full backend URL
    if (imagePath.startsWith('/uploads/')) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const baseURL = API_URL.replace('/api', '');
      return `${baseURL}${imagePath}`;
    }
    // Otherwise return as is (for other relative paths)
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projects - Omar Zouglah</title>
        <meta name="description" content="Portfolio projects and work samples" />
      </Helmet>

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-400 text-white py-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.title')}</h1>
              <p className="text-xl opacity-90">{t('projects.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;
