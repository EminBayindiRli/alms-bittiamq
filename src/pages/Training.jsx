import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Divider,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Link,
  Avatar,
  Tooltip,
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon, StarIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { EmployeeService, AdminService } from '../services/api';

// Sahte Microsoft Learn kursları
const DEMO_COURSES = {
  "time_management": [
    { id: 1, title: "Time Management Fundamentals", duration: "1.5 hours", modules: 5, difficulty: "Beginner", url: "#", completed: true },
    { id: 2, title: "Prioritization Techniques", duration: "2 hours", modules: 7, difficulty: "Intermediate", url: "#", completed: false },
    { id: 3, title: "Pomodoro and Other Time Techniques", duration: "1 hour", modules: 4, difficulty: "Beginner", url: "#", completed: false },
  ],
  "communication": [
    { id: 4, title: "Effective Communication Skills", duration: "3 hours", modules: 8, difficulty: "Intermediate", url: "#", completed: false },
    { id: 5, title: "Email Management and Communication", duration: "1.5 hours", modules: 5, difficulty: "Beginner", url: "#", completed: true },
    { id: 6, title: "Managing Difficult Conversations", duration: "2.5 hours", modules: 6, difficulty: "Advanced", url: "#", completed: false },
  ],
  "collaboration": [
    { id: 7, title: "Team Collaboration Fundamentals", duration: "2 hours", modules: 6, difficulty: "Beginner", url: "#", completed: false },
    { id: 8, title: "Effective Collaboration with Microsoft Teams", duration: "1.5 hours", modules: 5, difficulty: "Intermediate", url: "#", completed: false },
    { id: 9, title: "Digital Collaboration Tools", duration: "2 hours", modules: 7, difficulty: "Intermediate", url: "#", completed: false },
  ],
  "productivity": [
    { id: 10, title: "Personal Productivity and Focus", duration: "2.5 hours", modules: 8, difficulty: "Intermediate", url: "#", completed: true },
    { id: 11, title: "Productivity with Microsoft 365", duration: "3 hours", modules: 10, difficulty: "Intermediate", url: "#", completed: false },
    { id: 12, title: "Note Taking Systems for Productivity", duration: "1 hour", modules: 4, difficulty: "Beginner", url: "#", completed: false },
  ]
};

