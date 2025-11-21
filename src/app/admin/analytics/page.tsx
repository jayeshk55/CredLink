"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, BarChart3, Users, Link2, MapPin, Clock } from "lucide-react";
import styles from "./analytics.module.css";

export default function AnalyticsPage() {
  // Function to calculate new users based on period
  const getNewUsersByPeriod = async (period: string) => {
    try {
      const url = new URL('/api/admin/analytics', window.location.origin);
      url.searchParams.append('period', period);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      return data.stats.newUsers;
    } catch (error) {
      console.error('Error fetching user count:', error);
      return 0;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "thisWeek": return "New Users (This Week)";
      case "lastMonth": return "New Users (Last Month)";
      case "last3Months": return "New Users (Last 3 Months)";
      case "thisYear": return "New Users (This Year)";
      default: return "New Users (This Week)";
    }
  };

  // Demo data for overview metrics
  const [overview, setOverview] = useState<any>({
    totalUsers: 0,
    totalConnections: 3892,
    activeCities: 15,
    newUsersForPeriod: 0
  });

  // Real data for category distribution pie chart
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const [engagementData, setEngagementData] = useState<any[]>([]);

  // Demo data for user registration trend bar chart
  const [activityData, setActivityData] = useState<any[]>([
    { 
      date: "Nov 1", 
      newUsers: 12, 
      connections: 28, 
      topCity: "Mumbai", 
      topCategory: "Doctor",
      usersJoined: [
        { name: "Dr. Rajesh Sharma", city: "Mumbai", category: "Doctor" },
        { name: "Dr. Priya Patel", city: "Mumbai", category: "Doctor" },
        { name: "Amit Kumar", city: "Delhi", category: "Engineer" },
        { name: "Sneha Gupta", city: "Pune", category: "Designer" },
        { name: "Rohit Singh", city: "Mumbai", category: "Developer" },
        { name: "Kavya Nair", city: "Bangalore", category: "Artist" },
        { name: "Arjun Mehta", city: "Mumbai", category: "Doctor" },
        { name: "Pooja Joshi", city: "Delhi", category: "Teacher" },
        { name: "Vikram Rao", city: "Chennai", category: "Consultant" },
        { name: "Anita Desai", city: "Mumbai", category: "Doctor" },
        { name: "Suresh Iyer", city: "Bangalore", category: "Engineer" },
        { name: "Meera Agarwal", city: "Pune", category: "Designer" }
      ]
    },
    { 
      date: "Nov 2", 
      newUsers: 8, 
      connections: 35, 
      topCity: "Delhi", 
      topCategory: "Designer",
      usersJoined: [
        { name: "Ravi Verma", city: "Delhi", category: "Designer" },
        { name: "Sonia Kapoor", city: "Delhi", category: "Designer" },
        { name: "Manish Tiwari", city: "Mumbai", category: "Developer" },
        { name: "Deepika Sharma", city: "Delhi", category: "Designer" },
        { name: "Akash Jain", city: "Pune", category: "Engineer" },
        { name: "Priyanka Singh", city: "Delhi", category: "Artist" },
        { name: "Nikhil Agarwal", city: "Bangalore", category: "Consultant" },
        { name: "Shreya Pandey", city: "Delhi", category: "Designer" }
      ]
    },
    { 
      date: "Nov 3", 
      newUsers: 15, 
      connections: 42, 
      topCity: "Pune", 
      topCategory: "Developer",
      usersJoined: [
        { name: "Rahul Patil", city: "Pune", category: "Developer" },
        { name: "Neha Kulkarni", city: "Pune", category: "Developer" },
        { name: "Sachin Jadhav", city: "Pune", category: "Developer" },
        { name: "Pallavi Bhosale", city: "Mumbai", category: "Designer" },
        { name: "Omkar Shinde", city: "Pune", category: "Developer" },
        { name: "Sayali Deshpande", city: "Pune", category: "Engineer" },
        { name: "Kiran Pawar", city: "Delhi", category: "Artist" },
        { name: "Swati Joshi", city: "Pune", category: "Developer" },
        { name: "Aditya Gaikwad", city: "Pune", category: "Developer" },
        { name: "Vaishali Mane", city: "Mumbai", category: "Teacher" },
        { name: "Prasad Kale", city: "Pune", category: "Developer" },
        { name: "Rupali Sawant", city: "Pune", category: "Consultant" },
        { name: "Ganesh More", city: "Bangalore", category: "Engineer" },
        { name: "Sunita Raut", city: "Pune", category: "Developer" },
        { name: "Mahesh Bhagat", city: "Chennai", category: "Doctor" }
      ]
    },
    { 
      date: "Nov 4", 
      newUsers: 22, 
      connections: 38, 
      topCity: "Mumbai", 
      topCategory: "Doctor",
      usersJoined: [
        { name: "Dr. Ashwin Shah", city: "Mumbai", category: "Doctor" },
        { name: "Dr. Nisha Thakur", city: "Mumbai", category: "Doctor" },
        { name: "Rajat Malhotra", city: "Delhi", category: "Engineer" },
        { name: "Divya Reddy", city: "Bangalore", category: "Designer" },
        { name: "Harsh Agrawal", city: "Mumbai", category: "Developer" },
        { name: "Ritika Bansal", city: "Delhi", category: "Artist" },
        { name: "Siddharth Jha", city: "Mumbai", category: "Doctor" },
        { name: "Tanvi Mishra", city: "Pune", category: "Teacher" },
        { name: "Yash Chopra", city: "Mumbai", category: "Consultant" },
        { name: "Isha Sinha", city: "Delhi", category: "Designer" },
        { name: "Gaurav Saxena", city: "Mumbai", category: "Doctor" },
        { name: "Nidhi Gupta", city: "Pune", category: "Engineer" },
        { name: "Karthik Nair", city: "Chennai", category: "Developer" },
        { name: "Preeti Yadav", city: "Mumbai", category: "Doctor" },
        { name: "Rohit Bhatia", city: "Delhi", category: "Artist" },
        { name: "Simran Kaur", city: "Mumbai", category: "Doctor" },
        { name: "Abhishek Pandey", city: "Bangalore", category: "Engineer" },
        { name: "Kriti Sharma", city: "Mumbai", category: "Designer" },
        { name: "Varun Aggarwal", city: "Delhi", category: "Consultant" },
        { name: "Shweta Jain", city: "Pune", category: "Teacher" },
        { name: "Aryan Khanna", city: "Mumbai", category: "Doctor" },
        { name: "Ritu Singh", city: "Chennai", category: "Artist" }
      ]
    },
    { 
      date: "Nov 5", 
      newUsers: 18, 
      connections: 45, 
      topCity: "Bangalore", 
      topCategory: "Engineer",
      usersJoined: [
        { name: "Sunil Kumar", city: "Bangalore", category: "Engineer" },
        { name: "Lakshmi Rao", city: "Bangalore", category: "Engineer" },
        { name: "Naveen Reddy", city: "Bangalore", category: "Developer" },
        { name: "Sowmya Nair", city: "Chennai", category: "Designer" },
        { name: "Rajesh Babu", city: "Bangalore", category: "Engineer" },
        { name: "Kavitha Shetty", city: "Mumbai", category: "Doctor" },
        { name: "Mohan Gowda", city: "Bangalore", category: "Engineer" },
        { name: "Deepa Murthy", city: "Bangalore", category: "Teacher" },
        { name: "Srinivas Iyengar", city: "Chennai", category: "Consultant" },
        { name: "Padma Krishnan", city: "Bangalore", category: "Artist" },
        { name: "Venkat Subramanian", city: "Bangalore", category: "Engineer" },
        { name: "Radha Menon", city: "Delhi", category: "Designer" },
        { name: "Kishore Prasad", city: "Bangalore", category: "Engineer" },
        { name: "Usha Devi", city: "Chennai", category: "Teacher" },
        { name: "Raman Pillai", city: "Bangalore", category: "Developer" },
        { name: "Sudha Bhat", city: "Mumbai", category: "Consultant" },
        { name: "Prakash Hegde", city: "Bangalore", category: "Engineer" },
        { name: "Latha Kamath", city: "Pune", category: "Artist" }
      ]
    },
    { 
      date: "Nov 6", 
      newUsers: 25, 
      connections: 52, 
      topCity: "Delhi", 
      topCategory: "Artist",
      usersJoined: [
        { name: "Arjun Kapoor", city: "Delhi", category: "Artist" },
        { name: "Kavya Sharma", city: "Delhi", category: "Artist" },
        { name: "Rohit Gupta", city: "Mumbai", category: "Designer" },
        { name: "Priya Agarwal", city: "Delhi", category: "Artist" },
        { name: "Vikash Kumar", city: "Pune", category: "Developer" },
        { name: "Neetu Singh", city: "Delhi", category: "Teacher" },
        { name: "Arun Joshi", city: "Delhi", category: "Artist" },
        { name: "Pooja Verma", city: "Mumbai", category: "Consultant" },
        { name: "Sanjay Tiwari", city: "Delhi", category: "Engineer" },
        { name: "Renu Pandey", city: "Delhi", category: "Artist" },
        { name: "Ajay Mishra", city: "Bangalore", category: "Developer" },
        { name: "Sunita Yadav", city: "Delhi", category: "Designer" },
        { name: "Manoj Saxena", city: "Delhi", category: "Artist" },
        { name: "Geeta Bansal", city: "Mumbai", category: "Doctor" },
        { name: "Pankaj Jain", city: "Delhi", category: "Artist" },
        { name: "Seema Khanna", city: "Delhi", category: "Teacher" },
        { name: "Rakesh Sinha", city: "Chennai", category: "Engineer" },
        { name: "Meena Agrawal", city: "Delhi", category: "Artist" },
        { name: "Deepak Malhotra", city: "Pune", category: "Consultant" },
        { name: "Shilpa Gupta", city: "Delhi", category: "Designer" },
        { name: "Nitin Sharma", city: "Delhi", category: "Artist" },
        { name: "Anita Chopra", city: "Mumbai", category: "Doctor" },
        { name: "Vivek Singh", city: "Delhi", category: "Artist" },
        { name: "Ritu Jha", city: "Bangalore", category: "Developer" },
        { name: "Amit Verma", city: "Delhi", category: "Artist" }
      ]
    },
    { 
      date: "Nov 7", 
      newUsers: 19, 
      connections: 41, 
      topCity: "Pune", 
      topCategory: "Designer",
      usersJoined: [
        { name: "Aniket Patil", city: "Pune", category: "Designer" },
        { name: "Shruti Kulkarni", city: "Pune", category: "Designer" },
        { name: "Mayur Jadhav", city: "Mumbai", category: "Developer" },
        { name: "Priyanka Bhosale", city: "Pune", category: "Designer" },
        { name: "Sagar Shinde", city: "Pune", category: "Engineer" },
        { name: "Ashwini Deshpande", city: "Pune", category: "Designer" },
        { name: "Nitin Pawar", city: "Delhi", category: "Artist" },
        { name: "Manisha Joshi", city: "Pune", category: "Teacher" },
        { name: "Santosh Gaikwad", city: "Pune", category: "Designer" },
        { name: "Vidya Mane", city: "Mumbai", category: "Consultant" },
        { name: "Rajesh Kale", city: "Pune", category: "Developer" },
        { name: "Smita Sawant", city: "Pune", category: "Designer" },
        { name: "Anil More", city: "Bangalore", category: "Engineer" },
        { name: "Shubhangi Raut", city: "Pune", category: "Designer" },
        { name: "Pravin Bhagat", city: "Chennai", category: "Doctor" },
        { name: "Sarika Deshmukh", city: "Pune", category: "Designer" },
        { name: "Yogesh Wagh", city: "Mumbai", category: "Developer" },
        { name: "Pallavi Kadam", city: "Pune", category: "Designer" },
        { name: "Suresh Lokhande", city: "Delhi", category: "Consultant" }
      ]
    },
    { 
      date: "Nov 8", 
      newUsers: 14, 
      connections: 33, 
      topCity: "Mumbai", 
      topCategory: "Consultant",
      usersJoined: [
        { name: "Ramesh Shah", city: "Mumbai", category: "Consultant" },
        { name: "Nita Thakur", city: "Mumbai", category: "Consultant" },
        { name: "Kiran Malhotra", city: "Delhi", category: "Engineer" },
        { name: "Swati Reddy", city: "Bangalore", category: "Designer" },
        { name: "Hemant Agrawal", city: "Mumbai", category: "Developer" },
        { name: "Rashmi Bansal", city: "Delhi", category: "Artist" },
        { name: "Sandeep Jha", city: "Mumbai", category: "Consultant" },
        { name: "Trupti Mishra", city: "Pune", category: "Teacher" },
        { name: "Yatin Chopra", city: "Mumbai", category: "Consultant" },
        { name: "Ira Sinha", city: "Delhi", category: "Designer" },
        { name: "Gopal Saxena", city: "Mumbai", category: "Consultant" },
        { name: "Nisha Gupta", city: "Pune", category: "Engineer" },
        { name: "Kartik Nair", city: "Chennai", category: "Developer" },
        { name: "Preeti Yadav", city: "Mumbai", category: "Doctor" }
      ]
    },
    { 
      date: "Nov 9", 
      newUsers: 21, 
      connections: 47, 
      topCity: "Chennai", 
      topCategory: "Doctor",
      usersJoined: [
        { name: "Dr. Murugan", city: "Chennai", category: "Doctor" },
        { name: "Dr. Lakshmi", city: "Chennai", category: "Doctor" },
        { name: "Ravi Kumar", city: "Bangalore", category: "Engineer" },
        { name: "Sangeetha Rao", city: "Chennai", category: "Designer" },
        { name: "Rajesh Babu", city: "Chennai", category: "Developer" },
        { name: "Kavitha Shetty", city: "Mumbai", category: "Doctor" },
        { name: "Mohan Gowda", city: "Bangalore", category: "Engineer" },
        { name: "Deepa Murthy", city: "Chennai", category: "Teacher" },
        { name: "Srinivas Iyengar", city: "Chennai", category: "Consultant" },
        { name: "Padma Krishnan", city: "Chennai", category: "Artist" },
        { name: "Venkat Subramanian", city: "Bangalore", category: "Engineer" },
        { name: "Radha Menon", city: "Delhi", category: "Designer" },
        { name: "Kishore Prasad", city: "Chennai", category: "Doctor" },
        { name: "Usha Devi", city: "Chennai", category: "Teacher" },
        { name: "Raman Pillai", city: "Chennai", category: "Developer" },
        { name: "Sudha Bhat", city: "Mumbai", category: "Consultant" },
        { name: "Prakash Hegde", city: "Bangalore", category: "Engineer" },
        { name: "Latha Kamath", city: "Pune", category: "Artist" },
        { name: "Suresh Nair", city: "Chennai", category: "Doctor" },
        { name: "Geetha Iyer", city: "Chennai", category: "Teacher" },
        { name: "Anand Swamy", city: "Bangalore", category: "Developer" }
      ]
    },
    { 
      date: "Nov 10", 
      newUsers: 16, 
      connections: 39, 
      topCity: "Delhi", 
      topCategory: "Teacher",
      usersJoined: [
        { name: "Sunita Sharma", city: "Delhi", category: "Teacher" },
        { name: "Ramesh Gupta", city: "Delhi", category: "Teacher" },
        { name: "Kavita Agarwal", city: "Mumbai", category: "Designer" },
        { name: "Vinod Kumar", city: "Delhi", category: "Engineer" },
        { name: "Neeta Singh", city: "Delhi", category: "Teacher" },
        { name: "Arun Joshi", city: "Pune", category: "Artist" },
        { name: "Pooja Verma", city: "Delhi", category: "Consultant" },
        { name: "Sanjay Tiwari", city: "Delhi", category: "Teacher" },
        { name: "Renu Pandey", city: "Mumbai", category: "Developer" },
        { name: "Ajay Mishra", city: "Delhi", category: "Teacher" },
        { name: "Sunita Yadav", city: "Delhi", category: "Designer" },
        { name: "Manoj Saxena", city: "Delhi", category: "Teacher" },
        { name: "Geeta Bansal", city: "Bangalore", category: "Doctor" },
        { name: "Pankaj Jain", city: "Delhi", category: "Artist" },
        { name: "Seema Khanna", city: "Delhi", category: "Teacher" },
        { name: "Rakesh Sinha", city: "Chennai", category: "Engineer" }
      ]
    }
  ]);

  const [filters, setFilters] = useState({
    city: "all",
    category: "all",
    fromDate: "",
    toDate: "",
    usersPeriod: "thisWeek", // New filter for users metric
  });
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Update overview data when filters change (for non-realtime periods)
  useEffect(() => {
    const updatePeriodCount = async () => {
      if (filters.usersPeriod !== 'thisMonth') {
        const count = await getNewUsersByPeriod(filters.usersPeriod);
        setOverview((prev: { totalUsers: number; totalConnections: number; activeCities: number; newUsersForPeriod: number }) => ({
          ...prev,
          newUsersForPeriod: count
        }));
      }
    };
    updatePeriodCount();
  }, [filters.usersPeriod]);

  useEffect(() => {
    let isMounted = true;
    let es: EventSource | null = null;
    let intervalId: any;

    const applyStats = (stats: any) => {
      if (!isMounted) return;
      setOverview((prev: { totalUsers: number; totalConnections: number; activeCities: number; newUsersForPeriod: number }) => ({
        ...prev,
        totalUsers: stats?.totalUsers ?? prev.totalUsers,
        activeCities: stats?.activeCities ?? prev.activeCities,
        newUsersForPeriod: stats?.newUsers ?? prev.newUsersForPeriod
      }));
    };

    const usePolling = () => {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/admin/analytics', { cache: 'no-store' });
          if (!res.ok) return;
          const data = await res.json();
          applyStats(data?.stats);
          {
            const mapped = data.engagementData
              .filter((item: any) => item.name !== 'Users')
              .map((item: any) => ({ category: item.name, count: Number(item.value) || 0 }));
            const sum = mapped.reduce((s: number, d: any) => s + d.count, 0);
           // console.debug('[Analytics] categoryData (poll)', mapped);
            setCategoryData(sum > 0 ? mapped : mapped.map((d: any) => ({ ...d, count: 1 })));
          }
          setEngagementData(data.trafficData);
          setActivityData(data.activitySummaryDaily || []); // Update activityData from backend-provided activitySummaryDaily
        } catch (_) {}
      };
      fetchData();
      intervalId = setInterval(fetchData, 10000);
    };

    const useSSE = () => {
      es = new EventSource('/api/admin/analytics?stream=1');
      es.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          applyStats(payload?.stats);
          {
            const mapped = payload.engagementData
              .filter((item: any) => item.name !== 'Users')
              .map((item: any) => ({ category: item.name, count: Number(item.value) || 0 }));
            const sum = mapped.reduce((s: number, d: any) => s + d.count, 0);
           // console.debug('[Analytics] categoryData (sse)', mapped);
            setCategoryData(sum > 0 ? mapped : mapped.map((d: any) => ({ ...d, count: 1 })));
          }
          setEngagementData(payload.trafficData);
          setActivityData(payload.activitySummaryDaily || []); // Update activityData from backend-provided activitySummaryDaily
        } catch (_) {}
      };
      es.onerror = () => {
        es?.close();
        es = null;
        usePolling();
      };
    };

    if (typeof window !== 'undefined' && 'EventSource' in window) {
      useSSE();
    } else {
      usePolling();
    }

    return () => {
      isMounted = false;
      if (es) es.close();
      if (intervalId) clearInterval(intervalId);
    };
  }, [filters.usersPeriod]);

  const toggleRowExpansion = (rowIndex: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  // ===== Export Handlers =====
  const exportCSV = () => {
    const csvContent = [
      ["Date", "New Users", "Connections", "Top City", "Top Category"],
      ...activityData.map((r) => [r.date, r.newUsers, r.connections, r.topCity, r.topCategory]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics_report.csv";
    a.click();
  };

  const exportPDF = () => window.print();

  const COLORS = ["#2563eb", "#3b82f6", "#93c5fd", "#1d4ed8", "#60a5fa"];

  if (loading) return <div className="flex justify-center items-center min-h-screen text-lg">Loading analytics...</div>;

  return (
    <div className={styles.analyticsContainer}>
      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Platform <span>Analytics</span>
          </h1>
          <p className={styles.subtitle}>
            Visualize user growth, connections, and engagement trends across categories and cities.
          </p>
        </div>
        
      </div>

      {/* ===== FILTERS ===== */}
      <div className={styles.filtersSection}>
        <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
          <option value="all">All Cities</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Pune">Pune</option>
          <option value="Delhi">Delhi</option>
        </select>

        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="all">All Categories</option>
          <option value="Doctor">Doctor</option>
          <option value="Designer">Designer</option>
          <option value="Developer">Developer</option>
          <option value="Artist">Artist</option>
        </select>

        <select 
          value={filters.usersPeriod} 
          onChange={(e) => setFilters({ ...filters, usersPeriod: e.target.value })}
          className={styles.periodFilter}
        >
          <option value="thisWeek">This Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="last3Months">Last 3 Months</option>
          <option value="thisYear">This Year</option>
        </select>

      </div>

      {/* ===== METRIC CARDS ===== */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <Users className="text-blue-600" size={28} />
          <h3>Total Users</h3>
          <p className={styles.metric}>{overview?.totalUsers || 0}</p>
        </div>

        

        <div className={styles.card}>
          <MapPin className="text-blue-600" size={28} />
          <h3>Total Cities</h3>
          <p className={styles.metric}>{overview?.activeCities || 0}</p>
        </div>

        <div className={styles.card}>
          <Clock className="text-blue-600" size={28} />
          <h3>{getPeriodLabel(filters.usersPeriod)}</h3>
          <p className={styles.metric}>{overview?.newUsersForPeriod || 0}</p>
          <div className="text-xs text-gray-500 mt-1">
            Filter: {filters.usersPeriod ? filters.usersPeriod.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : 'This Week'}
          </div>
        </div>
      </div>

      {/* ===== GRAPHS ===== */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartBox}>
          <h2>Profile Distribution by Category</h2>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PieChart width={420} height={300}>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                minAngle={1}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* <div className={styles.chartBox}>
          <h2>User Registration Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#2563eb" name="New Users" />
              <Bar dataKey="connections" fill="#22c55e" name="New Connections" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>

      {/* ===== ACTIVITY TABLE ===== */}
      <div className={styles.insightSection}>
        <div className="flex justify-between items-center mb-4">
          <h2>Activity Summary</h2>
          <button 
            onClick={exportCSV}
            className={styles.primaryActionBtn}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Date</th>
              <th>New Users Count</th>
              <th>Users Who Joined</th>
              <th>Top City</th>
              <th>Top Category</th>
            </tr>
          </thead>
          <tbody>
            {activityData.map((row: any, i: number) => {
              const users = row.usersJoined || [];
              const firstTwo = users.slice(0, 2);
              const remaining = Math.max(users.length - 2, 0);
              return (
                <tr key={`${row.date}-${i}`} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{row.date}</td>
                  <td className="text-blue-600 font-semibold">{row.newUsers}</td>
                  <td className="py-2 max-w-md">
                    <div className="flex flex-wrap gap-1">
                      {firstTwo.map((user: any, idx: number) => (
                        <div key={idx} className="inline-block bg-blue-50 border border-blue-200 text-blue-800 text-xs px-2 py-1 rounded-lg">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            <span className="bg-green-100 text-green-700 px-1 rounded">{user.city}</span>
                            {' '}
                            <span className="bg-purple-100 text-purple-700 px-1 rounded">{user.category}</span>
                          </div>
                        </div>
                      ))}
                      {remaining > 0 && (
                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          +{remaining} Others
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-black font-medium">{row.topCity}</td>
                  <td className="text-black font-medium">{row.topCategory}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}