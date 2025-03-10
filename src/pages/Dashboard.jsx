import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Button,
  Stack,
  Badge,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  VStack,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { DownloadIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const toast = useToast();

  const boxBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.50');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isAdmin) {
          // Load admin data
          const data = await AdminService.getAllAnalyses();
          setAdminData(data);
        } else {
          // Load employee data (fixed ID for now)
          const employeeId = user?.id || '1'; // Real user ID
          const data = await EmployeeService.getEmployeeAnalysis(employeeId);
          setEmployeeData(data);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Data Loading Error');
        
        // Example data in case of error (development only)
        if (isAdmin) {
          setAdminData({
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
          });
        } else {
          setEmployeeData({
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
              { suggestion: "E-posta yanıt sürelerini iyileştirin", reason: "E-posta yanıt süreleriniz ortalama 25 dakikanın üzerinde", priority: "high" },
              { suggestion: "Toplantı süresini optimize edin", reason: "Toplantılarda geçirdiğiniz süre günlük 2 saatin üzerinde", priority: "medium" },
              { suggestion: "Dosya paylaşımını artırın", reason: "Dosya paylaşım oranınız takım ortalamasının altında", priority: "low" }
            ],
            performance_summary: {
              overall_score: 0.74,
              strongest_area: "task_completion_rate",
              improvement_needed: "collaboration_score"
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const handleGenerateReport = async () => {
    try {
      const employeeId = user?.id || '1';
      const response = await EmployeeService.getReport(employeeId);
      
      // PDF'i indir
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_${employeeId}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Report downloaded',
        description: 'Your performance report has been successfully downloaded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Report download error:', err);
      toast({
        title: 'Report download failed',
        description: 'An error occurred while downloading the report. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateAllReports = async () => {
    try {
      await AdminService.generateReports();
      toast({
        title: 'Reports generated',
        description: 'All reports have been successfully generated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Report generation error:', err);
      toast({
        title: 'Reports generation failed',
        description: 'An error occurred while generating reports. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Çalışan dashboard bileşeni
  const renderEmployeeDashboard = () => {
    if (!employeeData) return null;

    const metrics = employeeData.current_metrics;
    const trends = employeeData.historical_trends;
    
    // Görev tamamlama trendi için grafik verileri
    const taskCompletionChart = {
      labels: trends.task_completion.map(t => `Day ${t.day}`),
      datasets: [
        {
          label: 'Task Completion Rate',
          data: trends.task_completion.map(t => t.completion_rate * 100),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
    
    return (
      <Box width="100%" minWidth="100%" p={5}>
        <Box width="100%" minWidth="100%">
          <VStack spacing={8} align="stretch" width="100%">
            <Flex justifyContent="space-between" alignItems="center" mb={5} width="100%">
              <Heading size="lg">Performance Summary</Heading>
              <Button 
                leftIcon={<DownloadIcon />} 
                colorScheme="blue"
                onClick={handleGenerateReport}
              >
                Download Report
              </Button>
            </Flex>

            {/* Performans Metrikleri */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Overall Performance</StatLabel>
                    <StatNumber>
                      <CircularProgress value={employeeData.performance_summary.overall_score * 100} color="green.400" size="60px">
                        <CircularProgressLabel>{Math.round(employeeData.performance_summary.overall_score * 100)}%</CircularProgressLabel>
                      </CircularProgress>
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Task Completion</StatLabel>
                    <StatNumber>{Math.round(metrics.task_completion_rate * 100)}%</StatNumber>
                    <StatHelpText>Completed tasks on time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Communication Score</StatLabel>
                    <StatNumber>{Math.round(metrics.communication_score * 100)}%</StatNumber>
                    <StatHelpText>E-mail and instant messaging</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Collaboration Score</StatLabel>
                    <StatNumber>{Math.round(metrics.collaboration_score * 100)}%</StatNumber>
                    <StatHelpText>File sharing and comments</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Performance Charts */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5} mb={8}>
              <Card bg={boxBg} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Task Completion Trend</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <Line data={taskCompletionChart} options={{ maintainAspectRatio: false }} />
                  </Box>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Strongest and Improvement Areas</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={3}>
                    <Box>
                      <Flex align="center" mb={2}>
                        <Badge colorScheme="green" mr={2}>Strongest Area</Badge>
                        <Text fontWeight="bold">
                          {employeeData.performance_summary.strongest_area === 'task_completion_rate' ? 'Task Completion' : 
                           employeeData.performance_summary.strongest_area === 'email_efficiency' ? 'E-mail Efficiency' :
                           employeeData.performance_summary.strongest_area === 'meeting_efficiency' ? 'Meeting Efficiency' :
                           employeeData.performance_summary.strongest_area === 'communication_score' ? 'Communication' :
                           employeeData.performance_summary.strongest_area === 'collaboration_score' ? 'Collaboration' :
                           employeeData.performance_summary.strongest_area === 'time_efficiency' ? 'Time Management' :
                           employeeData.performance_summary.strongest_area === 'file_activity' ? 'File Activity' :
                           employeeData.performance_summary.strongest_area}
                        </Text>
                      </Flex>
                      <Text>You are outperforming in this area.</Text>
                    </Box>
                    
                    <Box>
                      <Flex align="center" mb={2}>
                        <Badge colorScheme="red" mr={2}>Improvement Area</Badge>
                        <Text fontWeight="bold">
                          {employeeData.performance_summary.improvement_needed === 'task_completion_rate' ? 'Task Completion' : 
                           employeeData.performance_summary.improvement_needed === 'email_efficiency' ? 'E-mail Efficiency' :
                           employeeData.performance_summary.improvement_needed === 'meeting_efficiency' ? 'Meeting Efficiency' :
                           employeeData.performance_summary.improvement_needed === 'communication_score' ? 'Communication' :
                           employeeData.performance_summary.improvement_needed === 'collaboration_score' ? 'Collaboration' :
                           employeeData.performance_summary.improvement_needed === 'time_efficiency' ? 'Time Management' :
                           employeeData.performance_summary.improvement_needed === 'file_activity' ? 'File Activity' :
                           employeeData.performance_summary.improvement_needed}
                        </Text>
                      </Flex>
                      <Text>There is room for improvement in this area.</Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </SimpleGrid>
            
            {/* Eğitim Önerileri */}
            <Card bg={boxBg} boxShadow="md" mb={5}>
              <CardHeader>
                <Heading size="md">Education Recommendations</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {employeeData.recommendations.map((rec, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                      <Flex align="center" mb={2}>
                        <Badge colorScheme={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'} mr={2}>
                          {rec.priority === 'high' ? 'High' : rec.priority === 'medium' ? 'Medium' : 'Low'} Priority
                        </Badge>
                        <Text fontWeight="bold">{rec.suggestion}</Text>
                      </Flex>
                      <Text color="gray.600">{rec.reason}</Text>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </Box>
    );
  };

  // Admin dashboard bileşeni
  const renderAdminDashboard = () => {
    if (!adminData) return null;
    
    // Departman istatistikleri için veri hazırlama
    const departmentNames = Object.keys(adminData.department_statistics);
    const taskCompletionRates = departmentNames.map(dept => 
      adminData.department_statistics[dept].avg_task_completion * 100
    );
    const emailResponseRates = departmentNames.map(dept => 
      adminData.department_statistics[dept].avg_email_response * 100
    );
    
    const departmentChart = {
      labels: departmentNames,
      datasets: [
        {
          label: 'Task Completion Rate (%)',
          data: taskCompletionRates,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderWidth: 2,
        },
        {
          label: 'Email Response Rate (%)',
          data: emailResponseRates,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    };

    const chartOptions = {
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        }
      },
      maintainAspectRatio: false,
      responsive: true
    };
    
    return (
      <Box width="100%" minWidth="100%" p={5}>
        <Box width="100%" minWidth="100%">
          <VStack spacing={8} align="stretch" width="100%">
            <Flex justifyContent="space-between" alignItems="center" mb={5} width="100%">
              <Heading size="lg">Company Overview</Heading>
              <Button 
                leftIcon={<DownloadIcon />} 
                colorScheme="blue"
                onClick={handleGenerateAllReports}
              >
                Generate All Reports
              </Button>
            </Flex>
          
            {/* Company Summary Metrics */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Employees</StatLabel>
                    <StatNumber>{adminData.total_employees}</StatNumber>
                    <StatHelpText>Active employees</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Department Count</StatLabel>
                    <StatNumber>{departmentNames.length}</StatNumber>
                    <StatHelpText>All departments</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg={boxBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Average Performance</StatLabel>
                    <StatNumber>
                      {Math.round(taskCompletionRates.reduce((a, b) => a + b, 0) / taskCompletionRates.length)}%
                    </StatNumber>
                    <StatHelpText>Task completion rate</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Department Performance Charts */}
            <Card bg={boxBg} boxShadow="md" mb={8}>
              <CardHeader>
                <Heading size="md">Department Performance Comparison</Heading>
              </CardHeader>
              <CardBody>
                <Box h="500px" w="100%" display="flex" justifyContent="center" alignItems="center">
                  <Box w="80%" h="100%">
                    <Radar data={departmentChart} options={chartOptions} />
                  </Box>
                </Box>
              </CardBody>
            </Card>
            
            {/* Department Details */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
              {departmentNames.map((dept) => (
                <Card key={dept} bg={boxBg} boxShadow="md">
                  <CardHeader>
                    <Heading size="md">{dept}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={2}>
                      <Flex justify="space-between">
                        <Text>Task Completion:</Text>
                        <Text fontWeight="bold">
                          {Math.round(adminData.department_statistics[dept].avg_task_completion * 100)}%
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text>Email Efficiency:</Text>
                        <Text fontWeight="bold">
                          {Math.round(adminData.department_statistics[dept].avg_email_response * 100)}%
                        </Text>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
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
    <Box width="100%" maxWidth="100%" height="auto">
      <Box width="100%" maxWidth="100%">
        {isAdmin ? renderAdminDashboard() : renderEmployeeDashboard()}
      </Box>
    </Box>
  );
};

export default Dashboard; 