/**
 * Authentic Portfolio Data for Takudzwa Muzovaka
 * Extracted directly from original index.html (verified identical content).
 * 
 * Empty strings ("") or items marked [CONFIG_REQUIRED] indicate fields
 * that were placeholders in the original source and await user configuration.
 */

export const portfolioData = {
  // Brand & Identity Information
  brand: {
    name: "Takudzwa Muzovaka",
    monogram: "TM",
    tagline: "Excellence with purpose",
    pillars: "Purpose | Innovation | Impact",
    logoPath: "/logo/tm-logo.png",
    faviconPath: "/logo/favicon.svg"
  },

  // Personal Profile Metadata
  profile: {
    fullName: "Takudzwa Muzovaka",
    jobTitle: "Computer Science & AI Student, Author, Entrepreneur",
    metaTitle: "Takudzwa Muzovaka | AI • Cybersecurity • Technology • Author",
    metaDescription: "Takudzwa Muzovaka is a Computer Science and AI student, cybersecurity enthusiast, researcher, entrepreneur and author building technology and ideas with purpose.",
    roles: [
      "Student",
      "Author",
      "Builder",
      "Innovator"
    ],
    rolesDetailed: [
      "Computer Science & AI Student",
      "Cybersecurity Enthusiast",
      "Author",
      "Entrepreneur",
      "Purpose-Driven"
    ],
    portraits: {
      hero: "/images/portrait-copper-suit.jpg", // Copper double-breasted suit
      about: "/images/portrait-navy-suit.jpg"  // Navy patterned suit
    }
  },

  // Global Navigation Links
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Writing", href: "#writing" },
    { label: "Skills", href: "#skills" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" }
  ],

  // Bottom Navigation Links (Mobile quick thumb navigation)
  bottomNavigation: [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Writing", href: "#writing" },
    { label: "Contact", href: "#contact" },
    { label: "More", action: "open_menu" }
  ],

  // Social Links
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/takudzwa-muzovaka/",
    github: "https://github.com/TkayMuzo/",
    x: "https://x.com/Cyberlunat3001",
    instagram: "https://www.instagram.com/takumuzoofficial/",
    youtube: ""
  },

  // Contact Channels & Configuration
  contact: {
    sectionLabel: "Let's create impact",
    heading: "Let's talk.",
    description: "Have a project, collaboration idea, research opportunity, business idea, or simply want to connect?",
    email: "takudzwamuzovaka25@gmail.com",
    whatsapp: "+91 7508368723",
    location: "",
    formEndpoint: '/api/contact',
    formFields: {
      name: { label: "Full name", placeholder: "Your name", required: true },
      email: { label: "Email", placeholder: "your@email.com", required: true },
      phone: { label: "Phone", placeholder: "Phone number (optional)", required: false },
      reason: {
        label: "Reason for contact",
        options: [
          "Project Collaboration",
          "Research",
          "Business",
          "Speaking",
          "Technology",
          "Writing",
          "Other"
        ]
      },
      subject: { label: "Subject", placeholder: "Subject", required: true },
      message: { label: "Message", placeholder: "Write your message here...", required: true }
    }
  },

  // Hero Section
  hero: {
    eyebrow: "• Author • Builder • Innovator",
    headlineLine1: "Takudzwa Muzovaka:",
    headlineLine2: "Turning",
    headlineLine3Prefix: "Ideas into ",
    headlineAccentWord: "Impact",
    bio: "Computer Science & AI student, cybersecurity enthusiast, researcher, author and entrepreneur building technology, ideas and solutions with purpose.",
    ctaPrimary: {
      label: "View my projects",
      href: "#projects"
    },
    ctaSecondary: {
      label: "Read my book",
      href: "#writing"
    },
    ctaTertiary: {
      label: "Let's connect",
      href: "#contact"
    },
    badge: {
      title: "Building",
      line2: "a Better",
      line3: "Tomorrow"
    }
  },

  // About Section
  about: {
    sectionLabel: "About me",
    heading: "Takudzwa Muzovaka",
    quote: "Technology, knowledge and purpose can change lives.",
    quoteAuthor: "Takudzwa Muzovaka",
    narrative: "I work where technology, artificial intelligence, cybersecurity, research, entrepreneurship and writing meet. I study Computer Science with a focus on AI and cybersecurity, build practical projects, and write to share what I learn. My aim is simple: create solutions and ideas that serve people and last.",
    focusPillars: [
      "Computer Science & Engineering",
      "AI / Machine Learning",
      "Cybersecurity",
      "Research",
      "Entrepreneurship",
      "Author"
    ],
    cta: {
      label: "More about me",
      href: "#contact"
    }
  },

  // Core Values (What drives me)
  values: {
    sectionLabel: "What drives me",
    heading: "Excellence with purpose",
    items: [
      {
        number: "01",
        title: "Purpose",
        description: "I build with intention and seek meaningful impact."
      },
      {
        number: "02",
        title: "Intelligence",
        description: "Continuous learning, research and understanding."
      },
      {
        number: "03",
        title: "Innovation",
        description: "Turning ideas into practical solutions."
      },
      {
        number: "04",
        title: "Excellence",
        description: "Maintaining high standards in what I build and create."
      }
    ]
  },

  // Projects (Authentic projects with wireframe featured arrangement)
  projects: [
    {
      id: "deepfake-detection",
      number: "01",
      title: "Deepfake Detection & Adversarial Robustness Analyzer",
      shortTitle: "Deepfake Detection & Robustness Analyzer",
      category: "AI / Machine Learning / Cybersecurity",
      primaryCategory: "AI/ML",
      secondaryCategory: "Computer Vision",
      researchQuestion: "Can a deepfake detector still be trusted when it is attacked?",
      description: "Detecting deepfakes and analyzing adversarial robustness using CNN and FGSM adversarial attacks.",
      fullDescription: "An AI-based system for detecting manipulated media and analyzing the robustness of deepfake detection models against adversarial attacks.",
      technologies: [
        "Python",
        "TensorFlow",
        "OpenCV",
        "CNN",
        "MobileNetV2",
        "FGSM",
        "Computer Vision"
      ],
      highlights: [
        "Python, TensorFlow, OpenCV",
        "FaceForensics++ Dataset",
        "CNN + Adversarial Attacks (FGSM)"
      ],
      featured: true,
      featuredOrder: 1,
      artIndex: 1,
      svgPaths: `<path d="M0 90 Q60 20 120 70 T240 40 T360 80" stroke="#E5B85C" fill="none" stroke-width="2"/><circle cx="120" cy="70" r="5" fill="#E5B85C"/>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "crop-disease-prediction",
      number: "02",
      title: "Multi-Modal Crop Disease Prediction",
      shortTitle: "Crop Disease Prediction (Multi-Modal ML)",
      category: "AI / Agriculture",
      primaryCategory: "AI/ML",
      secondaryCategory: "Agriculture",
      researchQuestion: "Can plant images and environmental data predict crop disease?",
      description: "Combining plant images and environmental data for accurate crop disease prediction.",
      fullDescription: "A multimodal machine learning system combining plant imagery and environmental data to support crop disease prediction.",
      technologies: [
        "Python",
        "TensorFlow",
        "MobileNetV2",
        "Machine Learning",
        "Computer Vision",
        "Environmental Sensors"
      ],
      highlights: [
        "Python, TensorFlow, MobileNetV2",
        "Multimodal Image & Sensor Fusion",
        "Early Disease Warning System"
      ],
      featured: true,
      featuredOrder: 2,
      artIndex: 3,
      svgPaths: `<g fill="#C9963E" opacity=".8"><circle cx="90" cy="60" r="34"/><circle cx="150" cy="80" r="26" opacity=".6"/></g><path d="M200 100V40l50 30 50-30v60" stroke="#F3D38A" fill="none" stroke-width="2"/>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "financial-forecasting",
      number: "03",
      title: "AI-Based Financial Forecasting",
      shortTitle: "AI-Based Financial Forecasting",
      category: "AI / Finance / Time-Series",
      primaryCategory: "AI/ML",
      secondaryCategory: "Finance",
      researchQuestion: "Can LSTM deep learning models accurately forecast corporate financial ratios over time?",
      description: "LSTM-based forecasting of financial ratios for McDonald's.",
      fullDescription: "An AI/ML project using LSTM-based time-series forecasting to analyze and forecast financial ratios for McDonald's.",
      technologies: [
        "Python",
        "TensorFlow / Keras",
        "LSTM",
        "Time-Series Analysis",
        "Financial Modeling"
      ],
      highlights: [
        "Model: LSTM (Long Short-Term Memory)",
        "Company Analyzed: McDonald's",
        "Indicators: P/E Ratio, P/S Ratio, Dividend Yield, Operating Margin"
      ],
      featured: true,
      featuredOrder: 3,
      artIndex: 5,
      svgPaths: `<path d="M20 100l40-30 40 10 40-50 40 40 40-20 40 30 40-60" stroke="#E5B85C" fill="none" stroke-width="2"/>`,
      caseStudyPlaceholder: "Case study details: [CONFIG_REQUIRED - Metrics, datasets, or additional technical claims can be configured here]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "machine-translation",
      number: "04",
      title: "Domain-Specific Machine Translation",
      shortTitle: "Domain-Specific Machine Translation",
      category: "AI / NLP / Research",
      primaryCategory: "AI/ML",
      secondaryCategory: "NLP",
      researchQuestion: "Can machine translation serve Shona speakers in law and healthcare?",
      description: "A domain-specific English-Shona machine translation research project focused on legal and healthcare applications.",
      fullDescription: "A domain-specific English-Shona machine translation research project focused on legal and healthcare applications.",
      technologies: [
        "NLLB-200",
        "LoRA",
        "QLoRA",
        "NLP",
        "Python",
        "Hugging Face"
      ],
      highlights: [
        "NLLB-200 Fine-Tuning",
        "LoRA & QLoRA Parameter Efficiency",
        "Legal & Healthcare Shona Corpora"
      ],
      featured: false,
      featuredOrder: 4,
      artIndex: 2,
      svgPaths: `<g stroke="#C9963E" fill="none"><path d="M40 30h120M40 60h200M40 90h150"/><path d="M200 30h120M260 60h80M220 90h120" stroke="#E5B85C"/></g>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "land-registry",
      number: "05",
      title: "Blockchain-Based Land Registry",
      shortTitle: "Blockchain-Based Land Registry",
      category: "Blockchain / Web3 / Civic Technology",
      primaryCategory: "Blockchain",
      secondaryCategory: "Civic Tech",
      researchQuestion: "Can land records be made transparent and tamper-resistant?",
      description: "A blockchain-based land registry concept designed to improve transparency, ownership verification and the integrity of land records.",
      fullDescription: "A blockchain-based land registry concept designed to improve transparency, ownership verification and the integrity of land records.",
      technologies: [
        "Blockchain",
        "Smart Contracts",
        "Web Applications",
        "GIS"
      ],
      highlights: [
        "Decentralized Title Verification",
        "Smart Contract Property Transfers",
        "Tamper-Proof Audit Trail"
      ],
      featured: false,
      featuredOrder: 5,
      artIndex: 4,
      svgPaths: `<g stroke="#C9963E" fill="#101B2E"><rect x="50" y="40" width="50" height="50"/><rect x="150" y="30" width="50" height="50"/><rect x="250" y="55" width="50" height="50"/><path d="M100 65l50-10M200 55l50 25" fill="none"/></g>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "predictive-maintenance",
      number: "06",
      title: "Machine Learning-Based Predictive Maintenance",
      shortTitle: "Predictive Maintenance for Industrial Equipment",
      category: "Machine Learning / Industrial AI",
      primaryCategory: "AI/ML",
      secondaryCategory: "Industrial AI",
      researchQuestion: "Can machines warn us before industrial equipment fails?",
      description: "A machine learning framework for predictive maintenance and fault prediction in industrial equipment.",
      fullDescription: "A machine learning framework for predictive maintenance and fault prediction in industrial equipment.",
      technologies: [
        "Python",
        "Scikit-learn",
        "Time-Series Analysis",
        "Sensor Telemetry"
      ],
      highlights: [
        "Equipment Failure Anomaly Detection",
        "Vibration & Temperature Telemetry",
        "Predictive Downtime Prevention"
      ],
      featured: false,
      featuredOrder: 6,
      artIndex: 5,
      svgPaths: `<path d="M20 100l40-30 40 10 40-50 40 40 40-20 40 30 40-60" stroke="#E5B85C" fill="none" stroke-width="2"/>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    },
    {
      id: "b2b-trading-platform",
      number: "07",
      title: "Global B2B Trading Platform",
      shortTitle: "Global B2B Trading Platform",
      category: "E-commerce / Global Trade / Technology",
      primaryCategory: "Web Development",
      secondaryCategory: "Global Trade",
      researchQuestion: "Can global commodity trade be simpler for buyers and sellers?",
      description: "A digital marketplace concept designed to connect international buyers and sellers of commodities.",
      fullDescription: "A digital marketplace concept designed to connect international buyers and sellers of commodities.",
      technologies: [
        "React",
        "Node.js",
        "PostgreSQL",
        "REST API"
      ],
      highlights: [
        "Cross-Border Commodity Marketplace",
        "Buyer & Supplier Verification",
        "Trade Negotiation Workflow"
      ],
      featured: false,
      featuredOrder: 7,
      artIndex: 6,
      svgPaths: `<circle cx="180" cy="60" r="40" stroke="#C9963E" fill="none"/><path d="M140 60h80M180 20q30 40 0 80M180 20q-30 40 0 80" stroke="#E5B85C" fill="none"/>`,
      caseStudyPlaceholder: "Problem, solution, architecture, results and future work: [PLACEHOLDER — ADD INFORMATION]",
      links: {
        github: "",  // [CONFIG_REQUIRED]
        demo: "",    // [CONFIG_REQUIRED]
        paper: ""    // [CONFIG_REQUIRED]
      }
    }
  ],

  // Skills & Tools (26 authentic skills organized into 5 categories from object K)
  skills: {
    sectionLabel: "Tools & technologies",
    heading: "What I work with",
    categories: {
      "Programming": [
        "Python",
        "C++",
        "Java",
        "JavaScript"
      ],
      "AI / ML": [
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "OpenCV"
      ],
      "Cybersecurity": [
        "Linux",
        "Kali Linux",
        "Splunk",
        "Wireshark",
        "Burp Suite",
        "Networking"
      ],
      "Web": [
        "React",
        "Svelte",
        "Tailwind CSS",
        "Node.js",
        "Firebase",
        "PostgreSQL"
      ],
      "Tools": [
        "Git",
        "GitHub",
        "Docker",
        "VS Code",
        "Figma"
      ]
    }
  },

  // Writing Section: Book & Articles
  writing: {
    sectionLabel: "Writing & ideas",
    heading: "Ideas become powerful when they are written, shared and applied.",
    
    // Featured Book
    book: {
      badge: "Featured book",
      title: "The Zimbabwean-India Dream",
      subtitle: "Written for Zimbabwean students who dream of studying in India.",
      description: "A practical guide for Zimbabwean students who want to study in India, with real experiences, insights and steps to help you achieve your dream.",
      cover: {
        title: "The Zimbabwean-India Dream",
        subtitle: "A GUIDE FOR ZIMBABWEAN STUDENTS TO STUDY IN INDIA",
        author: "TAKUDZWA MUZOVAKA",
        monogram: "TM"
      },
      keyHighlights: [
        "Practical guidance",
        "Real experiences",
        "Scholarships & opportunities",
        "Life in India"
      ],
      links: {
        buyUrl: "",    // [CONFIG_REQUIRED] Original CONFIG.buyUrl
        sampleUrl: "", // [CONFIG_REQUIRED] Original CONFIG.links.sample
        learnUrl: ""   // [CONFIG_REQUIRED] Original CONFIG.links.learn
      }
    },

    // Articles from original HTML
    articles: [
      {
        id: "article-0",
        title: "The Power of Purpose in a Student's Journey",
        category: "Purpose",
        excerptPlaceholder: "[PLACEHOLDER — ADD DATE, READING TIME AND EXCERPT]",
        url: "" // [CONFIG_REQUIRED] Original CONFIG.links.article0
      },
      {
        id: "article-1",
        title: "Cybersecurity: Guarding Your Digital Life",
        category: "Cybersecurity",
        excerptPlaceholder: "[PLACEHOLDER — ADD DATE, READING TIME AND EXCERPT]",
        url: "" // [CONFIG_REQUIRED] Original CONFIG.links.article1
      },
      {
        id: "article-2",
        title: "Lessons From My Journey in India",
        category: "Personal",
        excerptPlaceholder: "[PLACEHOLDER — ADD DATE, READING TIME AND EXCERPT]",
        url: "" // [CONFIG_REQUIRED] Original CONFIG.links.article2
      },
      {
        id: "article-3",
        title: "Building With Purpose",
        category: "Ideas",
        excerptPlaceholder: "[PLACEHOLDER — ADD DATE, READING TIME AND EXCERPT]",
        url: "" // [CONFIG_REQUIRED] Original CONFIG.links.article3
      }
    ]
  },

  // Services (7 authentic offerings from array in original script)
  services: {
    sectionLabel: "What I do",
    heading: "Services",
    items: [
      {
        id: "ai-ml",
        title: "AI / Machine Learning",
        description: "Models and systems that learn from data.",
        lead: true
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity",
        description: "Security analysis and defensive thinking.",
        lead: false
      },
      {
        id: "web-development",
        title: "Web Development",
        description: "Fast, accessible, well-crafted websites and apps.",
        lead: false
      },
      {
        id: "research-writing",
        title: "Research & Technical Writing",
        description: "Clear writing on complex technical topics.",
        lead: false
      },
      {
        id: "technology-solutions",
        title: "Technology Solutions",
        description: "Practical solutions for real problems.",
        lead: false
      },
      {
        id: "technology-consulting",
        title: "Technology Consulting",
        description: "Guidance on technology decisions.",
        lead: false
      },
      {
        id: "digital-product-development",
        title: "Digital Product Development",
        description: "From idea to working product.",
        lead: false
      }
    ]
  },

  // Journey & Experience Timeline
  journey: {
    sectionLabel: "My journey",
    heading: "Education, research and building",
    items: [
      {
        category: "EDUCATION",
        title: "B.Tech CSE (AI & ML, Cybersecurity)",
        institution: "LPU, India.",
        date: ""
      },
      {
        category: "WRITING",
        title: "Author, The Zimbabwean-India Dream",
        institution: "",
        date: ""
      },
      {
        category: "RESEARCH",
        title: "English–Shona domain-specific machine translation",
        institution: "",
        date: ""
      }
    ]
  },

  // Footer Metadata
  footer: {
    monogram: "TM",
    name: "Takudzwa Muzovaka",
    motto: "Excellence with purpose",
    pillars: "Purpose  |  Innovation  |  Impact",
    copyright: "© 2026 Takudzwa Muzovaka. All Rights Reserved."
  }
};
