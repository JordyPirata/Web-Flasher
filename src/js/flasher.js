import * as fastboot from 'android-fastboot';
import { XzReadableStream } from 'xzwasm';

const deviceinfo = [{
    'name': 'oneplus-enchilada',
    'nicename': 'OnePlus 6',
    'filter': {
      'product': 'sdm845'
    },
    'script': [{
        "flash": "http://localhost/system.img.xz",
        partition: 'userdata',
        name: "Flash rootfs"
      },
      {
        "flash": "http://localhost/boot.img.xz",
        partition: 'boot',
        name: "Flash boot"
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


async function fetchImage() {
  const response = await fetch('http://localhost/system.img.xz');
  // let blob = await response.blob();
  // console.log("Blob size:", blob.size, "Type:", blob.type);
  return response;
}

// Create a new FastbootDevice instance
let device = new fastboot.FastbootDevice();
window.device = device;

// Enable verbose debug logging
fastboot.setDebugLevel(2);

// Create the table
const table = document.getElementById("devices");

const row = document.createElement('TR');

const td_product = document.createElement('TD');
const td_start = document.createElement('TD');

row.appendChild(td_product);
row.appendChild(td_start);
table.appendChild(row);

async function ConnectDevice() {
  let is_connected = true;
  
  // center the text vertically

  td_product.classList.add('text-left');
  td_product.textContent = "Connecting to device...";

  try {
    await device.connect();
  } catch (error) {
    td_product.textContent = `Failed to connect to device: ${error.message}`;
    is_connected =  false;
  }

  // Check if the device is connected
  if (!is_connected) return;

  // Get the product name
  let product = await device.getVariable("product");
  
  let result;

  for (let index = 0; index < deviceinfo.length; index++) {
    const di = deviceinfo[index];
    if (di['filter']['product'] === product) {
      result = di['nicename'];
      break
    }
  }
  let status = `Connected to ${result}`;
  td_product.textContent = status;

  // Check if the button is already added
  if (td_start.children.length > 0) return;

  // Add button to start flashing
  const startButton = document.createElement('BUTTON');
  startButton.textContent = 'Start flashing';
  // add classes to tailwindcss and move to right
  startButton.classList.add('bg-[#fd961a]', 'hover:bg-[#a06713]', 'text-white', 'font-semibold', 'py-2', 'px-4', 'rounded', 'transition','ml-auto');
  startButton.addEventListener('click', StartFlashing);
  td_start.classList.add('flex', 'items-center', 'justify-center');
  td_start.appendChild(startButton);
  
}
async function StartFlashing() {
  console.log("Starting flashing");

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
  let connectResult = requestDeviceButton.addEventListener('click', ConnectDevice);

  if (connectResult) {
    
  }

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