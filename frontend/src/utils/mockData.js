export const mockOverview = {
  totalRequests: 1284930,
  successRequests: 1241087,
  failedRequests: 43843,
}

export const mockDaily = [
  { date: 'Mon', requests: 42000, errors: 1200 },
  { date: 'Tue', requests: 58000, errors: 800 },
  { date: 'Wed', requests: 51000, errors: 2100 },
  { date: 'Thu', requests: 76000, errors: 900 },
  { date: 'Fri', requests: 89000, errors: 1400 },
  { date: 'Sat', requests: 43000, errors: 600 },
  { date: 'Sun', requests: 38000, errors: 500 },
]

export const mockServices = [
  { name: 'Auth Service', requests: 320400, uptime: '99.9%' },
  { name: 'Payment API', requests: 218700, uptime: '99.7%' },
  { name: 'Notification Hub', requests: 189300, uptime: '99.8%' },
  { name: 'Data Pipeline', requests: 156200, uptime: '98.9%' },
  { name: 'Storage API', requests: 98400, uptime: '99.9%' },
]

export const mockErrors = [
  { service: 'Payment API', errors: 12400, rate: '5.7%' },
  { service: 'Data Pipeline', errors: 9800, rate: '6.3%' },
  { service: 'Auth Service', errors: 6200, rate: '1.9%' },
  { service: 'Notification Hub', errors: 4100, rate: '2.2%' },
  { service: 'Storage API', errors: 1200, rate: '1.2%' },
]

export const mockApiKeys = [
  {
    id: '1',
    name: 'Production Key',
    key: 'af_live_k8j2x9mNpQ7rL3vT',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2 minutes ago',
    requests: 48291,
  },
  {
    id: '2',
    name: 'Staging Key',
    key: 'af_test_w4nB6sYqHm1cR9eU',
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
    lastUsed: '1 hour ago',
    requests: 12034,
  },
  {
    id: '3',
    name: 'Old Dev Key',
    key: 'af_live_zK5pX2aVdJ8fG0nW',
    status: 'revoked',
    createdAt: '2023-11-20T14:00:00Z',
    lastUsed: '30 days ago',
    requests: 3201,
  },
]

export const mockServicesList = [
  {
    id: '1',
    name: 'Auth Service',
    description: 'OAuth2 + JWT authentication and authorization platform with SSO support.',
    category: 'Security',
    status: 'approved',
    uptime: '99.9%',
    version: 'v3.2.1',
  },
  {
    id: '2',
    name: 'Payment API',
    description: 'PCI-compliant payment processing with support for 50+ payment gateways.',
    category: 'Finance',
    status: 'pending',
    uptime: '99.7%',
    version: 'v2.1.0',
  },
  {
    id: '3',
    name: 'Notification Hub',
    description: 'Multi-channel notification service: email, SMS, push, and webhooks.',
    category: 'Messaging',
    status: 'available',
    uptime: '99.8%',
    version: 'v1.8.3',
  },
  {
    id: '4',
    name: 'Data Pipeline',
    description: 'Real-time stream processing and ETL pipeline orchestration at scale.',
    category: 'Data',
    status: 'available',
    uptime: '98.9%',
    version: 'v4.0.0',
  },
  {
    id: '5',
    name: 'Storage API',
    description: 'S3-compatible object storage with CDN, versioning and lifecycle policies.',
    category: 'Infrastructure',
    status: 'available',
    uptime: '99.9%',
    version: 'v2.3.0',
  },
  {
    id: '6',
    name: 'ML Inference',
    description: 'Serve ML models at scale with auto-scaling, A/B testing, and monitoring.',
    category: 'AI',
    status: 'available',
    uptime: '99.5%',
    version: 'v1.2.0',
  },
]

export const mockUsers = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', role: 'user', status: 'active', requests: 48291, joined: '2024-01-10' },
  { id: '2', name: 'Sarah Kim', email: 'sarah@devco.io', role: 'user', status: 'active', requests: 32100, joined: '2024-01-22' },
  { id: '3', name: 'Marcus Webb', email: 'marcus@startup.dev', role: 'admin', status: 'active', requests: 91204, joined: '2023-12-05' },
  { id: '4', name: 'Priya Nair', email: 'priya@techcorp.com', role: 'user', status: 'suspended', requests: 1200, joined: '2024-02-14' },
  { id: '5', name: 'Liam Torres', email: 'liam@agency.io', role: 'user', status: 'active', requests: 18900, joined: '2024-02-28' },
]
