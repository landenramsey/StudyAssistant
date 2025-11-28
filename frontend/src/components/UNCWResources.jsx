import { FiBook, FiCpu, FiMapPin, FiExternalLink, FiUsers, FiCalendar, FiHelpCircle } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import './UNCWResources.css';

function UNCWResources() {
  const resources = [
    {
      title: 'Randall Library',
      description: 'Access books, journals, databases, and research assistance. Reserve study rooms and get help from librarians.',
      icon: <FiBook />,
      link: 'https://library.uncw.edu/',
      color: '#0066CC'
    },
    {
      title: 'STEM Lab',
      description: 'State-of-the-art facility for science, technology, engineering, and mathematics. Access specialized equipment and tutoring.',
      icon: <FiCpu />,
      link: 'https://uncw.edu/stemlab/',
      color: '#00A651'
    },
    {
      title: 'Center for Learning Excellence',
      description: 'Free tutoring, academic coaching, and study skills workshops for all students.',
      icon: <FiUsers />,
      link: 'https://uncw.edu/cle/',
      color: '#8B5A3C'
    },
    {
      title: 'Writing Center',
      description: 'Get help with writing assignments, papers, and citations. One-on-one consultations available.',
      icon: <FiBook />,
      link: 'https://uncw.edu/writingcenter/',
      color: '#C8102E'
    },
    {
      title: 'Academic Calendar',
      description: 'Important dates, deadlines, exam schedules, and university events.',
      icon: <FiCalendar />,
      link: 'https://uncw.edu/registrar/calendars/',
      color: '#6366f1'
    },
    {
      title: 'Student Support Services',
      description: 'Comprehensive support including counseling, disability services, and academic accommodations.',
      icon: <FiHelpCircle />,
      link: 'https://uncw.edu/studentaffairs/',
      color: '#ec4899'
    }
  ];

  const quickLinks = [
    { name: 'Seahawk Hub', url: 'https://seahawkhub.uncw.edu/' },
    { name: 'Blackboard', url: 'https://uncw.edu/its/blackboard/' },
    { name: 'Email', url: 'https://uncw.edu/its/email/' },
    { name: 'Campus Map', url: 'https://uncw.edu/map/' },
    { name: 'Parking Services', url: 'https://uncw.edu/parking/' },
    { name: 'Dining Services', url: 'https://uncw.edu/dining/' }
  ];

  return (
    <div className="uncw-resources">
      <div className="section-header">
        <HiAcademicCap className="section-icon uncw-icon" />
        <div>
          <h2>UNCW Resources</h2>
          <p className="uncw-subtitle">University of North Carolina Wilmington</p>
        </div>
      </div>
      <p className="section-description">
        Quick access to campus resources, library services, and academic support to help you succeed.
      </p>

      <div className="resources-grid">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-card"
            style={{ '--card-color': resource.color }}
          >
            <div className="resource-icon" style={{ color: resource.color }}>
              {resource.icon}
            </div>
            <div className="resource-content">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </div>
            <FiExternalLink className="external-link-icon" />
          </a>
        ))}
      </div>

      <div className="quick-links-section">
        <h3>
          <FiMapPin className="section-icon-small" />
          Quick Links
        </h3>
        <div className="quick-links">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-link"
            >
              {link.name}
              <FiExternalLink className="link-icon" />
            </a>
          ))}
        </div>
      </div>

      <div className="uncw-info">
        <div className="info-card">
          <h4>📍 Location</h4>
          <p>601 S. College Road<br />Wilmington, NC 28403</p>
        </div>
        <div className="info-card">
          <h4>📞 Contact</h4>
          <p>Main: (910) 962-3000<br />Library: (910) 962-3760</p>
        </div>
        <div className="info-card">
          <h4>🕐 Library Hours</h4>
          <p>Mon-Thu: 7:30 AM - 11 PM<br />Fri: 7:30 AM - 5 PM<br />Sat-Sun: 10 AM - 6 PM</p>
        </div>
      </div>
    </div>
  );
}

export default UNCWResources;

