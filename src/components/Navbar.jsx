import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiBookOpen, FiUsers, FiFileText, FiPieChart, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, userRole, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { success } = await signOut();
    if (success) {
      navigate('/login');
    }
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        position="sticky"
        top="0"
        zIndex="sticky"
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useColorModeValue('left', 'center')}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            as={RouterLink}
            to="/"
            fontWeight="bold"
            fontSize="xl"
          >
            ALMS
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav isAdmin={isAdmin()} />
          </Flex>
        </Flex>

        {user ? (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            ml="auto"
          >
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Flex align="center">
                  <Avatar
                    size={'sm'}
                    src={user.user_metadata?.avatar_url || 'https://bit.ly/broken-link'}
                    name={user.user_metadata?.full_name || user.email}
                  />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                {isAdmin && (
                  <MenuItem as={RouterLink} to="/settings">
                    Settings
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            <Button
              as={RouterLink}
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
              to={'/login'}
            >
              Giriş Yap
            </Button>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav isAdmin={isAdmin()} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ isAdmin }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  const ALL_MENU_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: FiBarChart2, adminOnly: false },
    { name: 'Performance', path: '/performance', icon: FiBarChart2, adminOnly: true },
    { name: 'Training Recommendations', path: '/training', icon: FiBookOpen, adminOnly: false },
    { name: 'Employee Management', path: '/employees', icon: FiUsers, adminOnly: true },
    { name: 'Reports', path: '/reports', icon: FiFileText, adminOnly: true },
    { name: 'Analysis', path: '/analysis', icon: FiPieChart, adminOnly: true },
  ];

  // Sadece kullanıcının erişim yetkisi olan menü öğelerini filtrele
  const MENU_ITEMS = ALL_MENU_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <Stack direction={'row'} spacing={4}>
      {MENU_ITEMS.map((navItem) => (
        <Box key={navItem.name}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                as={RouterLink}
                to={navItem.path ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.name}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ isAdmin }) => {
  const ALL_MENU_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: FiBarChart2, adminOnly: false },
    { name: 'Performance', path: '/performance', icon: FiBarChart2, adminOnly: true },
    { name: 'Training Recommendations', path: '/training', icon: FiBookOpen, adminOnly: false },
    { name: 'Employee Management', path: '/employees', icon: FiUsers, adminOnly: true },
    { name: 'Reports', path: '/reports', icon: FiFileText, adminOnly: true },
    { name: 'Analysis', path: '/analysis', icon: FiPieChart, adminOnly: true },
  ];

  // Sadece kullanıcının erişim yetkisi olan menü öğelerini filtrele
  const MENU_ITEMS = ALL_MENU_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {MENU_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.name} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} as={RouterLink} to={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar; 