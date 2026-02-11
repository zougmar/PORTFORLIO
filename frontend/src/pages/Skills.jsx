import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';

const Skills = () => {
  const { t, i18n } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
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

  const categories = ['language', 'framework', 'database', 'tool'];

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
        <title>Skills - Omar Zouglah</title>
        <meta name="description" content="Technical skills and technologies" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('skills.title')}</h1>
              <p className="text-xl opacity-90">{t('skills.subtitle')}</p>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section-padding">
          <div className="container-custom">
            {categories.map((category) => {
              const categorySkills = skills.filter((skill) => skill.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <h2 className="text-3xl font-bold mb-8 text-center">{getCategoryName(category)}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold">{getSkillName(skill)}</h3>
                          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
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
        </section>
      </div>
    </>
  );
};

export default Skills;
