import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Badge,
  Divider,
} from '@chakra-ui/react';

// Fixed user credentials
const DEMO_USERS = {
  admin: {
    email: 'admin@alms-system.com',
    password: 'admin123',
    role: 'admin',
    id: 'admin',
    name: 'Mehmet Demir',
    department: 'Management',
    team: 'Leadership'
  },
  employee1: {
    email: 'ali.yilmaz@alms-system.com',
    password: 'password123',
    role: 'employee',
    id: '1',
    name: 'Ali Yılmaz',
    department: 'Product Development',
    team: 'Team-2'
  },
  employee2: {
    email: 'ayse.kaya@alms-system.com',
    password: 'password123',
    role: 'employee',
    id: '2',
    name: 'Ayşe Kaya',
    department: 'Sales',
    team: 'Team-1'
  },
  employee3: {
    email: 'mehmet.oz@alms-system.com',
    password: 'password123',
    role: 'employee',
    id: '3',
    name: 'Mehmet Öz',
    department: 'HR',
    team: 'Team-3'
  },
  employee4: {
    email: 'zeynep.demir@alms-system.com',
    password: 'password123',
    role: 'employee',
    id: '4',
    name: 'Zeynep Demir',
    department: 'Product Development',
    team: 'Team-2'
  },
  employee5: {
    email: 'mustafa.sahin@alms-system.com',
    password: 'password123',
    role: 'employee',
    id: '5',
    name: 'Mustafa Şahin',
    department: 'Sales',
    team: 'Team-1'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Demo kullanıcıları için aktif sekme
  const [activeTab, setActiveTab] = useState(0);
  
  // Başlangıçta localStorage'ı temizle
  useEffect(() => {
    localStorage.removeItem('alms_user');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Login Error',
        description: 'Please enter your email and password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);
    
    // Demo kullanıcılarını kontrol et
    let foundUser = null;
    
    // Tüm demo kullanıcılarını kontrol et
    Object.values(DEMO_USERS).forEach(user => {
      if (email === user.email && password === user.password) {
        foundUser = user;
      }
    });
    
    if (foundUser) {
      // Kullanıcı bulundu - giriş simülasyonu
      setTimeout(() => {
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
          department: foundUser.department,
          team: foundUser.team
        };
        
        localStorage.setItem('alms_user', JSON.stringify(userData));
        console.log('Saved user data to localStorage:', userData);
        
        toast({
          title: 'Login Successful',
          description: `Welcome to ALMS system. (as ${foundUser.role === 'admin' ? 'Administrator' : 'Employee'})`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setLoading(false);
        if (foundUser.role === 'admin') {
          window.location.href = '/dashboard'; // Tam sayfa yeniden yükleme
        } else {
          window.location.href = '/dashboard'; // Çalışan için de tam sayfa yeniden yükleme
        }
      }, 1000); // 1 saniyelik yapay gecikme
    } else {
      // Hatalı giriş
      setTimeout(() => {
        setLoading(false);
        toast({
          title: 'Login Error',
          description: 'Invalid email or password. Please use demo accounts.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }, 1000);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const setDemoUser = (userType) => {
    const user = DEMO_USERS[userType];
    setEmail(user.email);
    setPassword(user.password);
  };
  
  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      bgColor="gray.50"
    >
      <Container maxW="md" p={0}>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
          <Tabs variant="enclosed" index={activeTab} onChange={setActiveTab}>
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Demo Accounts</Tab>
            </TabList>
            <TabPanels>
              {/* Giriş Paneli */}
              <TabPanel>
                <VStack spacing={4} align="flex-start">
                  <Heading>Login to ALMS</Heading>
                  <Text color="gray.600">
                    Learning Management System Analysis
                  </Text>
                  
                  <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <VStack spacing={4} align="flex-start" w="full">
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@company.com"
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                          />
                          <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                              {showPassword ? 'Hide' : 'Show'}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                      
                      <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={loading}
                        loadingText="Logging in..."
                        mt={4}
                      >
                        Login
                      </Button>
                      
                      <Box width="full" mt={2}>
                        <Divider my={4} />
                        <Text color="gray.500" fontSize="sm" textAlign="center">
                          Use the "Demo Accounts" tab to access demo accounts.
                        </Text>
                      </Box>
                    </VStack>
                  </form>
                </VStack>
              </TabPanel>

              {/* Demo Hesaplar Paneli */}
              <TabPanel>
                <VStack spacing={6} align="flex-start" maxH="60vh" overflowY="auto" pr={2}>
                  <Heading size="md">Demo Accounts</Heading>
                  <Text color="gray.600">
                    You can use the following demo accounts to log in to the system:
                  </Text>
                  
                  <Card variant="outline" width="full">
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <Badge colorScheme="purple">Administrator Account</Badge>
                        <Text><strong>Email:</strong> {DEMO_USERS.admin.email}</Text>
                        <Text><strong>Password:</strong> {DEMO_USERS.admin.password}</Text>
                        <Text fontSize="sm" color="gray.500">You can view all company data with this account.</Text>
                        <Button 
                          colorScheme="purple" 
                          size="sm" 
                          onClick={() => {
                            setDemoUser('admin');
                            setActiveTab(0); // Giriş sekmesine dön
                          }}
                        >
                          Use This Account
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Heading size="sm" mt={4}>Employee Accounts</Heading>
                  
                  {Object.keys(DEMO_USERS)
                    .filter(key => key.startsWith('employee'))
                    .map((key) => (
                      <Card variant="outline" width="full" key={key}>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <Badge colorScheme="blue">Employee Account</Badge>
                            <Text><strong>Name:</strong> {DEMO_USERS[key].name}</Text>
                            <Text><strong>Department:</strong> {DEMO_USERS[key].department}</Text>
                            <Text><strong>Email:</strong> {DEMO_USERS[key].email}</Text>
                            <Text><strong>Password:</strong> {DEMO_USERS[key].password}</Text>
                            <Button 
                              colorScheme="blue" 
                              size="sm" 
                              onClick={() => {
                                setDemoUser(key);
                                setActiveTab(0); // Giriş sekmesine dön
                              }}
                            >
                              Use This Account
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 