"use client";

export default function EmeraldCoach() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 px-4">
            Your AI Financial <span className="text-accent">Coach</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Get personalized insights and recommendations powered by advanced AI
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
          
          {/* Chat Interface */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* User Message */}
            <div className="flex justify-end items-start gap-2 sm:gap-3">
              <div className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-md">
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                  "I've noticed my lifestyle expenses are up 20% this month. How will this affect my savings goal?"
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-gray-600 text-lg sm:text-xl">person</span>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-accent text-lg sm:text-xl">psychology</span>
              </div>
              <div className="bg-gray-50 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl rounded-tl-sm max-w-[85%] sm:max-w-lg border border-gray-100">
                <p className="text-base sm:text-lg text-gray-900 font-semibold mb-2 sm:mb-3 leading-snug">
                  Based on your current spending, this 20% increase delays your goal by 18 days.
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  I've calculated an adjustment: if you reduce discretionary spending by ₹15,000 this week, you'll recover the timeline completely.
                </p>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                  <button className="btn btn-primary text-xs sm:text-sm justify-center">
                    Apply Suggestion
                  </button>
                  <button className="btn btn-secondary text-xs sm:text-sm justify-center">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200 flex items-center gap-2 sm:gap-3">
              <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 rounded-full flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm truncate">Ask about your goals, spending, or savings...</span>
                <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-accent transition-colors text-lg sm:text-xl flex-shrink-0 ml-2">mic</span>
              </div>
              <button className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-light transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-lg sm:text-xl">send</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
