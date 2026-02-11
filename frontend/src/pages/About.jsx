import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiMail, FiPhone, FiUser } from 'react-icons/fi';

const About = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

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

  return (
    <>
      <Helmet>
        <title>About Me - Omar Zouglah</title>
        <meta name="description" content={t('about.description')} />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about.title')}</h1>
              <p className="text-xl opacity-90">{t('about.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* About Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:order-2 flex items-center justify-center"
              >
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-20 blur-xl"></div>
                  
                  {/* Border ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800"></div>
                  
                  {/* Profile image */}
                  <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white dark:ring-gray-800">
                    <img 
                      src="/images/my_image.jpeg" 
                      alt="Omar Zouglah" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Professional badge indicator */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 lg:order-1"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6">{t('about.personalInfo')}</h2>
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
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-6">Bio</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    {t('about.description')}
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-6">{t('about.education')}</h2>
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-primary-600"
                      >
                        <h3 className="text-xl font-semibold mb-2">{edu.title}</h3>
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
      </div>
    </>
  );
};

export default About;
