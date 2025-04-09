import React, { useState, useEffect, useRef } from 'react';
import { 
  FiCalendar, FiClock, FiBookOpen, 
  FiMapPin, FiCheck, FiArrowRight, FiSearch,
  FiUsers, FiChevronDown, FiHome, FiBook,
  FiEye, FiFilter, FiEdit, FiX, FiSave, 
  FiTrash2, FiChevronUp, FiMapPin as FiLocation,
  FiAlertCircle
} from 'react-icons/fi';
import './HomeDashboard.css';

const HomeDashboard = () => {
  // Hent valgt filial fra localStorage eller bruk standardverdi
  const [currentBranch, setCurrentBranch] = useState(() => {
    const saved = localStorage.getItem('currentBranch');
    return saved ? JSON.parse(saved) : {
      id: 'b1', 
      name: 'Kolbotn bibliotek', 
      address: 'Kolbotnveien 22, 1410 Kolbotn',
      theme: '#7d203a',
    };
  });
  
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [popularTitles, setPopularTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popularPeriod, setPopularPeriod] = useState('month');
  
  // Arrangementer
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventEditor, setShowEventEditor] = useState(false);
  
  // Referanser
  const dashboardRef = useRef(null);
  const popularTitlesRef = useRef(null);
  const eventsRef = useRef(null);
  const modalRef = useRef(null);

  const mockBranches = [
    { 
      id: 'b1', 
      name: 'Kolbotn bibliotek', 
      address: 'Kolbotnveien 22, 1410 Kolbotn',
      theme: '#7d203a',
    },
    { 
      id: 'b2', 
      name: 'Ski bibliotek', 
      address: 'Kirkeveien 3, 1400 Ski',
      theme: '#7d203a',
    },
  ];

  // Lytt etter endringer fra Sidebar
  useEffect(() => {
    const handleBranchChange = (event) => {
      setCurrentBranch(event.detail);
      setIsLoading(true);
      
      if (dashboardRef.current) {
        dashboardRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    window.addEventListener('branchChanged', handleBranchChange);
    
    return () => {
      window.removeEventListener('branchChanged', handleBranchChange);
    };
  }, []);

  // Last inn data når filialen endres
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Simuler lasting
        await new Promise(r => setTimeout(r, 800));
        
        // Last arrangementer fra localStorage eller generer nye
        const savedEvents = localStorage.getItem(`events-${currentBranch.id}`);
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        } else {
          const generatedEvents = generateEvents();
          setEvents(generatedEvents);
          localStorage.setItem(`events-${currentBranch.id}`, JSON.stringify(generatedEvents));
        }
        
        // Generer populære titler med forskjellige data for hver filial
        setPopularTitles(generatePopularTitles());
        
        // Oppdater CSS-variabler for filialens tema
        document.documentElement.style.setProperty('--branch-primary', currentBranch.theme);
        document.documentElement.style.setProperty('--branch-primary-light', adjustColor(currentBranch.theme, 20));
        document.documentElement.style.setProperty('--branch-primary-dark', adjustColor(currentBranch.theme, -20));
        document.documentElement.style.setProperty('--branch-primary-transparent', `${currentBranch.theme}1A`);
        
      } catch (error) {
        console.error('Feil:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentBranch.id]);

  // Animasjonsoppsett for elementer
  useEffect(() => {
    if (!isLoading && popularTitlesRef.current && eventsRef.current) {
      const popularItems = popularTitlesRef.current.querySelectorAll('.popular-book-card');
      const eventItems = eventsRef.current.querySelectorAll('.event-card');
      
      popularItems.forEach((item, i) => {
        item.style.setProperty('--index', i);
      });
      
      eventItems.forEach((item, i) => {
        item.style.setProperty('--index', i);
      });
    }
  }, [isLoading, popularTitles, events]);

  // Håndter klikk utenfor filialmenyen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showBranchMenu && !e.target.closest('.branch-switcher')) {
        setShowBranchMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBranchMenu]);

  // Håndter klikk utenfor modaler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && 
          !e.target.closest('.admin-button')) {
        setShowEventDetails(false);
        setShowEventEditor(false);
      }
    };
    
    if (showEventDetails || showEventEditor) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEventDetails, showEventEditor]);

  // Hjelpefunksjon for å justere fargelysstyrke
  const adjustColor = (hex, percent) => {
    hex = hex.replace('#', '');
    
    // Konverter til RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Juster lysstyrke
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // Konverter tilbake til hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Hjelpefunksjoner for datagenerering
  const generateEvents = () => {
    const today = new Date();
    
    return [
      {
        id: 1,
        title: 'Forfattermøte: Agnes Ravatn',
        description: 'Samtale om boken "Dei sju dørene" med forfatter Agnes Ravatn. Arrangementet er gratis, men krever påmelding på forhånd.',
        date: formatDate(addDays(today, 2)),
        time: '18:00 - 19:30',
        location: currentBranch.name,
        attendees: 28,
        maxAttendees: 50,
        isNew: true,
        isFeatured: false
      },
      {
        id: 2,
        title: 'Lesestund for barn 3-5 år',
        description: 'Vi leser fra nye barnebøker og har det gøy med rim og regler. Passer for barn mellom 3 og 5 år. Foreldre må være til stede.',
        date: formatDate(addDays(today, 4)),
        time: '10:30 - 11:15',
        location: `${currentBranch.name}, Barneavdelingen`,
        attendees: 12,
        maxAttendees: 15,
        isNew: false,
        isFeatured: false
      },
      {
        id: 3,
        title: 'Digital kompetanse for seniorer',
        description: 'Lær å bruke nettbrett og smartphone. Ta gjerne med eget utstyr. Vi har også nettbrett til utlån under kurset.',
        date: formatDate(addDays(today, 1)),
        time: '13:00 - 15:00',
        location: `${currentBranch.name}, Datarommet`,
        attendees: 8,
        maxAttendees: 12,
        isNew: false,
        isFeatured: false
      },
      {
        id: 4,
        title: 'Språkkafé',
        description: 'Praktiser norsk i en uformell setting. Alle språknivåer er velkomne. Kaffe og te serveres.',
        date: formatDate(addDays(today, 0)),
        time: '17:00 - 18:30',
        location: `${currentBranch.name}, Kafé Lesehesten`,
        attendees: 18,
        maxAttendees: 30,
        isNew: false,
        isFeatured: true
      }
    ].sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const generatePopularTitles = () => {
    // Forskjellige populære bøker for hver filial for å vise visuell endring
    if (currentBranch.id === 'b1') {
      return [
        {
          id: 1, title: 'Kongeriket', author: 'Jo Nesbø',
          weeklyCount: 14, monthlyCount: 42, yearlyCount: 156,
          available: true, category: 'Krim'
        },
        {
          id: 2, title: 'Kniv', author: 'Jo Nesbø',
          weeklyCount: 11, monthlyCount: 38, yearlyCount: 134,
          available: false, category: 'Krim'
        },
        {
          id: 3, title: 'Gleden med skjeden', 
          author: 'Nina Brochmann & Ellen Støkken Dahl',
          weeklyCount: 8, monthlyCount: 29, yearlyCount: 97,
          available: true, category: 'Fakta'
        },
        {
          id: 4, title: 'Hjernen er stjernen', author: 'Kaja Nordengen',
          weeklyCount: 7, monthlyCount: 26, yearlyCount: 88,
          available: true, category: 'Fakta'
        },
        {
          id: 5, title: 'Arv og Miljø', author: 'Vigdis Hjorth',
          weeklyCount: 6, monthlyCount: 22, yearlyCount: 79,
          available: false, category: 'Skjønnlitteratur'
        }
      ];
    } else if (currentBranch.id === 'b2') {
      return [
        {
          id: 1, title: 'Doppler', author: 'Erlend Loe',
          weeklyCount: 16, monthlyCount: 45, yearlyCount: 167,
          available: true, category: 'Skjønnlitteratur'
        },
        {
          id: 2, title: 'Bli best med mental trening', author: 'Erik Bertrand Larssen',
          weeklyCount: 13, monthlyCount: 41, yearlyCount: 142,
          available: true, category: 'Fakta'
        },
        {
          id: 3, title: 'Svøm med dem som drukner', 
          author: 'Lars Mytting',
          weeklyCount: 10, monthlyCount: 32, yearlyCount: 105,
          available: false, category: 'Skjønnlitteratur'
        },
        {
          id: 4, title: 'Snømannen', author: 'Jo Nesbø',
          weeklyCount: 9, monthlyCount: 28, yearlyCount: 94,
          available: false, category: 'Krim'
        },
        {
          id: 5, title: 'Kunsten å høre hjerteslag', author: 'Jan-Philipp Sendker',
          weeklyCount: 7, monthlyCount: 25, yearlyCount: 82,
          available: true, category: 'Skjønnlitteratur'
        }
      ];
    } else {
      return [
        {
          id: 1, title: 'Bienes historie', author: 'Maja Lunde',
          weeklyCount: 15, monthlyCount: 44, yearlyCount: 162,
          available: false, category: 'Skjønnlitteratur'
        },
        {
          id: 2, title: 'Min kamp 1', author: 'Karl Ove Knausgård',
          weeklyCount: 12, monthlyCount: 40, yearlyCount: 138,
          available: true, category: 'Skjønnlitteratur'
        },
        {
          id: 3, title: 'Kilden', 
          author: 'Anne Holt',
          weeklyCount: 9, monthlyCount: 31, yearlyCount: 103,
          available: true, category: 'Krim'
        },
        {
          id: 4, title: 'Å tenke, fort og langsomt', author: 'Daniel Kahneman',
          weeklyCount: 8, monthlyCount: 27, yearlyCount: 91,
          available: true, category: 'Fakta'
        },
        {
          id: 5, title: 'Beatles', author: 'Lars Saabye Christensen',
          weeklyCount: 6, monthlyCount: 24, yearlyCount: 80,
          available: false, category: 'Skjønnlitteratur'
        }
      ];
    }
  };
  
  // Datoverktøy
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('no-NO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };
  
  // Hendelseshåndterere
  const handleBranchChange = (branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('currentBranch', JSON.stringify(branch));
    setShowBranchMenu(false);
    setIsLoading(true);
    
    if (dashboardRef.current) {
      dashboardRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Send hendelse til Sidebar
    window.dispatchEvent(new CustomEvent('dashboardBranchChanged', { detail: branch }));
  };
  
  const getLoanCountByPeriod = (book) => {
    switch(popularPeriod) {
      case 'week': return book.weeklyCount;
      case 'month': return book.monthlyCount;
      case 'year': return book.yearlyCount;
      default: return book.monthlyCount;
    }
  };

  const getPeriodText = () => {
    switch(popularPeriod) {
      case 'week': return 'siste uke';
      case 'month': return 'siste måned';
      case 'year': return 'siste år';
      default: return 'siste måned';
    }
  };
  
  // Håndterere for arrangementsdetaljer og redigering
  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent({...event});
    setShowEventEditor(true);
  };
  
  const handleSaveEvent = () => {
    // Valider skjema
    if (!editingEvent.title.trim()) {
      alert('Tittel kan ikke være tom');
      return;
    }
    
    let updatedEvents;
    
    // Sjekk om dette er et nytt arrangement eller redigering av eksisterende
    if (events.find(e => e.id === editingEvent.id)) {
      // Oppdater eksisterende arrangement
      updatedEvents = events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      );
    } else {
      // Legg til nytt arrangement
      updatedEvents = [...events, editingEvent];
    }
    
    // Sorter arrangementer etter dato
    updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setEvents(updatedEvents);
    localStorage.setItem(`events-${currentBranch.id}`, JSON.stringify(updatedEvents));
    setShowEventEditor(false);
  };
  
  const handleDeleteEvent = () => {
    if (window.confirm('Er du sikker på at du vil slette dette arrangementet?')) {
      const updatedEvents = events.filter(event => event.id !== editingEvent.id);
      setEvents(updatedEvents);
      localStorage.setItem(`events-${currentBranch.id}`, JSON.stringify(updatedEvents));
      setShowEventEditor(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditingEvent(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const handleAddNewEvent = () => {
    const today = new Date();
    
    const newEvent = {
      id: Date.now(), // Bruk tidsstempel som ID
      title: 'Nytt arrangement',
      description: 'Beskrivelse av arrangementet',
      date: formatDate(addDays(today, 7)),
      time: '12:00 - 13:00',
      location: currentBranch.name,
      attendees: 0,
      maxAttendees: 20,
      isNew: true,
      isFeatured: false
    };
    
    setEditingEvent(newEvent);
    setShowEventEditor(true);
  };
  
  if (isLoading) {
    return (
      <div className="home-dashboard-container" style={{'--branch-primary': currentBranch.theme}}>
        <div className="home-dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Laster inn dashbord for {currentBranch.name}...</p>
        </div>
      </div>
    );
  }

  // Sorter bøker etter valgt periode
  const sortedBooks = [...popularTitles].sort((a, b) => 
    getLoanCountByPeriod(b) - getLoanCountByPeriod(a)
  );

  return (
    <div className="home-dashboard-container" ref={dashboardRef} style={{'--branch-primary': currentBranch.theme}}>
      <div className="home-dashboard">
        {/* Filialvelger og søk */}
        <div className="dashboard-controls">
          <div className="branch-switcher">
            <button 
              className="branch-button" 
              onClick={() => setShowBranchMenu(!showBranchMenu)}
              aria-label="Bytt filial"
              aria-expanded={showBranchMenu}
            >
              <div className="branch-info">
                <span className="branch-name">{currentBranch.name}</span>
                <span className="branch-address">{currentBranch.address}</span>
              </div>
              {showBranchMenu ? 
                <FiChevronUp className="dropdown-icon open" /> : 
                <FiChevronDown className="dropdown-icon" />
              }
            </button>
            
            {showBranchMenu && (
              <div className="branch-menu">
                {mockBranches.map(branch => (
                  <button 
                    key={branch.id}
                    className={`branch-menu-item ${branch.id === currentBranch.id ? 'active' : ''}`}
                    onClick={() => handleBranchChange(branch)}
                    style={{
                      '--item-color': branch.theme,
                      '--item-bg': `${branch.theme}1A`
                    }}
                  >
                    <div className="branch-menu-info">
                      <span>{branch.name}</span>
                      <span>{branch.address}</span>
                    </div>
                    {branch.id === currentBranch.id && <FiCheck className="active-check" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            {/* Populære titler-seksjon */}
            <section className="dashboard-section popular-section loaded">
              <div className="section-header">
                <h2><FiBookOpen /> Populære titler</h2>
                <div className="section-actions">
                  <div className="period-filter">
                    <select 
                      value={popularPeriod}
                      onChange={e => setPopularPeriod(e.target.value)}
                      className="period-select"
                      aria-label="Velg periode"
                    >
                      <option value="week">Siste uke</option>
                      <option value="month">Siste måned</option>
                      <option value="year">Siste år</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="popular-books" ref={popularTitlesRef}>
                {sortedBooks.map((book, index) => (
                  <div key={book.id} className="popular-book-card">
                    <div className="book-rank">{index + 1}</div>
                    <div className="book-details">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                      <div className="book-loan-count">
                        <FiBookOpen />
                        <span>{getLoanCountByPeriod(book)} utlån {getPeriodText()}</span>
                      </div>
                      <div className={`book-availability ${book.available ? 'available' : 'unavailable'}`}>
                        {book.available ? (
                          <>
                            <FiCheck className="availability-icon" />
                            <span>Tilgjengelig</span>
                          </>
                        ) : (
                          <>
                            <FiClock className="availability-icon" />
                            <span>Utlånt</span>
                          </>
                        )}
                      </div>
                      
                      <div className="book-info">
                        <div className="book-category">
                          <FiBook className="category-icon" />
                          <span>{book.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Kommende arrangementer-seksjon */}
            <section className="dashboard-section events-section loaded">
              <div className="section-header">
                <h2><FiCalendar /> Kommende arrangementer</h2>
                <div className="section-actions">
                  <button 
                    className="add-event-button" 
                    onClick={handleAddNewEvent}
                    aria-label="Legg til nytt arrangement"
                  >
                    + Nytt arrangement
                  </button>
                </div>
              </div>
              
              <div className="events-timeline">
                <div className="timeline-today-marker">I dag</div>
                
                <div className="events-list" ref={eventsRef}>
                  {events.length > 0 ? (
                    events.map(event => (
                      <div key={event.id} className={`event-card ${event.isFeatured ? 'featured' : ''}`}>
                        <div className="event-date-time">
                          <div className="event-date">
                            <FiCalendar />
                            <span>{event.date}</span>
                          </div>
                          <div className="event-time">
                            <FiClock />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        
                        <div className="event-details">
                          <div className="event-header">
                            <h3 className="event-title">
                              {event.title}
                              {event.isNew && <span className="event-tag new">Ny</span>}
                              {event.isFeatured && <span className="event-tag featured">Anbefalt</span>}
                            </h3>
                            <div className="event-actions">
                              <button 
                                className="event-action-button"
                                onClick={() => handleViewEventDetails(event)}
                                aria-label="Se detaljer"
                              >
                                <FiEye />
                              </button>
                              <button 
                                className="event-action-button"
                                onClick={() => handleEditEvent(event)}
                                aria-label="Rediger"
                              >
                                <FiEdit />
                              </button>
                            </div>
                          </div>
                          
                          <p className="event-description">{event.description}</p>
                          
                          <div className="event-meta">
                            <div className="event-location">
                              <FiMapPin />
                              <span>{event.location}</span>
                            </div>
                            
                            <div className="event-attendance">
                              <div className="attendance-text">
                                <FiUsers className="mini-icon" />
                                <span>{event.attendees}/{event.maxAttendees} påmeldte</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-events">
                      <p>Ingen kommende arrangementer</p>
                      <button 
                        className="add-event-button-empty" 
                        onClick={handleAddNewEvent}
                      >
                        Legg til arrangement
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Arrangementsdetaljer-modal */}
      {showEventDetails && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal event-details-modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Arrangementsdetaljer</h2>
              <button 
                className="close-button" 
                onClick={() => setShowEventDetails(false)}
                aria-label="Lukk"
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="event-detail-header">
                <h3>{selectedEvent.title}</h3>
                <div className="event-tags">
                  {selectedEvent.isNew && <span className="event-tag new">Ny</span>}
                  {selectedEvent.isFeatured && <span className="event-tag featured">Anbefalt</span>}
                </div>
              </div>
              
              <div className="event-detail-info">
                <div className="detail-item">
                  <FiCalendar className="detail-icon" />
                  <div>
                    <strong>Dato</strong>
                    <p>{selectedEvent.date}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FiClock className="detail-icon" />
                  <div>
                    <strong>Tidspunkt</strong>
                    <p>{selectedEvent.time}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FiLocation className="detail-icon" />
                  <div>
                    <strong>Sted</strong>
                    <p>{selectedEvent.location}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <FiUsers className="detail-icon" />
                  <div>
                    <strong>Påmeldte</strong>
                    <p>{selectedEvent.attendees} av {selectedEvent.maxAttendees} plasser</p>
                    <div className="attendance-bar">
                      <div 
                        className="attendance-fill" 
                        style={{width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="event-description-full">
                <h4>Beskrivelse</h4>
                <p>{selectedEvent.description}</p>
              </div>
              <div className="modal-actions">
                <button 
                  className="modal-button secondary"
                  onClick={() => setShowEventDetails(false)}
                >
                  Lukk
                </button>
                <button 
                  className="modal-button primary"
                  onClick={() => {
                    setShowEventDetails(false);
                    handleEditEvent(selectedEvent);
                  }}
                >
                  <FiEdit /> Rediger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Arrangementsredigering-modal */}
      {showEventEditor && editingEvent && (
        <div className="modal-overlay">
          <div className="modal event-editor-modal" ref={modalRef}>
            <div className="modal-header">
              <h2>{editingEvent.id === Date.now() ? 'Nytt arrangement' : 'Rediger arrangement'}</h2>
              <button 
                className="close-button" 
                onClick={() => setShowEventEditor(false)}
                aria-label="Lukk"
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-content">
              <form className="event-edit-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="title">Tittel</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value={editingEvent.title}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    placeholder="Skriv inn tittel på arrangementet"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Beskrivelse</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    value={editingEvent.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Skriv en beskrivelse av arrangementet"
                    aria-describedby="desc-hint"
                  ></textarea>
                  <small id="desc-hint" className="form-hint">
                    Beskriv arrangementet kort og presist for deltakerne
                  </small>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Dato</label>
                    <input 
                      type="text" 
                      id="date" 
                      name="date" 
                      value={editingEvent.date}
                      onChange={handleInputChange}
                      placeholder="DD.MM.ÅÅÅÅ"
                      pattern="\d{2}\.\d{2}\.\d{4}"
                      aria-describedby="date-hint"
                    />
                    <small id="date-hint" className="form-hint">
                      Format: DD.MM.ÅÅÅÅ
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time">Tidspunkt</label>
                    <input 
                      type="text" 
                      id="time" 
                      name="time" 
                      value={editingEvent.time}
                      onChange={handleInputChange}
                      placeholder="HH:MM - HH:MM"
                      aria-describedby="time-hint"
                    />
                    <small id="time-hint" className="form-hint">
                      Format: HH:MM - HH:MM
                    </small>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Sted</label>
                  <input 
                    type="text" 
                    id="location" 
                    name="location" 
                    value={editingEvent.location}
                    onChange={handleInputChange}
                    placeholder="Skriv inn sted for arrangementet"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="attendees">Antall påmeldte</label>
                    <input 
                      type="number" 
                      id="attendees" 
                      name="attendees" 
                      value={editingEvent.attendees}
                      onChange={handleNumberChange}
                      min="0"
                      max={editingEvent.maxAttendees}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="maxAttendees">Maks antall</label>
                    <input 
                      type="number" 
                      id="maxAttendees" 
                      name="maxAttendees" 
                      value={editingEvent.maxAttendees}
                      onChange={handleNumberChange}
                      min={editingEvent.attendees}
                    />
                  </div>
                </div>
                
                <div className="form-row checkbox-row">
                  <div className="form-group checkbox-group">
                    <input 
                      type="checkbox" 
                      id="isNew" 
                      name="isNew" 
                      checked={editingEvent.isNew}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="isNew">Marker som nytt</label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input 
                      type="checkbox" 
                      id="isFeatured" 
                      name="isFeatured" 
                      checked={editingEvent.isFeatured}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="isFeatured">Marker som anbefalt</label>
                  </div>
                </div>
              </form>
              
              <div className="form-feedback">
                {editingEvent.title.trim() === '' && (
                  <p className="error-message">
                    <FiAlertCircle /> Arrangementet må ha en tittel
                  </p>
                )}
              </div>
              
              <div className="modal-actions">
                {editingEvent.id !== Date.now() && (
                  <button 
                    className="modal-button danger"
                    onClick={handleDeleteEvent}
                    type="button"
                  >
                    <FiTrash2 /> Slett
                  </button>
                )}
                <button 
                  className="modal-button secondary"
                  onClick={() => setShowEventEditor(false)}
                  type="button"
                >
                  Avbryt
                </button>
                <button 
                  className="modal-button primary"
                  onClick={handleSaveEvent}
                  type="button"
                  disabled={editingEvent.title.trim() === ''}
                >
                  <FiSave /> Lagre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;