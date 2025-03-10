import { createContext, useState, useEffect, useContext } from 'react';

// Kimlik doğrulama için Context
const AuthContext = createContext();

// AuthProvider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini al
    const checkLocalSession = () => {
      setLoading(true);
      try {
        const savedUser = localStorage.getItem('alms_user');
        console.log('Checking local storage for user:', savedUser);
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          console.log('User data found:', userData);
          setUser(userData);
          setUserRole(userData.role);
        } else {
          console.log('No user data found in localStorage');
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Oturum bilgisi okunamadı:", error);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    // İlk oturum kontrolü
    checkLocalSession();

    // localStorage değişikliklerini dinle
    window.addEventListener('storage', checkLocalSession);

    // Temizlik
    return () => {
      window.removeEventListener('storage', checkLocalSession);
    };
  }, []);

  // Giriş yapma işlevi - artık Login sayfasında doğrudan yapılıyor
  const signIn = async (email, password) => {
    // Artık bu işlev kullanılmıyor, sadece bağımlılıkları korumak için tutuyoruz
    console.warn("signIn fonksiyonu demo modunda kullanılmıyor.");
    return { success: false, error: { message: "Demo mode active" } };
  };

  // Çıkış yapma işlevi
  const signOut = async () => {
    try {
      // localStorage'dan kullanıcı bilgilerini sil
      localStorage.removeItem('alms_user');
      setUser(null);
      setUserRole(null);
      return { success: true };
    } catch (error) {
      console.error("Çıkış hatası:", error);
      return { success: false, error };
    }
  };

  // Admin rolü kontrolü
  const isAdmin = () => userRole === 'admin';
  
  console.log('Current AuthContext state:', { user, userRole, loading });

  // Sağlanan değerler
  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Context'i kullanmak için hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 