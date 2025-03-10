import { useState, useEffect } from 'react';
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
  Input,
  Select,
  FormControl,
  FormLabel,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Divider,
  Tag,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  DownloadIcon,
  CalendarIcon,
  RepeatIcon,
  ChevronDownIcon,
  EmailIcon,
  ViewIcon,
  TimeIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { FiFile, FiUsers, FiUserCheck, FiBarChart2, FiPieChart, FiTrendingUp, FiClock, FiFilter } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/api';

// Mock veri: Rapor türleri
const REPORT_TYPES = [
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Detailed analysis of employee performance metrics',
    icon: FiBarChart2,
    color: 'blue',
  },
  {
    id: 'activity',
    name: 'Activity Report',
    description: 'Time analysis of employee system activities',
    icon: FiClock,
    color: 'green',
  },
  {
    id: 'training',
    name: 'Training Report',
    description: 'Training completion rates and effectiveness',
    icon: FiUserCheck,
    color: 'purple',
  },
  {
    id: 'comparison',
    name: 'Comparison Report',
    description: 'Performance comparison between departments or teams',
    icon: FiTrendingUp,
    color: 'orange',
  },
  {
    id: 'summary',
    name: 'Summary Report',
    description: 'Overview of all system data',
    icon: FiPieChart,
    color: 'teal',
  }
];

// Mock veri: Oluşturulan raporlar
const GENERATED_REPORTS = [
  {
    id: '1',
    name: 'Q3 2023 Performance Report',
    type: 'performance',
    createdAt: '2023-09-30',
    createdBy: 'Ahmet Manager',
    size: '2.4 MB',
    status: 'completed',
    filters: {
      department: 'All',
      period: 'Q3 2023',
    }
  },
  {
    id: '2',
    name: 'Sales Team Activity Analysis',
    type: 'activity',
    createdAt: '2023-09-15',
    createdBy: 'Ahmet Manager',
    size: '1.8 MB',
    status: 'completed',
    filters: {
      department: 'Sales',
      period: 'Last 30 Days',
    }
  },
  {
    id: '3',
    name: 'Training Completion Report - 2023',
    type: 'training',
    createdAt: '2023-09-01',
    createdBy: 'System',
    size: '3.2 MB',
    status: 'completed',
    filters: {
      department: 'All',
      period: '2023 Year',
    }
  },
  {
    id: '4',
    name: 'Department Comparison Report',
    type: 'comparison',
    createdAt: '2023-08-15',
    createdBy: 'Ahmet Manager',
    size: '4.1 MB',
    status: 'completed',
    filters: {
      department: 'All',
      period: 'Last 90 Days',
    }
  },
  {
    id: '5',
    name: 'Monthly Summary Report - September 2023',
    type: 'summary',
    createdAt: '2023-09-30',
    createdBy: 'System',
    size: '1.5 MB',
    status: 'processing',
    filters: {
      department: 'All',
      period: 'September 2023',
    }
  }
];

// Mock veri: Programlanmış raporlar
const SCHEDULED_REPORTS = [
  {
    id: '1',
    name: 'Monthly Performance Summary',
    type: 'performance',
    frequency: 'Monthly',
    nextRunDate: '2023-10-01',
    recipients: ['management@alms-system.com', 'hr@alms-system.com'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Weekly Activity Report',
    type: 'activity',
    frequency: 'Weekly',
    nextRunDate: '2023-10-02',
    recipients: ['management@alms-system.com'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Quarterly Department Comparison',
    type: 'comparison',
    frequency: 'Quarterly',
    nextRunDate: '2023-12-31',
    recipients: ['management@alms-system.com', 'department_leads@alms-system.com'],
    status: 'active',
  }
];

// Mock veri: Departmanlar
const DEPARTMENTS = [
  { id: 'all', name: 'All' },
  { id: 'product_development', name: 'Product Development' },
  { id: 'sales', name: 'Sales' },
  { id: 'hr', name: 'HR' },
  { id: 'marketing', name: 'Marketing' },
];

// Mock veri: Takımlar
const TEAMS = [
  { id: 'all', name: 'All' },
  { id: 'team-1', name: 'Team-1' },
  { id: 'team-2', name: 'Team-2' },
  { id: 'team-3', name: 'Team-3' },
];

// Mock veri: Periyotlar
const PERIODS = [
  { id: 'last_7_days', name: 'Last 7 Days' },
  { id: 'last_30_days', name: 'Last 30 Days' },
  { id: 'last_90_days', name: 'Last 90 Days' },
  { id: 'current_month', name: 'Current Month' },
  { id: 'current_quarter', name: 'Current Quarter' },
  { id: 'current_year', name: 'Current Year' },
  { id: 'custom', name: 'Custom Date Range' },
];

// Rapor türüne göre renk belirleme
const getReportTypeColor = (type) => {
  const reportType = REPORT_TYPES.find(r => r.id === type);
  return reportType ? reportType.color : 'gray';
};

// Rapor türüne göre ikon belirleme
const getReportTypeIcon = (type) => {
  const reportType = REPORT_TYPES.find(r => r.id === type);
  return reportType ? reportType.icon : FiFile;
};

// Duruma göre badge rengi belirleme
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'processing':
      return 'orange';
    case 'failed':
      return 'red';
    case 'active':
      return 'blue';
    case 'inactive':
      return 'gray';
    default:
      return 'gray';
  }
};

