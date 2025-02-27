import * as fastboot from 'android-fastboot';

const deviceinfo = [{
    'name': 'oneplus-enchilada',
    'nicename': 'OnePlus 6',
    'filter': {
      'product': 'sdm845'
    },
    'script': [{
        "cmd": "erase:dtbo",
        name: "Erase DTBO partition"
      },
      {
        "flash": ".img.xz",
        partition: 'userdata',
        name: "Flash rootfs"
      },
      {
        "flash": "-boot.img.xz",
        partition: 'boot',
        name: "Flash boot partition"
      },
      {
        "cmd": "reboot",
        name: "Reboot"
      },
    ]
  }
];
// Crear una instancia de FastbootDevice
let device = new fastboot.FastbootDevice();
window.device = device;

// Enable verbose debug logging
fastboot.setDebugLevel(2);

async function ConnectDevice() {
    let statusField = document.getElementById("devices");
    statusField.textContent = "Connecting to device...";

    try {
        await device.connect();
    } catch (error) {
        statusField.textContent = `Failed to connect to device: ${error.message}`;
        return;
    }

    let product = await device.getVariable("product");
    let result;
    for (let index = 0; index < deviceinfo.length; index++) {
        const di = deviceinfo[index];
        if (di['filter']['product'] === product) {
            result = di['nicename'];
            break
        }
        else
        {
            result = "Unknown device";
        }
    }

    let status = `Connected to ${result}`;
    statusField.textContent = status;
}



document.addEventListener("DOMContentLoaded", async function() {

if (navigator.usb === undefined) {

    const connectedDiv = document.getElementById('ConnectedDev');
    const SupportedDiv = document.getElementById('SupportedDev');
    const paragraph = document.getElementById("paragraph");

    paragraph.style.display = 'none';
    SupportedDiv.style.display = 'none';
    connectedDiv.style.display = 'none';
    console.error("No webusb support");
    return;
}
else 
{
    const div = document.getElementById('notsupported');
    div.style.display = 'none';
}

  // Add event listener to connect button
  const requestDeviceButton = document.getElementById('request-device');
  requestDeviceButton.addEventListener('click', ConnectDevice);

  const suppTable = document.getElementById('supporteddevices');
  for (let i = 0; i < deviceinfo.length; i++) {
    const di = deviceinfo[i];
    const row = document.createElement('TR');
    const td_name = document.createElement('TD');
    const name_link = document.createElement('A');
    name_link.innerText = di['nicename'];
    td_name.appendChild(name_link);
    row.appendChild(td_name);
    const td_codename = document.createElement('TD');
    td_codename.innerText = di['name'];
    row.appendChild(td_codename);
    suppTable.appendChild(row);
  }
}); 