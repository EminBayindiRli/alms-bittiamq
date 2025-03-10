import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Badge,
  Select,
  Stack,
  Progress,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const Performance = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [trendPeriod, setTrendPeriod] = useState('weekly');

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Performance sayfası: Veri yükleme başladı');
        console.log('User:', user);
        console.log('isAdmin:', isAdmin());
        
        if (isAdmin()) {
          // Admin verilerini yükle
          console.log('Admin verisi alınıyor...');
          const data = await AdminService.getAllAnalyses();
          console.log('Alınan admin verisi:', data);
          setAdminData(data);
        } else {
          // Çalışan verilerini yükle
          const employeeId = user?.id || '1';
          console.log('Çalışan verisi alınıyor, employeeId:', employeeId);
          try {
            const data = await EmployeeService.getEmployeeAnalysis(employeeId);
            console.log('Alınan çalışan performans verisi:', data);
            setEmployeeData(data);
          } catch (apiError) {
            console.error('API error:', apiError);
            setError(`API error: ${apiError.message}`);
          }
        }
      } catch (err) {
        console.error('Performance data loading error:', err);
        setError('There was a problem loading the data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  // Çalışan performans karşılaştırma grafiği (Admin için)
  const getEmployeeComparisonData = () => {
    if (!adminData) return null;

    // Seçilen departmana özgü veri oluştur
    let label = selectedDepartment === 'All' ? 'Company Average' : `${selectedDepartment} Average`;
    
    // Her departman için farklı değerler belirle
    const getDataForDepartment = (dept) => {
      switch(dept) {
        case 'Sales':
          return {
            task: 0.78,
            email: 0.65,
            meeting: 0.70,
            communication: 0.76,
            collaboration: 0.68
          };
        case 'Product Development':
          return {
            task: 0.85,
            email: 0.72,
            meeting: 0.75,
            communication: 0.70,
            collaboration: 0.82
          };
        case 'HR':
          return {
            task: 0.92,
            email: 0.88,
            meeting: 0.85,
            communication: 0.90,
            collaboration: 0.86
          };
        default: // Tüm şirket
          return {
            task: 0.82,
            email: 0.72,
            meeting: 0.76,
            communication: 0.75,
            collaboration: 0.75
          };
      }
    };
    
    // Seçilen departman veya tüm şirket verisi
    const selectedData = getDataForDepartment(selectedDepartment === 'All' ? 'All' : selectedDepartment);
    
    // En iyi ve en kötü performans değerlerini belirle
    const bestPerformance = {
      task: 0.92,
      email: 0.88,
      meeting: 0.90,
      communication: 0.90,
      collaboration: 0.86
    };
    
    const lowestPerformance = {
      task: 0.68,
      email: 0.60,
      meeting: 0.62,
      communication: 0.58,
      collaboration: 0.56
    };

    return {
      labels: ['Görev Tamamlama', 'E-posta Verimliliği', 'Toplantı Verimliliği', 'İletişim', 'İşbirliği'],
      datasets: [
        {
          label: label,
          data: [
            selectedData.task,
            selectedData.email,
            selectedData.meeting,
            selectedData.communication,
            selectedData.collaboration
          ],
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Best Performance',
          data: [
            bestPerformance.task,
            bestPerformance.email,
            bestPerformance.meeting,
            bestPerformance.communication,
            bestPerformance.collaboration
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Lowest Performance',
          data: [
            lowestPerformance.task,
            lowestPerformance.email,
            lowestPerformance.meeting,
            lowestPerformance.communication,
            lowestPerformance.collaboration
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ]
    };
  };

  // Departman performans grafiği (Admin için)
  const getDepartmentPerformanceData = () => {
    if (!adminData || !adminData.department_statistics) return null;

    // Eğer "Tümü" seçilmişse, tüm departmanları dahil et
    // Değilse, sadece seçilen departmanı göster
    const departmentsToShow = selectedDepartment === 'All' 
      ? Object.keys(adminData.department_statistics)
      : [selectedDepartment];

    return {
      labels: departmentsToShow,
      datasets: [
        {
          label: 'Average Task Completion (%)',
          data: departmentsToShow.map(dept => adminData.department_statistics[dept].avg_task_completion * 100),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Average Email Response Efficiency (%)',
          data: departmentsToShow.map(dept => adminData.department_statistics[dept].avg_email_response * 100),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
  };

  // Performans radar grafiği verisi
  const getPerformanceRadarData = () => {
    // Veri güvenlik kontrolü
    if (!employeeData || !employeeData.current_metrics) {
      console.warn('Radar veri oluşturmak için employeeData veya current_metrics eksik');
      return {
        labels: ['Görev Tamamlama', 'E-posta Verimliliği', 'Toplantı Verimliliği', 'İletişim', 'İşbirliği'],
        datasets: [
          {
            label: 'Kişisel Performans',
            data: [0.75, 0.65, 0.70, 0.68, 0.72],
            backgroundColor: 'rgba(99, 179, 237, 0.2)',
            borderColor: 'rgba(99, 179, 237, 1)',
            borderWidth: 1,
          }
        ]
      };
    }

    const metrics = employeeData.current_metrics;

    return {
      labels: ['Görev Tamamlama', 'E-posta Verimliliği', 'Toplantı Verimliliği', 'İletişim', 'İşbirliği'],
      datasets: [
        {
          label: 'Kişisel Performans',
          data: [
            metrics.task_completion_rate || 0,
            metrics.email_efficiency || 0,
            metrics.meeting_efficiency || 0,
            metrics.communication_score || 0,
            metrics.collaboration_score || 0,
          ],
          backgroundColor: 'rgba(99, 179, 237, 0.2)',
          borderColor: 'rgba(99, 179, 237, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Trend analiz grafiği verisi (Admin için)
  const getAdminTrendData = () => {
    if (!adminData) return null;

    // Seçilen departmana özel veri oluştur
    let labelPrefix = selectedDepartment === 'All' ? 'Şirket' : selectedDepartment;
    
    // Periyoda göre farklı etiketler ve değerler belirle
    let labels = [];
    let taskData = [];
    let collabData = [];
    
    if (trendPeriod === 'weekly') {
      labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      if (selectedDepartment === 'Sales') {
        taskData = [72, 75, 73, 79, 80, 78, 76];
        collabData = [65, 68, 70, 72, 74, 72, 70];
      } else if (selectedDepartment === 'Product Development') {
        taskData = [82, 83, 80, 85, 87, 86, 84];
        collabData = [75, 77, 76, 79, 80, 81, 78];
      } else if (selectedDepartment === 'HR') {
        taskData = [90, 91, 92, 93, 91, 92, 90];
        collabData = [83, 85, 86, 88, 87, 86, 85];
      } else {
        // Tüm departmanlar
        taskData = [78, 80, 79, 82, 84, 82, 80];
        collabData = [70, 72, 73, 75, 77, 76, 74];
      }
    } else if (trendPeriod === 'monthly') {
      labels = ['January', 'February', 'March', 'April', 'May', 'June'];
      
      if (selectedDepartment === 'Sales') {
        taskData = [70, 73, 75, 78, 76, 79];
        collabData = [62, 65, 68, 70, 72, 74];
      } else if (selectedDepartment === 'Product Development') {
        taskData = [80, 82, 83, 85, 84, 86];
        collabData = [74, 76, 77, 78, 80, 81];
      } else if (selectedDepartment === 'HR') {
        taskData = [88, 90, 91, 92, 93, 94];
        collabData = [82, 84, 85, 86, 87, 88];
      } else {
        // Tüm departmanlar
        taskData = [75, 78, 80, 82, 83, 85];
        collabData = [68, 70, 72, 75, 76, 78];
      }
    } else if (trendPeriod === 'quarterly') {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      
      if (selectedDepartment === 'Sales') {
        taskData = [72, 76, 78, 80];
        collabData = [65, 69, 72, 74];
      } else if (selectedDepartment === 'Product Development') {
        taskData = [81, 84, 85, 87];
        collabData = [75, 78, 80, 82];
      } else if (selectedDepartment === 'HR') {
        taskData = [89, 92, 94, 95];
        collabData = [83, 86, 88, 89];
      } else {
        // Tüm departmanlar
        taskData = [77, 80, 83, 86];
        collabData = [70, 73, 76, 79];
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: `${labelPrefix} Görev Tamamlama (%)`,
          data: taskData,
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.1
        },
        {
          label: `${labelPrefix} İşbirliği (%)`,
          data: collabData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  // Performans dağılımı verisi
  const getPerformanceDistribution = () => {
    if (!adminData) return null;
    
    // Departmana göre farklı değerler
    let distribution = {
      high: { percent: 0, count: 0 },
      mediumHigh: { percent: 0, count: 0 },
      medium: { percent: 0, count: 0 },
      mediumLow: { percent: 0, count: 0 },
      low: { percent: 0, count: 0 }
    };
    
    if (selectedDepartment === 'Sales') {
      distribution = {
        high: { percent: 20, count: 3 },
        mediumHigh: { percent: 33, count: 5 },
        medium: { percent: 27, count: 4 },
        mediumLow: { percent: 13, count: 2 },
        low: { percent: 7, count: 1 }
      };
    } else if (selectedDepartment === 'Product Development') {
      distribution = {
        high: { percent: 30, count: 5 },
        mediumHigh: { percent: 40, count: 6 },
        medium: { percent: 20, count: 3 },
        mediumLow: { percent: 7, count: 1 },
        low: { percent: 3, count: 0 }
      };
    } else if (selectedDepartment === 'HR') {
      distribution = {
        high: { percent: 40, count: 2 },
        mediumHigh: { percent: 40, count: 2 },
        medium: { percent: 20, count: 1 },
        mediumLow: { percent: 0, count: 0 },
        low: { percent: 0, count: 0 }
      };
    } else {
      // Tüm departmanlar
      distribution = {
        high: { percent: 25, count: 4 },
        mediumHigh: { percent: 35, count: 6 },
        medium: { percent: 20, count: 3 },
        mediumLow: { percent: 15, count: 2 },
        low: { percent: 5, count: 1 }
      };
    }
    
    return distribution;
  };

  // Çalışan için performans trend verileri
  const getPerformanceTrendData = () => {
    // Veri güvenlik kontrolü
    if (!employeeData || !employeeData.historical_trends || !employeeData.historical_trends.task_completion) {
      console.warn('Trend veri oluşturmak için employeeData, historical_trends veya task_completion eksik');
      return {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [
          {
            label: 'Görev Tamamlama Oranı',
            data: [75, 78, 80, 79, 82, 83, 85],
            backgroundColor: 'rgba(99, 179, 237, 0.2)',
            borderColor: 'rgba(99, 179, 237, 1)',
            borderWidth: 2,
            tension: 0.3,
          }
        ]
      };
    }

    // Trend verilerini hazırla
    const taskTrend = employeeData.historical_trends.task_completion || [];
    const commTrend = employeeData.historical_trends.communication || [];
    
    // Günleri belirle
    const labels = taskTrend.map(t => `Gün ${t.day}`);
    
    return {
      labels,
      datasets: [
        {
          label: 'Görev Tamamlama (%)',
          data: taskTrend.map(t => t.completion_rate * 100),
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.1,
        },
        {
          label: 'E-posta Aktivitesi',
          data: commTrend.map(t => t.email_activity),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Yanıt Süresi (dk)',
          data: commTrend.map(t => t.response_time),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.1,
        }
      ]
    };
  };

  // Admin Dashboard
  const renderAdminPerformance = () => {
    if (!adminData) return null;

    const departmentData = getDepartmentPerformanceData();
    const employeeComparisonData = getEmployeeComparisonData();
    const trendData = getAdminTrendData();
    const performanceDistribution = getPerformanceDistribution();
    
    // Çalışan sayısını hesapla
    let totalEmployees = adminData.total_employees;
    if (selectedDepartment === 'Sales') totalEmployees = 2;
    else if (selectedDepartment === 'Product Development') totalEmployees = 2;
    else if (selectedDepartment === 'HR') totalEmployees = 1;

    return (
      <Box width="100%" minWidth="100%" p={5}>
        <Box width="100%" minWidth="100%">
          <VStack spacing={8} align="stretch" width="100%">
            <Heading mb={6}>Performance Analysis - Company Overview</Heading>
            
            {/* Departman Filtreleme */}
            <Flex mb={5} align="center">
              <Text mr={2} fontWeight="bold">Department:</Text>
              <Select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                w="200px"
              >
                <option value="All">All</option>
                {Object.keys(adminData.department_statistics).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            </Flex>
            
            {/* Performans Metrikleri */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Average Task Completion</StatLabel>
                    <StatNumber>
                      {selectedDepartment === 'All' 
                        ? `${Math.round(Object.values(adminData.department_statistics).reduce((sum, dept) => sum + dept.avg_task_completion, 0) / Object.keys(adminData.department_statistics).length * 100)}%` 
                        : `${Math.round(adminData.department_statistics[selectedDepartment].avg_task_completion * 100)}%`
                      }
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Email Efficiency</StatLabel>
                    <StatNumber>
                      {selectedDepartment === 'All' 
                        ? `${Math.round(Object.values(adminData.department_statistics).reduce((sum, dept) => sum + dept.avg_email_response, 0) / Object.keys(adminData.department_statistics).length * 100)}%` 
                        : `${Math.round(adminData.department_statistics[selectedDepartment].avg_email_response * 100)}%`
                      }
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Toplam Çalışan</StatLabel>
                    <StatNumber>{totalEmployees}</StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            {/* Grafik Sekmeleri */}
            <Tabs isLazy onChange={setActiveTab} index={activeTab}>
              <TabList>
                <Tab>Departman Performansı</Tab>
                <Tab>Çalışan Karşılaştırması</Tab>
                <Tab>Trend Analizi</Tab>
              </TabList>
              
              <TabPanels>
                {/* Departman Performans Grafiği */}
                <TabPanel>
                  <Card bg={cardBg} p={4}>
                    <CardHeader>
                      <Heading size="md">Departman Performans Karşılaştırması</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="400px">
                        {departmentData && <Bar 
                          data={departmentData} 
                          options={{ 
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100
                              }
                            }
                          }} 
                        />}
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
                
                {/* Çalışan Karşılaştırma Grafiği */}
                <TabPanel>
                  <Card bg={cardBg} p={4}>
                    <CardHeader>
                      <Heading size="md">Çalışan Performans Karşılaştırması</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="400px">
                        {employeeComparisonData && <Radar 
                          data={employeeComparisonData} 
                          options={{ 
                            maintainAspectRatio: false,
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 1,
                                ticks: {
                                  stepSize: 0.2
                                }
                              }
                            }
                          }} 
                        />}
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
                
                {/* Trend Analizi Grafiği */}
                <TabPanel>
                  <Card bg={cardBg} p={4}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">Performans Trend Analizi</Heading>
                        <Select 
                          value={trendPeriod}
                          onChange={(e) => setTrendPeriod(e.target.value)}
                          w="150px"
                        >
                          <option value="weekly">Haftalık</option>
                          <option value="monthly">Aylık</option>
                          <option value="quarterly">Üç Aylık</option>
                        </Select>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Box h="400px">
                        <Line 
                          data={trendData} 
                          options={{ 
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                              }
                            }
                          }} 
                        />
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            {/* Performans Dağılımı */}
            <Card bg={cardBg} mt={8}>
              <CardHeader>
                <Heading size="md">Performans Dağılımı</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text>High Performance ({performanceDistribution.high.percent}%)</Text>
                      <Text>{performanceDistribution.high.count} Employees</Text>
                    </Flex>
                    <Progress value={performanceDistribution.high.percent} colorScheme="green" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text>Medium-High Performance ({performanceDistribution.mediumHigh.percent}%)</Text>
                      <Text>{performanceDistribution.mediumHigh.count} Employees</Text>
                    </Flex>
                    <Progress value={performanceDistribution.mediumHigh.percent} colorScheme="blue" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text>Medium Performance ({performanceDistribution.medium.percent}%)</Text>
                      <Text>{performanceDistribution.medium.count} Employees</Text>
                    </Flex>
                    <Progress value={performanceDistribution.medium.percent} colorScheme="yellow" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text>Medium-Low Performance ({performanceDistribution.mediumLow.percent}%)</Text>
                      <Text>{performanceDistribution.mediumLow.count} Employees</Text>
                    </Flex>
                    <Progress value={performanceDistribution.mediumLow.percent} colorScheme="orange" borderRadius="md" />
                  </Box>
                  
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text>Low Performance ({performanceDistribution.low.percent}%)</Text>
                      <Text>{performanceDistribution.low.count} Employees</Text>
                    </Flex>
                    <Progress value={performanceDistribution.low.percent} colorScheme="red" borderRadius="md" />
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </Box>
    );
  };

  // Çalışan Dashboard
  const renderEmployeePerformance = () => {
    console.log('renderEmployeePerformance called, employeeData:', employeeData);
    
    if (!employeeData) {
      console.error('employeeData is missing!');
      return (
        <Box width="100%" minWidth="100%" p={5}>
          <Alert status="error">
            <AlertIcon />
            Performance data could not be loaded. Please try again later.
          </Alert>
        </Box>
      );
    }

    // Veri yapısını kontrol et ve eksik alanlar varsa varsayılan değerler kullan
    const metrics = employeeData.current_metrics || {};
    
    // Performans özeti için güvenlik kontrolü
    const performanceSummary = employeeData.performance_summary || {
      overall_score: 0.75,
      strongest_area: 'task_completion_rate',
      improvement_needed: 'collaboration_score'
    };
    
    // Radar ve trend verileri için güvenlik kontrolleri
    let performanceRadarData;
    try {
      performanceRadarData = getPerformanceRadarData();
    } catch (error) {
      console.error('Error creating radar data:', error);
      performanceRadarData = null;
    }
    
    let performanceTrendData;
    try {
      performanceTrendData = getPerformanceTrendData();
    } catch (error) {
      console.error('Trend verisi oluşturma hatası:', error);
      performanceTrendData = null;
    }

    return (
      <Box width="100%" minWidth="100%" p={5}>
        <Box width="100%" minWidth="100%">
          <VStack spacing={8} align="stretch" width="100%">
            <Heading size="lg" mb={4}>Performance Analysis - Personal</Heading>
            
            {/* Performans Özeti Kartları */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Genel Performans</StatLabel>
                    <StatNumber>
                      {Math.round(performanceSummary.overall_score * 100)}%
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type={performanceSummary.overall_score >= 0.7 ? 'increase' : 'decrease'} />
                      {performanceSummary.overall_score >= 0.7 ? 'İyi' : 'Geliştirilmeli'}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Görev Tamamlama</StatLabel>
                    <StatNumber>
                      {Math.round((metrics.task_completion_rate || 0) * 100)}%
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type={(metrics.task_completion_rate || 0) >= 0.8 ? 'increase' : 'decrease'} />
                      {(metrics.task_completion_rate || 0) >= 0.8 ? 'Yüksek' : 'Ortalama'}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Email Efficiency</StatLabel>
                    <StatNumber>{Math.round(metrics.email_efficiency * 100)}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      2% Decrease
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Collaboration Score</StatLabel>
                    <StatNumber>
                      {Math.round((metrics.collaboration_score || 0) * 100)}%
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type={(metrics.collaboration_score || 0) >= 0.7 ? 'increase' : 'decrease'} />
                      {(metrics.collaboration_score || 0) >= 0.7 ? 'Good' : 'Needs Improvement'}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            {/* Radar ve Trend Grafikleri */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Performance Metrics</Heading>
                </CardHeader>
                <CardBody>
                  {performanceRadarData ? (
                    <Radar 
                      data={performanceRadarData} 
                      options={{
                        scales: {
                          r: {
                            min: 0,
                            max: 1,
                            ticks: {
                              stepSize: 0.2,
                              callback: (value) => `${value * 100}%`
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <Box textAlign="center" py={10}>
                      <Text>Radar verisi yüklenemedi</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Performans Trendleri</Heading>
                </CardHeader>
                <CardBody>
                  {performanceTrendData ? (
                    <Line 
                      data={performanceTrendData} 
                      options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                          }
                        }
                      }}
                    />
                  ) : (
                    <Box textAlign="center" py={10}>
                      <Text>Trend verisi yüklenemedi</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </SimpleGrid>
            
            {/* Detaylı Metrikler */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Detaylı Performans Metrikleri</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Görev Tamamlama */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>Görev Tamamlama</Text>
                    <Stack spacing={3}>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Zamanında Tamamlanan Görevler</Text>
                          <Badge colorScheme="green">{Math.round(metrics.task_completion_rate * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.task_completion_rate * 100} colorScheme="green" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Görev Kalitesi</Text>
                          <Badge colorScheme="blue">85%</Badge>
                        </Flex>
                        <Progress value={85} colorScheme="blue" borderRadius="md" />
                      </Box>
                    </Stack>
                  </Box>
                  
                  {/* İletişim ve İşbirliği */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>İletişim ve İşbirliği</Text>
                    <Stack spacing={3}>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">E-posta Yanıt Süresi</Text>
                          <Badge colorScheme="blue">{Math.round(metrics.email_efficiency * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.email_efficiency * 100} colorScheme="blue" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">İşbirliği</Text>
                          <Badge colorScheme="purple">{Math.round(metrics.collaboration_score * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.collaboration_score * 100} colorScheme="purple" borderRadius="md" />
                      </Box>
                    </Stack>
                  </Box>
                  
                  {/* Toplantı Etkinliği */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>Toplantı Etkinliği</Text>
                    <Stack spacing={3}>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Toplantı Verimliliği</Text>
                          <Badge colorScheme="orange">{Math.round(metrics.meeting_efficiency * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.meeting_efficiency * 100} colorScheme="orange" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Katılım Oranı</Text>
                          <Badge colorScheme="green">92%</Badge>
                        </Flex>
                        <Progress value={92} colorScheme="green" borderRadius="md" />
                      </Box>
                    </Stack>
                  </Box>
                  
                  {/* Zaman Yönetimi */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>Zaman Yönetimi</Text>
                    <Stack spacing={3}>
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Odaklanma Süresi</Text>
                          <Badge colorScheme="blue">{Math.round(metrics.time_efficiency * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.time_efficiency * 100} colorScheme="blue" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={1}>
                          <Text fontSize="sm">Dosya Aktivitesi</Text>
                          <Badge colorScheme="purple">{Math.round(metrics.file_activity * 100)}%</Badge>
                        </Flex>
                        <Progress value={metrics.file_activity * 100} colorScheme="purple" borderRadius="md" />
                      </Box>
                    </Stack>
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>
            
            {/* Takım Karşılaştırması */}
            <Card bg={cardBg} mt={8}>
              <CardHeader>
                <Heading size="md">Your Position in the Team</Heading>
              </CardHeader>
              <CardBody>
                <Text mb={4}>
                  {employeeData.segment_info ? (
                    <>You are in the <Badge colorScheme="blue">{employeeData.segment_info.segment_name}</Badge> group. This group represents {employeeData.segment_info.segment_percentage}% of all employees.</>
                  ) : (
                    'Segment information not found.'
                  )}
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="xs" mb={2}>Your Strengths</Heading>
                      <Text fontSize="sm">
                        {employeeData.performance_summary.strongest_area === 'task_completion_rate' ? 'Task Completion' :
                         employeeData.performance_summary.strongest_area === 'email_efficiency' ? 'Email Efficiency' :
                         employeeData.performance_summary.strongest_area === 'meeting_efficiency' ? 'Meeting Efficiency' :
                         employeeData.performance_summary.strongest_area === 'communication_score' ? 'Communication' :
                         employeeData.performance_summary.strongest_area === 'collaboration_score' ? 'Collaboration' :
                         employeeData.performance_summary.strongest_area === 'time_efficiency' ? 'Time Management' :
                         employeeData.performance_summary.strongest_area === 'file_activity' ? 'File Activity' :
                         employeeData.performance_summary.strongest_area}
                      </Text>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="xs" mb={2}>Areas for Improvement</Heading>
                      <Text fontSize="sm">
                        {employeeData.performance_summary.improvement_needed === 'task_completion_rate' ? 'Task Completion' :
                         employeeData.performance_summary.improvement_needed === 'email_efficiency' ? 'Email Efficiency' :
                         employeeData.performance_summary.improvement_needed === 'meeting_efficiency' ? 'Meeting Efficiency' :
                         employeeData.performance_summary.improvement_needed === 'communication_score' ? 'Communication' :
                         employeeData.performance_summary.improvement_needed === 'collaboration_score' ? 'Collaboration' :
                         employeeData.performance_summary.improvement_needed === 'time_efficiency' ? 'Time Management' :
                         employeeData.performance_summary.improvement_needed === 'file_activity' ? 'File Activity' :
                         employeeData.performance_summary.improvement_needed}
                      </Text>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="xs" mb={2}>Team Contribution</Heading>
                      <Text fontSize="sm">Your performance is 8% higher than the team average.</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </Box>
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
          Data Loading Error
        </Text>
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <Box width="100%" maxWidth="100%" height="auto" minHeight="calc(100vh - 60px)">
      <Box width="100%" maxWidth="100%">
        <Tabs isLazy width="100%">
          <TabList>
            {isAdmin() && (
              <Tab>Admin View</Tab>
            )}
            <Tab>Personal Performance</Tab>
          </TabList>
          <TabPanels width="100%">
            {isAdmin() && (
              <TabPanel p={0} width="100%">
                {renderAdminPerformance()}
              </TabPanel>
            )}
            <TabPanel p={0} width="100%">
              {renderEmployeePerformance()}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Performance; 