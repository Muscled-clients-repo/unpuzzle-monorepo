import React from 'react';

const Overview: React.FC = () => {
    return (
        <div className="overview-container p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Learn Rate"
                    value="48m/hr"
                    comparison="~ 15% Higher than average"
                />
                <StatCard
                    title="Execution Rate"
                    value="20/hr"
                    comparison="~ 15% Higher than average"
                />
                <StatCard
                    title="Execution Price"
                    value="251 sec"
                    comparison="~ 15% Higher than average"
                />
                <StatCard
                    title="Quiz Stats"
                    value="24/43"
                    comparison="25sec ~ 15% Higher than average"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Least Performing Video */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Least Performing Video</h2>
                    <div className="space-y-2">
                        <p className="text-gray-700">48m/hr</p>
                        <p className="text-gray-600">The 2025 UI/UX Crash Course for Beginners</p>
                        <div className="flex justify-between">
                            <p className="text-gray-700">Execution Rate: 20hr</p>
                            <p className="text-gray-600">~ 25sec</p>
                        </div>
                        <p className="text-gray-700">Quiz Stats: 2/5</p>
                    </div>
                </div>

                {/* Watch Again */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Watch again</h2>
                    <div className="text-gray-500 italic">
                        {/* Placeholder for watch again content */}
                        Content to be added
                    </div>
                </div>
            </div>

            {/* Skills Learn Rate */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Skills Learn Rate</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-4">Keywords</th>
                                <th className="text-left py-2 px-4">Learn Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow keyword="Shopify UI Design" rate="48m/hr" />
                            <TableRow keyword="E-commerce UI" rate="22m/hr" />
                            <TableRow keyword="SaaS UI Design" rate="33m/hr" />
                            <TableRow keyword="Dashboard UI Design" rate="44m/hr" />
                            <TableRow keyword="Mobile UI Patterns" rate="55m/hr" />
                            <TableRow keyword="Web App UX" rate="60m/hr" />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Skills Overview */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Skills Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium mb-2 text-blue-600">Primary skills</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Fundamental Principles of UI Design</li>
                            <li>Complete Design Thinking Process</li>
                            <li>Wireframing and Interactive Prototyping Techniques</li>
                            <li>Conducting Effective User Research</li>
                            <li>Structuring Information Architecture Clearly</li>
                            <li>Implementing Responsive Design Concepts</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2 text-purple-600">Secondary skills</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Designing Microinteractions and Animations</li>
                            <li>Collaborating with Development Teams</li>
                            <li>Streamlining Design Handoff Processes</li>
                            <li>Effective Client Communication Techniques</li>
                            <li>Understanding Basic SEO for Designers</li>
                            <li>Implementing Version Control for Designs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper components
interface StatCardProps {
    title: string;
    value: string;
    comparison: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, comparison }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-xl font-semibold my-1">{value}</p>
            <p className="text-xs text-gray-500">{comparison}</p>
        </div>
    );
};

interface TableRowProps {
    keyword: string;
    rate: string;
}

const TableRow: React.FC<TableRowProps> = ({ keyword, rate }) => {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">{keyword}</td>
            <td className="py-2 px-4">{rate}</td>
        </tr>
    );
};

export default Overview;