import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';

const Experience = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

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

  return (
    <>
      <Helmet>
        <title>Experience & Education - Omar Zouglah</title>
        <meta name="description" content="Professional experience and education background" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('experience.title')}</h1>
              <p className="text-xl opacity-90">{t('experience.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 transform md:-translate-x-1/2"></div>

                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative mb-12 ${
                      index % 2 === 0 ? 'md:pr-1/2 md:pl-0' : 'md:pl-1/2 md:pr-0'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-1/2 z-10"></div>

                    {/* Content Card */}
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
      </div>
    </>
  );
};

export default Experience;
