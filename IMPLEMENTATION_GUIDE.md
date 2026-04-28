# Frontend Implementation Guide
## Creating Missing Pages & Components

---

## Overview

This guide provides step-by-step instructions for implementing the missing pages referenced in your sidebar menu. Each page maps to specific modules in your 10-module architecture.

---

## 1. ANALYTICS PAGE (Module 5: Analytics Engine)

### File: `src/pages/Analytics.jsx`

**Purpose:** Display advanced analytics with trend analysis, KPIs, and statistical insights.

**Features:**
- Time-series trend charts
- KPI comparisons
- Growth rate calculations
- Statistical summaries

**Implementation Steps:**

1. Install Recharts:
```bash
npm install recharts
```

2. Create the component with:
   - Line chart for view trends
   - Bar chart for engagement metrics
   - KPI cards with trend indicators
   - Date range selector
   - Export functionality

**Key Metrics to Display:**
- View velocity (views per day)
- Engagement rate trend
- Subscriber growth rate
- Watch time trend
- Revenue trend

---

## 2. VIDEOS PAGE (Module 2: YouTube Integration)

### File: `src/pages/Videos.jsx`

**Purpose:** Comprehensive video management and performance analysis.

**Features:**
- Video list with filtering
- Performance metrics per video
- Video search
- Bulk actions
- Video details modal

**Key Sections:**
- Video performance table
- Filter by date range
- Sort by views/likes/comments
- Video preview modal
- Performance comparison

---

## 3. AUDIENCE PAGE (Module 5: Analytics Engine)

### File: `src/pages/Audience.jsx`

**Purpose:** Audience insights and demographics.

**Features:**
- Audience size trends
- Subscriber growth chart
- Audience retention analysis
- Engagement metrics
- Audience segments

**Key Metrics:**
- Total audience size
- New subscribers
- Subscriber retention rate
- Audience engagement
- Peak activity times

---

## 4. REVENUE PAGE (Module 5: Analytics Engine)

### File: `src/pages/Revenue.jsx`

**Purpose:** Revenue analytics and monetization insights.

**Features:**
- Revenue trend chart
- Revenue sources breakdown
- CPM/RPM analysis
- Estimated earnings
- Revenue forecasting

**Key Metrics:**
- Total revenue
- Daily revenue
- CPM (Cost Per Mille)
- RPM (Revenue Per Mille)
- Revenue sources (AdSense, memberships, etc.)

---

## 5. GEOGRAPHIC PAGE (Module 5: Analytics Engine)

### File: `src/pages/Geographic.jsx`

**Purpose:** Geographic audience distribution and regional analytics.

**Features:**
- World map with viewer distribution
- Top countries list
- Regional performance comparison
- Language distribution
- Regional trends

**Key Metrics:**
- Viewers by country
- Views by region
- Engagement by location
- Revenue by region
- Growth by country

---

## 6. TRENDS PAGE (Module 6: Machine Learning)

### File: `src/pages/Trends.jsx`

**Purpose:** Trend detection and prediction.

**Features:**
- Trending topics detection
- Content trend analysis
- Hashtag trends
- Seasonal patterns
- Predictive trends

**Key Metrics:**
- Trending videos
- Trending topics
- Seasonal patterns
- Predicted trends
- Trend strength

---

## 7. COMMENTS PAGE (Module 6: Machine Learning)

### File: `src/pages/Comments.jsx`

**Purpose:** Comment analysis with sentiment analysis.

**Features:**
- Comment list with filtering
- Sentiment analysis visualization
- Top comments
- Comment trends
- Sentiment distribution

**Key Metrics:**
- Total comments
- Sentiment distribution (positive/negative/neutral)
- Average sentiment score
- Comment growth
- Top commenters

---

## 8. ALERTS PAGE (Module 9: Alert & Notification)

### File: `src/pages/Alerts.jsx`

**Purpose:** Alert configuration and management.

**Features:**
- Alert rules configuration
- Alert history
- Alert triggers
- Notification preferences
- Alert templates

**Key Sections:**
- Active alerts list
- Alert configuration form
- Alert history
- Notification channels
- Alert templates

---

## 9. REPORTS PAGE (Module 8: Reporting Module)

### File: `src/pages/Reports.jsx`

**Purpose:** Report generation and management.

**Features:**
- Report templates
- Custom report builder
- Scheduled reports
- Report history
- Export options

**Key Sections:**
- Report templates list
- Report builder
- Scheduled reports
- Report history
- Export formats (PDF, Excel, CSV)

---

## 10. SETTINGS PAGE (Module 1: User Authentication)

### File: `src/pages/Settings.jsx`

**Purpose:** User settings and preferences.

**Features:**
- Profile management
- Password change
- Notification preferences
- API key management
- Account settings

**Key Sections:**
- Profile information
- Password change
- Notification settings
- Connected accounts
- API keys
- Account deletion

---

## 11. ADMIN PAGE (Module 10: Administration)

### File: `src/pages/Admin.jsx`

**Purpose:** Administrative interface for system management.

**Features:**
- User management
- System monitoring
- API usage tracking
- Configuration management
- Audit logs

**Key Sections:**
- User management table
- System health dashboard
- API usage statistics
- Configuration settings
- Audit log viewer

---

## Implementation Priority

### Phase 1 (Week 1-2): Core Pages
1. Analytics.jsx - Most important for data insights
2. Videos.jsx - Core content management
3. Audience.jsx - Key metrics

