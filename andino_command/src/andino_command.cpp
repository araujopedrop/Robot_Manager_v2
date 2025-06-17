#include "rclcpp/rclcpp.hpp"
#include "std_srvs/srv/trigger.hpp"
#include "andino_custom_interfaces/srv/save_map.hpp"

#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <csignal>
#include <cstdlib>
#include <memory>
#include <string>
#include <cstdio>
#include <filesystem>


class AndinoCommand : public rclcpp::Node
{
public:
    AndinoCommand() : Node("andino_command")
    {
    
    
    
        start_mapping_srv_ = this->create_service<std_srvs::srv::Trigger>(
            "start_mapping", std::bind(&AndinoCommand::start_mapping_cb, this, std::placeholders::_1, std::placeholders::_2));

        stop_mapping_srv_ = this->create_service<std_srvs::srv::Trigger>(
            "stop_mapping", std::bind(&AndinoCommand::stop_mapping_cb, this, std::placeholders::_1, std::placeholders::_2));

        start_saver_srv_ = this->create_service<andino_custom_interfaces::srv::SaveMap>(
            "start_map_saver", std::bind(&AndinoCommand::start_saver_cb, this, std::placeholders::_1, std::placeholders::_2));

        stop_saver_srv_ = this->create_service<std_srvs::srv::Trigger>(
            "stop_map_saver", std::bind(&AndinoCommand::stop_saver_cb, this, std::placeholders::_1, std::placeholders::_2));

        delete_map_srv_ = this->create_service<andino_custom_interfaces::srv::SaveMap>(
            "delete_map", std::bind(&AndinoCommand::delete_map_cb, this, std::placeholders::_1, std::placeholders::_2));
            
        start_and_finalize_saver_srv_ = this->create_service<andino_custom_interfaces::srv::SaveMap>(
            "start_and_finalize_map", std::bind(&AndinoCommand::start_and_finalize_saver_cb, this, std::placeholders::_1, std::placeholders::_2));

        RCLCPP_INFO(this->get_logger(), "🟢 Nodo andino_command listo.");
    }

private:
    pid_t mapping_pid_ = -1;
    pid_t saver_pid_ = -1;
    
    std::string path_maps = "/home/andino1/maps/";

    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr start_mapping_srv_;
    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr stop_mapping_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr start_saver_srv_;
    rclcpp::Service<std_srvs::srv::Trigger>::SharedPtr stop_saver_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr delete_map_srv_;
    rclcpp::Service<andino_custom_interfaces::srv::SaveMap>::SharedPtr start_and_finalize_saver_srv_;

