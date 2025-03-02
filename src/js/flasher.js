import * as fastboot from 'android-fastboot';
import { XzReadableStream } from 'xzwasm';

const deviceinfo = [{
    'name': 'oneplus-enchilada',
    'nicename': 'OnePlus 6',
    'filter': {
      'product': 'sdm845'
    },
    'script': [{
        "flash": "159.223.192.247:8080/system.img.xz",
        partition: 'userdata',
        name: "Flash rootfs"
      },
      {
        "flash": "159.223.192.247:8080/boot.img.xz",
        partition: 'boot',
        name: "Flash boot partition"
      },
      {
        "cmd": "erase:dtbo_a",
        name: "Erase DTBO partition"
      },
      {
        "cmd": "erase:dtbo_b",
        name: "Erase DTBO partition"
      },
      {
        "cmd": "reboot",
        name: "Reboot"
      },
    ]
  }
];

// Fetch the compressed file
const compressedResponse = await fetch('somefile.xz');

const decompressedResponse = new Response(
   new XzReadableStream(compressedResponse.body)
);

const text = await decompressedResponse.text();
// Create a new FastbootDevice instance
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

async function sendFormCommand(event) {
  event.preventDefault();

  let inputField = document.querySelector(".command-input");
  let command = inputField.value;
  let result = (await device.runCommand(command)).text;
  document.querySelector(".result-field").textContent = result;
  inputField.value = "";
}

async function flashFormFile(event) {
  event.preventDefault();

  let fileField = document.querySelector(".flash-file");
  let partField = document.querySelector(".flash-partition");
  let file = fileField.files[0];
  await device.flashBlob(partField.value, file);
  fileField.value = "";
  partField.value = "";
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