### Phase 2 (Week 3-4): Secondary Pages
4. Revenue.jsx - Monetization insights
5. Geographic.jsx - Regional analysis
6. Trends.jsx - Trend detection

### Phase 3 (Week 5-6): Advanced Features
7. Comments.jsx - Sentiment analysis
8. Reports.jsx - Report generation
9. Alerts.jsx - Alert management

### Phase 4 (Week 7-8): System Pages
10. Settings.jsx - User preferences
11. Admin.jsx - System administration

---

## Common Component Structure

Each page should follow this structure:

```javascript
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { youtubeApi } from '../api';
import { RefreshCw, Download, Filter } from 'lucide-react';

function PageName() {
  // State management
  const [filters, setFilters] = useState({});
  const [timeRange, setTimeRange] = useState('last30days');

  // Data fetching
  const { data, isLoading, error, refetch } = useQuery(
    ['pageData', filters, timeRange],
    () => fetchPageData(filters, timeRange),
    { staleTime: 5 * 60 * 1000 }
  );

  // Handlers
  const handleExport = () => {
    // Export logic
  };

  const handleRefresh = () => {
    refetch();
  };

  // Render
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Page Title</h1>
        <div className="flex gap-2">
          <button onClick={handleRefresh}>
            <RefreshCw size={20} />
          </button>
          <button onClick={handleExport}>
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        {/* Filter controls */}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <div>
          {/* Page content */}
        </div>
      )}
    </div>
  );
}

export default PageName;
```

---

## Reusable Components to Create

### 1. StatCard Component
```javascript
// components/common/StatCard.jsx
function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-2xl p-6`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-${color}-600 text-sm font-medium`}>{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          {trend && <p className="text-sm mt-2">{trend}</p>}
        </div>
        <div className={`p-3 bg-${color}-500/20 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
}
```

### 2. ChartCard Component
```javascript
// components/common/ChartCard.jsx
function ChartCard({ title, children, onExport }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {onExport && (
          <button onClick={onExport} className="text-gray-500 hover:text-gray-700">
            <Download size={20} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
```

### 3. FilterBar Component
```javascript
// components/common/FilterBar.jsx
function FilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
      {/* Filter inputs */}
      <button onClick={onReset} className="ml-auto">Reset</button>
    </div>
  );
}
```

### 4. DataTable Component
```javascript
// components/common/DataTable.jsx
function DataTable({ columns, data, onSort, sortBy }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => onSort(col.key)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## API Endpoints Needed

### Analytics Page
- `GET /youtube/analytics/trends/` - Trend data
- `GET /youtube/analytics/kpi/` - KPI metrics
- `GET /youtube/analytics/growth/` - Growth rates

### Videos Page
- `GET /youtube/videos/` - Video list
- `GET /youtube/videos/{id}/` - Video details
- `GET /youtube/videos/performance/` - Performance metrics

### Audience Page
- `GET /youtube/audience/demographics/` - Demographics
- `GET /youtube/audience/retention/` - Retention data
- `GET /youtube/audience/growth/` - Growth trends

### Revenue Page
- `GET /youtube/revenue/` - Revenue data
- `GET /youtube/revenue/sources/` - Revenue sources
- `GET /youtube/revenue/forecast/` - Revenue forecast

### Geographic Page
- `GET /youtube/geographic/` - Geographic data
- `GET /youtube/geographic/countries/` - Country breakdown

### Trends Page
- `GET /youtube/trends/` - Trending data
- `GET /youtube/trends/predictions/` - Predictions

### Comments Page
- `GET /youtube/comments/` - Comments list
- `GET /youtube/comments/sentiment/` - Sentiment analysis

### Alerts Page
- `GET /youtube/alerts/` - Alerts list
- `POST /youtube/alerts/` - Create alert
- `PUT /youtube/alerts/{id}/` - Update alert
- `DELETE /youtube/alerts/{id}/` - Delete alert

### Reports Page
- `GET /youtube/reports/` - Reports list
- `POST /youtube/reports/` - Generate report
- `GET /youtube/reports/{id}/` - Report details
- `POST /youtube/reports/{id}/export/` - Export report

---

## State Management Pattern

### Using React Query + Zustand

```javascript
// store/useAnalyticsStore.js
import create from 'zustand';

export const useAnalyticsStore = create((set) => ({
  filters: {},
  timeRange: 'last30days',
  
  setFilters: (filters) => set({ filters }),
  setTimeRange: (timeRange) => set({ timeRange }),
  reset: () => set({ filters: {}, timeRange: 'last30days' }),
}));

// Usage in component
const { filters, timeRange, setFilters } = useAnalyticsStore();
```

---

## Error Handling Pattern

```javascript
// components/common/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-lg">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Testing Template

```javascript
// __tests__/pages/Analytics.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import Analytics from '../Analytics';

describe('Analytics Page', () => {
  it('renders analytics page', () => {
    render(<Analytics />);
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
  });

  it('fetches and displays data', async () => {
    render(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText(/Total Views/i)).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    // Mock API error
    render(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});
```

---

## Next Steps

1. **Create the page components** following the structure above
2. **Implement the API endpoints** in the backend
3. **Add the routes** to `App.jsx`
4. **Create reusable components** for common UI patterns
5. **Add error handling** and loading states
6. **Implement data caching** with React Query
7. **Add tests** for each page
8. **Deploy and monitor** performance

---

## Resources

- [Recharts Documentation](https://recharts.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

---

**Document Version:** 1.0  
**Status:** Ready for Implementation
