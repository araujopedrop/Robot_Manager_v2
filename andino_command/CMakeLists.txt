cmake_minimum_required(VERSION 3.5)
project(andino_command)

find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_srvs REQUIRED)
find_package(andino_custom_interfaces REQUIRED)
find_package(rosidl_default_generators REQUIRED)

add_executable(andino_command_node src/andino_command.cpp)

ament_target_dependencies(andino_command_node
  rclcpp
  std_srvs
  andino_custom_interfaces
)

include_directories(include)


install(DIRECTORY launch
  DESTINATION share/${PROJECT_NAME})

install(TARGETS
  andino_command_node
  DESTINATION lib/${PROJECT_NAME})

ament_package()





