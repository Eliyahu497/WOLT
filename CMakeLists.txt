cmake_minimum_required(VERSION 3.14)
project(WoltRecommender CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)



include_directories(
    src/interfaces
    src/repository
    src/core
    src/io
    src/commands
    src/recommendation
    src/network
)


set(CORE_SOURCES
    src/core/RecommenderServer.cpp
    src/network/SocketInput.cpp
    src/network/SocketOutput.cpp
    src/io/TerminalInput.cpp
    src/io/TerminalOutput.cpp
    src/repository/FileStorage.cpp
    src/recommendation/RecommendationEngine.cpp
    src/commands/CmdHelp.cpp
    src/commands/CmdGet.cpp
    src/commands/CmdPost.cpp
    src/commands/CmdPatch.cpp
    src/commands/CmdDelete.cpp
)


add_library(recommender_core STATIC ${CORE_SOURCES})
target_compile_options(recommender_core PRIVATE -Wall -Wextra -Wpedantic)


add_executable(wolt_recommender_app src/main.cpp)
target_link_libraries(wolt_recommender_app PRIVATE recommender_core)


include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()
add_executable(recommender_tests 
    test/test_commands.cpp 
    test/test_repository.cpp 
    test/test_algorithm.cpp
)
target_link_libraries(recommender_tests PRIVATE recommender_core GTest::gtest_main)
include(GoogleTest)
gtest_discover_tests(recommender_tests)