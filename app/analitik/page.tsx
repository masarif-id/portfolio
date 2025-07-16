'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/container';
import Card from '@/components/ui/card';
import { 
    FaUsers, 
    FaEye, 
    FaGlobe, 
    FaChartLine, 
    FaMobile, 
    FaDesktop, 
    FaTablet,
    FaArrowUp,
    FaArrowDown,
    FaClock,
    FaCalendarDay
} from 'react-icons/fa6';

interface AnalyticsData {
    totalVisitors: number;
    totalPageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: string;
    topPages: Array<{ page: string; views: number; percentage: number }>;
    trafficSources: Array<{ source: string; visitors: number; percentage: number }>;
    utmCampaigns: Array<{ campaign: string; visitors: number; conversions: number }>;
    deviceTypes: Array<{ device: string; percentage: number; visitors: number }>;
    countries: Array<{ country: string; visitors: number; percentage: number }>;
    hourlyTraffic: Array<{ hour: number; visitors: number }>;
    dailyTraffic: Array<{ date: string; visitors: number; pageViews: number }>;
}

// Mock data - dalam implementasi nyata, ini akan diambil dari API analytics
const mockAnalyticsData: AnalyticsData = {
    totalVisitors: 12847,
    totalPageViews: 28394,
    uniqueVisitors: 9234,
    bounceRate: 34.2,
    avgSessionDuration: '2m 34s',
    topPages: [
        { page: '/', views: 8234, percentage: 29.0 },
        { page: '/projects/gallery', views: 4521, percentage: 15.9 },
        { page: '/spotify', views: 3892, percentage: 13.7 },
        { page: '/posts/about-arif', views: 2847, percentage: 10.0 },
        { page: '/products/preset', views: 2156, percentage: 7.6 },
        { page: '/products/lut', views: 1834, percentage: 6.5 },
    ],
    trafficSources: [
        { source: 'Direct', visitors: 4521, percentage: 35.2 },
        { source: 'Google Search', visitors: 3847, percentage: 29.9 },
        { source: 'Instagram', visitors: 2156, percentage: 16.8 },
        { source: 'YouTube', visitors: 1234, percentage: 9.6 },
        { source: 'LinkedIn', visitors: 789, percentage: 6.1 },
        { source: 'Other', visitors: 300, percentage: 2.4 },
    ],
    utmCampaigns: [
        { campaign: 'instagram_story', visitors: 1847, conversions: 234 },
        { campaign: 'youtube_description', visitors: 1234, conversions: 156 },
        { campaign: 'linkedin_post', visitors: 789, conversions: 89 },
        { campaign: 'email_newsletter', visitors: 567, conversions: 78 },
        { campaign: 'facebook_ad', visitors: 345, conversions: 45 },
    ],
    deviceTypes: [
        { device: 'Mobile', percentage: 68.4, visitors: 8787 },
        { device: 'Desktop', percentage: 24.7, visitors: 3173 },
        { device: 'Tablet', percentage: 6.9, visitors: 887 },
    ],
    countries: [
        { country: 'Indonesia', visitors: 7234, percentage: 56.3 },
        { country: 'Malaysia', visitors: 1847, percentage: 14.4 },
        { country: 'Singapore', visitors: 1234, percentage: 9.6 },
        { country: 'United States', visitors: 987, percentage: 7.7 },
        { country: 'Australia', visitors: 654, percentage: 5.1 },
        { country: 'Others', visitors: 891, percentage: 6.9 },
    ],
    hourlyTraffic: [
        { hour: 0, visitors: 234 }, { hour: 1, visitors: 156 }, { hour: 2, visitors: 123 },
        { hour: 3, visitors: 89 }, { hour: 4, visitors: 67 }, { hour: 5, visitors: 98 },
        { hour: 6, visitors: 234 }, { hour: 7, visitors: 456 }, { hour: 8, visitors: 678 },
        { hour: 9, visitors: 789 }, { hour: 10, visitors: 834 }, { hour: 11, visitors: 923 },
        { hour: 12, visitors: 1045 }, { hour: 13, visitors: 1123 }, { hour: 14, visitors: 1234 },
        { hour: 15, visitors: 1345 }, { hour: 16, visitors: 1456 }, { hour: 17, visitors: 1234 },
        { hour: 18, visitors: 1123 }, { hour: 19, visitors: 1045 }, { hour: 20, visitors: 934 },
        { hour: 21, visitors: 823 }, { hour: 22, visitors: 678 }, { hour: 23, visitors: 456 },
    ],
    dailyTraffic: [
        { date: '2025-01-01', visitors: 456, pageViews: 1234 },
        { date: '2025-01-02', visitors: 523, pageViews: 1456 },
        { date: '2025-01-03', visitors: 634, pageViews: 1678 },
        { date: '2025-01-04', visitors: 789, pageViews: 1890 },
        { date: '2025-01-05', visitors: 845, pageViews: 2123 },
        { date: '2025-01-06', visitors: 923, pageViews: 2345 },
        { date: '2025-01-07', visitors: 1045, pageViews: 2567 },
    ],
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        // Simulate API call
        const fetchAnalytics = async () => {
            setIsLoading(true);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setData(mockAnalyticsData);
            setIsLoading(false);
        };

        fetchAnalytics();
    }, [timeRange]);

    if (isLoading) {
        return <LoadingState />;
    }

    if (!data) {
        return <ErrorState />;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-dark-950">
            <Container className="py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-pixelify-sans text-4xl mb-4">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Comprehensive analytics for masarif.id
                    </p>
                    
                    {/* Time Range Selector */}
                    <div className="flex gap-2">
                        {['24h', '7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    timeRange === range
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                                }`}>
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Visitors"
                        value={data.totalVisitors.toLocaleString()}
                        icon={<FaUsers />}
                        trend={12.5}
                        trendDirection="up"
                    />
                    <MetricCard
                        title="Page Views"
                        value={data.totalPageViews.toLocaleString()}
                        icon={<FaEye />}
                        trend={8.3}
                        trendDirection="up"
                    />
                    <MetricCard
                        title="Unique Visitors"
                        value={data.uniqueVisitors.toLocaleString()}
                        icon={<FaGlobe />}
                        trend={-2.1}
                        trendDirection="down"
                    />
                    <MetricCard
                        title="Bounce Rate"
                        value={`${data.bounceRate}%`}
                        icon={<FaChartLine />}
                        trend={-5.2}
                        trendDirection="up"
                    />
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Pages */}
                    <Card className="p-6">
                        <h3 className="font-pixelify-sans text-xl mb-4">Top Pages</h3>
                        <div className="space-y-4">
                            {data.topPages.map((page, index) => (
                                <div key={page.page} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium truncate">{page.page}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {page.views.toLocaleString()}
                                        </span>
                                        <div className="w-16 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${page.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Traffic Sources */}
                    <Card className="p-6">
                        <h3 className="font-pixelify-sans text-xl mb-4">Traffic Sources</h3>
                        <div className="space-y-4">
                            {data.trafficSources.map((source, index) => (
                                <div key={source.source} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getSourceColor(index)}`} />
                                        <span className="font-medium">{source.source}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {source.visitors.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium w-12 text-right">
                                            {source.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* UTM Campaigns */}
                <Card className="p-6 mb-8">
                    <h3 className="font-pixelify-sans text-xl mb-4">UTM Campaigns Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-dark-700">
                                    <th className="text-left py-3 px-4 font-medium">Campaign</th>
                                    <th className="text-left py-3 px-4 font-medium">Visitors</th>
                                    <th className="text-left py-3 px-4 font-medium">Conversions</th>
                                    <th className="text-left py-3 px-4 font-medium">Conversion Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.utmCampaigns.map((campaign) => (
                                    <tr key={campaign.campaign} className="border-b border-gray-100 dark:border-dark-800">
                                        <td className="py-3 px-4 font-medium">{campaign.campaign}</td>
                                        <td className="py-3 px-4">{campaign.visitors.toLocaleString()}</td>
                                        <td className="py-3 px-4">{campaign.conversions}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                                                {((campaign.conversions / campaign.visitors) * 100).toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Device Types and Countries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Device Types */}
                    <Card className="p-6">
                        <h3 className="font-pixelify-sans text-xl mb-4">Device Types</h3>
                        <div className="space-y-4">
                            {data.deviceTypes.map((device, index) => (
                                <div key={device.device} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {device.device === 'Mobile' && <FaMobile className="text-blue-600" />}
                                        {device.device === 'Desktop' && <FaDesktop className="text-green-600" />}
                                        {device.device === 'Tablet' && <FaTablet className="text-purple-600" />}
                                        <span className="font-medium">{device.device}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {device.visitors.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium w-12 text-right">
                                            {device.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Countries */}
                    <Card className="p-6">
                        <h3 className="font-pixelify-sans text-xl mb-4">Top Countries</h3>
                        <div className="space-y-4">
                            {data.countries.map((country, index) => (
                                <div key={country.country} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium">{country.country}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {country.visitors.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium w-12 text-right">
                                            {country.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Hourly Traffic Chart */}
                <Card className="p-6">
                    <h3 className="font-pixelify-sans text-xl mb-4">Hourly Traffic Pattern</h3>
                    <div className="flex items-end justify-between h-32 gap-1">
                        {data.hourlyTraffic.map((hour) => (
                            <div key={hour.hour} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className="bg-blue-600 rounded-t w-full min-h-[4px]"
                                    style={{
                                        height: `${(hour.visitors / Math.max(...data.hourlyTraffic.map(h => h.visitors))) * 100}%`
                                    }}
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {hour.hour.toString().padStart(2, '0')}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </Container>
        </main>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: number;
    trendDirection: 'up' | 'down';
}

function MetricCard({ title, value, icon, trend, trendDirection }: MetricCardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600 dark:text-gray-400">{icon}</div>
                <div className={`flex items-center gap-1 text-sm ${
                    trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {trendDirection === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div className="mb-2">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
            </div>
        </Card>
    );
}

function getSourceColor(index: number): string {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-gray-500',
    ];
    return colors[index % colors.length];
}

function LoadingState() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-dark-950">
            <Container className="py-8">
                <div className="mb-8">
                    <div className="h-10 bg-gray-300 dark:bg-dark-700 animate-pulse rounded-md w-64 mb-4" />
                    <div className="h-4 bg-gray-300 dark:bg-dark-700 animate-pulse rounded-md w-96 mb-6" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 bg-gray-300 dark:bg-dark-700 animate-pulse rounded-lg w-16" />
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-6">
                            <div className="h-20 bg-gray-300 dark:bg-dark-700 animate-pulse rounded-md" />
                        </Card>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <Card key={i} className="p-6">
                            <div className="h-64 bg-gray-300 dark:bg-dark-700 animate-pulse rounded-md" />
                        </Card>
                    ))}
                </div>
            </Container>
        </main>
    );
}

function ErrorState() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-dark-950">
            <Container className="py-8">
                <Card className="p-12 text-center">
                    <h2 className="font-pixelify-sans text-2xl mb-4">Failed to Load Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Unable to fetch analytics data. Please try again later.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Retry
                    </button>
                </Card>
            </Container>
        </main>
    );
}