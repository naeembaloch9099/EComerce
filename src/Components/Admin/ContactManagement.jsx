import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaCalendar,
  FaEye,
  FaDownload,
  FaTrash,
  FaSearch,
  FaBell,
  FaCheckCircle,
  FaReply,
  FaFilter,
  FaSort,
  FaChartLine,
  FaInbox,
  FaArchive,
  FaPaperPlane,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaStar,
  FaHeart,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin-bottom: 0.5rem;
`;

const HeaderSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.gradient};
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const Select = styled.select`
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  min-width: 180px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const RefreshButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
  }
`;

const MessagesContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
`;

const MessageRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(4px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${(props) => props.gradient});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ContactEmail = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ContactPhone = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MessagePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MessageSubject = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const MessageText = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  box-shadow: 0 4px 8px ${(props) => props.shadow};
`;

const PriorityBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: ${(props) => props.background};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px ${(props) => props.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${(props) => props.shadow};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  margin: 4rem auto;
`;

const NotificationBadge = styled(motion.div)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
`;

const ModalContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 50;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 1.5rem;
  width: 95%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 95vw;
    padding: 1rem;
    max-height: 90vh;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 0.75rem;
  }
`;

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Fetch contacts
  const fetchContacts = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem("refreshToken");

      let url = `${API_URL}/api/contact?page=${page}&limit=10`;
      if (status !== "all") {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setContacts(data.data.contacts || []);
        setPagination(data.data.pagination || {});
        setUnreadCount(data.data.unreadCount || 0);
      } else {
        toast.error("Failed to fetch contact messages");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Network error while fetching contacts");
    } finally {
      setLoading(false);
    }
  };

  // View contact details
  const viewContact = async (contactId) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${API_URL}/api/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setSelectedContact(data.data.contact);
        setShowModal(true);

        // Refresh list to update read status
        fetchContacts(pagination.currentPage, statusFilter);
      } else {
        toast.error("Failed to fetch contact details");
      }
    } catch (error) {
      console.error("Error viewing contact:", error);
      toast.error("Network error while viewing contact");
    }
  };

  // Download PDF
  const downloadPDF = async (contactId, contactName) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${API_URL}/api/contact/${contactId}/pdf`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `contact_${contactName}_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded successfully!");
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);

      // Fallback: Create a simple text file if PDF generation fails
      try {
        const contact = contacts.find((c) => c._id === contactId);
        if (contact) {
          const textContent = `
RABBIT FASHION - CONTACT MESSAGE REPORT
=======================================

Name: ${contact.name}
Email: ${contact.email}
Date: ${new Date(contact.createdAt).toLocaleString()}
Subject: ${contact.subject}
Status: ${contact.status}

Message:
${contact.message}

---
Generated on: ${new Date().toLocaleString()}
          `.trim();

          const blob = new Blob([textContent], { type: "text/plain" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `contact_${contactName.replace(
            /\s+/g,
            "_"
          )}_${Date.now()}.txt`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success(
            "Contact details downloaded as text file (PDF service unavailable)"
          );
        } else {
          toast.error("Contact not found for download");
        }
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        toast.error(
          "Download failed. Please ensure the backend server is running."
        );
      }
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId, status) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${API_URL}/api/contact/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Contact status updated successfully!");
        fetchContacts(pagination.currentPage, statusFilter);
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(data.data.contact);
        }
      } else {
        toast.error("Failed to update contact status");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Network error while updating contact");
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    if (
      !window.confirm("Are you sure you want to delete this contact message?")
    ) {
      return;
    }

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(`${API_URL}/api/contact/${contactId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Contact message deleted successfully!");
        fetchContacts(pagination.currentPage, statusFilter);
        setShowModal(false);
      } else {
        toast.error("Failed to delete contact message");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Network error while deleting contact");
    }
  };

  // Handle reply to contact
  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplySubject(`Re: ${contact.subject}`);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  // Send reply email
  const sendReply = async () => {
    if (!replySubject.trim() || !replyMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    try {
      setSendingReply(true);
      const refreshToken = localStorage.getItem("refreshToken");

      const response = await fetch(`${API_URL}/api/contact/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({
          contactId: selectedContact._id,
          replySubject: replySubject.trim(),
          replyMessage: replyMessage.trim(),
          customerEmail: selectedContact.email,
          customerName: selectedContact.name,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Reply sent successfully!");
        setShowReplyModal(false);
        setReplySubject("");
        setReplyMessage("");
        // Update contact status to replied
        await updateContactStatus(selectedContact._id, "replied");
      } else {
        toast.error(data.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Network error while sending reply");
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: {
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        color: "white",
        shadow: "rgba(59, 130, 246, 0.3)",
        label: "New",
      },
      read: {
        background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
        color: "white",
        shadow: "rgba(107, 114, 128, 0.3)",
        label: "Read",
      },
      replied: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        shadow: "rgba(16, 185, 129, 0.3)",
        label: "Replied",
      },
      archived: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white",
        shadow: "rgba(245, 158, 11, 0.3)",
        label: "Archived",
      },
    };

    const config = statusConfig[status] || statusConfig.new;

    return (
      <StatusBadge
        background={config.background}
        color={config.color}
        shadow={config.shadow}
      >
        {config.label}
      </StatusBadge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { background: "rgba(34, 197, 94, 0.1)", color: "#059669" },
      medium: { background: "rgba(251, 191, 36, 0.1)", color: "#d97706" },
      high: { background: "rgba(239, 68, 68, 0.1)", color: "#dc2626" },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <PriorityBadge background={config.background} color={config.color}>
        {priority}
      </PriorityBadge>
    );
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      "#667eea 0%, #764ba2 100%",
      "#f093fb 0%, #f5576c 100%",
      "#4facfe 0%, #00f2fe 100%",
      "#43e97b 0%, #38f9d7 100%",
      "#fa709a 0%, #fee140 100%",
      "#a8edea 0%, #fed6e3 100%",
      "#ff9a9e 0%, #fecfef 100%",
      "#ffecd2 0%, #fcb69f 100%",
    ];

    const index = name?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardContainer>
      <ContentWrapper>
        {/* Header */}
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <HeaderTitle>Contact Messages</HeaderTitle>
              <HeaderSubtitle>
                Manage and respond to customer inquiries with style
              </HeaderSubtitle>
            </div>

            {unreadCount > 0 && (
              <NotificationBadge initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <FaBell />
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                    {unreadCount} new message{unreadCount > 1 ? "s" : ""}
                  </div>
                </div>
              </NotificationBadge>
            )}
          </div>
        </Header>

        {/* Stats Cards */}
        <StatsGrid
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            {
              icon: FaInbox,
              label: "Total Messages",
              value: pagination.total || 0,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            },
            {
              icon: FaBell,
              label: "Unread",
              value: unreadCount,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            },
            {
              icon: FaCheckCircle,
              label: "Replied",
              value: contacts.filter((c) => c.status === "replied").length,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            },
            {
              icon: FaChartLine,
              label: "This Month",
              value: contacts.filter(
                (c) =>
                  new Date(c.createdAt) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            },
          ].map((stat, index) => (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              gradient={stat.gradient}
            >
              <StatIcon background={stat.background}>
                <stat.icon style={{ fontSize: "1.5rem", color: "white" }} />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        {/* Filters */}
        <FilterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <SearchInput
                  type="text"
                  placeholder="Search messages by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ position: "relative" }}>
                <FaFilter
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchContacts(1, e.target.value);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>

              <RefreshButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  fetchContacts(pagination.currentPage, statusFilter)
                }
              >
                <FaSort />
                <span>Refresh</span>
              </RefreshButton>
            </div>
          </div>
        </FilterSection>

        {/* Messages Container */}
        <MessagesContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
              }}
            >
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : filteredContacts.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FaInbox style={{ fontSize: "2rem" }} />
              </EmptyIcon>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "1rem",
                }}
              >
                No messages found
              </h3>
              <p style={{ fontSize: "1.1rem" }}>
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "All caught up! No new messages to display."}
              </p>
            </EmptyState>
          ) : (
            <>
              <TableHeader>
                <div>Contact</div>
                <div>Message</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Date</div>
                <div>Actions</div>
              </TableHeader>

              <AnimatePresence>
                {filteredContacts.map((contact, index) => (
                  <MessageRow
                    key={contact._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ContactInfo>
                      <Avatar gradient={getAvatarGradient(contact.name)}>
                        {contact.name?.charAt(0)?.toUpperCase() || <FaUser />}
                      </Avatar>
                      <ContactDetails>
                        <ContactName>{contact.name}</ContactName>
                        <ContactEmail>{contact.email}</ContactEmail>
                        {contact.phone && (
                          <ContactPhone>
                            <FaPhone style={{ fontSize: "0.7rem" }} />
                            {contact.phone}
                          </ContactPhone>
                        )}
                      </ContactDetails>
                    </ContactInfo>

                    <MessagePreview>
                      <MessageSubject>{contact.subject}</MessageSubject>
                      <MessageText>{contact.message}</MessageText>
                    </MessagePreview>

                    <div>{getStatusBadge(contact.status)}</div>

                    <div>{getPriorityBadge(contact.priority)}</div>

                    <DateInfo>
                      <FaClock style={{ fontSize: "0.8rem" }} />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </DateInfo>

                    <ActionButtons>
                      <ActionButton
                        background="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                        shadow="rgba(59, 130, 246, 0.3)"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => viewContact(contact._id)}
                        title="View Details"
                      >
                        <FaEye />
                      </ActionButton>

                      <ActionButton
                        background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        shadow="rgba(16, 185, 129, 0.3)"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => downloadPDF(contact._id, contact.name)}
                        title="Download PDF"
                      >
                        <FaDownload />
                      </ActionButton>

                      <ActionButton
                        background="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                        shadow="rgba(239, 68, 68, 0.3)"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteContact(contact._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionButtons>
                  </MessageRow>
                ))}
              </AnimatePresence>
            </>
          )}
        </MessagesContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchContacts(page, statusFilter)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    background:
                      page === pagination.currentPage
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "rgba(255, 255, 255, 0.9)",
                    color:
                      page === pagination.currentPage ? "white" : "#374151",
                    boxShadow:
                      page === pagination.currentPage
                        ? "0 8px 16px rgba(102, 126, 234, 0.3)"
                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {page}
                </motion.button>
              )
            )}
          </motion.div>
        )}
      </ContentWrapper>

      {/* Modal for Contact Details */}
      <AnimatePresence>
        {showModal && selectedContact && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <FaEnvelope
                        style={{ color: "white", fontSize: "1.5rem" }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "1.75rem",
                          fontWeight: "700",
                          color: "#1f2937",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Message Details
                      </h3>
                      <p style={{ color: "#6b7280", fontSize: "1rem" }}>
                        Complete conversation view
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <FaTimes style={{ fontSize: "1.25rem" }} />
                  </motion.button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                    marginBottom: "2rem",
                  }}
                >
                  {/* Contact Information */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(102, 126, 234, 0.05)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#1f2937",
                          marginBottom: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FaUser style={{ color: "#667eea" }} />
                        Contact Information
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaUser
                              style={{ color: "white", fontSize: "0.9rem" }}
                            />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "#6b7280",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Name
                            </p>
                            <p style={{ color: "#1f2937", fontWeight: "600" }}>
                              {selectedContact.name}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaEnvelope
                              style={{ color: "white", fontSize: "0.9rem" }}
                            />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "#6b7280",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Email
                            </p>
                            <a
                              href={`mailto:${selectedContact.email}`}
                              style={{
                                color: "#667eea",
                                textDecoration: "none",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              {selectedContact.email}
                            </a>
                          </div>
                        </div>

                        {selectedContact.phone && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <FaPhone
                                style={{ color: "white", fontSize: "0.9rem" }}
                              />
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                  color: "#6b7280",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                Phone
                              </p>
                              <a
                                href={`tel:${selectedContact.phone}`}
                                style={{
                                  color: "#667eea",
                                  textDecoration: "none",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                {selectedContact.phone}
                              </a>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FaCalendar
                              style={{ color: "white", fontSize: "0.9rem" }}
                            />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: "#6b7280",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Date
                            </p>
                            <p style={{ color: "#1f2937", fontWeight: "600" }}>
                              {new Date(
                                selectedContact.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.05)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid rgba(16, 185, 129, 0.1)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#1f2937",
                          marginBottom: "1rem",
                        }}
                      >
                        Status Management
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              color: "#374151",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Update Status
                          </label>
                          <select
                            value={selectedContact.status}
                            onChange={(e) =>
                              updateContactStatus(
                                selectedContact._id,
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              border: "2px solid #e5e7eb",
                              borderRadius: "12px",
                              fontSize: "1rem",
                              background: "white",
                              cursor: "pointer",
                            }}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                          }}
                        >
                          {getStatusBadge(selectedContact.status)}
                          {getPriorityBadge(selectedContact.priority)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div
                    style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid rgba(245, 158, 11, 0.1)",
                      height: "fit-content",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#1f2937",
                        marginBottom: "1rem",
                      }}
                    >
                      Message Content
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                      }}
                    >
                      <div>
                        <h5
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Subject
                        </h5>
                        <div
                          style={{
                            background: "white",
                            padding: "1rem",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          {selectedContact.subject}
                        </div>
                      </div>

                      <div>
                        <h5
                          style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Message
                        </h5>
                        <div
                          style={{
                            background: "white",
                            padding: "1rem",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            minHeight: "120px",
                            maxHeight: "500px",
                            overflowY: "auto",
                            lineHeight: "1.6",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          <p
                            style={{
                              color: "#1f2937",
                              whiteSpace: "pre-wrap",
                              margin: 0,
                            }}
                          >
                            {selectedContact.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      downloadPDF(selectedContact._id, selectedContact.name)
                    }
                    style={{
                      padding: "0.75rem 1.5rem",
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <FaDownload />
                    <span>Download PDF</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReply(selectedContact)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <FaPaperPlane />
                    <span>Send Reply</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => deleteContact(selectedContact._id)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background:
                        "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <FaTrash />
                    <span>Delete Message</span>
                  </motion.button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedContact && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReplyModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px", width: "90%" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                  paddingBottom: "1rem",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  Reply to {selectedContact.name}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReplyModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                    color: "#6b7280",
                    fontSize: "1.5rem",
                  }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Customer Info */}
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.05)",
                  padding: "1rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  <strong>To:</strong> {selectedContact.email}
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                  <strong>Original Subject:</strong> {selectedContact.subject}
                </p>
              </div>

              {/* Reply Form */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={8}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  placeholder="Type your reply message here..."
                />
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReplyModal(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: sendingReply ? 1 : 1.02 }}
                  whileTap={{ scale: sendingReply ? 1 : 0.98 }}
                  onClick={sendReply}
                  disabled={sendingReply}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: sendingReply
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: sendingReply ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaPaperPlane />
                  <span>{sendingReply ? "Sending..." : "Send Reply"}</span>
                </motion.button>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default ContactManagement;
