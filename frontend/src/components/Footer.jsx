import { useTranslation } from 'react-i18next';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Omar Zouglah</h3>
            <p className="text-sm">
              {t('hero.title')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === '/') {
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#about';
                    }
                  }}
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a 
                  href="/#skills" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === '/') {
                      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#skills';
                    }
                  }}
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  {t('nav.skills')}
                </a>
              </li>
              <li>
                <a 
                  href="/#projects" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === '/') {
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#projects';
                    }
                  }}
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  {t('nav.projects')}
                </a>
              </li>
              <li>
                <a 
                  href="/#contact" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.location.pathname === '/') {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#contact';
                    }
                  }}
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/zougmar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/omar-z-396420213/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:o.zouglah03@gmail.com"
                className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Omar Zouglah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