const Reports = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeMetrics, setIncludeMetrics] = useState({
    performance: true,
    activity: true,
    training: true,
    communications: false,
  });
  const [reportName, setReportName] = useState('');
  const [generatedReports, setGeneratedReports] = useState(GENERATED_REPORTS);
  const [scheduledReports, setScheduledReports] = useState(SCHEDULED_REPORTS);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
            setGeneratedReports(GENERATED_REPORTS);
            setScheduledReports(SCHEDULED_REPORTS);
            setLoading(false);
          }, 1000);
        } else {
          // Admin değilse bu sayfaya erişim yok
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Veri yükleme hatası:', err);
        setError('Veri yüklenirken bir sorun oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const openReportCreationModal = (reportType) => {
    setSelectedReportType(reportType);
    setReportName(`New ${reportType.name} - ${new Date().toLocaleDateString('en-US')}`);
    onOpen();
  };

  const createReport = async () => {
    setIsCreatingReport(true);
    try {
      // Gerçek API isteği burada yapılacak
      // const response = await AdminService.createReport({
      //   name: reportName,
      //   type: selectedReportType.id,
      //   department: selectedDepartment,
      //   team: selectedTeam,
      //   period: selectedPeriod,
      //   startDate: startDate,
      //   endDate: endDate,
      //   includeMetrics,
      // });

      // Mock işlem
      setTimeout(() => {
        const newReport = {
          id: String(generatedReports.length + 1),
          name: reportName,
          type: selectedReportType.id,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'Ahmet Manager',
          size: '0 KB',
          status: 'processing',
          filters: {
            department: DEPARTMENTS.find(d => d.id === selectedDepartment)?.name || 'All',
            period: PERIODS.find(p => p.id === selectedPeriod)?.name || 'Custom',
          }
        };

        setGeneratedReports([newReport, ...generatedReports]);
        
        toast({
          title: 'Report Created',
          description: 'Report creation process started. The report will be downloadable once the process is completed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setIsCreatingReport(false);
        onClose();

        // Rapor işlenmesini simüle edelim
        setTimeout(() => {
          setGeneratedReports(prev => 
            prev.map(report => 
              report.id === newReport.id 
                ? { ...report, status: 'completed', size: '1.7 MB' } 
                : report
            )
          );
        }, 5000);

      }, 2000);
    } catch (error) {
      console.error("Report creation error:", error);
      toast({
        title: "Report Creation Error",
        description: "An error occurred while creating the report.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsCreatingReport(false);
    }
  };

  const downloadReport = async (reportId) => {
    try {
      // Gerçek API isteği
      // const reportBlob = await AdminService.downloadReport(reportId);
      
      // PDF'i indir
      toast({
        title: 'Report Downloading',
        description: 'Report download process started.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      // İndirme simülasyonu
      setTimeout(() => {
        toast({
          title: 'Report Downloaded',
          description: 'Report downloaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 2000);
    } catch (error) {
      console.error("Report download error:", error);
      toast({
        title: "Download Error",
        description: "An error occurred while downloading the report.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleScheduleStatusChange = (reportId, newStatus) => {
    setScheduledReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );

    toast({
      title: 'Status Updated',
      description: `Report status updated to "${newStatus}".`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteReport = (reportId) => {
    setGeneratedReports(prev => prev.filter(report => report.id !== reportId));
    
    toast({
      title: 'Report Deleted',
      description: 'Report deleted successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteSchedule = (scheduleId) => {
    setScheduledReports(prev => prev.filter(schedule => schedule.id !== scheduleId));
    
    toast({
      title: 'Scheduled Report Deleted',
      description: 'Scheduled report deleted successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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

  return (
    <Box width="100%" maxWidth="100%" p={5}>
      <VStack spacing={8} align="stretch">
        {/* Başlık */}
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Reports</Heading>
            <Text color="gray.600">
              View, create and download system reports
            </Text>
          </Box>
        </Flex>

        {/* Report Statistics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
          <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
            <StatLabel>Total Reports</StatLabel>
            <StatNumber>{generatedReports.length}</StatNumber>
            <StatHelpText>This month: {generatedReports.filter(r => r.createdAt.startsWith('2023-09')).length}</StatHelpText>
          </Stat>

          <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
            <StatLabel>Scheduled Reports</StatLabel>
            <StatNumber>{scheduledReports.length}</StatNumber>
            <StatHelpText>Active: {scheduledReports.filter(s => s.status === 'active').length}</StatHelpText>
          </Stat>

          <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
            <StatLabel>Processing Reports</StatLabel>
            <StatNumber>
              {generatedReports.filter(r => r.status === 'processing').length}
            </StatNumber>
            <StatHelpText>In queue</StatHelpText>
          </Stat>

          <Stat p={5} bg={cardBg} borderRadius="lg" boxShadow="sm">
            <StatLabel>Storage Usage</StatLabel>
            <StatNumber>
              {generatedReports.reduce((acc, report) => {
                const size = parseFloat(report.size.replace(' MB', ''));
                return acc + (isNaN(size) ? 0 : size);
              }, 0).toFixed(1)} MB
            </StatNumber>
            <StatHelpText>Total</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Create New Report */}
        <Box>
          <Heading size="md" mb={4}>Create New Report</Heading>
          <SimpleGrid columns={{ base: 1, md: 5 }} spacing={5}>
            {REPORT_TYPES.map(reportType => (
              <Card 
                key={reportType.id} 
                bg={cardBg} 
                cursor="pointer" 
                _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                onClick={() => openReportCreationModal(reportType)}
              >
                <CardBody>
                  <VStack spacing={3}>
                    <Icon as={reportType.icon} boxSize={6} color={`${reportType.color}.500`} />
                    <Text fontWeight="medium">{reportType.name}</Text>
                    <Text fontSize="sm" color="gray.500">{reportType.description}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Generated Reports */}
        <Box>
          <Tabs isFitted onChange={setActiveTab} index={activeTab}>
            <TabList mb="1em">
              <Tab>Generated Reports</Tab>
              <Tab>Scheduled Reports</Tab>
            </TabList>
            <TabPanels>
              {/* Generated Reports */}
              <TabPanel px={0}>
                <Box overflowX="auto">
                  <Table variant="simple" borderRadius="md" boxShadow="sm" bg={cardBg}>
                    <Thead>
                      <Tr>
                        <Th>Report Name</Th>
                        <Th>Created Date</Th>
                        <Th>Filters</Th>
                        <Th>Size</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {generatedReports.map(report => (
                        <Tr key={report.id}>
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={getReportTypeIcon(report.type)} 
                                color={`${getReportTypeColor(report.type)}.500`}
                                mr={2}
                              />
                              <Box>
                                <Text fontWeight="medium">{report.name}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {report.createdBy} created
                                </Text>
                              </Box>
                            </Flex>
                          </Td>
                          <Td>{report.createdAt}</Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme="blue">
                                Department: {report.filters.department}
                              </Badge>
                              <Badge colorScheme="purple">
                                Period: {report.filters.period}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>{report.size}</Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(report.status)}>
                              {report.status === 'completed' ? 'Completed' : 
                               report.status === 'processing' ? 'Processing' : 
                               report.status === 'failed' ? 'Failed' : report.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button 
                                size="sm" 
                                leftIcon={<DownloadIcon />} 
                                colorScheme="blue"
                                isDisabled={report.status !== 'completed'}
                                onClick={() => downloadReport(report.id)}
                              >
                                Download
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                colorScheme="red"
                                onClick={() => deleteReport(report.id)}
                              >
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                      {generatedReports.length === 0 && (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={4}>
                            <Text color="gray.500">No reports created yet.</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>

              {/* Scheduled Reports */}
              <TabPanel px={0}>
                <Box overflowX="auto">
                  <Table variant="simple" borderRadius="md" boxShadow="sm" bg={cardBg}>
                    <Thead>
                      <Tr>
                        <Th>Report Name</Th>
                        <Th>Schedule</Th>
                        <Th>Last Run</Th>
                        <Th>Next Run</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {scheduledReports.map(schedule => (
                        <Tr key={schedule.id}>
                          <Td>
                            <Flex align="center">
                              <Icon 
                                as={getReportTypeIcon(schedule.type)} 
                                color={`${getReportTypeColor(schedule.type)}.500`}
                                mr={2}
                              />
                              <Text fontWeight="medium">{schedule.name}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <HStack>
                              <RepeatIcon />
                              <Text>{schedule.frequency}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <CalendarIcon />
                              <Text>{schedule.nextRunDate}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              {schedule.recipients.map((recipient, index) => (
                                <HStack key={index}>
                                  <EmailIcon color="blue.500" />
                                  <Text fontSize="sm">{recipient}</Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(schedule.status)}>
                              {schedule.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Menu>
                                <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                                  Status
                                </MenuButton>
                                <MenuList>
                                  <MenuItem 
                                    icon={<CheckIcon />} 
                                    onClick={() => handleScheduleStatusChange(schedule.id, 'active')}
                                  >
                                    Active
                                  </MenuItem>
                                  <MenuItem 
                                    icon={<WarningIcon />} 
                                    onClick={() => handleScheduleStatusChange(schedule.id, 'inactive')}
                                  >
                                    Inactive
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                colorScheme="red"
                                onClick={() => deleteSchedule(schedule.id)}
                              >
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                      {scheduledReports.length === 0 && (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={4}>
                            <Text color="gray.500">No scheduled reports created yet.</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Rapor Oluşturma Modalı */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            {selectedReportType && (
              <>
                <ModalHeader>
                  <Flex align="center">
                    <Icon 
                      as={selectedReportType.icon} 
                      color={`${selectedReportType.color}.500`} 
                      mr={2} 
                    />
                    <Text>{selectedReportType.name} Create</Text>
                  </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Report Name</FormLabel>
                      <Input 
                        value={reportName} 
                        onChange={(e) => setReportName(e.target.value)} 
                        placeholder="Enter report name" 
                      />
                    </FormControl>

                    <SimpleGrid columns={2} spacing={4}>
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
                          isDisabled={selectedDepartment === 'all'}
                        >
                          {TEAMS.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel>Date Range</FormLabel>
                      <Select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        {PERIODS.map(period => (
                          <option key={period.id} value={period.id}>{period.name}</option>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedPeriod === 'custom' && (
                      <SimpleGrid columns={2} spacing={4}>
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

                    <Box>
                      <FormLabel mb={2}>Included Metrics</FormLabel>
                      <SimpleGrid columns={2} spacing={3}>
                        <Checkbox 
                          isChecked={includeMetrics.performance} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, performance: e.target.checked})}
                        >
                          Performance Metrics
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.activity} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, activity: e.target.checked})}
                        >
                          Activity Data
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.training} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, training: e.target.checked})}
                        >
                          Training Information
                        </Checkbox>
                        <Checkbox 
                          isChecked={includeMetrics.communications} 
                          onChange={(e) => setIncludeMetrics({...includeMetrics, communications: e.target.checked})}
                        >
                          Communication Analysis
                        </Checkbox>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={2}>Report Preview</Heading>
                      <Card variant="outline">
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Flex align="center" w="full" justify="space-between">
                              <Text fontWeight="bold">{reportName || "Report Name"}</Text>
                              <Badge colorScheme={getReportTypeColor(selectedReportType.id)}>
                                {selectedReportType.name}
                              </Badge>
                            </Flex>
                            <Divider />
                            <SimpleGrid columns={2} spacing={2} w="full">
                              <Box>
                                <Text fontSize="sm" color="gray.500">Department</Text>
                                <Text>{DEPARTMENTS.find(d => d.id === selectedDepartment)?.name || 'Not Selected'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Team</Text>
                                <Text>{TEAMS.find(t => t.id === selectedTeam)?.name || 'Not Selected'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Period</Text>
                                <Text>{PERIODS.find(p => p.id === selectedPeriod)?.name || 'Not Selected'}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Metrics</Text>
                                <Flex gap={1} flexWrap="wrap">
                                  {Object.entries(includeMetrics)
                                    .filter(([_, isChecked]) => isChecked)
                                    .map(([key, _]) => (
                                      <Tag key={key} size="sm" colorScheme="blue" mr={1} mb={1}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                      </Tag>
                                    ))
                                  }
                                </Flex>
                              </Box>
                            </SimpleGrid>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    colorScheme="blue" 
                    mr={3} 
                    leftIcon={<FiBarChart2 />} 
                    onClick={createReport}
                    isLoading={isCreatingReport}
                    loadingText="Creating..."
                    isDisabled={!reportName.trim()}
                  >
                    Create Report
                  </Button>
                  <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Reports; 