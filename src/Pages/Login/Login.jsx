import React, { useState } from "react";
import styled from "styled-components";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdFingerprint } from "react-icons/md";
const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAuthToast, showLoginToast } = useToast();
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword)
      return showAuthToast("error", "Fill all fields");
    if (password !== confirmPassword)
      return showAuthToast("error", "Passwords do not match");

    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/auth/send-signup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setOtpSent(true);
        showAuthToast("success", "OTP sent to your email successfully!");
      } else {
        showAuthToast("error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showAuthToast("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.otp) {
      return showAuthToast("error", "Please enter the OTP");
    }

    try {
      setLoading(true);
      const { name, email, password, otp } = formData;
      const result = await signup({ name, email, password, otp });
      if (result.success) {
        showAuthToast(
          "success",
          result.message || "Account created successfully!"
        );

        // Navigate to home or appropriate page after successful signup
        setTimeout(() => {
          navigate("/");
        }, 1500);

        setIsSignup(false);
        setOtpSent(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          otp: "",
        });
      } else {
        showAuthToast(
          "error",
          result.error || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      showAuthToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password)
      return showAuthToast("error", "Enter email and password");

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.isAdmin || result.user.role === "admin") {
          showAuthToast("success", "Admin login successful!");
          navigate("/admin");
        } else {
          showLoginToast(result.user.name || "User");
          navigate("/");
        }
      } else {
        showAuthToast(
          "error",
          result.error || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      showAuthToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TouchPanel>
        <MdFingerprint size={48} />
        <TouchTitle>Login with Touch ID</TouchTitle>
        <TouchText>
          Use your Touch ID for faster, easier access to your Payment account.
        </TouchText>
        <TouchButton>Use Touch ID</TouchButton>
      </TouchPanel>

      <Card>
        <Header>{isSignup ? "Create Account" : "Welcome Back"}</Header>
        <SubHeader>
          {isSignup ? "Fill details to sign up" : "Sign in to continue"}
        </SubHeader>

        <Form>
          {isSignup && (
            <InputGroup>
              <FiUser />
              <Input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
              />
            </InputGroup>
          )}

          <InputGroup>
            <FiMail />
            <Input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <FiLock />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
            />
            <Toggle onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </Toggle>
          </InputGroup>

          {isSignup && (
            <InputGroup>
              <FiLock />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </InputGroup>
          )}

          {isSignup && otpSent && (
            <InputGroup>
              <FiLock />
              <Input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
              />
            </InputGroup>
          )}

          {!isSignup && <Forgot>Forgot your password?</Forgot>}

          <Button
            disabled={loading}
            onClick={
              isSignup ? (otpSent ? handleSignup : handleSendOtp) : handleLogin
            }
          >
            {loading
              ? "Loading..."
              : isSignup
              ? otpSent
                ? "Sign Up"
                : "Send OTP"
              : "Login"}
          </Button>
        </Form>

        <Switch>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <Link onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </Link>
        </Switch>
      </Card>
    </Container>
  );
};

export default AuthPage;

// ===== Styled Components =====

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea, #764ba2);
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  flex-wrap: wrap;
`;

const TouchPanel = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 2rem;
  color: #fff;
  text-align: center;
`;

const TouchTitle = styled.h3`
  margin-top: 1rem;
  font-size: 1.2rem;
`;
const TouchText = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem;
`;
const TouchButton = styled.button`
  background: #fff;
  color: #764ba2;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
`;

const Card = styled.div`
  width: 400px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
`;

const Header = styled.h2`
  text-align: center;
  color: #1f2937;
`;
const SubHeader = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #f9f9ff;
  border-radius: 12px;
  padding: 0.5rem 1rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
  }
`;

const Toggle = styled.div`
  cursor: pointer;
  color: #9ca3af;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.4);
  }
`;

const Forgot = styled.p`
  font-size: 0.8rem;
  color: #667eea;
  text-align: right;
  cursor: pointer;
`;

const Switch = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: center;
`;

const Link = styled.span`
  color: #764ba2;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.3rem;
`;
