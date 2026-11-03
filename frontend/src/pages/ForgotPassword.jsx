import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await requestPasswordReset(email);
    if (result.success) {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Omar Zouglah Portfolio</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative px-4">
        <Link
          to="/login"
          className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('auth.backToLogin')}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                <img
                  src="/images/logo.jpeg"
                  alt="Omar Zouglah Logo"
                  className="h-16 w-16 mx-auto rounded-lg object-cover shadow-md"
                />
              </Link>
              <h1 className="text-3xl font-bold mb-2">{t('auth.forgotPasswordTitle')}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('auth.forgotPasswordSubtitle')}
              </p>
            </div>

            {sent ? (
              <p className="text-center text-gray-700 dark:text-gray-300">
                {t('auth.resetEmailSent')}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-5 h-5" />
                  <span>{loading ? t('common.loading') : t('auth.sendResetLink')}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
