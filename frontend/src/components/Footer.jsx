import { useTranslation } from 'react-i18next';
import { FiGithub, FiLinkedin, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();

  const links = [
    { href: '/#about', id: 'about', label: t('nav.about') },
    { href: '/#skills', id: 'skills', label: t('nav.skills') },
    { href: '/#projects', id: 'projects', label: t('nav.projects') },
    { href: '/#contact', id: 'contact', label: t('nav.contact') }
  ];

  const scrollTo = (event, id) => {
    event.preventDefault();
    if (window.location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-white/10 dark:bg-gray-950">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 dark:text-primary-300">
              Portfolio
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Omar Zouglah
            </h3>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-primary-500 to-transparent"></div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
              {t('hero.title')}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              {t('hero.location')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(event) => scrollTo(event, link.id)}
                    className="text-sm text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
              Connect
            </h4>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com/zougmar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-primary-400 dark:hover:text-primary-300"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/omar-z-396420213/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-primary-400 dark:hover:text-primary-300"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:o.zouglah03@gmail.com"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:border-primary-500 hover:text-primary-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-primary-400 dark:hover:text-primary-300"
                aria-label="Email"
              >
                <FiMail className="h-5 w-5" />
              </a>
            </div>
            <a
              href="mailto:o.zouglah03@gmail.com"
              className="mt-5 inline-block text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300"
            >
              o.zouglah03@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-400 dark:border-white/10">
          <p>&copy; {new Date().getFullYear()} Omar Zouglah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
