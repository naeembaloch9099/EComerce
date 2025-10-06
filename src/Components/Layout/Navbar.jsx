import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../../context/ToastContext";

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const Logo = styled(Link)`
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`;

const DesktopNav = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  margin-left: 2.5rem;
  display: flex;
  align-items: baseline;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${(props) => (props.$isActive ? "#3b82f6" : "#374151")};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    width: ${(props) => (props.$isActive ? "100%" : "0")};
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #3b82f6;
    transform: translateY(-1px);

    &::after {
      width: 100%;
    }
  }
`;

const IconsContainer = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const IconButton = styled.button`
  color: #374151;
  padding: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
  border: none;
  background: none;
  border-radius: 0.5rem;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
`;

const CartButton = styled(IconButton)`
  &:hover {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.75rem;
  border-radius: 50%;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  animation: ${(props) => (props.$isNew ? "bounce 0.6s ease-in-out" : "none")};

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const UserButton = styled(Link)`
  color: ${(props) => (props.$isAuthenticated ? "#10b981" : "#374151")};
  padding: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border-radius: 0.5rem;
  position: relative;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$isAuthenticated &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid white;
    }
  `}
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  position: relative;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    background: #10b981;
    border-radius: 50%;
    border: 3px solid white;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(229, 231, 235, 0.8);
  min-width: 200px;
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)"};
  transition: all 0.2s ease;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background: none;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: #f9fafb;
    color: #1f2937;
  }

  &:last-child {
    border-radius: 0 0 0.75rem 0.75rem;
    color: #ef4444;

    &:hover {
      background: #fef2f2;
      color: #dc2626;
    }
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  }
`;

const MobileMenuButton = styled.button`
  color: #374151;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  background: none;
  border-radius: 0.5rem;

  @media (min-width: 768px) {
    display: none;
  }

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: rotate(90deg);
  }
`;

const MobileMenu = styled.div`
  display: ${(props) => (props.$isOpen ? "block" : "none")};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuContent = styled.div`
  padding: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.75rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

const MobileNavLink = styled(Link)`
  color: ${(props) => (props.$isActive ? "#3b82f6" : "#374151")};
  display: block;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    transform: translateX(0.5rem);
  }
`;

const MobileIconsRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
  margin-top: 1rem;
`;

const SearchOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
`;

const SearchModal = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  transform: ${(props) => (props.$isOpen ? "scale(1)" : "scale(0.95)")};
  transition: all 0.3s ease;
`;

const SearchHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 0.5rem;

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchResults = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const SearchResultImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const SearchResultInfo = styled.div`
  flex: 1;
`;

const SearchResultName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const SearchResultPrice = styled.p`
  color: #3b82f6;
  font-weight: 600;
`;

