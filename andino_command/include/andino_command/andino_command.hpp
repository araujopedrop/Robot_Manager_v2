#ifndef ANDINO_COMMAND_HPP
#define ANDINO_COMMAND_HPP

#include "rclcpp/rclcpp.hpp"
#include "std_srvs/srv/trigger.hpp"
#include "andino_custom_interfaces/srv/save_map.hpp"

#include <string>
#include <filesystem>
#include <memory>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <csignal>

class AndinoCommand : public rclcpp::Node
{
public:
    AndinoCommand();

private:
    pid_t mapping_pid_;
    pid_t saver_pid_;
    std::string path_maps;

    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr start_mapping_srv_;
    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr stop_mapping_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr start_saver_srv_;
    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr stop_saver_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr delete_map_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr start_and_finalize_saver_srv_;

    void start_mapping_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                          std::shared_ptr<std_srvs::srv::Trigger::Response> response);

    void stop_mapping_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                         std::shared_ptr<std_srvs::srv::Trigger::Response> response);

    void start_saver_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                        std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response);

    void stop_saver_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                       std::shared_ptr<std_srvs::srv::Trigger::Response> response);

    void delete_map_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                       std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response);

    void start_and_finalize_saver_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                                     std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response);

    bool mapWasCreated(const std::string& folder, const std::string& fileName);
    void finalize_processes();
};

#endif // ANDINO_COMMAND_HPP
