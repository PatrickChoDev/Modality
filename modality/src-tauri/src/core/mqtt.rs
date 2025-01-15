use rumqttc::{Client, MqttOptions, QoS};
use std::time::Duration;
use std::error::Error;
use mdns_sd::{ServiceDaemon, ServiceInfo};
use std::net::IpAddr;

// Add Send + Sync traits to make MqttCluster thread-safe
#[derive(Sized)]
pub struct MqttCluster {
  client: Client,
  
}

// Implement Send + Sync explicitly
unsafe impl Send for MqttCluster {}
unsafe impl Sync for MqttCluster {}

impl MqttCluster {
  pub fn new(broker_address: &str, port: u16, client_id: &str) -> Result<Self, Box<dyn Error>> {
    let mut mqtt_options = MqttOptions::new(client_id, broker_address, port);
    mqtt_options.set_keep_alive(Duration::from_secs(5));
    
    let (client, mut connection) = Client::new(mqtt_options, 10);
    
    // Spawn a thread to handle incoming messages
    std::thread::spawn(move || {
      loop {
        for notification in connection.iter() {
          match notification {
            Ok(event) => println!("Event: {:?}", event),
            Err(e) => println!("Error: {:?}", e),
          }
        }
      }
    });

    Ok(MqttCluster { client })
  }

  pub fn subscribe(&mut self, topic: &str) -> Result<(), Box<dyn Error>> {
    self.client.subscribe(topic, QoS::AtLeastOnce)?;
    Ok(())
  }

  pub fn publish(&mut self, topic: &str, payload: &[u8]) -> Result<(), Box<dyn Error>> {
    self.client.publish(topic, QoS::AtLeastOnce, false, payload)?;
    Ok(())
  }
}

// Example usage:
pub fn create_wlan_mqtt_cluster() -> Result<MqttCluster, Box<dyn Error>> {
  let cluster = MqttCluster::new("localhost", 1883, "wlan_client")?;
  Ok(cluster)
}
pub fn discover_mqtt_cluster() -> Option<(String, u16)> {
  let mdns = ServiceDaemon::new().ok()?;
  let receiver = mdns.browse("_monitor._modality._tcp.local.").ok()?;

  // Wait for a short time to discover services
  std::thread::sleep(Duration::from_secs(1));

  for service in receiver.try_iter() {
    match service {
      Ok(ServiceEvent::ServiceResolved(info)) => {
        if let Some(addr) = info.get_addresses().first() {
          return Some((addr.to_string(), info.get_port()));
        }
      }
      _ => continue,
    }
  }
  None
}

pub fn setup_mqtt_cluster() -> Result<MqttCluster, Box<dyn Error>> {
  // First try to discover existing cluster
  if let Some((host, port)) = discover_mqtt_cluster() {
    println!("Joining existing MQTT cluster at {}:{}", host, port);
    return MqttCluster::new(&host, port, "wlan_client");
  }

  // If no existing cluster found, create new one
  println!("Creating new MQTT cluster");
  create_wlan_mqtt_cluster()
}