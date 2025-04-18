import React, { useState, useEffect } from "react";
import ReviewCardComponent from "../components/ReviewCardComponent";
import FooterComponent from "../components/FooterComponent";
import plane from "../assets/images/plane2.jpg";
import NavigationBarComponent from "../components/NavigationBarComponent";

export interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface ReviewsPageProps {
  reviews: Review[];
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews }) => {
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [ratingFilters, setRatingFilters] = useState<number[]>([5, 4, 3, 2, 1]);
  const [timePeriod, setTimePeriod] = useState<string>("All time");
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  const [ratingCollapsed, setRatingCollapsed] = useState<boolean>(false);
  const [timeCollapsed, setTimeCollapsed] = useState<boolean>(false);

  const toggleFilters = (): void => {
    setFiltersVisible(!filtersVisible);
  };

  const toggleRatingCollapse = (): void => {
    setRatingCollapsed(!ratingCollapsed);
  };

  const toggleTimeCollapse = (): void => {
    setTimeCollapsed(!timeCollapsed);
  };

  const handleRatingFilterChange = (rating: number): void => {
    if (ratingFilters.includes(rating)) {
      const newFilters = ratingFilters.filter((r) => r !== rating);
      setRatingFilters(newFilters);
      applyRatingAndTimeFilters(newFilters, timePeriod);
    } else {
      const newFilters = [...ratingFilters, rating];
      setRatingFilters(newFilters);
      applyRatingAndTimeFilters(newFilters, timePeriod);
    }
  };

  const handleTimePeriodChange = (period: string): void => {
    setTimePeriod(period);
    applyRatingAndTimeFilters(ratingFilters, period);
  };

  const applyRatingAndTimeFilters = (
    ratings: number[],
    period: string
  ): void => {
    let result = [...reviews];

    if (ratings.length > 0 && ratings.length < 5) {
      result = result.filter((review) => ratings.includes(review.rating));
    }

    if (period !== "All time") {
      const now = new Date();
      if (period === "Last month") {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
        result = result.filter((review) => new Date(review.date) >= lastMonth);
      } else if (period === "Last year") {
        const lastYear = new Date(now.setFullYear(now.getFullYear() - 1));
        result = result.filter((review) => new Date(review.date) >= lastYear);
      }
    }

    setFilteredReviews(result);
    setIsFilterApplied(true);
  };

  const resetFilters = (): void => {
    setRatingFilters([5, 4, 3, 2, 1]);
    setTimePeriod("All time");
    setFilteredReviews(reviews);
    setIsFilterApplied(false);
  };

  useEffect(() => {
    if (!isFilterApplied) {
      setFilteredReviews(reviews);
    }
  }, [reviews, isFilterApplied]);

  return (
    <div className="min-h-screen bg-white">
      <NavigationBarComponent />
      <div className="w-full bg-cover bg-center mb-10 py-12" 
        style={{ 
          backgroundImage: `url(${plane})`,
          position: 'relative'
        }}>
        <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
        <div className="flex justify-between items-center px-8 relative z-10">
        <h1 className="text-2xl font-bold text-white ml-8">
          Customer Reviews
        </h1>
        </div>
        
      </div>
      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col md:flex-row w-full">
            {filtersVisible && (
              <div className="w-full md:w-64 min-h-60 bg-white px-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-[#1B3A4B]">
                    Filter Reviews
                  </h3>
                  <button
                    className="text-[#455A64] text-sm hover:text-[#1B3A4B]"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>

                {/* Rating filter */}
                <div className="mb-8 border-t border-[#ECEFF1] pt-4">
                  <div
                    className="flex items-center justify-between mb-2 cursor-pointer"
                    onClick={toggleRatingCollapse}
                  >
                    <h4 className="text-base font-medium text-[#1B3A4B]">
                      Rating
                    </h4>
                  </div>
                  <div className="transition-all">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center mb-3">
                        <div
                          className={`w-5 h-5 rounded-sm ${
                            ratingFilters.includes(rating)
                              ? "bg-[#1B3A4B]"
                              : "border border-[#455A64] bg-white"
                          } flex items-center justify-center mr-3 cursor-pointer`}
                          onClick={() => handleRatingFilterChange(rating)}
                        >
                          {ratingFilters.includes(rating) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <label
                          className="text-[#455A64] text-sm cursor-pointer"
                          onClick={() => handleRatingFilterChange(rating)}
                        >
                          {rating} {rating === 1 ? "Star" : "Stars"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8 border-t border-[#ECEFF1] pt-4">
                  <div
                    className="flex items-center justify-between mb-2 cursor-pointer"
                    onClick={toggleTimeCollapse}
                  >
                    <h4 className="text-base font-medium text-[#1B3A4B]">
                      Time Period
                    </h4>
                  </div>

                  <div className="transition-all">
                    {["Last month", "Last year", "All time"].map((period) => (
                      <div key={period} className="flex items-center mb-3">
                        <div
                          className="w-5 h-5 rounded-full border border-[#455A64] flex items-center justify-center mr-3 cursor-pointer"
                          onClick={() => handleTimePeriodChange(period)}
                        >
                          {timePeriod === period && (
                            <div className="w-3 h-3 rounded-full bg-[#1B3A4B]"></div>
                          )}
                        </div>
                        <label
                          className="text-[#455A64] text-sm cursor-pointer"
                          onClick={() => handleTimePeriodChange(period)}
                        >
                          {period}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews content section */}
            <div className="flex-1 bg-white">
              <div className="px-4">
                <button
                  onClick={toggleFilters}
                  className="inline-flex items-center text-sm text-[#455A64] hover:text-[#1B3A4B]"
                >
                  {filtersVisible ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1.5"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <span>Hide Filters</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1.5"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      <span>Show Filters</span>
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 px-4 py-6">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review, index) => (
                    <ReviewCardComponent
                      key={index}
                      name={review.name}
                      date={review.date}
                      rating={review.rating}
                      comment={review.comment}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-[#455A64]">
                    <p className="text-lg font-medium">
                      No reviews found matching your filters
                    </p>
                    <button
                      className="mt-4 text-[#1B3A4B] underline hover:text-[#0D1B2A]"
                      onClick={resetFilters}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ReviewsPage;
