import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Icon,
  Select,
  FormControl,
  FormLabel,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Tag,
  Input,
  Switch,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Checkbox,
  CheckboxGroup,
  StatArrow,
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  InfoIcon, 
  DownloadIcon, 
  SearchIcon, 
  RepeatIcon,
  CalendarIcon,
  TimeIcon,
  QuestionIcon
} from '@chakra-ui/icons';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiUsers, 
  FiActivity, 
  FiClock, 
  FiFilter, 
  FiSettings, 
  FiDownload,
  FiSliders,
  FiZap,
  FiGrid
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/api';
import { Bar, Radar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Sahte veri: Analiz Türleri
const ANALYSIS_TYPES = [
  {
    id: 'performance',
    name: 'Performance Analysis',
    description: 'Detailed analysis of performance metrics',
    icon: FiBarChart2,
    color: 'blue',
  },
  {
    id: 'activity',
    name: 'Activity Analysis',
    description: 'Analysis of daily activities and time usage',
    icon: FiActivity,
    color: 'green',
  },
  {
    id: 'comparative',
    name: 'Comparative Analysis',
    description: 'Comparison between departments and teams',
    icon: FiPieChart,
    color: 'orange',
  },
  {
    id: 'training',
    name: 'Training Effectiveness Analysis',
    description: 'Analysis of training impact on performance',
    icon: FiZap,
    color: 'purple',
  },
  {
    id: 'trends',
    name: 'Trend Analysis',
    description: 'Performance and activity trends over time',
    icon: FiTrendingUp,
    color: 'teal',
  },
];

// Sahte veri: Departmanlar
const DEPARTMENTS = [
  { id: 'all', name: 'All Departments' },
  { id: 'sales', name: 'Sales' },
  { id: 'product_development', name: 'Product Development' },
  { id: 'hr', name: 'HR' },
];

// Sahte veri: Takımlar
const TEAMS = [
  { id: 'all', name: 'All Teams' },
  { id: 'team1', name: 'Team-1' },
  { id: 'team2', name: 'Team-2' },
  { id: 'team3', name: 'Team-3' },
];

// Sahte veri: Dönemler
const PERIODS = [
  { id: 'last_7_days', name: 'Last 7 Days' },
  { id: 'last_30_days', name: 'Last 30 Days' },
  { id: 'last_90_days', name: 'Last 90 Days' },
  { id: 'last_year', name: 'Last Year' },
  { id: 'custom', name: 'Custom Date Range' },
];

// Sahte veri: Performans analizi
const PERFORMANCE_DATA = {
  departments: ['Sales', 'Product Development', 'HR'],
  metrics: {
    overall_performance: [78, 85, 92],
    email_efficiency: [65, 72, 88],
    time_management: [70, 80, 85],
    meeting_effectiveness: [75, 77, 90],
    focus_time: [68, 82, 87],
    collaboration: [77, 88, 94]
  }
};

// Sahte veri: Aktivite analizi
const ACTIVITY_DATA = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  metrics: {
    email_sent: [45, 52, 48, 56, 42],
    meetings_attended: [4, 6, 5, 3, 7],
    tasks_completed: [12, 15, 10, 14, 11],
    focus_hours: [3.5, 4.2, 3.8, 4.0, 3.2]
  },
  total_active_users: 100,
  avg_daily_sessions: 3.5
};

// Sahte veri: Karşılaştırmalı analiz
const COMPARATIVE_DATA = {
  metrics: ['Overall Performance', 'Email Efficiency', 'Time Management', 'Meeting Effectiveness', 'Focus Time', 'Collaboration'],
  departments: {
    'Sales': [78, 65, 70, 75, 68, 80],
    'Product Development': [85, 72, 80, 82, 78, 84],
    'HR': [92, 88, 85, 90, 84, 86]
  }
};

// Sahte veri: Eğitim analizi
const TRAINING_DATA = {
  departments: ['Sales', 'Product Development', 'HR'],
  metrics: {
    training_completion_rate: [82, 88, 95],
    avg_training_hours: [12, 18, 22],
    skill_improvement: [8, 12, 15],
    certification_rate: [60, 75, 90]
  }
};

