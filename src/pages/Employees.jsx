import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Icon,
  Avatar,
  Tag,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  DownloadIcon, 
  EmailIcon, 
  PhoneIcon,
  StarIcon,
  TimeIcon,
  InfoIcon
} from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { AdminService, EmployeeService } from '../services/api';

// Sahte çalışan verileri
const DEMO_EMPLOYEES = [
  { 
    id: '1', 
    name: 'Ali Yılmaz', 
    email: 'ali.yilmaz@alms-system.com', 
    phone: '(555) 123-4567',
    department: 'Product Development', 
    team: 'Team-2',
    position: 'Senior Developer',
    hireDate: '2020-05-12',
    manager: 'Mehmet Demir',
    performanceScore: 85,
    status: 'active',
    lastActivityDate: '2023-09-15',
    completedTrainings: 12,
    assignedTrainings: 15,
    strengths: ['JavaScript', 'React', 'Team Collaboration'],
    improvementAreas: ['Time Management', 'Documentation'],
    segment: 'High Performer'
  },
  { 
    id: '2', 
    name: 'Ayşe Kaya', 
    email: 'ayse.kaya@alms-system.com', 
    phone: '(555) 234-5678',
    department: 'Sales', 
    team: 'Team-1',
    position: 'Sales Representative',
    hireDate: '2021-03-18',
    manager: 'Mehmet Demir',
    performanceScore: 78,
    status: 'active',
    lastActivityDate: '2023-09-14',
    completedTrainings: 8,
    assignedTrainings: 10,
    strengths: ['Customer Relations', 'Presentation Skills'],
    improvementAreas: ['Product Knowledge', 'Email Efficiency'],
    segment: 'Solid Performer'
  },
  { 
    id: '3', 
    name: 'Mehmet Öz', 
    email: 'mehmet.oz@alms-system.com', 
    phone: '(555) 345-6789',
    department: 'HR', 
    team: 'Team-3',
    position: 'HR Specialist',
    hireDate: '2019-11-05',
    manager: 'Mehmet Demir',
    performanceScore: 92,
    status: 'active',
    lastActivityDate: '2023-09-16',
    completedTrainings: 18,
    assignedTrainings: 20,
    strengths: ['Interpersonal Skills', 'Conflict Resolution', 'Training'],
    improvementAreas: ['Technical Knowledge'],
    segment: 'High Performer'
  },
  { 
    id: '4', 
    name: 'Zeynep Demir', 
    email: 'zeynep.demir@alms-system.com', 
    phone: '(555) 456-7890',
    department: 'Product Development', 
    team: 'Team-2',
    position: 'UX Designer',
    hireDate: '2022-01-10',
    manager: 'Mehmet Demir',
    performanceScore: 75,
    status: 'active',
    lastActivityDate: '2023-09-10',
    completedTrainings: 5,
    assignedTrainings: 8,
    strengths: ['UI Design', 'User Research'],
    improvementAreas: ['Meeting Efficiency', 'Communication'],
    segment: 'New Talent'
  },
  { 
    id: '5', 
    name: 'Mustafa Şahin', 
    email: 'mustafa.sahin@alms-system.com', 
    phone: '(555) 567-8901',
    department: 'Sales', 
    team: 'Team-1',
    position: 'Account Manager',
    hireDate: '2020-09-22',
    manager: 'Mehmet Demir',
    performanceScore: 80,
    status: 'active',
    lastActivityDate: '2023-09-13',
    completedTrainings: 10,
    assignedTrainings: 12,
    strengths: ['Account Management', 'Negotiation'],
    improvementAreas: ['Follow-up Consistency', 'Email Response Time'],
    segment: 'Solid Performer'
  },
];

// Performance skoruna göre renk belirleme
const getPerformanceColor = (score) => {
  if (score >= 90) return "green";
  if (score >= 75) return "blue";
  if (score >= 60) return "yellow";
  return "red";
};

