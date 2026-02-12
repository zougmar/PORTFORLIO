import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiMenu, 
  FiX as FiClose,
  FiBriefcase,
  FiCode,
  FiMail,
  FiFileText,
  FiLogOut,
  FiHome,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProfileEditModal from '../components/ProfileEditModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({ 
    cvUrlEn: '', 
    cvFileNameEn: '', 
    cvUrlFr: '', 
    cvFileNameFr: '' 
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    fetchProfileData();
  }, [i18n.language]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/users/profile/me');
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const response = await api.get('/projects');
        setProjects(response.data);
      } else if (activeTab === 'skills') {
        const response = await api.get('/skills');
        setSkills(response.data);
      } else if (activeTab === 'messages') {
        const response = await api.get('/messages');
        setMessages(response.data);
      } else if (activeTab === 'cv') {
        const response = await api.get('/settings');
        setSettings(response.data);
      }
    } catch (error) {
      toast.error('Error fetching data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/${type}/${id}`);
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Error deleting item');
      console.error('Error:', error);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
      setImagePreview(item.image || null);
    } else {
      setFormData({});
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'projects' && imageFile) {
        // Use FormData for file upload
        const submitData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key !== 'image') { // Don't include image URL if we have a file
            if (key === 'technologies' && Array.isArray(formData[key])) {
              // Handle technologies array - send as comma-separated string
              submitData.append(key, formData[key].join(','));
            } else if (typeof formData[key] === 'boolean') {
              submitData.append(key, formData[key]);
            } else if (formData[key] !== null && formData[key] !== undefined) {
              submitData.append(key, formData[key]);
            }
          }
        });

        // Append image file
        submitData.append('image', imageFile);

        // Use api utility for file uploads (axios handles FormData)
        if (editingItem) {
          await api.put(`/projects/${editingItem._id}`, submitData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          await api.post('/projects', submitData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        toast.success(editingItem ? 'Project updated successfully' : 'Project created successfully');
      } else {
        // Regular JSON request for non-project items or projects without image upload
        if (editingItem) {
          await api.put(`/${modalType}/${editingItem._id}`, formData);
          toast.success('Item updated successfully');
        } else {
          await api.post(`/${modalType}`, formData);
          toast.success('Item created successfully');
        }
      }
      
      closeModal();
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Error saving item');
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Mark as read when viewing
    if (!message.read) {
      try {
        await api.put(`/messages/${message._id}`, { read: true });
        // Update local state
        setMessages(messages.map(msg => 
          msg._id === message._id ? { ...msg, read: true } : msg
        ));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleToggleReadStatus = async (messageId, currentStatus) => {
    try {
      await api.put(`/messages/${messageId}`, { read: !currentStatus });
      // Update local state
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, read: !currentStatus } : msg
      ));
      // Update selected message if it's the one being toggled
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: !currentStatus });
      }
      toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
    } catch (error) {
      toast.error('Error updating message status');
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, use it as is (same domain in production)
    return imagePath;
  };

  const menuItems = [
    { id: 'projects', label: t('admin.projects'), icon: FiBriefcase },
    { id: 'skills', label: t('admin.skills'), icon: FiCode },
    { id: 'messages', label: t('admin.messages'), icon: FiMail },
    { id: 'cv', label: 'CV Management', icon: FiFileText }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Omar Zouglah Portfolio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {profileData?.image ? (
                    <img 
                      src={getImageUrl(profileData.image)} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-lg object-cover border-2 border-primary-200 dark:border-primary-800"
                    />
                  ) : (
                    <img 
                      src="/images/logo.jpeg" 
                      alt="Logo" 
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${activeTab === item.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {/* Profile Section */}
              <button
                onClick={() => {
                  navigate('/');
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiHome className="w-5 h-5" />
                <span className="font-medium">Back to Site</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Top Bar */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="px-4 py-4 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div>
                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.projects')}</h2>
                      <button
                        onClick={() => openModal('projects')}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span>{t('admin.addProject')}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        >
                          {project.image && (
                            <div className="h-32 overflow-hidden">
                              <img 
                                src={getImageUrl(project.image)} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal('projects', project)}
                                className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                              >
                                <FiEdit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(project._id, 'projects')}
                                className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.skills')}</h2>
                      <button
                        onClick={() => openModal('skills')}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
                      >
                        <FiPlus className="w-5 h-5" />
                        <span>{t('admin.addSkill')}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {skills.map((skill) => (
                        <div
                          key={skill._id}
                          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                        >
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{skill.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {skill.category} - {skill.proficiency}%
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal('skills', skill)}
                              className="p-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                            >
                              <FiEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id, 'skills')}
                              className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CV Management Tab */}
                {activeTab === 'cv' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">CV Management</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* English CV Upload */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                          <span>🇬🇧</span>
                          <span>English CV</span>
                        </h3>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData();
                          const fileInput = document.getElementById('cv-file-en');
                          if (!fileInput.files[0]) {
                            toast.error('Please select a PDF file');
                            return;
                          }
                          formData.append('cv', fileInput.files[0]);
                          formData.append('language', 'en');
                          
                          try {
                            await api.post('/settings/upload-cv', formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data'
                              }
                            });
                            toast.success('English CV uploaded successfully!');
                            fetchData();
                            fileInput.value = '';
                          } catch (error) {
                            const message = error.response?.data?.message || 'Error uploading CV';
                            toast.error(message);
                            console.error('Error:', error);
                          }
                        }} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select English CV (PDF only, max 10MB)</label>
                            <input
                              type="file"
                              id="cv-file-en"
                              accept=".pdf,application/pdf"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Upload English CV
                          </button>
                        </form>
                        {settings.cvUrlEn && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                              <strong>Current English CV:</strong> {settings.cvFileNameEn || 'CV_English.pdf'}
                            </p>
                            <a
                              href={settings.cvUrlEn.startsWith('http://') || settings.cvUrlEn.startsWith('https://')
                                ? settings.cvUrlEn
                                : settings.cvUrlEn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              View/Download English CV
                            </a>
                          </div>
                        )}
                      </div>

                      {/* French CV Upload */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white">
                          <span>🇫🇷</span>
                          <span>French CV</span>
                        </h3>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData();
                          const fileInput = document.getElementById('cv-file-fr');
                          if (!fileInput.files[0]) {
                            toast.error('Please select a PDF file');
                            return;
                          }
                          formData.append('cv', fileInput.files[0]);
                          formData.append('language', 'fr');
                          
                          try {
                            await api.post('/settings/upload-cv', formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data'
                              }
                            });
                            toast.success('French CV uploaded successfully!');
                            fetchData();
                            fileInput.value = '';
                          } catch (error) {
                            const message = error.response?.data?.message || 'Error uploading CV';
                            toast.error(message);
                            console.error('Error:', error);
                          }
                        }} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select French CV (PDF only, max 10MB)</label>
                            <input
                              type="file"
                              id="cv-file-fr"
                              accept=".pdf,application/pdf"
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Upload French CV
                          </button>
                        </form>
                        {settings.cvUrlFr && (
                          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                              <strong>Current French CV:</strong> {settings.cvFileNameFr || 'CV_French.pdf'}
                            </p>
                            <a
                              href={settings.cvUrlFr.startsWith('http://') || settings.cvUrlFr.startsWith('https://')
                                ? settings.cvUrlFr
                                : settings.cvUrlFr}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              View/Download French CV
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.messages')}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {messages.filter(m => !m.read).length} unread message{messages.filter(m => !m.read).length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    {messages.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <FiMail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">No messages yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 transition-all cursor-pointer hover:shadow-lg ${
                              message.read
                                ? 'border-gray-300 dark:border-gray-600'
                                : 'border-primary-600 bg-primary-50/50 dark:bg-primary-900/20'
                            }`}
                            onClick={() => handleViewMessage(message)}
                          >
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {!message.read && (
                                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                    )}
                                    <h3 className={`text-lg font-bold ${message.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                      {message.name}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                                    <FiMail className="w-3 h-3" />
                                    <span>{message.email}</span>
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                                      message.read
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                    }`}
                                  >
                                    {message.read ? (
                                      <>
                                        <FiCheckCircle className="w-3 h-3" />
                                        <span>{t('admin.read')}</span>
                                      </>
                                    ) : (
                                      <>
                                        <FiCircle className="w-3 h-3" />
                                        <span>{t('admin.unread')}</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <p className="font-semibold text-gray-900 dark:text-white mb-2">{message.subject}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                  {message.message}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <FiClock className="w-3 h-3" />
                                  <span>{formatDate(message.createdAt)}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(message._id, 'messages');
                                  }}
                                  className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                  title="Delete message"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Message Detail Modal */}
        <AnimatePresence>
          {showMessageModal && selectedMessage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start z-10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <FiMail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Message Details</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(selectedMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleReadStatus(selectedMessage._id, selectedMessage.read)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
                        selectedMessage.read
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800'
                      }`}
                    >
                      {selectedMessage.read ? (
                        <>
                          <FiCircle className="w-4 h-4" />
                          <span>Mark as Unread</span>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          <span>Mark as Read</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowMessageModal(false);
                        setSelectedMessage(null);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 ${
                        selectedMessage.read
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      }`}
                    >
                      {selectedMessage.read ? (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          <span>{t('admin.read')}</span>
                        </>
                      ) : (
                        <>
                          <FiCircle className="w-4 h-4" />
                          <span>{t('admin.unread')}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Sender Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Sender Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiClock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(selectedMessage.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Subject
                    </h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedMessage.subject}</p>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Message
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this message?')) {
                          handleDelete(selectedMessage._id, 'messages');
                          setShowMessageModal(false);
                          setSelectedMessage(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center space-x-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete Message</span>
                    </button>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>Reply</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? t('admin.editProject') : t('admin.addProject')}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {modalType === 'projects' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Project Image
                      </label>
                      <div className="space-y-4">
                        {/* File Upload */}
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Upload Image (JPEG, PNG, GIF, WebP - Max 5MB)
                          </label>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
                          />
                        </div>
                        
                        {/* OR Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OR</span>
                          </div>
                        </div>

                        {/* URL Input */}
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Enter Image URL
                          </label>
                          <input
                            type="url"
                            name="image"
                            value={formData.image || ''}
                            onChange={handleChange}
                            placeholder="https://example.com/project-image.jpg or /images/project.jpg"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={!!imageFile}
                          />
                          {imageFile && (
                            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                              File upload selected. URL input disabled.
                            </p>
                          )}
                        </div>

                        {/* Preview */}
                        {(imagePreview || formData.image) && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                            <img 
                              src={imagePreview || formData.image} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title (EN)</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description (EN)</label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">GitHub URL</label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Live URL</label>
                      <input
                        type="url"
                        name="liveUrl"
                        value={formData.liveUrl || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        name="technologies"
                        value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : (formData.technologies || '')}
                        onChange={(e) => {
                          const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                          setFormData({ ...formData, technologies: techs });
                        }}
                        placeholder="React.js, Node.js, MongoDB"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Separate multiple technologies with commas
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                      <select
                        name="category"
                        value={formData.category || 'web'}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="fullstack">Full Stack</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured || false}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-gray-700 dark:text-gray-300">Featured</label>
                    </div>
                  </>
                )}

                {modalType === 'skills' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Category</label>
                      <select
                        name="category"
                        value={formData.category || 'language'}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="language">Language</option>
                        <option value="framework">Framework</option>
                        <option value="database">Database</option>
                        <option value="tool">Tool</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Proficiency (0-100)</label>
                      <input
                        type="number"
                        name="proficiency"
                        value={formData.proficiency || 0}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={showProfileModal}
          onClose={async () => {
            setShowProfileModal(false);
            await fetchProfileData();
          }}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