    void start_mapping_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                          std::shared_ptr<std_srvs::srv::Trigger::Response> response)
    {
        if (mapping_pid_ > 0) {
            response->success = false;
            response->message = "andino_command: SLAM ya en ejecución.";
            RCLCPP_INFO(this->get_logger(), "andino_command: PID: %d", mapping_pid_);
            return;
        }
        
        RCLCPP_INFO(this->get_logger(), "andino_command: 🟢 Mapeando.");

        pid_t pid = fork();
        if (pid == 0) {
            setsid();
            execl("/bin/bash", "bash", "-c",
                  "source /opt/ros/humble/setup.bash && ros2 launch andino_slam slam_toolbox_online_async.launch.py",
                  (char *)NULL);
            _exit(1);
        } else if (pid > 0) {
            mapping_pid_ = pid;
            response->success = true;
            response->message = "andino_command: SLAM iniciado.";
        } else {
            response->success = false;
            response->message = "andino_command: Error al iniciar SLAM.";
        }
    }

    void stop_mapping_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                         std::shared_ptr<std_srvs::srv::Trigger::Response> response)
    {
        if (mapping_pid_ <= 0) {
            response->success = false;
            response->message = "andino_command: No hay SLAM activo.";
            return;
        }

        kill(-mapping_pid_, SIGTERM);
        waitpid(mapping_pid_, nullptr, 0);
        mapping_pid_ = -1;

        response->success = true;
        response->message = "andino_command: SLAM detenido.";
    }

    void start_saver_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                        std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response)
    {
    
        RCLCPP_INFO(this->get_logger(), "andino_command: 🟢 Guardando mapa.");
        
        if (saver_pid_ > 0) {
            response->success = false;
            response->message = "andino_command: Map saver ya en ejecución.";
            return;
        }


        std::string mapa = request->nombre;
        std::string path = "/home/andino1/maps/" + mapa;
        std::string comando = "source /opt/ros/humble/setup.bash && ros2 run nav2_map_server map_saver_cli -f " + path;

        pid_t pid = fork();
        if (pid == 0) {
            setsid();
            execl("/bin/bash", "bash", "-c", comando.c_str(), (char *)NULL);
            _exit(1);
        } else if (pid > 0) {
            saver_pid_ = pid;
            response->success = true;
            response->message = "andino_command: Mapa guardado en: " + path + ".{pgm,yaml}";
        } else {
            response->success = false;
            response->message = "andino_command: Error al iniciar map saver.";
        }
    }

    void stop_saver_cb(const std::shared_ptr<std_srvs::srv::Trigger::Request>,
                       std::shared_ptr<std_srvs::srv::Trigger::Response> response)
    {
        if (saver_pid_ <= 0) {
            response->success = false;
            response->message = "andino_command: No hay map saver activo.";
            return;
        }

        kill(-saver_pid_, SIGTERM);
        waitpid(saver_pid_, nullptr, 0);
        saver_pid_ = -1;

        response->success = true;
        response->message = "andino_command: Map saver detenido.";
    }

    void delete_map_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                       std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response)
    {
        std::string mapa = request->nombre;
        std::string base_path = "/home/ubuntu/maps/" + mapa;
        std::string path_pgm = base_path + ".pgm";
        std::string path_yaml = base_path + ".yaml";

        bool deleted_pgm = (std::remove(path_pgm.c_str()) == 0);
        bool deleted_yaml = (std::remove(path_yaml.c_str()) == 0);

        if (deleted_pgm || deleted_yaml) {
            response->success = true;
            response->message = "andino_command: 🗑️ Mapa eliminado: " + mapa;
        } else {
            response->success = false;
            response->message = "andino_command: ⚠️ No se encontró el mapa: " + mapa;
        }
    }
    
    void start_and_finalize_saver_cb(const std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Request> request,
                       std::shared_ptr<andino_custom_interfaces::srv::SaveMap::Response> response)
    {
        int status;
        
        // First part: Save Map
        RCLCPP_INFO(this->get_logger(), "andino_command: 🟢 Guardando mapa: start_and_finalize_saver_cb.");
        
        if (saver_pid_ > 0) {
            response->success = false;
            response->message = "andino_command: Map saver ya en ejecución.";
            return;
        }

        std::string mapa = request->nombre;
        std::string path = this->path_maps + mapa;
        std::string comando = "source /opt/ros/humble/setup.bash && ros2 run nav2_map_server map_saver_cli -f " + path;

        pid_t pid = fork();
        if (pid == 0) {
            setsid();
            execl("/bin/bash", "bash", "-c", comando.c_str(), (char *)NULL);
            _exit(1);
        } else if (pid > 0) {
            saver_pid_ = pid;    	
	    waitpid(pid, &status, 0);
            // Second part: Check if map was saved
            
	    if(mapWasCreated(path_maps,mapa)){
	        RCLCPP_INFO(this->get_logger(), "andino_command: 🟢 Mapa guardado.");
                // Third part: Stop mapping               
		finalize_processes();	                
                
                response->success = true;
                response->message = "andino_command: Mapa guardado en: " + path + ".{pgm,yaml}";	    
	    }
            else
	    {
	        RCLCPP_WARN(this->get_logger(), "andino_command: Mapa NO guardado.");
		finalize_processes();
		response->success = false;
		response->message = "andino_command: Mapa no guardado";
            }	            

        } else {
            finalize_processes();
            response->success = false;
            response->message = "andino_command: Error al iniciar map saver.";
        }
    }
    
    bool mapWasCreated(const std::string& folder, const std::string& fileName){
        RCLCPP_INFO(this->get_logger(), "andino_command: Buscar mapa %s en carpeta %s.", fileName.c_str(), folder.c_str());
    	for (const auto& entry : std::filesystem::directory_iterator(folder)) {
    	        RCLCPP_INFO(this->get_logger(), "andino_command: Mapa a chequear: %s ", entry.path().filename().c_str());
    		//if (entry.is_regular_file() && entry.path().filename() == fileName){
    		if (entry.path().filename() == fileName + ".yaml"){
    		        RCLCPP_INFO(this->get_logger(), "andino_command: Encontre el mapa.");
    			return true;
    		}
    	}
    	RCLCPP_INFO(this->get_logger(), "andino_command: NO encontre el mapa.");
    	return false;
    }
    
    void finalize_processes()
    {
    	if(mapping_pid_>0)
    	{
                kill(-mapping_pid_, SIGTERM);
                waitpid(mapping_pid_, nullptr, 0);
                mapping_pid_ = -1;	     
    	}
       	if(saver_pid_>0)
    	{
                kill(-saver_pid_, SIGTERM);
                waitpid(saver_pid_, nullptr, 0);
                saver_pid_ = -1;	     
    	}
    }
    
    
    
};

int main(int argc, char **argv)
{
    rclcpp::init(argc, argv);
    auto node = std::make_shared<AndinoCommand>();
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}

