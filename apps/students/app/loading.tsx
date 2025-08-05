import { LoadingSpinner } from '@unpuzzle/ui';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-6">
        <div className="relative">
          {/* Animated background circles */}
          <div 
            className="absolute -inset-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-20 blur-3xl"
            style={{
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          <div 
            className="absolute -inset-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 opacity-20 blur-2xl"
            style={{
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '1s'
            }}
          />
          
          {/* Main spinner */}
          <div className="relative">
            <LoadingSpinner size="xl" color="gradient" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Loading</h2>
          <p className="text-gray-500 text-sm">Please wait while we prepare your content</p>
        </div>
      </div>
    </div>
  );
}