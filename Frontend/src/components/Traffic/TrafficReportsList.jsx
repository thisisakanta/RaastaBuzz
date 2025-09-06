// import {
//   LocationOn as LocationIcon,
//   Refresh as RefreshIcon,
//   ThumbDown as ThumbDownIcon,
//   ThumbUp as ThumbUpIcon,
// } from "@mui/icons-material";
// import {
//   Alert,
//   Avatar,
//   Box,
//   Chip,
//   CircularProgress,
//   Divider,
//   IconButton,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Paper,
//   Stack,
//   Typography,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { trafficReportService } from "../../services/trafficReportService";

// // Category icons
// const getCategoryIcon = (category) => {
//   const iconMap = {
//     TRAFFIC_JAM: "🚗",
//     ACCIDENT: "🚨",
//     ROAD_CLOSED: "🚧",
//     CHECKPOINT: "👮",
//     CONSTRUCTION: "🏗️",
//     FLOODING: "🌊",
//     OTHER: "📍",
//   };
//   return iconMap[category] || iconMap.OTHER;
// };

// // Format category name
// const formatCategoryName = (category) => {
//   return category
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(/\b\w/g, (l) => l.toUpperCase());
// };

// // Get severity color
// const getSeverityColor = (severity) => {
//   const colors = {
//     LOW: "success",
//     MEDIUM: "warning",
//     HIGH: "error",
//     CRITICAL: "secondary",
//   };
//   return colors[severity] || "default";
// };

// // Calculate time ago
// const getTimeAgo = (dateString) => {
//   const now = new Date();
//   const reportTime = new Date(dateString);
//   const diffInMinutes = Math.floor((now - reportTime) / (1000 * 60));

//   if (diffInMinutes < 60) {
//     return `${diffInMinutes}m ago`;
//   } else if (diffInMinutes < 1440) {
//     return `${Math.floor(diffInMinutes / 60)}h ago`;
//   } else {
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   }
// };

// const TrafficReportsList = ({ maxItems = 5 }) => {
//   const { user } = useAuth();
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await trafficReportService.getRecentReports(24);
//       setReports(data.slice(0, maxItems));
//     } catch (err) {
//       console.error("Error fetching reports:", err);
//       setError("Failed to load traffic reports");
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [maxItems]);

//   const handleVote = async (reportId, voteType) => {
//     if (!user) return;

//     try {
//       await trafficReportService.voteOnReport(reportId, voteType);
//       await fetchReports(); // Refresh to get updated counts
//     } catch (error) {
//       console.error("Error voting:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <Paper sx={{ p: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           Latest Traffic Reports
//         </Typography>
//         <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//           <CircularProgress />
//         </Box>
//       </Paper>
//     );
//   }

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Stack
//         direction="row"
//         justifyContent="space-between"
//         alignItems="center"
//         sx={{ mb: 2 }}
//       >
//         <Typography variant="h6">Latest Traffic Reports</Typography>
//         <IconButton onClick={fetchReports} size="small">
//           <RefreshIcon />
//         </IconButton>
//       </Stack>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {reports.length === 0 ? (
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           textAlign="center"
//           sx={{ py: 2 }}
//         >
//           No recent traffic reports available
//         </Typography>
//       ) : (
//         <List sx={{ p: 0 }}>
//           {reports.map((report, index) => (
//             <React.Fragment key={report.id}>
//               <ListItem alignItems="flex-start" sx={{ px: 0 }}>
//                 <ListItemAvatar>
//                   <Avatar sx={{ bgcolor: "primary.main" }}>
//                     {getCategoryIcon(report.category)}
//                   </Avatar>
//                 </ListItemAvatar>

//                 <ListItemText
//                   primary={
//                     <Stack
//                       direction="row"
//                       spacing={1}
//                       alignItems="center"
//                       sx={{ mb: 0.5 }}
//                     >
//                       <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
//                         {report.title}
//                       </Typography>
//                       {report.verified && (
//                         <Chip label="✓" size="small" color="success" />
//                       )}
//                     </Stack>
//                   }
//                   secondary={
//                     <Box>
//                       <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
//                         <Chip
//                           label={formatCategoryName(report.category)}
//                           size="small"
//                           variant="outlined"
//                           color="primary"
//                         />
//                         <Chip
//                           label={report.severity}
//                           size="small"
//                           color={getSeverityColor(report.severity)}
//                         />
//                       </Stack>

//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{ mb: 1 }}
//                       >
//                         {report.description?.substring(0, 80)}
//                         {report.description?.length > 80 && "..."}
//                       </Typography>

//                       {report.address && (
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           sx={{ display: "flex", alignItems: "center", mb: 1 }}
//                         >
//                           <LocationIcon sx={{ fontSize: 12, mr: 0.5 }} />
//                           {report.address.substring(0, 50)}
//                           {report.address.length > 50 && "..."}
//                         </Typography>
//                       )}

//                       <Stack
//                         direction="row"
//                         justifyContent="space-between"
//                         alignItems="center"
//                       >
//                         <Typography variant="caption" color="text.secondary">
//                           By {report.user?.username || "Anonymous"} •{" "}
//                           {getTimeAgo(report.createdAt)}
//                         </Typography>

