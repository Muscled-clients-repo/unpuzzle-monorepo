
import Overview from './Overview/Overview';

const OverviewScreen: React.FC = () => {
    return (
        <div className="p-4 md:p-8">
            {/* You can add a header or other layout elements here */}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
                <Overview />
            </div>

            {/* You can add other components below the Overview if needed */}
        </div>
    );
};

export default OverviewScreen;