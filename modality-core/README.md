# Modality Core

Modality Core is an ESP-IDF oriented software designed for the ESP32-S3 board. This project aims to create a robust ground station that can seamlessly integrate with the Modality software (Flutter part) for enhanced meshing capabilities.

## Features

- **ESP-IDF Integration**: Leverages the ESP-IDF framework for efficient development on the ESP32-S3 board.
- **Ground Station**: Acts as a central hub for communication and control.
- **Modality Integration**: Ready to mesh with the Modality software built using Flutter.

## Getting Started

### Prerequisites

- ESP-IDF installed on your development machine.
- ESP32-S3 board.
- Flutter environment set up for the Modality software.

### Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/yourusername/modality-core.git
  ```
2. Navigate to the project directory:
  ```sh
  cd modality-core
  ```
3. Set up the ESP-IDF environment:
  ```sh
  . $HOME/esp/esp-idf/export.sh
  ```
4. Build the project:
  ```sh
  idf.py build
  ```
5. Flash the firmware to the ESP32-S3 board:
  ```sh
  idf.py flash
  ```

## Usage

1. Power on the ESP32-S3 board.
2. Connect to the ground station via the designated communication protocol.
3. Use the Modality software (Flutter part) to interact with the ground station.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or support, please contact [PatrickChoDev](https://github.com/PatrickChoDev).
