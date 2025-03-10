import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Container,
  Icon,
  HStack,
  Badge
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaChartLine, FaGraduationCap, FaUsers, FaChartBar } from 'react-icons/fa';
import { MdInsights } from 'react-icons/md';

const LandingPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const boxBg = useColorModeValue('gray.50', 'gray.700');
  const highlightColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box bg={bgColor} minHeight="100vh" display="flex" alignItems="center">
      <Container maxW="container.xl" py={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <HStack spacing={2}>
            <Icon as={MdInsights} w={8} h={8} color="purple.500" />
            <Heading size="md" color={textColor}>ALMS</Heading>
          </HStack>
          <Button 
            as={RouterLink} 
            to="/login" 
            colorScheme="blue" 
            size="md"
            boxShadow="sm"
          >
            Sign In
          </Button>
        </Flex>
        
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          alignItems="flex-start" 
          justifyContent="flex-start"
          mb={12}
        >
          <VStack align="start" spacing={6} maxW="800px" ml={{ base: 0, md: 0 }}>
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
              Enterprise Analytics Platform
            </Badge>
            <Heading size="2xl" color={textColor} lineHeight="1.2">
              ALMS - Advanced Learning Management System Analytics
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Powerful AI-based tools for analyzing employee performance and training effectiveness. Get actionable insights and personalized training recommendations from your Microsoft tools.
            </Text>
            <HStack spacing={4} pt={2}>
              <Button 
                as={RouterLink} 
                to="/login" 
                colorScheme="purple" 
                size="lg"
                boxShadow="md"
              >
                Get Started
              </Button>
              <Button 
                as={RouterLink} 
                to="/login" 
                variant="outline"
                colorScheme="blue" 
                size="lg"
              >
                Demo Access
              </Button>
            </HStack>
          </VStack>
        </Flex>
        
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          <FeatureBox 
            icon={FaChartLine} 
            title="Performance Analytics" 
            description="Detailed performance metrics and evaluations" 
          />
          <FeatureBox 
            icon={FaGraduationCap} 
            title="Training Tracking" 
            description="Track training completion and effectiveness" 
          />
          <FeatureBox 
            icon={FaUsers} 
            title="Employee Metrics" 
            description="Individual and department-based comparisons" 
          />
          <FeatureBox 
            icon={FaChartBar} 
            title="Trend Analysis" 
            description="Long-term performance and development trends" 
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// Feature box component
const FeatureBox = ({ icon, title, description }) => {
  const boxBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box 
      p={5} 
      shadow="md" 
      borderWidth="1px" 
      bg={boxBg} 
      borderRadius="lg" 
      textAlign="center"
      borderColor={borderColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Icon as={icon} w={10} h={10} color="purple.500" mb={4} />
      <Heading size="md" mb={2}>{title}</Heading>
      <Text>{description}</Text>
    </Box>
  );
};

export default LandingPage; 