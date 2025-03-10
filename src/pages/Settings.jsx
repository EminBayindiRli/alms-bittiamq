import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Switch,
  Button,
  Divider,
  Select,
  useToast,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    language: 'tr',
    dataRefreshInterval: '30',
  });
  const toast = useToast();

  const handleSettingChange = (name, value) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSaveSettings = () => {
    // Ayarları güncelleme simülasyonu
    toast({
      title: 'Settings Updated',
      description: 'Your system settings have been successfully updated.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Heading mb={6}>System Settings</Heading>
      
      <Card variant="outline" width="100%" maxW="800px" mx="auto">
        <CardHeader>
          <Heading size="md">User Preferences</Heading>
          <Text color="gray.600" mt={2}>
            Customize your system behavior and notification preferences
          </Text>
        </CardHeader>
        
        <CardBody>
          <VStack spacing={6} align="start">
            <Box w="100%">
              <Heading size="sm" mb={4}>Notifications</Heading>
              <Stack spacing={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    App Notifications
                  </FormLabel>
                  <Switch 
                    isChecked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    colorScheme="blue"
                    ml="auto"
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Email Notifications
                  </FormLabel>
                  <Switch 
                    isChecked={settings.emailAlerts}
                    onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                    colorScheme="blue"
                    ml="auto"
                  />
                </FormControl>
              </Stack>
            </Box>
            
            <Divider />
            
            <Box w="100%">
              <Heading size="sm" mb={4}>Interface Settings</Heading>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select 
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="tr">Turkish</option>
                    <option value="en">English</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Data Refresh Interval</FormLabel>
                  <Select 
                    value={settings.dataRefreshInterval}
                    onChange={(e) => handleSettingChange('dataRefreshInterval', e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="0">Manual</option>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            
            <Button 
              colorScheme="blue" 
              onClick={handleSaveSettings}
              alignSelf="flex-end"
              mt={4}
            >
              Save Settings
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Settings; 