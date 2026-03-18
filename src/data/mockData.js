export const currentWorker = {
  id: "W-1042",
  name: "Arjun Sharma",
  email: "arjun.sharma@deliverfast.com",
  phone: "+91 98765 43210",
  vehicle: "Bike",
  city: "Mumbai",
  zone: "Andheri West",
  platform: "DeliverFast",
  workingHours: "9 AM – 9 PM",
  joinDate: "2023-03-15",
  avatar: "AS",
  policy: {
    id: "POL-20231042",
    coverageAmount: 500000,
    status: "Active",
    startDate: "2024-03-15",
    expiryDate: "2025-03-14",
    type: "Comprehensive",
    subType: "Accident + Income Protection",
    premium: 6499,
    nextDue: "2026-03-15",
    yearlyTarget: 1,
    paidCount: 1,
  },
};

export const paymentHistory = [
  { id: "PAY-001", date: "2025-03-15", amount: 6499, status: "Paid", method: "UPI" },
  { id: "PAY-002", date: "2024-03-15", amount: 5999, status: "Paid", method: "Credit Card" },
  { id: "PAY-003", date: "2023-03-15", amount: 5499, status: "Paid", method: "Net Banking" },
];

export const workerClaims = [
  { id: "CLM-3301", type: "Accident", date: "2025-04-10", amount: 18000, status: "Paid", step: 4, description: "Bike collision during delivery on SV Road" },
  { id: "CLM-3302", type: "Injury", date: "2025-05-02", amount: 12000, status: "Approved", step: 3, description: "Wrist injury from fall near Juhu signal" },
  { id: "CLM-3303", type: "Weather Disruption", date: "2025-05-18", amount: 5000, status: "Under Review", step: 2, description: "Income loss due to cyclone warning" },
];

export const incomeData = [
  { month: "Jan", earnings: 18000, compensation: 0 },
  { month: "Feb", earnings: 20000, compensation: 0 },
  { month: "Mar", earnings: 17000, compensation: 0 },
  { month: "Apr", earnings: 9000, compensation: 18000 },
  { month: "May", earnings: 8000, compensation: 17000 },
  { month: "Jun", earnings: 15000, compensation: 5000 },
];

export const workerAlerts = [
  { id: 1, type: "Annual Amount Reminder", message: "Your annual amount of ₹6,499 is due on Mar 15, 2026.", severity: "warning" },
  { id: 2, type: "Claim Update", message: "Claim CLM-3303 is now Under Review. Expected resolution in 5 days.", severity: "info" },
  { id: 3, type: "Disruption Alert", message: "Severe weather warning in Andheri West zone tomorrow. Stay safe!", severity: "danger" },
  { id: 4, type: "Claim Approved", message: "Claim CLM-3302 has been approved. ₹12,000 will be credited in 3 days.", severity: "success" },
];

export const workers = [
  { id: "W-1042", name: "Arjun Sharma",  city: "Mumbai",    vehicle: "Bike",       policy: "POL-20231042", status: "Active",  premium: 6499,  claims: 3, joinDate: "2023-03-15" },
  { id: "W-1043", name: "Maria Chen",    city: "Delhi",     vehicle: "Motorcycle", policy: "POL-20231043", status: "Active",  premium: 7999,  claims: 1, joinDate: "2023-06-10" },
  { id: "W-1044", name: "James Okafor", city: "Bangalore", vehicle: "Car",        policy: "POL-20231044", status: "Active",  premium: 9999,  claims: 2, joinDate: "2022-11-20" },
  { id: "W-1045", name: "Priya Nair",   city: "Chennai",   vehicle: "Bike",       policy: "POL-20231045", status: "Lapsed", premium: 6499,  claims: 0, joinDate: "2024-01-05" },
  { id: "W-1046", name: "Tom Nguyen",   city: "Hyderabad", vehicle: "Motorcycle", policy: "POL-20231046", status: "Active",  premium: 7999,  claims: 2, joinDate: "2023-09-14" },
  { id: "W-1047", name: "Sara Kim",     city: "Pune",      vehicle: "Car",        policy: "POL-20231047", status: "Active",  premium: 9999,  claims: 1, joinDate: "2024-03-22" },
];

export const allClaims = [
  { id: "CLM-3301", worker: "Arjun Sharma",  city: "Mumbai",    type: "Accident", amount: 18000, status: "Paid",         date: "2025-04-10", flagged: false, flagReason: "" },
  { id: "CLM-3302", worker: "Arjun Sharma",  city: "Mumbai",    type: "Injury",   amount: 12000, status: "Approved",     date: "2025-05-02", flagged: false, flagReason: "" },
  { id: "CLM-3303", worker: "Arjun Sharma",  city: "Mumbai",    type: "Weather",  amount: 5000,  status: "Under Review", date: "2025-05-18", flagged: false, flagReason: "" },
  { id: "CLM-3304", worker: "Maria Chen",    city: "Delhi",     type: "Accident", amount: 22000, status: "Approved",     date: "2025-04-22", flagged: true,  flagReason: "3rd claim in 60 days" },
  { id: "CLM-3305", worker: "James Okafor", city: "Bangalore", type: "Injury",   amount: 15000, status: "Rejected",     date: "2025-03-30", flagged: false, flagReason: "" },
  { id: "CLM-3306", worker: "Tom Nguyen",   city: "Hyderabad", type: "Accident", amount: 25000, status: "Under Review", date: "2025-05-10", flagged: true,  flagReason: "Duplicate claim — similar incident filed last month" },
  { id: "CLM-3307", worker: "Sara Kim",     city: "Pune",      type: "Weather",  amount: 4500,  status: "Paid",         date: "2025-05-15", flagged: false, flagReason: "" },
];

export const disruptionData = [
  { month: "Jan", storms: 2, floods: 1, heatwaves: 0, claims: 3 },
  { month: "Feb", storms: 1, floods: 0, heatwaves: 0, claims: 1 },
  { month: "Mar", storms: 3, floods: 2, heatwaves: 1, claims: 6 },
  { month: "Apr", storms: 4, floods: 1, heatwaves: 2, claims: 8 },
  { month: "May", storms: 5, floods: 3, heatwaves: 3, claims: 12 },
  { month: "Jun", storms: 2, floods: 4, heatwaves: 5, claims: 9 },
];

export const financialData = [
  { month: "Jan", premiums: 38994, payouts: 0 },
  { month: "Feb", premiums: 38994, payouts: 12000 },
  { month: "Mar", premiums: 46494, payouts: 18000 },
  { month: "Apr", premiums: 46494, payouts: 40000 },
  { month: "May", premiums: 53994, payouts: 37000 },
  { month: "Jun", premiums: 53994, payouts: 22000 },
];