const FavoriteBadge = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 0.75rem;
  border-radius: 50%;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  animation: ${(props) => (props.$isNew ? "bounce 0.6s ease-in-out" : "none")};

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const FavoriteButton = styled(IconButton)`
  &:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-2px);
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { getFavoritesCount } = useFavorites();
  const { showLogoutToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    logout();
    navigate("/login");
    showLogoutToast();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCartClick = () => {
    toggleCart();
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Import products here (we'll need to access the products data)
      import("../../data/dummyData").then(({ products }) => {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 10)); // Show max 10 results
      });
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = () => {
    handleSearchClose();
    // Navigate to product or scroll to product
  };

  // Handle escape key for search
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isSearchOpen) {
          handleSearchClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const cartCount = getCartCount();

  return (
    <NavbarContainer>
      <NavContent>
        <NavInner>
          {/* Logo */}
          <Logo to="/">FASHION</Logo>

          {/* Desktop Navigation */}
          <DesktopNav>
            <NavLinks>
              <NavLink to="/men" $isActive={isActiveRoute("/men")}>
                MEN
              </NavLink>
              <NavLink to="/women" $isActive={isActiveRoute("/women")}>
                WOMEN
              </NavLink>
              <NavLink to="/topwear" $isActive={isActiveRoute("/topwear")}>
                TOP WEAR
              </NavLink>
              <NavLink
                to="/bottomwear"
                $isActive={isActiveRoute("/bottomwear")}
              >
                BOTTOM WEAR
              </NavLink>
              <NavLink
                to="/collection"
                $isActive={isActiveRoute("/collection")}
              >
                COLLECTION
              </NavLink>
              <NavLink to="/about" $isActive={isActiveRoute("/about")}>
                ABOUT
              </NavLink>
              <NavLink to="/contact" $isActive={isActiveRoute("/contact")}>
                CONTACT
              </NavLink>
            </NavLinks>
          </DesktopNav>

          {/* Desktop Icons */}
          <IconsContainer>
            <IconButton onClick={handleSearchClick}>
              <FiSearch size={20} />
            </IconButton>

            <FavoriteButton as={Link} to="/favorites">
              <FiHeart size={20} />
              {getFavoritesCount() > 0 && (
                <FavoriteBadge $isNew={getFavoritesCount() > 0}>
                  {getFavoritesCount()}
                </FavoriteBadge>
              )}
            </FavoriteButton>

            <CartButton onClick={handleCartClick}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <CartBadge $isNew={cartCount > 0}>{cartCount}</CartBadge>
              )}
            </CartButton>

            {isAuthenticated && user ? (
              <UserDropdown ref={dropdownRef}>
                <UserAvatar
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </UserAvatar>
                <DropdownMenu $isOpen={isUserDropdownOpen}>
                  <DropdownHeader>
                    <UserName>{user.name || "User"}</UserName>
                    <UserEmail>{user.email || "user@example.com"}</UserEmail>
                  </DropdownHeader>
                  <DropdownItem onClick={handleLogout}>
                    <FiLogOut size={16} />
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UserDropdown>
            ) : (
              <UserButton to="/login" $isAuthenticated={isAuthenticated}>
                <FiUser size={20} />
              </UserButton>
            )}
          </IconsContainer>

          {/* Mobile menu button */}
          <MobileMenuButton onClick={toggleMenu}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </NavInner>

        {/* Mobile Navigation */}
        <MobileMenu $isOpen={isMenuOpen}>
          <MobileMenuContent>
            <MobileNavLink
              to="/men"
              $isActive={isActiveRoute("/men")}
              onClick={() => setIsMenuOpen(false)}
            >
              MEN
            </MobileNavLink>
            <MobileNavLink
              to="/women"
              $isActive={isActiveRoute("/women")}
              onClick={() => setIsMenuOpen(false)}
            >
              WOMEN
            </MobileNavLink>
            <MobileNavLink
              to="/topwear"
              $isActive={isActiveRoute("/topwear")}
              onClick={() => setIsMenuOpen(false)}
            >
              TOP WEAR
            </MobileNavLink>
            <MobileNavLink
              to="/bottomwear"
              $isActive={isActiveRoute("/bottomwear")}
              onClick={() => setIsMenuOpen(false)}
            >
              BOTTOM WEAR
            </MobileNavLink>
            <MobileNavLink
              to="/collection"
              $isActive={isActiveRoute("/collection")}
              onClick={() => setIsMenuOpen(false)}
            >
              COLLECTION
            </MobileNavLink>
            <MobileNavLink
              to="/about"
              $isActive={isActiveRoute("/about")}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </MobileNavLink>
            <MobileNavLink
              to="/contact"
              $isActive={isActiveRoute("/contact")}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </MobileNavLink>

            {/* Mobile Icons Row */}
            <MobileIconsRow>
              <IconButton onClick={handleSearchClick}>
                <FiSearch size={20} />
              </IconButton>
              <FavoriteButton as={Link} to="/favorites">
                <FiHeart size={20} />
                {getFavoritesCount() > 0 && (
                  <FavoriteBadge $isNew={getFavoritesCount() > 0}>
                    {getFavoritesCount()}
                  </FavoriteBadge>
                )}
              </FavoriteButton>
              <CartButton onClick={handleCartClick}>
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <CartBadge $isNew={cartCount > 0}>{cartCount}</CartBadge>
                )}
              </CartButton>
              {isAuthenticated && user ? (
                <UserDropdown ref={dropdownRef}>
                  <UserAvatar
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </UserAvatar>
                  <DropdownMenu $isOpen={isUserDropdownOpen}>
                    <DropdownHeader>
                      <UserName>{user.name || "User"}</UserName>
                      <UserEmail>{user.email || "user@example.com"}</UserEmail>
                    </DropdownHeader>
                    <DropdownItem
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <FiLogOut size={16} />
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UserDropdown>
              ) : (
                <UserButton
                  to="/login"
                  $isAuthenticated={isAuthenticated}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser size={20} />
                </UserButton>
              )}
            </MobileIconsRow>
          </MobileMenuContent>
        </MobileMenu>
      </NavContent>

      {/* Search Overlay */}
      <SearchOverlay $isOpen={isSearchOpen} onClick={handleSearchClose}>
        <SearchModal
          $isOpen={isSearchOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchHeader>
            <FiSearch size={20} color="#6b7280" />
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <IconButton onClick={handleSearchClose}>
              <FiX size={20} />
            </IconButton>
          </SearchHeader>
          <SearchResults>
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <SearchResultItem
                  key={product.id}
                  onClick={() => handleSearchResultClick(product)}
                >
                  <SearchResultImage src={product.image} alt={product.name} />
                  <SearchResultInfo>
                    <SearchResultName>{product.name}</SearchResultName>
                    <SearchResultPrice>${product.price}</SearchResultPrice>
                  </SearchResultInfo>
                </SearchResultItem>
              ))
            ) : searchQuery ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "2rem",
                }}
              >
                No products found for "{searchQuery}"
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: "2rem",
                }}
              >
                Start typing to search for products...
              </div>
            )}
          </SearchResults>
        </SearchModal>
      </SearchOverlay>
    </NavbarContainer>
  );
};

export default Navbar;
