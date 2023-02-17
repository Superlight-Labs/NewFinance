cmake_minimum_required(VERSION 3.4.1)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 11)
set(LIB_DIR ../cpp/src/src/)

find_package(openssl REQUIRED CONFIG)

file(GLOB SOURCES CONFIGURE_DEPENDS
     "${CMAKE_CURRENT_SOURCE_DIR}/../cpp/src/src/*.cpp"
     "${CMAKE_CURRENT_SOURCE_DIR}/../cpp/src/src/mpc/*.cpp"
     "${CMAKE_CURRENT_SOURCE_DIR}/../cpp/src/src/mpc/utils/*.cpp"
     "${CMAKE_CURRENT_SOURCE_DIR}/../cpp/src/src/mpc/crypto_utils/*.cpp"
     "${CMAKE_CURRENT_SOURCE_DIR}/../cpp/src/src/mpc/mpc_protocols/*.cpp"

)

add_library(nativempc
            SHARED
            ${SOURCES}
            cpp-adapter.cpp

)

target_link_libraries(nativempc openssl::crypto)


# Specifies a path to native header files.
include_directories(
            ../cpp/src/include
            ../cpp/src/src/mpc
            ../cpp/src/src/mpc/crypto_utils
            ../cpp/src/src/mpc/mpc_protocols
            ../cpp/src/src/mpc/utils
)