const Training = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeRecommendations, setEmployeeRecommendations] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState({});
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          const data = await AdminService.getAllAnalyses();
          setAdminData(data);

          // Tüm çalışanlar için mock veri
          setAllEmployees([
            { id: '1', name: 'Ali Yılmaz', department: 'Product Development', team: 'Team-2' },
            { id: '2', name: 'Ayşe Kaya', department: 'Sales', team: 'Team-1' },
            { id: '3', name: 'Mehmet Öz', department: 'HR', team: 'Team-3' },
            { id: '4', name: 'Zeynep Demir', department: 'Product Development', team: 'Team-2' },
            { id: '5', name: 'Mustafa Şahin', department: 'Sales', team: 'Team-1' },
          ]);
          
          // Atanmış kurslar için boş bir nesne oluştur
          const initialAssignedCourses = {};
          allEmployees.forEach(emp => {
            initialAssignedCourses[emp.id] = [];
          });
          setAssignedCourses(initialAssignedCourses);
        } else {
          // Çalışan verilerini yükle
          const employeeId = user?.id || '1';
          const data = await EmployeeService.getEmployeeAnalysis(employeeId);
          setEmployeeData(data);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);
  
  // Çalışan seçildiğinde önerileri getir
  useEffect(() => {
    const fetchEmployeeRecommendations = async () => {
      if (selectedEmployee) {
        try {
          // Seçilen çalışanın verilerini getir
          const data = await EmployeeService.getEmployeeAnalysis(selectedEmployee);
          if (data && data.recommendations) {
            setEmployeeRecommendations(data.recommendations);
          }
        } catch (err) {
          console.error('Çalışan önerileri yüklenirken hata:', err);
          setEmployeeRecommendations([]);
        }
      } else {
        setEmployeeRecommendations([]);
      }
    };
    
    fetchEmployeeRecommendations();
  }, [selectedEmployee]);

  // Eğitim tamamlandı işlevleri
  const handleCompleteTraining = (courseId) => {
    toast({
      title: "Training Completed",
      description: "You have successfully completed the training and it has been saved to the system.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Admin tarafından eğitim atama işlevi
  const handleAssignTraining = (course, employeeId) => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Please select an employee first.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Atanmış kursları güncelle
    setAssignedCourses(prev => {
      const updatedCourses = { ...prev };
      if (!updatedCourses[employeeId]) {
        updatedCourses[employeeId] = [];
      }
      
      // Kurs zaten atanmış mı kontrol et
      const alreadyAssigned = updatedCourses[employeeId].some(c => c.id === course.id);
      if (!alreadyAssigned) {
        updatedCourses[employeeId].push(course);
      }
      
      return updatedCourses;
    });
    
    // Başarı mesajı göster
    const employeeName = allEmployees.find(e => e.id === employeeId)?.name || 'Employee';
    toast({
      title: "Training Assigned",
      description: `"${course.title}" training has been successfully assigned to ${employeeName}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Eğitim ilerlemesini görselleştirme işlevi
  const getProgressColor = (value) => {
    if (value < 30) return "red";
    if (value < 70) return "yellow";
    return "green";
  };

  // Çalışan eğitim görünümü
  const renderEmployeeTraining = () => {
    if (!employeeData) return null;

    // Önerilen kurslar
    const recommendedCourses = employeeData.recommendations || [];
    
    // Atanan kurslar (gerçek uygulamada API'den gelecek)
    const assignedCourses = recommendedCourses.filter(course => course.priority === 'high');

    return (
      <Box p={5}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Training Recommendations</Heading>
            <Text color="gray.600" mb={6}>
              Specially selected training recommendations and assigned courses based on your performance analysis.
            </Text>
          </Box>

          {/* Training Statistics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
              <StatLabel>Completed Courses</StatLabel>
              <StatNumber>2</StatNumber>
              <StatHelpText>Last 30 days</StatHelpText>
              <Progress value={40} colorScheme="green" size="sm" mt={2} />
            </Stat>
            <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
              <StatLabel>Assigned Courses</StatLabel>
              <StatNumber>{assignedCourses.length}</StatNumber>
              <StatHelpText>Pending completion</StatHelpText>
              <Progress value={60} colorScheme="blue" size="sm" mt={2} />
            </Stat>
            <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
              <StatLabel>Total Training Hours</StatLabel>
              <StatNumber>12.5</StatNumber>
              <StatHelpText>This month</StatHelpText>
              <Progress value={70} colorScheme="purple" size="sm" mt={2} />
            </Stat>
          </SimpleGrid>

          {/* Assigned Courses */}
          <Box>
            <Heading size="md" mb={4}>Assigned Courses</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {assignedCourses.length > 0 ? (
                assignedCourses.map(course => (
                  <Card key={course.suggestion} bg={cardBg}>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <Flex justifyContent="space-between" width="100%">
                          <Badge colorScheme="red">High Priority</Badge>
                          <Badge colorScheme="blue">Assigned</Badge>
                        </Flex>
                        <Heading size="sm">{course.suggestion}</Heading>
                        <Text fontSize="sm">{course.reason}</Text>
                        <HStack>
                          <Icon as={TimeIcon} />
                          <Text fontSize="sm">{course.course?.duration || '2 hours'}</Text>
                          <Icon as={StarIcon} />
                          <Text fontSize="sm">{course.course?.difficulty || 'Intermediate'}</Text>
                        </HStack>
                        <Link href={course.link} isExternal color="blue.500" width="100%">
                          <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue" size="sm" width="100%">
                            View on Microsoft Learn
                          </Button>
                        </Link>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Box p={5} textAlign="center" width="100%">
                  <Text>No courses assigned yet.</Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>

          {/* Recommended Courses */}
          <Box>
            <Heading size="md" mb={4}>Recommended Courses</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {recommendedCourses
                .filter(course => course.priority !== 'high')
                .map(course => (
                  <Card key={course.suggestion} bg={cardBg}>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <Badge colorScheme={course.priority === 'medium' ? 'orange' : 'green'}>
                          {course.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                        </Badge>
                        <Heading size="sm">{course.suggestion}</Heading>
                        <Text fontSize="sm">{course.reason}</Text>
                        <HStack>
                          <Icon as={TimeIcon} />
                          <Text fontSize="sm">{course.course?.duration || '2 hours'}</Text>
                          <Icon as={StarIcon} />
                          <Text fontSize="sm">{course.course?.difficulty || 'Intermediate'}</Text>
                        </HStack>
                        <Link href={course.link} isExternal color="blue.500" width="100%">
                          <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue" size="sm" width="100%">
                            View on Microsoft Learn
                          </Button>
                        </Link>
                        <Button 
                          colorScheme="green" 
                          size="sm" 
                          width="100%" 
                          leftIcon={<CheckCircleIcon />}
                          onClick={() => handleCompleteTraining(course.id)}
                        >
                          Mark as Completed
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
            </SimpleGrid>
          </Box>

          {/* Popular Courses */}
          <Box>
            <Heading size="md" mb={4}>Popular Microsoft Learn Courses</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Badge colorScheme="purple">Most Popular</Badge>
                    <Heading size="sm">Microsoft 365 Fundamentals</Heading>
                    <Text fontSize="sm">Learn to use Microsoft 365 applications effectively.</Text>
                    <HStack>
                      <Icon as={TimeIcon} />
                      <Text fontSize="sm">3 hours</Text>
                      <Icon as={StarIcon} />
                      <Text fontSize="sm">Beginner</Text>
                    </HStack>
                    <Link href="https://learn.microsoft.com/en-us/training/paths/m365-productivity-teamwork/" isExternal color="blue.500" width="100%">
                      <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue" size="sm" width="100%">
                        View on Microsoft Learn
                      </Button>
                    </Link>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Badge colorScheme="teal">New</Badge>
                    <Heading size="sm">Data Analysis with Power BI</Heading>
                    <Text fontSize="sm">Improve your data visualization and analysis skills with Power BI.</Text>
                    <HStack>
                      <Icon as={TimeIcon} />
                      <Text fontSize="sm">4 hours</Text>
                      <Icon as={StarIcon} />
                      <Text fontSize="sm">Intermediate</Text>
                    </HStack>
                    <Link href="https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/" isExternal color="blue.500" width="100%">
                      <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue" size="sm" width="100%">
                        View on Microsoft Learn
                      </Button>
                    </Link>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card bg={cardBg}>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Badge colorScheme="orange">Trending</Badge>
                    <Heading size="sm">Collaboration with Microsoft Teams</Heading>
                    <Text fontSize="sm">Learn how to improve team collaboration and communication with Teams.</Text>
                    <HStack>
                      <Icon as={TimeIcon} />
                      <Text fontSize="sm">2.5 hours</Text>
                      <Icon as={StarIcon} />
                      <Text fontSize="sm">Beginner</Text>
                    </HStack>
                    <Link href="https://learn.microsoft.com/en-us/training/modules/intro-to-microsoft-teams/" isExternal color="blue.500" width="100%">
                      <Button rightIcon={<ExternalLinkIcon />} colorScheme="blue" size="sm" width="100%">
                        View on Microsoft Learn
                      </Button>
                    </Link>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>
    );
  };

  // Admin eğitim yönetimi
  const renderAdminTraining = () => {
    if (!adminData) return null;

    // Kategorilere göre tamamlanma oranları
    const completionRates = {
      'Communication': 45,
      'Time Management': 65,
      'Collaboration': 30,
      'Productivity': 55,
      'Technical Skills': 70,
      'Leadership': 25
    };

    // Çalışanların eğitim tamamlama oranları
    const employeeCompletionRates = [
      { id: '1', name: 'Ali Yılmaz', completed: 5, assigned: 8, rate: 62.5 },
      { id: '2', name: 'Ayşe Kaya', completed: 3, assigned: 10, rate: 30 },
      { id: '3', name: 'Mehmet Öz', completed: 7, assigned: 7, rate: 100 },
      { id: '4', name: 'Zeynep Demir', completed: 2, assigned: 6, rate: 33.3 },
      { id: '5', name: 'Mustafa Şahin', completed: 4, assigned: 9, rate: 44.4 },
    ];

    return (
      <Box p={5}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="lg" mb={4}>Training Management</Heading>
            <Text color="gray.600" mb={6}>
              You can view all training activities and completion rates of employees in the company.
            </Text>
          </Box>

          {/* Training Completion Statistics */}
          <Box>
            <Heading size="md" mb={4}>Training Completion Statistics</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Average Completion Rate</StatLabel>
                <StatNumber>54%</StatNumber>
                <StatHelpText>All Company</StatHelpText>
                <Progress value={54} colorScheme="blue" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Total Completed Courses</StatLabel>
                <StatNumber>87</StatNumber>
                <StatHelpText>Last 6 months</StatHelpText>
                <Progress value={70} colorScheme="green" size="sm" mt={2} />
              </Stat>
              <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
                <StatLabel>Pending Assigned Courses</StatLabel>
                <StatNumber>34</StatNumber>
                <StatHelpText>Incomplete</StatHelpText>
                <Progress value={40} colorScheme="orange" size="sm" mt={2} />
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Category-Based Training Completion */}
          <Box>
            <Heading size="md" mb={4}>Category-Based Training Completion</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {Object.entries(completionRates).map(([category, rate]) => (
                <Card key={category} bg={cardBg}>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Heading size="sm">{category}</Heading>
                      <Progress 
                        value={rate} 
                        colorScheme={getProgressColor(rate)} 
                        size="sm" 
                        borderRadius="md"
                      />
                      <Flex justifyContent="space-between">
                        <Text fontSize="sm" fontWeight="bold">{rate}%</Text>
                        <Text fontSize="xs" color="gray.500">Completion Rate</Text>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Employee Training Tracking */}
          <Box mt={5}>
            <Heading size="md" mb={4}>Employee Training Tracking</Heading>
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={5} align="stretch">
                  {employeeCompletionRates.map(employee => (
                    <Box key={employee.id}>
                      <Flex justifyContent="space-between" mb={2}>
                        <Text fontWeight="medium">{employee.name}</Text>
                        <HStack spacing={4}>
                          <Text fontSize="sm">{employee.completed}/{employee.assigned} Course</Text>
                          <Text fontWeight="bold" color={getProgressColor(employee.rate)}>
                            {employee.rate.toFixed(1)}%
                          </Text>
                        </HStack>
                      </Flex>
                      <Progress 
                        value={employee.rate} 
                        colorScheme={getProgressColor(employee.rate)} 
                        size="sm" 
                        borderRadius="md"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Training Assignment Section */}
          <Box mt={5}>
            <Heading size="md" mb={4}>Training Assignment</Heading>
            <Card bg={cardBg}>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">Employee-Specific Recommendations</Heading>
                    <Divider />
                    
                    <Select 
                      placeholder="Select Employee" 
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      mb={3}
                    >
                      {allEmployees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.department}
                        </option>
                      ))}
                    </Select>
                    
                    {selectedEmployee ? (
                      employeeRecommendations.length > 0 ? (
                        employeeRecommendations.map(recommendation => (
                          <Flex 
                            key={recommendation.suggestion} 
                            justifyContent="space-between" 
                            alignItems="center" 
                            p={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                            mb={2}
                          >
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Text fontWeight="medium" fontSize="sm">{recommendation.suggestion}</Text>
                                <Badge colorScheme={recommendation.priority === 'high' ? 'red' : recommendation.priority === 'medium' ? 'orange' : 'green'}>
                                  {recommendation.priority === 'high' ? 'High' : recommendation.priority === 'medium' ? 'Medium' : 'Low'}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">{recommendation.reason}</Text>
                              <Link href={recommendation.link} isExternal fontSize="xs" color="blue.500">
                                Microsoft Learn <ExternalLinkIcon mx="2px" />
                              </Link>
                            </VStack>
                            <Button 
                              size="sm" 
                              colorScheme="blue"
                              onClick={() => handleAssignTraining(recommendation.course, selectedEmployee)}
                            >
                              Assign
                            </Button>
                          </Flex>
                        ))
                      ) : (
                        <Box p={4} textAlign="center">
                          <Text>No training recommendations available for this employee.</Text>
                        </Box>
                      )
                    ) : (
                      <Box p={4} textAlign="center">
                        <Text>Select an employee to view recommendations.</Text>
                      </Box>
                    )}
                  </VStack>

                  <VStack align="stretch" spacing={3}>
                    <Heading size="sm">Assigned Courses</Heading>
                    <Divider />
                    
                    {selectedEmployee ? (
                      assignedCourses[selectedEmployee] && assignedCourses[selectedEmployee].length > 0 ? (
                        assignedCourses[selectedEmployee].map(course => (
                          <Flex 
                            key={course.id} 
                            justifyContent="space-between" 
                            alignItems="center" 
                            p={3} 
                            borderWidth="1px" 
                            borderRadius="md"
                            mb={2}
                          >
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" fontSize="sm">{course.title}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {course.duration} • {course.difficulty}
                              </Text>
                              <Link href={course.url} isExternal fontSize="xs" color="blue.500">
                                Microsoft Learn <ExternalLinkIcon mx="2px" />
                              </Link>
                            </VStack>
                            <Badge colorScheme="green">Assigned</Badge>
                          </Flex>
                        ))
                      ) : (
                        <Box p={4} textAlign="center">
                          <Text>No course assigned to this employee yet.</Text>
                        </Box>
                      )
                    ) : (
                      <Box p={4} textAlign="center">
                        <Text>Select an employee to view assigned courses.</Text>
                      </Box>
                    )}
                  </VStack>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>
        </VStack>
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
    <Box>
      {isAdmin() ? renderAdminTraining() : renderEmployeeTraining()}
    </Box>
  );
};

export default Training; 