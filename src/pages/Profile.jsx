import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    department: '',
    team: '',
  });
  const toast = useToast();

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    if (user) {
      const userData = JSON.parse(localStorage.getItem('alms_user'));
      setUserInfo({
        name: userData?.name || '',
        email: userData?.email || '',
        department: userData?.department || '',
        team: userData?.team || ''
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    // Profil bilgilerini güncelleme simülasyonu
    toast({
      title: 'Profil güncellendi',
      description: 'Profil bilgileriniz başarıyla güncellendi.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Heading mb={6}>Profil Bilgileri</Heading>
      
      <Card variant="outline" width="100%" maxW="800px" mx="auto">
        <CardHeader>
          <HStack spacing={4}>
            <Avatar 
              size="xl" 
              name={userInfo.name} 
              src="https://bit.ly/broken-link" 
            />
            <VStack align="start" spacing={1}>
              <Heading size="md">{userInfo.name}</Heading>
              <Text color="gray.600">{userInfo.department} - {userInfo.team}</Text>
            </VStack>
          </HStack>
        </CardHeader>
        
        <CardBody>
          <VStack spacing={4} align="start">
            <Divider />
            
            <Heading size="sm">Kişisel Bilgiler</Heading>
            
            <FormControl>
              <FormLabel>İsim</FormLabel>
              <Input 
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>E-posta</FormLabel>
              <Input 
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                isReadOnly
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Departman</FormLabel>
              <Input 
                value={userInfo.department}
                isReadOnly
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Takım</FormLabel>
              <Input 
                value={userInfo.team}
                isReadOnly
              />
            </FormControl>
            
            <Button 
              colorScheme="blue" 
              onClick={handleSaveProfile}
              alignSelf="flex-end"
              mt={4}
            >
              Değişiklikleri Kaydet
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Profile; 