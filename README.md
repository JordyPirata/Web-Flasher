# Web-Flasher

## Description
Web-Flasher is a web application that uses WebUSB to flash a Nix-Bitcoin image to your device. It provides a user-friendly interface to connect and manage devices in fastboot mode.

## Usage
1. Open the application in a web browser that supports WebUSB.
2. Put your device in fastboot mode.
3. Click on the "Give Access" button to allow the application to access your device.
4. Follow the on-screen instructions to flash the Nix-Bitcoin image to your device.

## Development
To set up the development environment, follow these steps:

1. Clone the repository.
    ``` .sh
    git clone git@github.com:JordyPirata/Web-Flasher.git
    ```
2. Install the necessary dependencies.
    ``` .sh
    npm install
    ```
3. Ensure install the [fastboot nix-package](https://github.com/JordyPirata/fastboot.js)

    **Note:** Please check the link above for more details.
4. Run dev scripts
    ``` .sh
    npm run dev
    ```
