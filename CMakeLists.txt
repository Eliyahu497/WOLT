cmake_minimum_required(VERSION 3.14)
project(WoltRecommender CXX)

# Use C++17 standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Define include paths so the compiler can find your .h files
include_directories(
    src/interfaces
    src/repository
    src/recommendation
)

# Create a library from your core logic files
add_library(recommender_core
    src/repository/FileStorage.cpp          
    src/recommendation/RecommendationEngine.cpp 
)

# Add compiler warnings for better code quality
target_compile_options(recommender_core PRIVATE -Wall -Wextra -Wpedantic)

# Download and setup Google Test (Official method)
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

# Build the test executable using the 'test' folder
add_executable(recommender_tests 
    test/test_algorithm.cpp 
)

# Link the test with your core logic and GTest
target_link_libraries(recommender_tests PRIVATE recommender_core GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(recommender_tests)