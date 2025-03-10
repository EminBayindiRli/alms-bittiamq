import supabase from './supabase';

// Demo mod - gerçek API kullanmak yerine sahte veriler
const DEMO_MODE = true;

// Microsoft Learn kursları
const MICROSOFT_LEARN_COURSES = {
  time_management: [
    { 
      id: 'tm1', 
      title: 'Uzaktan Çalışma Ortamında Üretkenliği Artırma', 
      description: 'Modern iş yerinde uzaktan çalışırken üretkenliğinizi artırmak için stratejiler öğrenin.',
      duration: '1.5 saat', 
      modules: 5, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-prepare-deployment/',
      category: 'time_management'
    },
    { 
      id: 'tm2', 
      title: 'Microsoft 365 ile Zaman Yönetimi', 
      description: 'Microsoft 365 araçlarını kullanarak zamanınızı daha etkili yönetmeyi öğrenin.',
      duration: '2 saat', 
      modules: 6, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/paths/m365-productivity-teamwork/',
      category: 'time_management'
    },
    { 
      id: 'tm3', 
      title: 'Microsoft Planner ile Görev Yönetimi', 
      description: 'Microsoft Planner ile görevlerinizi organize edin ve takip edin.',
      duration: '1 saat', 
      modules: 3, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/manage-tasks-time-microsoft-to-do/',
      category: 'time_management'
    }
  ],
  communication: [
    { 
      id: 'cm1', 
      title: 'Microsoft Teams ile Etkili İletişim', 
      description: 'Microsoft Teams kullanarak ekip iletişimini geliştirmeyi öğrenin.',
      duration: '2 saat', 
      modules: 5, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-prepare-deployment/',
      category: 'communication'
    },
    { 
      id: 'cm2', 
      title: 'Teams ile Toplantı Verimliliğini Artırma', 
      description: 'Microsoft Teams ile daha etkili toplantılar düzenlemeyi öğrenin.',
      duration: '1.5 saat', 
      modules: 4, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-setup-meetings/',
      category: 'communication'
    },
    { 
      id: 'cm3', 
      title: 'Teams ile E-posta Yönetimi', 
      description: 'Microsoft Teams ve Outlook entegrasyonu ile e-posta verimliliğinizi artırın.',
      duration: '1 saat', 
      modules: 3, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/outlook-create-manage-rules/',
      category: 'communication'
    }
  ],
  collaboration: [
    { 
      id: 'cl1', 
      title: 'Microsoft 365 ile İşbirliği Temelleri', 
      description: 'Microsoft 365 araçlarını kullanarak ekip işbirliğini geliştirmeyi öğrenin.',
      duration: '2.5 saat', 
      modules: 6, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/paths/m365-teams-collaboration/',
      category: 'collaboration'
    },
    { 
      id: 'cl2', 
      title: 'SharePoint ile Dosya Paylaşımı ve İşbirliği', 
      description: 'SharePoint kullanarak dosya paylaşımı ve işbirliği süreçlerini optimize edin.',
      duration: '2 saat', 
      modules: 5, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/sharepoint-integrations/',
      category: 'collaboration'
    },
    { 
      id: 'cl3', 
      title: 'Microsoft Teams ile Ekip Kültürü Oluşturma', 
      description: 'Microsoft Teams kullanarak güçlü bir ekip kültürü oluşturmayı öğrenin.',
      duration: '1.5 saat', 
      modules: 4, 
      difficulty: 'İleri', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-leverage-teams/',
      category: 'collaboration'
    }
  ],
  technical_skills: [
    { 
      id: 'ts1', 
      title: 'Microsoft Power BI Temelleri', 
      description: 'Power BI ile veri analizi ve görselleştirme temellerini öğrenin.',
      duration: '4 saat', 
      modules: 8, 
      difficulty: 'Başlangıç', 
      url: 'https://learn.microsoft.com/tr-tr/training/paths/create-use-analytics-reports-power-bi/',
      category: 'technical_skills'
    },
    { 
      id: 'ts2', 
      title: 'Microsoft Excel ile Veri Analizi', 
      description: 'Excel kullanarak veri analizi ve raporlama becerilerinizi geliştirin.',
      duration: '3 saat', 
      modules: 6, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/get-transform-data-power-bi/',
      category: 'technical_skills'
    },
    { 
      id: 'ts3', 
      title: 'Power Automate ile İş Akışı Otomasyonu', 
      description: 'Power Automate kullanarak iş süreçlerinizi otomatikleştirmeyi öğrenin.',
      duration: '2.5 saat', 
      modules: 5, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/paths/automate-process-power-automate/',
      category: 'technical_skills'
    }
  ],
  leadership: [
    { 
      id: 'ld1', 
      title: 'Microsoft Teams ile Uzaktan Ekip Yönetimi', 
      description: 'Microsoft Teams kullanarak uzaktan çalışan ekipleri etkili bir şekilde yönetmeyi öğrenin.',
      duration: '3 saat', 
      modules: 7, 
      difficulty: 'İleri', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-post-implementation/',
      category: 'leadership'
    },
    { 
      id: 'ld2', 
      title: 'Microsoft 365 ile Yüksek Performanslı Ekipler Oluşturma', 
      description: 'Microsoft 365 araçlarını kullanarak yüksek performanslı ekipler oluşturmayı öğrenin.',
      duration: '2.5 saat', 
      modules: 6, 
      difficulty: 'İleri', 
      url: 'https://learn.microsoft.com/tr-tr/training/paths/m365-teams-collaboration/',
      category: 'leadership'
    },
    { 
      id: 'ld3', 
      title: 'Microsoft Viva ile Çalışan Deneyimini Geliştirme', 
      description: 'Microsoft Viva kullanarak çalışan deneyimini ve bağlılığını artırmayı öğrenin.',
      duration: '2 saat', 
      modules: 5, 
      difficulty: 'Orta', 
      url: 'https://learn.microsoft.com/tr-tr/training/modules/viva-connections-implement/',
      category: 'leadership'
    }
  ]
};

