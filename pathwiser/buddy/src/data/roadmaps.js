// data/roadmaps.js
export const roadmaps = {
    cybersecurity: {
      title: "Cybersecurity Specialized Roadmap",
      description: "Comprehensive path from fundamentals to advanced security expertise",
      topics: [
        {
          id: 1,
          text: "🔐 Cybersecurity Fundamentals",
          subTopics: [
            "Information Security Triad (CIA)",
            "Risk Management Framework",
            "Security Governance",
            "Security Policies & Standards",
            "Cyber Law & Ethics",
            "Hands-on: Security Awareness Lab"
          ]
        },
        {
          id: 2,
          text: "🛡️ Networking & System Security",
          subTopics: [
            "TCP/IP Deep Dive",
            "Network Architecture Security",
            "Firewalls (pfSense, iptables)",
            "IDS/IPS Systems",
            "VPN Technologies (IPSec, SSL/TLS)",
            "Wireless Security (WPA3, Radius)"
          ]
        },
        {
          id: 3,
          text: "🔒 Operating System Security",
          subTopics: [
            "Windows Security Architecture",
            "Linux Hardening Techniques",
            "MAC/DAC/RBAC Models",
            "Patch Management",
            "Log Analysis & SIEM",
            "Hands-on: SELinux Configuration"
          ]
        },
        {
          id: 4,
          text: "🔑 Cryptography & PKI",
          subTopics: [
            "Symmetric vs Asymmetric Encryption",
            "Hash Functions (SHA, MD5)",
            "Digital Signatures & Certificates",
            "PKI Infrastructure",
            "Quantum Cryptography Basics",
            "Hands-on: OpenSSL Lab"
          ]
        },
        {
          id: 5,
          text: "💻 Ethical Hacking & Pen Testing",
          subTopics: [
            "Penetration Testing Methodology",
            "OWASP Top 10 (2024)",
            "Metasploit Framework",
            "Burp Suite Mastery",
            "Wireless Hacking Techniques",
            "Social Engineering Simulations"
          ]
        },
        {
          id: 6,
          text: "🛡️ Defense Strategies",
          subTopics: [
            "Zero Trust Architecture",
            "Defense-in-Depth",
            "Threat Hunting",
            "Incident Response Plan",
            "Disaster Recovery",
            "Blue Team Exercises"
          ]
        },
        {
          id: 7,
          text: "📜 Compliance & Regulations",
          subTopics: [
            "GDPR & Data Protection",
            "HIPAA Security Rule",
            "PCI-DSS Requirements",
            "NIST Cybersecurity Framework",
            "ISO 27001 Implementation",
            "SOX Compliance Basics"
          ]
        },
        {
          id: 8,
          text: "🔍 Digital Forensics",
          subTopics: [
            "Chain of Custody",
            "Disk Imaging (FTK, dd)",
            "Memory Forensics",
            "Network Forensics",
            "Anti-Forensics Techniques",
            "Case Study Analysis"
          ]
        },
        {
          id: 9,
          text: "📈 Career Development",
          subTopics: [
            "Certification Path (CEH, CISSP, OSCP)",
            "Resume Building for Security Roles",
            "CTF Competition Preparation",
            "Bug Bounty Programs",
            "Security Conference Participation",
            "LinkedIn Profile Optimization"
          ]
        },
        {
          id: 10,
          text: "🚀 Advanced Topics",
          subTopics: [
            "Cloud Security (AWS/Azure/GCP)",
            "IoT Security Challenges",
            "ICS/SCADA Security",
            "AI in Cybersecurity",
            "Blockchain Security",
            "Career Specialization Paths"
          ]
        }
      ]
    },
    // Keep existing fullstack roadmap

    fullstack: {
      title: "Full-Stack Development Roadmap",
      description: "Master modern full-stack web development from frontend to backend",
      topics: [
        {
          id: 1,
          text: "🔹 Web Fundamentals",
          subTopics: [
            "HTML5 & Semantic HTML",
            "CSS3 & Flexbox/Grid",
            "JavaScript ES6+",
            "Browser APIs"
          ]
        },
        {
          id: 2,
          text: "📌 Frontend Development",
          subTopics: [
            "React.js Fundamentals",
            "State Management (Redux)",
            "Component Architecture",
            "UI/UX Principles"
          ]
        },
        {
          id: 3,
          text: "📌 Backend Development",
          subTopics: [
            "Node.js & Express",
            "REST API Design",
            "Database Modeling",
            "Authentication (JWT)"
          ]
        },
        {
          id: 4,
          text: "📌 DevOps & Deployment",
          subTopics: [
            "Docker Containers",
            "CI/CD Pipelines",
            "Cloud Deployment (AWS)",
            "Performance Optimization"
          ]
        },
        {
          id: 5,
          text: "✅ Project Portfolio",
          subTopics: [
            "Build 3 Full Projects",
            "Open Source Contributions",
            "Technical Blogging",
            "Interview Prep"
          ]
        }
        
      ]
    },
    datascience: {
        title: "Data Science Roadmap",
        description: "Master data analysis, machine learning, and statistical modeling",
        topics: [
          {
            id: 1,
            text: "📊 Data Fundamentals",
            subTopics: [
              "Python/R Programming Basics",
              "SQL & Database Management",
              "Data Cleaning & Preprocessing",
              "Exploratory Data Analysis (EDA)",
              "Statistical Foundations",
              "Jupyter Notebooks Setup"
            ]
          },
          {
            id: 2,
            text: "📈 Data Visualization",
            subTopics: [
              "Matplotlib & Seaborn",
              "Plotly Interactive Visuals",
              "Tableau/Power BI",
              "Storytelling with Data",
              "Dashboard Design Principles",
              "Geospatial Visualization"
            ]
          },
          {
            id: 3,
            text: "🤖 Machine Learning",
            subTopics: [
              "Supervised vs Unsupervised Learning",
              "Scikit-learn Pipeline",
              "Feature Engineering",
              "Hyperparameter Tuning",
              "Model Evaluation Metrics",
              "MLOps Fundamentals"
            ]
          },
          {
            id: 4,
            text: "📚 Advanced Topics",
            subTopics: [
              "Deep Learning with TensorFlow/PyTorch",
              "Natural Language Processing (NLP)",
              "Time Series Analysis",
              "Big Data (Spark, Hadoop)",
              "Cloud ML (AWS SageMaker, GCP AI)",
              "Model Deployment (Flask, FastAPI)"
            ]
          }
        ]
      },
    
      cloud: {
        title: "Cloud Engineering Roadmap",
        description: "Become expert in cloud infrastructure and distributed systems",
        topics: [
          {
            id: 1,
            text: "☁️ Cloud Fundamentals",
            subTopics: [
              "Cloud Service Models (IaaS/PaaS/SaaS)",
              "AWS/GCP/Azure Comparison",
              "Virtualization & Containers",
              "Identity & Access Management (IAM)",
              "Networking Basics (VPC, CIDR)",
              "Storage Solutions (S3, EBS)"
            ]
          },
          {
            id: 2,
            text: "🛠️ Infrastructure as Code",
            subTopics: [
              "Terraform Foundations",
              "AWS CloudFormation",
              "Ansible Configuration",
              "CI/CD Pipelines",
              "Monitoring & Logging",
              "Disaster Recovery Strategies"
            ]
          },
          {
            id: 3,
            text: "🚀 Advanced Cloud",
            subTopics: [
              "Serverless Architecture (Lambda)",
              "Kubernetes Orchestration",
              "Service Mesh (Istio)",
              "Cloud Security Best Practices",
              "Cost Optimization Techniques",
              "Multi-Cloud Architectures"
            ]
          }
        ]
      },
    
      devops: {
        title: "DevOps Engineering Roadmap",
        description: "Master CI/CD, automation, and infrastructure management",
        topics: [
          {
            id: 1,
            text: "🔄 CI/CD Pipeline",
            subTopics: [
              "Jenkins Configuration",
              "GitLab CI/CD",
              "Artifact Management (Nexus)",
              "Blue/Green Deployments",
              "Infrastructure Testing",
              "Chaos Engineering Basics"
            ]
          },
          {
            id: 2,
            text: "🐋 Containerization",
            subTopics: [
              "Docker Deep Dive",
              "Kubernetes Architecture",
              "Helm Charts",
              "Service Mesh (Linkerd)",
              "Container Security",
              "Serverless Containers"
            ]
          },
          {
            id: 3,
            text: "🔒 DevSecOps",
            subTopics: [
              "SAST/DAST Tools",
              "Secret Management (Vault)",
              "Compliance as Code",
              "Runtime Protection",
              "SBOM Management",
              "Zero Trust Architecture"
            ]
          }
        ]
      },
    
      blockchain: {
        title: "Blockchain Development Roadmap",
        description: "Learn smart contracts, DApps, and decentralized systems",
        topics: [
          {
            id: 1,
            text: "⛓️ Blockchain Basics",
            subTopics: [
              "Cryptography Fundamentals",
              "Consensus Algorithms",
              "Smart Contract Development",
              "Solidity Programming",
              "Truffle Suite",
              "IPFS Integration"
            ]
          },
          {
            id: 2,
            text: "🪙 DeFi & Tokens",
            subTopics: [
              "ERC Standards (20, 721, 1155)",
              "AMM Protocols (Uniswap)",
              "Yield Farming Strategies",
              "DAO Architecture",
              "Oracles (Chainlink)",
              "Cross-Chain Bridges"
            ]
          },
          {
            id: 3,
            text: "🔐 Security",
            subTopics: [
              "Smart Contract Auditing",
              "Reentrancy Attacks",
              "Front-Running Prevention",
              "Formal Verification",
              "Zero-Knowledge Proofs",
              "Layer 2 Security"
            ]
          }
        ]
      },
    
      mobile: {
        title: "Mobile Development Roadmap",
        description: "Build cross-platform mobile applications with modern tools",
        topics: [
          {
            id: 1,
            text: "📱 Cross-Platform",
            subTopics: [
              "React Native Fundamentals",
              "Flutter/Dart Ecosystem",
              "State Management (Redux)",
              "Native Modules Integration",
              "Performance Optimization",
              "App Store Deployment"
            ]
          },
          {
            id: 2,
            text: "🔗 Backend Integration",
            subTopics: [
              "REST/GraphQL APIs",
              "Firebase Integration",
              "Offline-First Apps",
              "Push Notifications",
              "Biometric Authentication",
              "In-App Purchases"
            ]
          },
          {
            id: 3,
            text: "🎨 UI/UX Excellence",
            subTopics: [
              "Material Design",
              "Animation Libraries",
              "Dark Mode Implementation",
              "Accessibility Standards",
              "Localization",
              "Progressive Web Apps"
            ]
          }
        ]}
  };