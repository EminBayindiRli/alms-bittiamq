import { Box } from '@chakra-ui/react';

// Tüm sayfaları sarmalayacak container bileşeni
// Sayfaların ekranı tamamen doldurmasını ve kenarlara yapışmamasını sağlar
const PageContainer = ({ children }) => {
  return (
    <Box 
      position="absolute"
      top="60px"
      left="0"
      right="0"
      bottom="0"
      width="100%"
      maxWidth="100%"
      overflowY="auto"
      overflowX="hidden"
      p={0}
    >
      <Box 
        width="100%" 
        height="100%" 
        p={6}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer; 