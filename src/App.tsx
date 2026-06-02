import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Chatbot } from "./modules/bot/ui/Chatbot";
import { AuthProvider } from "./hooks/context/AuthContext";
import { CartProvider } from "./hooks/context/CartContext";
import { ChatbotProvider } from "./hooks/context/ChatbotContext";
//admins
//import AdminPage from "./modules/admin/ui/AdminPage";

//auth
import ForgotPasswordPage from "./modules/auth/ui/ForgotPasswordPage";
import LoginRegisterPage from "./modules/auth/ui/LoginRegisterPage";
import ResetPasswordPage from "./modules/auth/ui/ResetPasswordPage";

//Search product
import SearchPage from "./modules/search/ui/SearchPage";
import StoresListPage from "./modules/search/ui/StoresListPage";

//home
import HomePage from "./modules/home/ui/HomePage";

//seller
import BeSellerPage from "./modules/home/ui/BeSellerPage";
import StoreProductCRUDPage from "./modules/store/ui/StoreProductCRUDPage";
import ProductPage from "./modules/store/ui/ProductPage";
import RegisterSellerPage from "./modules/auth/ui/RegisterSellerPage";
import StorePage from "./modules/store/ui/StorePage";

//users
import ProfilePage from "./modules/users/ui/ProfilePage";
import CartPage from "./modules/cart/ui/CartPage";
import { AlertProvider } from "./hooks/context/AlertContext";
import AboutUsPage from "./modules/home/ui/AboutUsPage";
import HelpPage from "./modules/home/ui/HelpPage";
import WishListPage from "./modules/users/ui/WishListPage";
import NotFoundPage from "./components/navigation/NotFoundPage";
import NotAuthorize from "./components/navigation/NotAuthorize";
import { NotificationProvider } from "./hooks/context/NotificationContext";
import ReportProblemPage from "./modules/home/ui/ReportProblemPage";
import ContactPage from "./modules/home/ContactPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <CartProvider>
            <NotificationProvider>
              <ChatbotProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/loginRegister"
                    element={<LoginRegisterPage />}
                  />
                  <Route
                    path="/registerSeller"
                    element={<RegisterSellerPage />}
                  />
                  <Route path="/beSellerPage" element={<BeSellerPage />} />
                  <Route path="/store/:id" element={<StorePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/shoppingCart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishListPage />} />
                  <Route
                    path="/wishlist/public/:slug"
                    element={<WishListPage />}
                  />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route
                    path="/resetPassword"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="/forgotPassword"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/crudProduct"
                    element={<StoreProductCRUDPage />}
                  />
                  <Route path="/search/:categoryId" element={<SearchPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/search/stores" element={<StoresListPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route
                    path="/editProduct/:id"
                    element={<StoreProductCRUDPage />}
                  />
                  <Route path="/store/:id/search" element={<StorePage />} />
                  <Route
                    path="/reportProblem"
                    element={<ReportProblemPage />}
                  />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/notAuthorized" element={<NotAuthorize />} />
                </Routes>
                <Chatbot />
              </ChatbotProvider>
            </NotificationProvider>
          </CartProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