// Admin için sahte veriler
const ADMIN_MOCK_DATA = {
  total_employees: 5,
  department_statistics: {
    'Sales': { avg_task_completion: 0.78, avg_email_response: 0.65 },
    'Product Development': { avg_task_completion: 0.85, avg_email_response: 0.72 },
    'HR': { avg_task_completion: 0.92, avg_email_response: 0.88 },
  },
  team_statistics: {
    'Team-1': { avg_task_completion: 0.82, avg_email_response: 0.70 },
    'Team-2': { avg_task_completion: 0.75, avg_email_response: 0.68 },
    'Team-3': { avg_task_completion: 0.90, avg_email_response: 0.85 },
  }
};

// Çalışanlar için ayrı ayrı sahte veriler
const EMPLOYEE_MOCK_DATA_BY_ID = {
  '1': { // Ali Yılmaz - Product Development
    employee_id: '1',
    current_metrics: {
      task_completion_rate: 0.85,
      email_efficiency: 0.75,
      meeting_efficiency: 0.70,
      communication_score: 0.80,
      collaboration_score: 0.65,
      time_efficiency: 0.78,
      file_activity: 0.62
    },
    historical_trends: {
      task_completion: [
        { day: 1, completion_rate: 0.82, overdue_ratio: 0.15 },
        { day: 2, completion_rate: 0.84, overdue_ratio: 0.12 },
        { day: 3, completion_rate: 0.79, overdue_ratio: 0.18 },
        { day: 4, completion_rate: 0.85, overdue_ratio: 0.10 },
        { day: 5, completion_rate: 0.88, overdue_ratio: 0.08 },
        { day: 6, completion_rate: 0.86, overdue_ratio: 0.09 },
        { day: 7, completion_rate: 0.90, overdue_ratio: 0.05 }
      ],
      communication: [
        { day: 1, email_activity: 32, chat_activity: 45, response_time: 25 },
        { day: 2, email_activity: 28, chat_activity: 42, response_time: 30 },
        { day: 3, email_activity: 35, chat_activity: 50, response_time: 20 },
        { day: 4, email_activity: 30, chat_activity: 48, response_time: 28 },
        { day: 5, email_activity: 25, chat_activity: 40, response_time: 35 },
        { day: 6, email_activity: 38, chat_activity: 52, response_time: 18 },
        { day: 7, email_activity: 35, chat_activity: 55, response_time: 15 }
      ]
    },
    recommendations: [
      { 
        suggestion: "JavaScript ileri seviye kurs", 
        reason: "Frontend becerilerinizi geliştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/paths/create-use-analytics-reports-power-bi/",
        course: MICROSOFT_LEARN_COURSES.technical_skills[0]
      },
      { 
        suggestion: "React performans optimizasyonu", 
        reason: "Uygulama performansını artırmak için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/paths/automate-process-power-automate/",
        course: MICROSOFT_LEARN_COURSES.technical_skills[2]
      },
      { 
        suggestion: "Zaman yönetimi atölyesi", 
        reason: "Zaman yönetimi konusundaki zorluklarınız için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-prepare-deployment/",
        course: MICROSOFT_LEARN_COURSES.time_management[0]
      }
    ],
    segment_info: {
      segment_name: "Yüksek Performans - Orta İletişim",
      segment_characteristics: {
        performance: "Orta seviye görev tamamlama",
        communication: "Yüksek iletişim becerisi",
        improvement: "Görev tamamlama ve zaman yönetimi"
      }
    },
    performance_summary: {
      overall_score: 0.74,
      strongest_area: "task_completion_rate",
      improvement_needed: "collaboration_score"
    }
  },
  '2': { // Ayşe Kaya - Sales
    employee_id: '2',
    current_metrics: {
      task_completion_rate: 0.78,
      email_efficiency: 0.65,
      meeting_efficiency: 0.82,
      communication_score: 0.88,
      collaboration_score: 0.75,
      time_efficiency: 0.70,
      file_activity: 0.58
    },
    historical_trends: {
      task_completion: [
        { day: 1, completion_rate: 0.75, overdue_ratio: 0.20 },
        { day: 2, completion_rate: 0.76, overdue_ratio: 0.18 },
        { day: 3, completion_rate: 0.74, overdue_ratio: 0.22 },
        { day: 4, completion_rate: 0.77, overdue_ratio: 0.17 },
        { day: 5, completion_rate: 0.80, overdue_ratio: 0.15 },
        { day: 6, completion_rate: 0.82, overdue_ratio: 0.12 },
        { day: 7, completion_rate: 0.78, overdue_ratio: 0.16 }
      ],
      communication: [
        { day: 1, email_activity: 45, chat_activity: 38, response_time: 15 },
        { day: 2, email_activity: 42, chat_activity: 35, response_time: 18 },
        { day: 3, email_activity: 48, chat_activity: 40, response_time: 12 },
        { day: 4, email_activity: 50, chat_activity: 42, response_time: 10 },
        { day: 5, email_activity: 47, chat_activity: 39, response_time: 14 },
        { day: 6, email_activity: 49, chat_activity: 41, response_time: 11 },
        { day: 7, email_activity: 51, chat_activity: 43, response_time: 9 }
      ]
    },
    recommendations: [
      { 
        suggestion: "Müşteri ilişkileri yönetimi", 
        reason: "Satış süreçlerini iyileştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-prepare-deployment/",
        course: MICROSOFT_LEARN_COURSES.communication[0]
      },
      { 
        suggestion: "E-posta iletişim teknikleri", 
        reason: "E-posta verimliliğini artırmak için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/outlook-create-manage-rules/",
        course: MICROSOFT_LEARN_COURSES.communication[2]
      },
      { 
        suggestion: "Ürün bilgisi eğitimi", 
        reason: "Ürün bilginizi geliştirmek için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/get-started-dynamics-365-sales/",
        course: MICROSOFT_LEARN_COURSES.technical_skills[1]
      }
    ],
    segment_info: {
      segment_name: "İletişim Odaklı - Orta Performans",
      segment_characteristics: {
        performance: "Orta seviye görev tamamlama",
        communication: "Yüksek iletişim becerisi",
        improvement: "Görev tamamlama ve zaman yönetimi"
      }
    },
    performance_summary: {
      overall_score: 0.72,
      strongest_area: "communication_score",
      improvement_needed: "email_efficiency"
    }
  },
  '3': { // Mehmet Öz - HR
    employee_id: '3',
    current_metrics: {
      task_completion_rate: 0.92,
      email_efficiency: 0.88,
      meeting_efficiency: 0.90,
      communication_score: 0.94,
      collaboration_score: 0.87,
      time_efficiency: 0.85,
      file_activity: 0.80
    },
    historical_trends: {
      task_completion: [
        { day: 1, completion_rate: 0.90, overdue_ratio: 0.07 },
        { day: 2, completion_rate: 0.91, overdue_ratio: 0.06 },
        { day: 3, completion_rate: 0.89, overdue_ratio: 0.08 },
        { day: 4, completion_rate: 0.92, overdue_ratio: 0.05 },
        { day: 5, completion_rate: 0.94, overdue_ratio: 0.04 },
        { day: 6, completion_rate: 0.93, overdue_ratio: 0.05 },
        { day: 7, completion_rate: 0.95, overdue_ratio: 0.03 }
      ],
      communication: [
        { day: 1, email_activity: 40, chat_activity: 35, response_time: 10 },
        { day: 2, email_activity: 38, chat_activity: 33, response_time: 12 },
        { day: 3, email_activity: 42, chat_activity: 37, response_time: 9 },
        { day: 4, email_activity: 41, chat_activity: 36, response_time: 11 },
        { day: 5, email_activity: 43, chat_activity: 38, response_time: 8 },
        { day: 6, email_activity: 40, chat_activity: 35, response_time: 10 },
        { day: 7, email_activity: 44, chat_activity: 39, response_time: 7 }
      ]
    },
    recommendations: [
      { 
        suggestion: "İleri seviye çatışma çözümleme", 
        reason: "İK süreçlerini iyileştirmek için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/deal-with-conflict/",
        course: MICROSOFT_LEARN_COURSES.leadership[1]
      },
      { 
        suggestion: "Veri analizi ve raporlama", 
        reason: "İK metriklerini daha iyi analiz etmek için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/paths/data-analytics-microsoft/",
        course: MICROSOFT_LEARN_COURSES.technical_skills[1]
      },
      { 
        suggestion: "İleri seviye liderlik becerileri", 
        reason: "Ekip liderliği becerilerinizi geliştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collaboration/",
        course: MICROSOFT_LEARN_COURSES.leadership[1]
      }
    ],
    segment_info: {
      segment_name: "Yüksek Performans - Yüksek İletişim",
      segment_characteristics: {
        performance: "Üstün görev tamamlama",
        communication: "Mükemmel iletişim becerisi",
        improvement: "Teknik bilgi alanında gelişim potansiyeli"
      }
    },
    performance_summary: {
      overall_score: 0.90,
      strongest_area: "communication_score",
      improvement_needed: "file_activity"
    }
  },
  '4': { // Zeynep Demir - Product Development 
    employee_id: '4',
    current_metrics: {
      task_completion_rate: 0.75,
      email_efficiency: 0.68,
      meeting_efficiency: 0.72,
      communication_score: 0.70,
      collaboration_score: 0.76,
      time_efficiency: 0.65,
      file_activity: 0.80
    },
    historical_trends: {
      task_completion: [
        { day: 1, completion_rate: 0.72, overdue_ratio: 0.22 },
        { day: 2, completion_rate: 0.73, overdue_ratio: 0.20 },
        { day: 3, completion_rate: 0.70, overdue_ratio: 0.24 },
        { day: 4, completion_rate: 0.74, overdue_ratio: 0.19 },
        { day: 5, completion_rate: 0.76, overdue_ratio: 0.17 },
        { day: 6, completion_rate: 0.78, overdue_ratio: 0.15 },
        { day: 7, completion_rate: 0.75, overdue_ratio: 0.18 }
      ],
      communication: [
        { day: 1, email_activity: 25, chat_activity: 30, response_time: 35 },
        { day: 2, email_activity: 24, chat_activity: 28, response_time: 36 },
        { day: 3, email_activity: 26, chat_activity: 31, response_time: 33 },
        { day: 4, email_activity: 28, chat_activity: 32, response_time: 30 },
        { day: 5, email_activity: 30, chat_activity: 34, response_time: 28 },
        { day: 6, email_activity: 29, chat_activity: 33, response_time: 29 },
        { day: 7, email_activity: 32, chat_activity: 35, response_time: 25 }
      ]
    },
    recommendations: [
      { 
        suggestion: "UI/UX tasarım kursu", 
        reason: "Tasarım becerilerinizi geliştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/paths/modern-experience/",
        course: MICROSOFT_LEARN_COURSES.technical_skills[0]
      },
      { 
        suggestion: "Toplantı yönetimi atölyesi", 
        reason: "Toplantı verimliliğinizi artırmak için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-setup-meetings/",
        course: MICROSOFT_LEARN_COURSES.communication[1]
      },
      { 
        suggestion: "İletişim becerileri geliştirme", 
        reason: "İletişim becerilerinizi güçlendirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/m365-teams-collab-leverage-teams/",
        course: MICROSOFT_LEARN_COURSES.collaboration[2]
      }
    ],
    segment_info: {
      segment_name: "Yeni Yetenek - Gelişim Odaklı",
      segment_characteristics: {
        performance: "Orta seviye görev tamamlama",
        communication: "Geliştirilmesi gereken iletişim becerisi",
        improvement: "İletişim ve toplantı verimliliği"
      }
    },
    performance_summary: {
      overall_score: 0.69,
      strongest_area: "file_activity",
      improvement_needed: "time_efficiency"
    }
  },
  '5': { // Mustafa Şahin - Sales
    employee_id: '5',
    current_metrics: {
      task_completion_rate: 0.80,
      email_efficiency: 0.72,
      meeting_efficiency: 0.85,
      communication_score: 0.82,
      collaboration_score: 0.75,
      time_efficiency: 0.78,
      file_activity: 0.65
    },
    historical_trends: {
      task_completion: [
        { day: 1, completion_rate: 0.78, overdue_ratio: 0.18 },
        { day: 2, completion_rate: 0.79, overdue_ratio: 0.17 },
        { day: 3, completion_rate: 0.77, overdue_ratio: 0.19 },
        { day: 4, completion_rate: 0.80, overdue_ratio: 0.15 },
        { day: 5, completion_rate: 0.82, overdue_ratio: 0.13 },
        { day: 6, completion_rate: 0.83, overdue_ratio: 0.12 },
        { day: 7, completion_rate: 0.81, overdue_ratio: 0.14 }
      ],
      communication: [
        { day: 1, email_activity: 38, chat_activity: 42, response_time: 20 },
        { day: 2, email_activity: 36, chat_activity: 40, response_time: 22 },
        { day: 3, email_activity: 39, chat_activity: 43, response_time: 19 },
        { day: 4, email_activity: 40, chat_activity: 44, response_time: 18 },
        { day: 5, email_activity: 37, chat_activity: 41, response_time: 21 },
        { day: 6, email_activity: 41, chat_activity: 45, response_time: 17 },
        { day: 7, email_activity: 42, chat_activity: 46, response_time: 16 }
      ]
    },
    recommendations: [
      { 
        suggestion: "İleri seviye müzakere teknikleri", 
        reason: "Müzakere becerilerinizi geliştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/explore-sales-pipeline-management/",
        course: MICROSOFT_LEARN_COURSES.leadership[0]
      },
      { 
        suggestion: "Müşteri takip süreçleri", 
        reason: "Takip süreçlerinizi iyileştirmek için", 
        priority: "high", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/manage-leads-opportunities-dynamics-365-sales/",
        course: MICROSOFT_LEARN_COURSES.communication[0]
      },
      { 
        suggestion: "E-posta yanıt süresi optimizasyonu", 
        reason: "E-posta yanıt sürenizi iyileştirmek için", 
        priority: "medium", 
        link: "https://learn.microsoft.com/tr-tr/training/modules/improve-email-management/",
        course: MICROSOFT_LEARN_COURSES.communication[2]
      }
    ],
    segment_info: {
      segment_name: "İstikrarlı Performans",
      segment_characteristics: {
        performance: "İyi görev tamamlama, istikrarlı sonuçlar",
        communication: "İyi iletişim becerisi",
        improvement: "Tutarlılık ve takip süreçleri"
      }
    },
    performance_summary: {
      overall_score: 0.76,
      strongest_area: "meeting_efficiency",
      improvement_needed: "file_activity"
    }
  }
};

