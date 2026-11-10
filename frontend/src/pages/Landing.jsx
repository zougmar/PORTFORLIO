import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiMail, FiArrowRight, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Landing = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [cvSettings, setCvSettings] = useState({ cvUrlEn: '', cvUrlFr: '' });
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    api.get('/users/profile/public')
      .then((response) => setProfileData(response.data))
      .catch(() => setProfileData(null));
    api.get('/settings')
      .then((response) => setCvSettings({
        cvUrlEn: response.data.cvUrlEn || '',
        cvUrlFr: response.data.cvUrlFr || ''
      }))
      .catch(() => setCvSettings({ cvUrlEn: '', cvUrlFr: '' }));
  }, [i18n.language]);

  const downloadCV = (language) => {
    const cvUrl = language === 'en' ? cvSettings.cvUrlEn : cvSettings.cvUrlFr;
    if (!cvUrl) {
      toast.error(`${language === 'en' ? 'English' : 'French'} CV is not available`);
      return;
    }
    window.open(cvUrl, '_blank');
    setShowLanguageModal(false);
  };

  const handleDownloadCV = (event) => {
    event.preventDefault();
    if (!cvSettings.cvUrlEn && !cvSettings.cvUrlFr) {
      toast.error('CV is not available. Please set it up in the admin panel.');
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

  return (
    <>
      <Helmet>
        <title>Omar Zouglah - Full Stack Developer | Software Engineer</title>
        <meta name="description" content={t('hero.description')} />
      </Helmet>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
              <p className="text-primary-300 font-semibold">{t('hero.greeting')}</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="gradient-text">{t('hero.name')}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-white">{t('hero.title')}</h2>
              <p className="text-lg text-gray-200 flex items-center space-x-2">
                <span>📍</span>
                <span>{t('hero.location')}</span>
              </p>
              <p className="text-gray-300 max-w-xl">{t('hero.description')}</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleDownloadCV}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>{t('hero.downloadCV')}</span>
                </button>
                <button
                  onClick={() => navigate('/#contact')}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <FiMail className="w-5 h-5" />
                  <span>{t('hero.contactMe')}</span>
                </button>
                <button
                  onClick={() => navigate('/#projects')}
                  className="flex items-center space-x-2 px-6 py-3 text-white hover:text-primary-200 transition-colors"
                >
                  <span>{t('hero.viewWork')}</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </div>
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
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200"></div>
                  <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                    <img
                      src={profileData?.image || '/images/my_image.jpeg'}
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
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 transition-colors"
                  >
                    <span className="font-semibold">English CV</span>
                    <FiDownload className="w-5 h-5 text-primary-600" />
                  </button>
                )}
                {cvSettings.cvUrlFr && (
                  <button
                    onClick={() => downloadCV('fr')}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-600 transition-colors"
                  >
                    <span className="font-semibold">French CV</span>
                    <FiDownload className="w-5 h-5 text-primary-600" />
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

export default Landing;