// Trend Verisi
const TREND_DATA = {
  months: ['January', 'February', 'March', 'April', 'May', 'June'],
  metrics: {
    overall_performance: [72, 73, 75, 78, 80, 82],
    email_efficiency: [68, 70, 72, 75, 77, 78],
    time_management: [65, 68, 72, 75, 79, 85],
    meeting_effectiveness: [70, 72, 74, 73, 78, 76],
  }
};

// Renk skalası oluşturma yardımcı fonksiyonu
const getColorScale = (value, inverse = false) => {
  if (inverse) {
    if (value >= 80) return "red";
    if (value >= 60) return "orange";
    if (value >= 40) return "yellow";
    return "green";
  } else {
    if (value >= 80) return "green";
    if (value >= 60) return "blue";
    if (value >= 40) return "yellow";
    return "red";
  }
};

// Trend ikonunu belirleme
const getTrendIcon = (trend) => {
  switch (trend) {
    case 'up':
      return { color: 'green.500', icon: FiTrendingUp };
    case 'down':
      return { color: 'red.500', icon: FiTrendingUp, transform: 'rotate(180deg)' };
    default:
      return { color: 'gray.500', icon: FiActivity };
  }
};

const Analysis = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('performance');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState([
    'overall_performance', 
    'email_efficiency', 
    'time_management', 
    'meeting_effectiveness', 
    'focus_time', 
    'collaboration'
  ]);
  const chartContainerRef = useRef(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          // gerçek API'den veri alınacak kısım
          
          // Mock veriler için gecikme ekleyelim
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else {
          // Admin değilse bu sayfaya erişim yok
          setError('You do not have permission to access this page.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Data loading error:', err);
        setError('There was a problem loading the data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const exportAnalysisData = () => {
    // Burası gerçek uygulamada API'ye istek atarak veriyi CSV veya Excel formatında indirecek
    alert('Downloading analysis data...');
  };

  // Analiz türüne göre başlık ve açıklama getirme
  const getAnalysisTypeInfo = () => {
    const analysisType = ANALYSIS_TYPES.find(at => at.id === selectedAnalysisType);
    return analysisType ? {
      name: analysisType.name,
      description: analysisType.description,
      icon: analysisType.icon,
      color: analysisType.color
    } : {
      name: 'Analysis',
      description: 'Analysis of your system data',
      icon: FiBarChart2,
      color: 'blue'
    };
  };

  // Performans analizi içeriği
  const renderPerformanceAnalysis = () => {
    // Departmana göre filtrelenmiş veriyi al
    const filteredData = {
      departments: [],
      metrics: {
        overall_performance: [],
        email_efficiency: [],
        time_management: [],
        meeting_effectiveness: [],
        focus_time: [],
        collaboration: []
      }
    };
    
    // Filtreleme işlemi
    if (selectedDepartment === 'all') {
      // Tüm departmanlar seçiliyse
      filteredData.departments = [...PERFORMANCE_DATA.departments];
      Object.keys(PERFORMANCE_DATA.metrics).forEach(metric => {
        filteredData.metrics[metric] = [...PERFORMANCE_DATA.metrics[metric]];
      });
    } else {
      // Belirli bir departman seçiliyse
      const deptIndex = DEPARTMENTS.findIndex(d => d.id === selectedDepartment) - 1; // 'all' hariç
      if (deptIndex >= 0 && deptIndex < PERFORMANCE_DATA.departments.length) {
        filteredData.departments = [PERFORMANCE_DATA.departments[deptIndex]];
        Object.keys(PERFORMANCE_DATA.metrics).forEach(metric => {
          filteredData.metrics[metric] = [PERFORMANCE_DATA.metrics[metric][deptIndex]];
        });
      }
    }
    
    // Periyoda göre filtreleme simülasyonu (gerçek uygulamada backend'den güncel veri alınır)
    console.log(`Veri periyot filtresi: ${selectedPeriod}`);
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Performance</StatLabel>
            <StatNumber>
              {filteredData.metrics.overall_performance.length > 0 
                ? Math.round(filteredData.metrics.overall_performance.reduce((a, b) => a + b, 0) / filteredData.metrics.overall_performance.length) 
                : 0}%
            </StatNumber>
            <StatHelpText>
              {selectedDepartment === 'all' ? 'Tüm departments' : DEPARTMENTS.find(d => d.id === selectedDepartment)?.name}
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Highest Performance</StatLabel>
            <StatNumber>
              {filteredData.metrics.overall_performance.length > 0 
                ? Math.max(...filteredData.metrics.overall_performance)
                : 0}%
            </StatNumber>
            <StatHelpText>
              {filteredData.departments[filteredData.metrics.overall_performance.indexOf(Math.max(...filteredData.metrics.overall_performance))] || ''}
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Lowest Performance</StatLabel>
            <StatNumber>
              {filteredData.metrics.overall_performance.length > 0 
                ? Math.min(...filteredData.metrics.overall_performance)
                : 0}%
            </StatNumber>
            <StatHelpText>
              {filteredData.departments[filteredData.metrics.overall_performance.indexOf(Math.min(...filteredData.metrics.overall_performance))] || ''}
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Best Metric</StatLabel>
            <StatNumber>
              {Object.keys(filteredData.metrics).reduce((a, b) => 
                filteredData.metrics[a].length > 0 && filteredData.metrics[b].length > 0 &&
                filteredData.metrics[a].reduce((sum, val) => sum + val, 0) / filteredData.metrics[a].length >
                filteredData.metrics[b].reduce((sum, val) => sum + val, 0) / filteredData.metrics[b].length
                ? a : b, 'overall_performance'
              ).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </StatNumber>
            <StatHelpText>Average highest</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Period</StatLabel>
            <StatNumber>
              {PERIODS.find(p => p.id === selectedPeriod)?.name || ''}
            </StatNumber>
            <StatHelpText>
              {compareWithPrevious ? 'Comparative' : 'Single period'}
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Grafik Kartı */}
        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Department Performance Comparison</Heading>
          </CardHeader>
          <CardBody>
            <Box height="400px" ref={chartContainerRef}>
              {/* Eğer grafik kütüphanesi yükleniyse grafiği göster, yoksa mesaj göster */}
              {filteredData.departments.length > 0 ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <Bar 
                    data={{
                      labels: filteredData.departments,
                      datasets: [
                        {
                          label: 'Overall Performance (%)',
                          data: filteredData.metrics.overall_performance,
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                        {
                          label: 'Email Efficiency (%)',
                          data: filteredData.metrics.email_efficiency,
                          backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                          label: 'Time Management (%)',
                          data: filteredData.metrics.time_management,
                          backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                        {
                          label: 'Meeting Effectiveness (%)',
                          data: filteredData.metrics.meeting_effectiveness,
                          backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <Flex justify="center" align="center" height="100%">
                  <Text>No data found for selected filters</Text>
                </Flex>
              )}
            </Box>
          </CardBody>
        </Card>

        {/* İkincil Kartlar */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Performance Distribution</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <Radar 
                  data={{
                    labels: ['Overall Performance', 'Email Efficiency', 'Time Management', 'Meeting Effectiveness', 'Focus Time', 'Collaboration'],
                    datasets: [
                      {
                        label: selectedDepartment === 'all' ? 'Average Performance' : DEPARTMENTS.find(d => d.id === selectedDepartment)?.name,
                        data: [
                          filteredData.metrics.overall_performance.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.overall_performance.length),
                          filteredData.metrics.email_efficiency.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.email_efficiency.length),
                          filteredData.metrics.time_management.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.time_management.length),
                          filteredData.metrics.meeting_effectiveness.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.meeting_effectiveness.length),
                          filteredData.metrics.focus_time.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.focus_time.length),
                          filteredData.metrics.collaboration.reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics.collaboration.length)
                        ],
                        backgroundColor: 'rgba(53, 162, 235, 0.2)',
                        borderColor: 'rgba(53, 162, 235, 0.8)',
                        borderWidth: 2,
                      }
                    ]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Metric-Based Comparison</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                {selectedMetrics.length > 0 ? (
                  <Bar 
                    data={{
                      labels: selectedMetrics.map(m => m.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')),
                      datasets: [{
                        label: selectedDepartment === 'all' ? 'All Departments' : DEPARTMENTS.find(d => d.id === selectedDepartment)?.name,
                        data: selectedMetrics.map(m => 
                          filteredData.metrics[m] ? filteredData.metrics[m].reduce((a, b) => a + b, 0) / Math.max(1, filteredData.metrics[m].length) : 0
                        ),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 0.8)',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                ) : (
                  <Flex justify="center" align="center" height="100%">
                    <Text>Please select at least one metric</Text>
                  </Flex>
                )}
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    );
  };

  // Aktivite analizi içeriği
  const renderActivityAnalysis = () => {
    const data = ACTIVITY_DATA;
    
    // Metrik hesaplamaları için güvenlik kontrolleri ekleyelim
    const avgEmailsSent = data.metrics?.email_sent?.length > 0 
      ? data.metrics.email_sent.reduce((a, b) => a + b, 0) / data.metrics.email_sent.length 
      : 0;
    
    const avgEmailsReceived = data.metrics?.email_received?.length > 0
      ? data.metrics.email_received.reduce((a, b) => a + b, 0) / data.metrics.email_received.length
      : 0;
    
    const avgMeetings = data.metrics?.meetings_attended?.length > 0
      ? data.metrics.meetings_attended.reduce((a, b) => a + b, 0) / data.metrics.meetings_attended.length
      : 0;
    
    const totalFocusHours = data.metrics?.focus_hours?.reduce((a, b) => a + b, 0) || 0;
    const avgFocusHours = data.metrics?.focus_hours?.length > 0 
      ? totalFocusHours / data.metrics.focus_hours.length
      : 0;

    // Chart data
    const emailChartData = {
      labels: data.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Sent Emails',
          data: data.metrics?.email_sent || [45, 52, 48, 56, 42],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Meetings',
          data: data.metrics?.meetings_attended || [4, 6, 5, 3, 7],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
    
    const timeDistributionData = {
      labels: ['Focus Time', 'Meeting Time', 'Email Time'],
      datasets: [
        {
          label: 'Hours',
          data: [avgFocusHours, avgMeetings, 2], // Assuming 2 hours for email
          backgroundColor: [
            'rgba(53, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)',
          ],
        }
      ]
    };
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Active Users</StatLabel>
            <StatNumber>
              {data.total_active_users || 0}
            </StatNumber>
            <StatHelpText>Daily active users</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Daily Sessions</StatLabel>
            <StatNumber>
              {data.avg_daily_sessions || 0}
            </StatNumber>
            <StatHelpText>Sessions per user</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Focus Hours</StatLabel>
            <StatNumber>
              {avgFocusHours.toFixed(1)}
            </StatNumber>
            <StatHelpText>Hours per day</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Meetings</StatLabel>
            <StatNumber>
              {avgMeetings.toFixed(1)}
            </StatNumber>
            <StatHelpText>Per day</StatHelpText>
          </Stat>
        </SimpleGrid>
        
        {/* Email Activity */}
        <Card>
          <CardHeader>
            <Heading size="md">Email Activity</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <Bar 
                data={emailChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </CardBody>
        </Card>
        
        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <Heading size="md">Time Distribution</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Daily Activity</Heading>
                <Box height="300px">
                  <Line 
                    data={{
                      labels: data.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                      datasets: [
                        {
                          label: 'Tasks Completed',
                          data: data.metrics?.tasks_completed || [12, 15, 10, 14, 11],
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.5)'
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Time Distribution</Heading>
                <Box height="300px">
                  <Pie 
                    data={timeDistributionData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };
  // Karşılaştırmalı analiz içeriği
  const renderComparativeAnalysis = () => {
    const data = COMPARATIVE_DATA;
    
    // Security checks for metrics improvement
    const improvementRate = data.metrics && Array.isArray(data.metrics) 
      ? Math.round(75) // Demo value
      : 0;
    
    const maxImprovement = 15; // Demo value
    const bestMetric = "Collaboration";
    
    // Chart data
    const departmentComparisonData = {
      labels: Object.keys(data.departments || {}),
      datasets: [
        {
          label: 'Overall Performance',
          data: Object.values(data.departments || {}).map(values => values[0]),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Email Efficiency',
          data: Object.values(data.departments || {}).map(values => values[1]),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Time Management',
          data: Object.values(data.departments || {}).map(values => values[2]),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        }
      ]
    };
    
    const metricsRadarData = {
      labels: data.metrics || ['Overall Performance', 'Email Efficiency', 'Time Management', 'Meeting Effectiveness', 'Focus Time', 'Collaboration'],
      datasets: [
        {
          label: 'Sales',
          data: data.departments?.Sales || [78, 65, 70, 75, 68, 80],
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderColor: 'rgb(53, 162, 235)',
          pointBackgroundColor: 'rgb(53, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(53, 162, 235)'
        },
        {
          label: 'Product Development',
          data: data.departments?.['Product Development'] || [85, 72, 80, 82, 78, 84],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }
      ]
    };
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Improvement Rate</StatLabel>
            <StatNumber>
              {improvementRate}%
            </StatNumber>
            <StatHelpText>Metrics improvement ratio</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Best Improvement</StatLabel>
            <StatNumber>
              {maxImprovement}%
            </StatNumber>
            <StatHelpText>{bestMetric}</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Departments Compared</StatLabel>
            <StatNumber>
              {Object.keys(data.departments || {}).length || 0}
            </StatNumber>
            <StatHelpText>Total departments</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Metrics Analyzed</StatLabel>
            <StatNumber>
              {Array.isArray(data.metrics) ? data.metrics.length : 6}
            </StatNumber>
            <StatHelpText>Performance metrics</StatHelpText>
          </Stat>
        </SimpleGrid>
        
        {/* Department Comparison */}
        <Card>
          <CardHeader>
            <Heading size="md">Department Comparison</Heading>
          </CardHeader>
          <CardBody>
            <Box height="400px">
              <Bar 
                data={departmentComparisonData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </CardBody>
        </Card>
        
        {/* Performance by Area */}
        <Card>
          <CardHeader>
            <Heading size="md">Performance by Area</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Key Metrics Comparison</Heading>
                <Box height="300px">
                  <Bar 
                    data={{
                      labels: data.metrics?.slice(0, 3) || ['Overall Performance', 'Email Efficiency', 'Time Management'],
                      datasets: Object.keys(data.departments || {}).map((dept, idx) => ({
                        label: dept,
                        data: data.departments[dept]?.slice(0, 3) || [75, 65, 70],
                        backgroundColor: idx === 0 
                          ? 'rgba(53, 162, 235, 0.5)' 
                          : idx === 1 
                            ? 'rgba(255, 99, 132, 0.5)'
                            : 'rgba(255, 206, 86, 0.5)'
                      }))
                    }}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Department Strengths</Heading>
                <Box height="300px">
                  <Radar 
                    data={metricsRadarData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scale: {
                        min: 0,
                        max: 100
                      }
                    }}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  // Eğitim analizi içeriği
  const renderTrainingAnalysis = () => {
    const data = TRAINING_DATA;
    
    // Security checks and calculations
    const avgImprovement = data.metrics?.skill_improvement?.length > 0
      ? data.metrics.skill_improvement.reduce((a, b) => a + b, 0) / data.metrics.skill_improvement.length
      : 0;
    
    const avgTrainingHours = data.metrics?.avg_training_hours?.length > 0
      ? data.metrics.avg_training_hours.reduce((a, b) => a + b, 0) / data.metrics.avg_training_hours.length
      : 0;
    
    const avgCompletionRate = data.metrics?.training_completion_rate?.length > 0
      ? data.metrics.training_completion_rate.reduce((a, b) => a + b, 0) / data.metrics.training_completion_rate.length
      : 0;
    
    const avgCertificationRate = data.metrics?.certification_rate?.length > 0
      ? data.metrics.certification_rate.reduce((a, b) => a + b, 0) / data.metrics.certification_rate.length
      : 0;

    // Chart data
    const trainingImpactData = {
      labels: data.departments || ['Sales', 'Product Development', 'HR'],
      datasets: [
        {
          label: 'Before Training',
          data: [70, 65, 80], // Demo data
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'After Training',
          data: data.metrics?.skill_improvement.map(imp => 75 + imp) || [78, 77, 95],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    };
    
    const trainingHoursData = {
      labels: data.departments || ['Sales', 'Product Development', 'HR'],
      datasets: [
        {
          label: 'Training Hours',
          data: data.metrics?.avg_training_hours || [12, 18, 22],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    };
    
    const effectivenessData = {
      labels: data.departments || ['Sales', 'Product Development', 'HR'],
      datasets: [
        {
          label: 'Completion Rate',
          data: data.metrics?.training_completion_rate || [82, 88, 95],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Certification Rate',
          data: data.metrics?.certification_rate || [60, 75, 90],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Improvement</StatLabel>
            <StatNumber>
              {avgImprovement.toFixed(1)}%
            </StatNumber>
            <StatHelpText>After training</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Training Hours</StatLabel>
            <StatNumber>
              {avgTrainingHours.toFixed(1)}h
            </StatNumber>
            <StatHelpText>Per employee</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Completion Rate</StatLabel>
            <StatNumber>
              {avgCompletionRate.toFixed(1)}%
            </StatNumber>
            <StatHelpText>Assigned trainings</StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Certification Rate</StatLabel>
            <StatNumber>
              {avgCertificationRate.toFixed(1)}%
            </StatNumber>
            <StatHelpText>Success rate</StatHelpText>
          </Stat>
        </SimpleGrid>
        
        {/* Training Impact */}
        <Card>
          <CardHeader>
            <Heading size="md">Training Impact</Heading>
          </CardHeader>
          <CardBody>
            <Box height="400px">
              <Bar 
                data={trainingImpactData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </Box>
          </CardBody>
        </Card>
        
        {/* Department Analysis */}
        <Card>
          <CardHeader>
            <Heading size="md">Department Analysis</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Training Hours by Department</Heading>
                <Box height="300px">
                  <Bar 
                    data={trainingHoursData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Training Effectiveness</Heading>
                <Box height="300px">
                  <Bar 
                    data={effectivenessData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  // Trend Analysis Content
  const renderTrendAnalysis = () => {
    // Create trend data
    const trendData = {
      labels: [],
      datasets: []
    };
    
    // Set labels based on period
    if (selectedPeriod === 'last_7_days') {
      trendData.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    } else if (selectedPeriod === 'last_30_days') {
      trendData.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (selectedPeriod === 'last_90_days') {
      trendData.labels = ['January', 'February', 'March'];
    } else if (selectedPeriod === 'last_year') {
      trendData.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    } else {
      trendData.labels = ['January', 'February', 'March', 'April', 'May', 'June'];
    }
    
    // Demo data
    const data = TREND_DATA;
    
    // Chart data for performance trends
    const performanceTrendData = {
      labels: data.months || trendData.labels,
      datasets: [
        {
          label: 'Overall Performance',
          data: data.metrics?.overall_performance || [72, 73, 75, 78, 80, 82],
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3
        },
        {
          label: 'Email Efficiency',
          data: data.metrics?.email_efficiency || [68, 70, 72, 75, 77, 78],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3
        }
      ]
    };
    
    // Chart data for metric breakdown
    const metricBreakdownData = {
      labels: ['Overall Performance', 'Email Efficiency', 'Time Management', 'Meeting Effectiveness'],
      datasets: [
        {
          label: 'Current',
          data: [82, 78, 85, 76],
          backgroundColor: 'rgba(53, 162, 235, 0.5)'
        },
        {
          label: 'Previous',
          data: [75, 70, 73, 71],
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    };
    
    // Chart data for forecast
    const forecastData = {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Actual',
          data: [82, 84, 85, null, null, null],
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3
        },
        {
          label: 'Forecast',
          data: [null, null, 85, 86, 87, 88],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    };
    
    return (
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Overall Change</StatLabel>
            <StatNumber>
              +7.2%
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              From previous period
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Best Performing Metric</StatLabel>
            <StatNumber>
              Time Management
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              +12% improvement
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Growth Rate</StatLabel>
            <StatNumber>
              1.8%
            </StatNumber>
            <StatHelpText>
              Monthly average
            </StatHelpText>
          </Stat>
          
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Trend Consistency</StatLabel>
            <StatNumber>
              High
            </StatNumber>
            <StatHelpText>
              89% reliability
            </StatHelpText>
          </Stat>
        </SimpleGrid>
        
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <Heading size="md">Performance Trends</Heading>
          </CardHeader>
          <CardBody>
            <Box height="400px">
              <Line 
                data={performanceTrendData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </Box>
          </CardBody>
        </Card>
        
        {/* Trend Details */}
        <Card>
          <CardHeader>
            <Heading size="md">Trend Details</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Metric Breakdown</Heading>
                <Box height="300px">
                  <Bar 
                    data={metricBreakdownData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Heading size="sm" mb={4}>Trend Prediction</Heading>
                <Box height="300px">
                  <Line 
                    data={forecastData}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          suggestedMin: 70,
                          suggestedMax: 90
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <Text mt={4} mb={1} fontSize="lg">
          Access Error
        </Text>
        <Text>{error}</Text>
      </Alert>
    );
  }

  const analysisInfo = getAnalysisTypeInfo();

  return (
    <Box width="100%" maxWidth="100%">
      {/* İşlem Çubuğu */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Data Analysis</Heading>
        <HStack spacing={4}>
          <Button leftIcon={<FiDownload />} onClick={exportAnalysisData}>
            Download Analysis Data
          </Button>
        </HStack>
      </Flex>
      
      <VStack spacing={8} align="stretch">
        {/* Başlık */}
        <Box>
          <Heading size="md">Analysis Center</Heading>
          <Text color="gray.600">
            Analyze your data and generate reports
          </Text>
        </Box>
        
        {/* Analiz Türleri Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
          {ANALYSIS_TYPES.map(analysisType => (
            <Button
              key={analysisType.id}
              variant={selectedAnalysisType === analysisType.id ? 'solid' : 'outline'}
              colorScheme={selectedAnalysisType === analysisType.id ? analysisType.color : 'gray'}
              height="auto"
              p={4}
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="column"
              onClick={() => setSelectedAnalysisType(analysisType.id)}
              whiteSpace="normal"
              textAlign="left"
            >
              <Flex align="center" mb={2} width="100%">
                <Icon as={analysisType.icon} mr={2} boxSize={5} />
                <Text fontWeight="bold">{analysisType.name}</Text>
              </Flex>
              <Text 
                fontSize="xs" 
                color={selectedAnalysisType === analysisType.id ? `${analysisType.color}.50` : 'gray.500'}
              >
                {analysisType.description}
              </Text>
            </Button>
          ))}
        </SimpleGrid>
        
        {/* Filtreler */}
        <Card>
          <CardHeader>
            <Heading size="sm">Filters</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Select 
                  value={selectedDepartment} 
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Team</FormLabel>
                <Select 
                  value={selectedTeam} 
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  {TEAMS.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Period</FormLabel>
                <Select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  {PERIODS.map(period => (
                    <option key={period.id} value={period.id}>{period.name}</option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {selectedPeriod === 'custom' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                  />
                </FormControl>
              </SimpleGrid>
            )}

            <Flex mt={4} align="center">
              <FormControl display="flex" alignItems="center" maxW="300px">
                <FormLabel htmlFor="compare-with-previous" mb="0">
                  Compare with previous period
                </FormLabel>
                <Switch 
                  id="compare-with-previous" 
                  isChecked={compareWithPrevious}
                  onChange={(e) => setCompareWithPrevious(e.target.checked)}
                />
              </FormControl>
            </Flex>
          </CardBody>
        </Card>

        {/* Content Based on Selected Analysis Type */}
        <Card>
          <CardHeader>
            <Flex align="center">
              <Box 
                bg={`${analysisInfo.color}.50`} 
                color={`${analysisInfo.color}.500`} 
                p={2} 
                borderRadius="full" 
                mr={3}
              >
                <Icon as={analysisInfo.icon} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md">{analysisInfo.name}</Heading>
                <Text color="gray.500" fontSize="sm">{analysisInfo.description}</Text>
              </Box>
            </Flex>
          </CardHeader>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Department Performance</Tab>
                <Tab>Employee Comparison</Tab>
                <Tab>Trend Analysis</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {renderPerformanceAnalysis()}
                </TabPanel>
                <TabPanel>
                  {renderActivityAnalysis()}
                </TabPanel>
                <TabPanel>
                  {renderTrendAnalysis()}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Analysis; 