// API istekleri için yardımcı fonksiyon
const fetchWithAuth = async (url, options = {}) => {
  if (DEMO_MODE) {
    // Demo modda ise API isteklerini simüle et
    console.log(`Demo modunda API isteği: ${url}`);
    
    return new Promise((resolve) => {
      // Ağ gecikmesini simüle et
      setTimeout(() => {
        // URL'e göre uygun mock veriyi döndür
        if (url === '/analyze/all') {
          resolve({
            ok: true,
            json: () => Promise.resolve(ADMIN_MOCK_DATA)
          });
        } else if (url.startsWith('/employee/')) {
          // Belirli bir çalışan ID'si için veri döndür
          const employeeIdMatch = url.match(/\/employee\/([^\/]+)/); // Herhangi bir ID formatını kabul et
          console.log('URL analizi:', url, 'Regex eşleşmesi:', employeeIdMatch);
          
          if (employeeIdMatch && employeeIdMatch[1]) {
            const employeeId = employeeIdMatch[1];
            console.log('URL\'den çıkarılan employeeId:', employeeId);
            
            // Çalışan ID'sine göre veri döndür
            const employeeData = EMPLOYEE_MOCK_DATA_BY_ID[employeeId] || EMPLOYEE_MOCK_DATA_BY_ID['1'];
            console.log('Döndürülecek çalışan verisi bulundu mu?', !!employeeData, 'ID:', employeeId);
            
            if (!employeeData) {
              console.warn(`${employeeId} ID'li çalışan için veri bulunamadı, varsayılan veri kullanılıyor`);
            }
            
            resolve({
              ok: true,
              json: () => Promise.resolve(employeeData)
            });
          } else {
            // Varsayılan olarak ilk çalışanın verilerini döndür
            console.log('URL\'den employeeId çıkarılamadı, varsayılan veri döndürülüyor');
            resolve({
              ok: true,
              json: () => Promise.resolve(EMPLOYEE_MOCK_DATA_BY_ID['1'])
            });
          }
        } else if (url.startsWith('/generate/reports')) {
          resolve({
            ok: true,
            json: () => Promise.resolve({
              status: "success",
              message: "All reports generated successfully",
              report_paths: ["report1.pdf", "report2.pdf"]
            })
          });
        } else {
          // Diğer tüm API çağrıları için varsayılan yanıt
          resolve({
            ok: true,
            json: () => Promise.resolve({ status: "success", message: "Operation successful" })
          });
        }
      }, 500); // 500ms yapay gecikme
    });
  }
  
  // Gerçek API isteği (demo mod kapalıysa)
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  };

  return fetch(`${API_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
};

export const EmployeeService = {
  // Çalışan analiz verilerini getir
  getEmployeeAnalysis: async (employeeId) => {
    try {
      console.log('getEmployeeAnalysis çağrıldı - Gelen employeeId:', employeeId);
      
      // Eğer employeeId verilmediyse, localStorage'dan al
      if (!employeeId) {
        const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
        employeeId = userData.id || '1';
        console.log('localStorage\'dan alınan employeeId:', employeeId);
      }
      
      console.log(`Çalışan analizi için fetchWithAuth çağrılıyor, URL: /employee/${employeeId}`);
      
      const response = await fetchWithAuth(`/employee/${employeeId}`);
      console.log('fetchWithAuth cevabı:', response);
      
      if (!response.ok) {
        console.error('API yanıt hatası:', response.status, response.statusText);
        throw new Error(`Veriler alınamadı: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API\'den alınan çalışan verileri:', data);
      
      return data;
    } catch (error) {
      console.error('getEmployeeAnalysis hatası:', error);
      throw error;
    }
  },

  // Çalışan raporunu getir
  getReport: async (employeeId) => {
    try {
      // Demo modda sahte bir PDF Blob döndür
      if (DEMO_MODE) {
        // Boş bir PDF bytes dizisini simüle etmek için yeni bir ArrayBuffer oluştur
        const bytes = new Uint8Array(100);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return blob;
      }
      
      const response = await fetchWithAuth(`/employee/${employeeId}/report`);
      if (!response.ok) throw new Error('Çalışan raporu alınamadı');
      return await response.blob();
    } catch (error) {
      console.error('Rapor alma hatası:', error);
      throw error;
    }
  },
};

export const AdminService = {
  // Tüm çalışanların analizini getir
  getAllAnalyses: async () => {
    try {
      const response = await fetchWithAuth('/analyze/all');
      if (!response.ok) throw new Error('Veriler alınamadı');
      return await response.json();
    } catch (error) {
      console.error('Tüm analizler hatası:', error);
      throw error;
    }
  },

  // Tüm raporları oluştur
  generateReports: async () => {
    try {
      const response = await fetchWithAuth('/generate/reports', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Raporlar oluşturulamadı');
      return await response.json();
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      throw error;
    }
  },
};

export const ProfileService = {
  // Kullanıcı profil bilgilerini getir
  getUserProfile: async (userId) => {
    try {
      // Demo modda localStorage'dan kullanıcı bilgilerini döndür
      if (DEMO_MODE) {
        const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
        return userData;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Profil alma hatası:', error);
      throw error;
    }
  },

  // Profil güncelleme
  updateProfile: async (userId, updates) => {
    try {
      // Demo modda güncelleme simülasyonu yap
      if (DEMO_MODE) {
        const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
        const updatedUser = { ...userData, ...updates };
        localStorage.setItem('alms_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    }
  },
}; 