//                         <Stack direction="row" spacing={0.5}>
//                           <IconButton
//                             size="small"
//                             onClick={() => handleVote(report.id, "UP")}
//                             disabled={!user}
//                             color={user ? "primary" : "default"}
//                           >
//                             <ThumbUpIcon fontSize="small" />
//                             <Typography variant="caption" sx={{ ml: 0.5 }}>
//                               {report.upvotes}
//                             </Typography>
//                           </IconButton>

//                           <IconButton
//                             size="small"
//                             onClick={() => handleVote(report.id, "DOWN")}
//                             disabled={!user}
//                             color={user ? "primary" : "default"}
//                           >
//                             <ThumbDownIcon fontSize="small" />
//                             <Typography variant="caption" sx={{ ml: 0.5 }}>
//                               {report.downvotes}
//                             </Typography>
//                           </IconButton>
//                         </Stack>
//                       </Stack>
//                     </Box>
//                   }
//                 />
//               </ListItem>
//               {index < reports.length - 1 && <Divider component="li" />}
//             </React.Fragment>
//           ))}
//         </List>
//       )}

//       {!user && (
//         <Alert severity="info" sx={{ mt: 2 }}>
//           <Typography variant="caption">
//             Sign in to vote on reports and contribute to the community
//           </Typography>
//         </Alert>
//       )}
//     </Paper>
//   );
// };

// export default TrafficReportsList;

import {
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  ThumbDown as ThumbDownIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { trafficReportService } from "../../services/trafficReportService";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Category icons
const getCategoryIcon = (category) => {
  const iconMap = {
    TRAFFIC_JAM: "🚗",
    ACCIDENT: "🚨",
    ROAD_CLOSED: "🚧",
    CHECKPOINT: "👮",
    CONSTRUCTION: "🏗️",
    FLOODING: "🌊",
    OTHER: "📍",
  };
  return iconMap[category] || iconMap.OTHER;
};

// Format category name
const formatCategoryName = (category) => {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Get severity color
const getSeverityColor = (severity) => {
  const colors = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error",
    CRITICAL: "secondary",
  };
  return colors[severity] || "default";
};

// Calculate time ago
const getTimeAgo = (dateString) => {
  const now = new Date();
  const reportTime = new Date(dateString);
  const diffInMinutes = Math.floor((now - reportTime) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

const isRecentReport = (report) => {
  const now = new Date();
  const reportTime = new Date(report.createdAt);
  return (now - reportTime) / (1000 * 60 * 60) < 24;
};

const TrafficReportsList = ({ maxItems = 5 }) => {
  const { user, token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trafficReportService.getRecentReports(24);
      setReports(data.slice(0, maxItems));
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load traffic reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [maxItems]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = trafficReportService.subscribeToUpdates((report) => {
      setReports((prevReports) => {
        if (!report.active) {
          // Remove deactivated report
          const updated = prevReports.filter((r) => r.id !== report.id);
          return updated.slice(0, maxItems);
        } else if (isRecentReport(report)) {
          // Add or update recent report
          const exists = prevReports.some((r) => r.id === report.id);
          let updated;
          if (exists) {
            updated = prevReports.map((r) => (r.id === report.id ? report : r));
          } else {
            updated = [...prevReports, report];
          }
          // Sort by createdAt descending
          updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          // Slice to maxItems
          return updated.slice(0, maxItems);
        }
        // If not recent and not in list, ignore
        return prevReports;
      });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [maxItems]);

  const handleVote = async (reportId, voteType) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/traffic-reports/${reportId}/vote`,
        {
          voteType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? response.data : r))
      );
    } catch (error) {
      setError("Failed to submit vote. Please try again.");
      console.error("Error voting:", error);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Latest Traffic Reports
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">Latest Traffic Reports</Typography>
        <IconButton onClick={fetchReports} size="small">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {reports.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ py: 2 }}
        >
          No recent traffic reports available
        </Typography>
      ) : (
        <List sx={{ p: 0 }}>
          {reports.map((report, index) => (
            <React.Fragment key={report.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {getCategoryIcon(report.category)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                        {report.title}
                      </Typography>
                      {report.verified && (
                        <Chip label="✓" size="small" color="success" />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          label={formatCategoryName(report.category)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          label={report.severity}
                          size="small"
                          color={getSeverityColor(report.severity)}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {report.description?.substring(0, 80)}
                        {report.description?.length > 80 && "..."}
                      </Typography>

                      {report.address && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <LocationIcon sx={{ fontSize: 12, mr: 0.5 }} />
                          {report.address.substring(0, 50)}
                          {report.address.length > 50 && "..."}
                        </Typography>
                      )}

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          By {report.user?.username || "Anonymous"} •{" "}
                          {getTimeAgo(report.createdAt)}
                        </Typography>

                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleVote(report.id, "UPVOTE")}
                            disabled={!user}
                            color={user ? "primary" : "default"}
                          >
                            <ThumbUpIcon fontSize="small" />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {report.upvotes}
                            </Typography>
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleVote(report.id, "DOWNVOTE")}
                            disabled={!user}
                            color={user ? "primary" : "default"}
                          >
                            <ThumbDownIcon fontSize="small" />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {report.downvotes}
                            </Typography>
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  }
                />
              </ListItem>
              {index < reports.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      {!user && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            Sign in to vote on reports and contribute to the community
          </Typography>
        </Alert>
      )}
    </Paper>
  );
};

export default TrafficReportsList;
