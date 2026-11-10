import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiGithub, FiX } from 'react-icons/fi';
import api from '../utils/api';

const imageUrl = (path) => {
  if (!path) return '';
  return path;
};

const localized = (project, field, language) => {
  if (language === 'fr' && project[`${field}Fr`]) return project[`${field}Fr`];
  if (language === 'ar' && project[`${field}Ar`]) return project[`${field}Ar`];
  return project[field] || '';
};

const localizedList = (project, field, language) => {
  const value = localized(project, field, language);
  return Array.isArray(value) ? value.filter(Boolean) : [];
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    setLoading(true);
    api.get('/projects')
      .then((response) => setProjects(response.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  useEffect(() => {
    setActiveImage(0);
    setFullscreen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const index = projects.findIndex((project) => project._id === id);
  const project = index >= 0 ? projects[index] : null;
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  const title = project ? localized(project, 'title', i18n.language) : '';
  const description = project ? localized(project, 'description', i18n.language) : '';
  const overview = project ? (localized(project, 'overview', i18n.language) || description) : '';
  const storedFeatures = project ? localizedList(project, 'features', i18n.language) : [];
  const features = storedFeatures.length
    ? storedFeatures
    : overview.split(/(?<=\.)\s+/).map((item) => item.trim()).filter((item) => item.length > 24).slice(0, 4);

  const images = project
    ? [project.image, ...(project.images || [])].filter(Boolean).map(imageUrl)
    : [];
  const currentImage = images[Math.min(activeImage, Math.max(images.length - 1, 0))];

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setFullscreen(false);
      if (event.key === 'ArrowRight' && images.length > 1) {
        setActiveImage((current) => (current + 1) % images.length);
      }
      if (event.key === 'ArrowLeft' && images.length > 1) {
        setActiveImage((current) => (current - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, images.length]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-custom px-4 pb-20 pt-32 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Project not found</h1>
        <Link to="/#projects" className="mt-6 inline-flex text-primary-600">Back to projects</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} - Omar Zouglah</title>
        <meta name="description" content={description} />
      </Helmet>

      <article className="bg-white pb-20 pt-28 dark:bg-gray-950">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300">
              <FiArrowLeft className="h-4 w-4" />
              {t('projects.title')}
            </Link>
            {project.category && (
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">
                {project.category}
              </p>
            )}
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                  <FiExternalLink className="h-4 w-4" />
                  {t('projects.viewProject')}
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700 dark:border-white/10 dark:text-gray-200">
                  <FiGithub className="h-4 w-4" />
                  {t('projects.viewCode')}
                </a>
              )}
            </div>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => currentImage && setFullscreen(true)}
            className="mt-12 block w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900"
          >
            {currentImage ? (
              <img src={currentImage} alt={title} className="max-h-[640px] w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center bg-gradient-to-br from-primary-500 to-primary-800 text-6xl font-semibold text-white/80">
                {title.charAt(0)}
              </div>
            )}
          </motion.button>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((image, imageIndex) => (
                <button
                  key={`${image}-${imageIndex}`}
                  type="button"
                  onClick={() => {
                    setActiveImage(imageIndex);
                    setFullscreen(true);
                  }}
                  className={`h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 ${imageIndex === activeImage ? 'border-primary-500' : 'border-transparent'}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">Overview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Project overview</h2>
              <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-600 dark:text-gray-300">{overview}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">Features</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Key features</h2>
              <ul className="mt-5 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {project.technologies?.length > 0 && (
            <section className="mt-14">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">{t('projects.technologies')}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 grid gap-4 border-t border-gray-200 pt-8 dark:border-white/10 sm:grid-cols-2">
            {previous ? (
              <button type="button" onClick={() => navigate(`/projects/${previous._id}`)} className="rounded-2xl border border-gray-200 p-5 text-left transition hover:-translate-y-0.5 hover:border-primary-300 dark:border-white/10">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  <FiArrowLeft className="h-4 w-4" /> Previous
                </span>
                <span className="mt-2 block text-lg font-semibold text-gray-900 dark:text-white">{localized(previous, 'title', i18n.language)}</span>
              </button>
            ) : <div />}
            {next && (
              <button type="button" onClick={() => navigate(`/projects/${next._id}`)} className="rounded-2xl border border-gray-200 p-5 text-right transition hover:-translate-y-0.5 hover:border-primary-300 dark:border-white/10">
                <span className="inline-flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Next <FiArrowRight className="h-4 w-4" />
                </span>
                <span className="mt-2 block text-lg font-semibold text-gray-900 dark:text-white">{localized(next, 'title', i18n.language)}</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <AnimatePresence>
        {fullscreen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/95 p-4"
            onClick={() => setFullscreen(false)}
          >
            <button type="button" className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" aria-label="Close">
              <FiX className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImage((current) => (current - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-3 text-white"
                  aria-label="Previous screenshot"
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveImage((current) => (current + 1) % images.length);
                  }}
                  className="absolute right-16 rounded-full bg-white/10 p-3 text-white md:right-20"
                  aria-label="Next screenshot"
                >
                  <FiArrowRight className="h-5 w-5" />
                </button>
              </>
            )}
            <img src={currentImage} alt={title} onClick={(event) => event.stopPropagation()} className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetails;