// Segment türüne göre badge rengi
const getSegmentColor = (segment) => {
  switch (segment) {
    case 'High Performer':
      return 'green';
    case 'Solid Performer':
      return 'blue';
    case 'Needs Improvement':
      return 'orange';
    case 'At Risk':
      return 'red';
    case 'New Talent':
      return 'purple';
    default:
      return 'gray';
  }
};

const Employees = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [employeeAnalysis, setEmployeeAnalysis] = useState(null);
  const [employeeAnalysisLoading, setEmployeeAnalysisLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const tableBg = useColorModeValue('white', 'gray.800');
  const oddRowBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin()) {
          // Admin verilerini yükle
          const allEmployeesData = DEMO_EMPLOYEES;
          setEmployees(allEmployeesData);
        } else {
          // Admin değilse bu sayfaya erişim yok
          setError('You do not have permission to access this page.');
        }
      } catch (err) {
        console.error('Data loading error:', err);
        setError('There was a problem loading the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  // Sıralama fonksiyonu
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sıralanmış çalışanlar
  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Arama sonuçları
  const filteredEmployees = sortedEmployees.filter(
    employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Çalışan detaylarını görüntüleme
  const viewEmployeeDetails = async (employee) => {
    setSelectedEmployee(employee);
    setEmployeeAnalysisLoading(true);
    
    try {
      // Çalışan analiz verilerini getir
      const analysisData = await EmployeeService.getAnalysis(employee.id);
      setEmployeeAnalysis(analysisData);
    } catch (error) {
      console.error("Çalışan analizi yüklenirken hata:", error);
      toast({
        title: "Veri Yükleme Hatası",
        description: "Çalışan analizi yüklenirken bir sorun oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setEmployeeAnalysisLoading(false);
      onOpen();
    }
  };

  // Rapor indirme fonksiyonu
  const downloadEmployeeReport = async (employeeId) => {
    try {
      const reportBlob = await EmployeeService.getReport(employeeId);
      
      // PDF'i indir
      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_${employeeId}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Rapor İndirildi',
        description: 'Çalışan raporu başarıyla indirildi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Rapor indirme hatası:", error);
      toast({
        title: "İndirme Hatası",
        description: "Rapor indirilirken bir sorun oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Çalışan metrik kartı
  const renderMetricCard = (title, value, secondaryInfo, icon, color) => (
    <Card bg={cardBg} shadow="sm">
      <CardBody>
        <Flex align="center">
          <Box 
            bg={`${color}.50`} 
            color={`${color}.500`} 
            p={3} 
            borderRadius="full" 
            mr={4}
          >
            <Icon as={icon} boxSize={5} />
          </Box>
          <Box>
            <Text color="gray.500" fontSize="sm">{title}</Text>
            <Text fontSize="2xl" fontWeight="bold">{value}</Text>
            {secondaryInfo && (
              <Text fontSize="xs" color="gray.500">{secondaryInfo}</Text>
            )}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );

  // Çalışan İstatistikleri
  const employeeStats = {
    'High Performer': 2,
    'Solid Performer': 2,
    'New Talent': 1,
    'Needs Improvement': 0,
    'At Risk': 0
  };

  // Departman İstatistikleri
  const departmentStats = {
    'Product Development': 2,
    'Sales': 2,
    'HR': 1
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
          Erişim Hatası
        </Text>
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <Box width="100%" maxWidth="100%" p={5}>
      <VStack spacing={8} align="stretch">
        {/* Başlık ve Arama */}
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Employee Management</Heading>
            <Text color="gray.600">
              Detailed analysis and performance data of all employees
            </Text>
          </Box>
          <Box>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search employee..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>
        </Flex>

        {/* Özet İstatistikler */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Total Employees</StatLabel>
            <StatNumber>{employees.length}</StatNumber>
            <StatHelpText>Active: {employees.filter(e => e.status === 'active').length}</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Average Performance</StatLabel>
            <StatNumber>
              {Math.round(employees.reduce((sum, emp) => sum + emp.performanceScore, 0) / employees.length)}%
            </StatNumber>
            <StatHelpText>All employees</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Training Completion</StatLabel>
            <StatNumber>
              {Math.round(employees.reduce((sum, emp) => sum + emp.completedTrainings, 0) / 
                employees.reduce((sum, emp) => sum + emp.assignedTrainings, 0) * 100)}%
            </StatNumber>
            <StatHelpText>Average</StatHelpText>
          </Stat>

          <Stat bg={cardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>High Performance</StatLabel>
            <StatNumber>
              {employees.filter(emp => emp.performanceScore >= 85).length}
            </StatNumber>
            <StatHelpText>Number of employees</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Çalışan Segment ve Departman Analizi */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Segment Dağılımı */}
          <Card>
            <CardHeader>
              <Heading size="md">Employee Segment Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {Object.entries(employeeStats).map(([segment, count]) => (
                  <Flex key={segment} justify="space-between" align="center">
                    <HStack>
                      <Badge colorScheme={getSegmentColor(segment)}>{segment}</Badge>
                      <Text>{count} employees</Text>
                    </HStack>
                    <Progress 
                      value={(count / employees.length) * 100} 
                      colorScheme={getSegmentColor(segment)} 
                      size="sm" 
                      width="150px"
                    />
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Departman Dağılımı */}
          <Card>
            <CardHeader>
              <Heading size="md">Department Distribution</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {Object.entries(departmentStats).map(([dept, count]) => (
                  <Flex key={dept} justify="space-between" align="center">
                    <Text>{dept}</Text>
                    <HStack spacing={4}>
                      <Text>{count} employees</Text>
                      <Progress 
                        value={(count / employees.length) * 100} 
                        colorScheme="blue" 
                        size="sm" 
                        width="150px"
                      />
                    </HStack>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Çalışan Tablosu */}
        <Box overflowX="auto">
          <Table bg={tableBg} variant="simple" borderRadius="md" boxShadow="sm">
            <Thead>
              <Tr>
                <Th cursor="pointer" onClick={() => requestSort('name')}>
                  <Flex align="center">
                    Employee
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th cursor="pointer" onClick={() => requestSort('department')}>
                  <Flex align="center">
                    Department
                    {sortConfig.key === 'department' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th cursor="pointer" onClick={() => requestSort('team')}>
                  <Flex align="center">
                    Team
                    {sortConfig.key === 'team' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th cursor="pointer" onClick={() => requestSort('performanceScore')}>
                  <Flex align="center">
                    Performance
                    {sortConfig.key === 'performanceScore' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th cursor="pointer" onClick={() => requestSort('lastActivityDate')}>
                  <Flex align="center">
                    Last Activity
                    {sortConfig.key === 'lastActivityDate' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th cursor="pointer" onClick={() => requestSort('segment')}>
                  <Flex align="center">
                    Segment
                    {sortConfig.key === 'segment' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUpIcon ml={1} /> 
                        : <ChevronDownIcon ml={1} />
                    )}
                  </Flex>
                </Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees.map((employee, index) => (
                <Tr key={employee.id} bg={index % 2 === 1 ? oddRowBg : 'transparent'}>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" name={employee.name} mr={2} />
                      <Box>
                        <Text fontWeight="medium">{employee.name}</Text>
                        <Text fontSize="xs" color="gray.500">{employee.position}</Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td>{employee.department}</Td>
                  <Td>{employee.team}</Td>
                  <Td>
                    <Box>
                      <Text fontWeight="bold" color={getPerformanceColor(employee.performanceScore)}>
                        {employee.performanceScore}%
                      </Text>
                      <Progress 
                        value={employee.performanceScore} 
                        colorScheme={getPerformanceColor(employee.performanceScore)} 
                        size="xs" 
                        mt={1}
                      />
                    </Box>
                  </Td>
                  <Td>{employee.lastActivityDate}</Td>
                  <Td>
                    <Badge colorScheme={getSegmentColor(employee.segment)}>
                      {employee.segment}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        onClick={() => viewEmployeeDetails(employee)}
                      >
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        leftIcon={<DownloadIcon />} 
                        onClick={() => downloadEmployeeReport(employee.id)}
                      >
                        Report
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {filteredEmployees.length === 0 && (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    <Text color="gray.500">Arama kriterlerine uygun çalışan bulunamadı.</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Çalışan Detay Modalı */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            {selectedEmployee && (
              <>
                <ModalHeader>
                  <Flex align="center">
                    <Avatar name={selectedEmployee.name} size="sm" mr={2} />
                    <Text>{selectedEmployee.name}</Text>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {employeeAnalysisLoading ? (
                    <Flex justify="center" py={10}>
                      <Spinner />
                    </Flex>
                  ) : (
                    <Tabs isFitted variant="enclosed">
                      <TabList mb="1em">
                        <Tab>General Information</Tab>
                        <Tab>Performance</Tab>
                        <Tab>Trainings</Tab>
                      </TabList>
                      <TabPanels>
                        {/* Genel Bilgiler */}
                        <TabPanel>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Department</Text>
                              <Text>{selectedEmployee.department}</Text>
                            </Box>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Team</Text>
                              <Text>{selectedEmployee.team}</Text>
                            </Box>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Position</Text>
                              <Text>{selectedEmployee.position}</Text>
                            </Box>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Hire Date</Text>
                              <Text>{selectedEmployee.hireDate}</Text>
                            </Box>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Manager</Text>
                              <Text>{selectedEmployee.manager}</Text>
                            </Box>
                            <Box>
                              <Text color="gray.500" fontSize="sm">Segment</Text>
                              <Badge colorScheme={getSegmentColor(selectedEmployee.segment)}>
                                {selectedEmployee.segment}
                              </Badge>
                            </Box>
                          </SimpleGrid>

                          <Divider my={4} />

                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box>
                              <Text fontWeight="medium" mb={2}>Contact Information</Text>
                              <HStack>
                                <EmailIcon color="blue.500" />
                                <Text>{selectedEmployee.email}</Text>
                              </HStack>
                              <HStack mt={2}>
                                <PhoneIcon color="green.500" />
                                <Text>{selectedEmployee.phone}</Text>
                              </HStack>
                            </Box>
                            <Box>
                              <Text fontWeight="medium" mb={2}>Strengths</Text>
                              <HStack flexWrap="wrap" gap={2}>
                                {selectedEmployee.strengths.map(strength => (
                                  <Tag key={strength} colorScheme="green" size="sm">
                                    {strength}
                                  </Tag>
                                ))}
                              </HStack>

                              <Text fontWeight="medium" mt={4} mb={2}>Improvement Areas</Text>
                              <HStack flexWrap="wrap" gap={2}>
                                {selectedEmployee.improvementAreas.map(area => (
                                  <Tag key={area} colorScheme="orange" size="sm">
                                    {area}
                                  </Tag>
                                ))}
                              </HStack>
                            </Box>
                          </SimpleGrid>
                        </TabPanel>

                        {/* Performans Bilgileri */}
                        <TabPanel>
                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                            {renderMetricCard(
                              "Performance Score", 
                              `${selectedEmployee.performanceScore}%`, 
                              "Last 30 days", 
                              StarIcon, 
                              getPerformanceColor(selectedEmployee.performanceScore)
                            )}
                            {renderMetricCard(
                              "Training Completion", 
                              `${Math.round((selectedEmployee.completedTrainings / selectedEmployee.assignedTrainings) * 100)}%`, 
                              `${selectedEmployee.completedTrainings}/${selectedEmployee.assignedTrainings} course`, 
                              InfoIcon, 
                              "blue"
                            )}
                            {renderMetricCard(
                              "Last Activity", 
                              selectedEmployee.lastActivityDate, 
                              "Daily activity", 
                              TimeIcon, 
                              "purple"
                            )}
                          </SimpleGrid>

                          {employeeAnalysis && (
                            <>
                              <Heading size="sm" mb={4}>Performance Metrics</Heading>
                              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {Object.entries(employeeAnalysis.current_metrics).map(([key, value]) => (
                                  <Box key={key} p={3} borderWidth="1px" borderRadius="md">
                                    <Flex justify="space-between">
                                      <Text fontSize="sm" fontWeight="medium">
                                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </Text>
                                      <Text fontWeight="bold">
                                        {Math.round(value * 100)}%
                                      </Text>
                                    </Flex>
                                    <Progress 
                                      value={value * 100} 
                                      colorScheme={value > 0.8 ? "green" : value > 0.6 ? "blue" : value > 0.4 ? "yellow" : "red"} 
                                      size="xs" 
                                      mt={2}
                                    />
                                  </Box>
                                ))}
                              </SimpleGrid>
                            </>
                          )}
                        </TabPanel>

                        {/* Eğitim Bilgileri */}
                        <TabPanel>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                            <Card>
                              <CardHeader>
                                <Heading size="sm">Completed Trainings</Heading>
                              </CardHeader>
                              <CardBody>
                                <VStack align="stretch" spacing={3}>
                                  {[...Array(selectedEmployee.completedTrainings)].map((_, index) => (
                                    <Flex 
                                      key={index} 
                                      p={2} 
                                      borderWidth="1px" 
                                      borderRadius="md" 
                                      justify="space-between" 
                                      align="center"
                                    >
                                      <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="medium">
                                          {[
                                            "Time Management Fundamentals",
                                            "Email Management and Communication",
                                            "Personal Productivity and Focus",
                                            "Sample Course " + (index + 4)
                                          ][index % 4]}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {["2 weeks ago", "1 month ago", "3 months ago", "6 months ago"][index % 4]}
                                        </Text>
                                      </VStack>
                                      <Badge colorScheme="green">Completed</Badge>
                                    </Flex>
                                  ))}
                                  {selectedEmployee.completedTrainings === 0 && (
                                    <Text color="gray.500">No training completed.</Text>
                                  )}
                                </VStack>
                              </CardBody>
                            </Card>

                            <Card>
                              <CardHeader>
                                <Heading size="sm">Ongoing Trainings</Heading>
                              </CardHeader>
                              <CardBody>
                                <VStack align="stretch" spacing={3}>
                                  {[...Array(selectedEmployee.assignedTrainings - selectedEmployee.completedTrainings)].map((_, index) => (
                                    <Flex 
                                      key={index} 
                                      p={2} 
                                      borderWidth="1px" 
                                      borderRadius="md" 
                                      justify="space-between" 
                                      align="center"
                                    >
                                      <VStack align="start" spacing={0}>
                                        <Text fontSize="sm" fontWeight="medium">
                                          {[
                                            "Effective Communication Skills",
                                            "Team Collaboration Basics",
                                            "Microsoft 365 Productivity",
                                            "Sample Course " + (index + 1)
                                          ][index % 4]}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {["40% completed", "25% completed", "10% completed", "5% completed"][index % 4]}
                                        </Text>
                                      </VStack>
                                      <Badge colorScheme="orange">Ongoing</Badge>
                                    </Flex>
                                  ))}
                                  {(selectedEmployee.assignedTrainings - selectedEmployee.completedTrainings) === 0 && (
                                    <Text color="gray.500">No ongoing training.</Text>
                                  )}
                                </VStack>
                              </CardBody>
                            </Card>
                          </SimpleGrid>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={() => downloadEmployeeReport(selectedEmployee.id)}>
                    Download Report
                  </Button>
                  <Button variant="ghost" onClick={onClose}>Close</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Employees; 