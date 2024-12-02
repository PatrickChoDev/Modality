# Modality

**Modality** is a comprehensive software solution designed for the ESP32-S3 board, aimed at creating a robust ground station. This project leverages Tauri for building the Rust backend and implements a React frontend with Redux for state management. Modality seamlessly integrates with the Modality Core to enhance meshing capabilities, allowing for efficient management of multiple ground station devices simultaneously.

## Installation

To install the necessary dependencies, run:
```sh
git clone https://github.com/PatrickChoDev/modality-ui.git
cd modality-ui
```

## Features

- **Cross-Platform Compatibility**: Runs seamlessly on Windows, macOS, and Linux.
- **Modern Technology Stack**: Built with Rust, Tauri, React, and Redux.
- **User-Friendly Interface**: Intuitive and easy-to-navigate UI/UX.
- **Lightweight**: No need for a command-line interface, making it accessible for all users.
- **Ground Station Management**: Capable of managing sounding rocket ground stations, including device meshing for multiple ground station devices simultaneously.

## Getting Started

### Prerequisites

- Rust and Cargo installed on your development machine.
- Node.js and npm installed.
- Tauri CLI installed.

### Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/PatrickChODev/modality.git
  ```
2. Navigate to the project directory:
  ```sh
  cd modality/modality
  ```
3. Install the dependencies using pnpm:
  ```sh
  pnpm install
  ```
4. Build the Tauri application:
  ```sh
  pnpm run tauri build
  ```

### Tauri Rust Setup

1. Ensure you have Rust and Cargo installed. You can install Rust using `rustup`:
  ```sh
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
2. Install the Tauri CLI:
  ```sh
  cargo install tauri-cli
  ```

## Usage

1. Build the release version of Modality
  ```sh
  cargo tauri bundle
  ```
2. Install the package that suits your OS from the `target` directory.
  ```sh
  cd src-tauri/target/release
  ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the BSD 3-Clause License.

## Contact

For any inquiries or support, please contact [PatrickChoDev](https://github.com/PatrickChoDev).