const deviceinfo = [{
    'name': 'oneplus-enchilada',
    'nicename': 'OnePlus 6',
    'filter': {
      'product': 'sdm845'
    },
    'script': [{
        type: "flash",
        size: 734292888,
        // url: "https://elasticbeanstalk-us-west-2-190312923858.s3.us-west-2.amazonaws.com/boot.img.xz",
        url: "https://images.postmarketos.org/bpo/v24.12/oneplus-enchilada/gnome-mobile/20250219-1310/20250219-1310-postmarketOS-v24.12-gnome-mobile-3-oneplus-enchilada.img.xz",
        // url: "https://images.postmarketos.org/bpo/edge/oneplus-enchilada/gnome-mobile/20250214-0841/20250214-0841-postmarketOS-edge-gnome-mobile-3-oneplus-enchilada.img.xz",
        partition: "userdata",
        name: "Flash rootfs"
      },
      {
        type: "flash",
        size: 23749736,
        // url: "https://elasticbeanstalk-us-west-2-190312923858.s3.us-west-2.amazonaws.com/system.img.xz",
        url: "https://images.postmarketos.org/bpo/v24.12/oneplus-enchilada/gnome-mobile/20250219-1310/20250219-1310-postmarketOS-v24.12-gnome-mobile-3-oneplus-enchilada-boot.img.xz",
        partition: 'boot',
        name: "Flash boot"
      },
      {
        type: "cmd",
        command: "erase:dtbo",
        name: "Erase DTBO partition"
      },
      /*
      {
        type: "cmd",
        command: "erase:dtbo_a",
        name: "Erase DTBO partition"
      },
      {
        type: "cmd",
        command: "erase:dtbo_b",
        name: "Erase DTBO partition"
      },*/
      {
        type: "cmd",
        command: "reboot",
        name: "Reboot"
      },
    ]
  }
];

function readableFileSize(size) {
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = 0;
  while (size >= 1024) {
      size /= 1024;
      ++i;
  }
  return size.toFixed(1) + ' ' + units[i];
}

async function fastbootCheckResponse(device) {
  const resultPacket = await device.transferIn(1, 64);
  const result = new TextDecoder().decode(resultPacket.data);

  const statusCode = result.substring(0, 4);
  const data = result.substring(4);
  console.debug('IN', statusCode, data);
  if (statusCode === 'INFO') {
      console.info(data);
      return await fastbootCheckResponse(device);
  }
  return [statusCode, data];
}

async function fastbootCommand(device, command) {
  if (device === null) {
      console.error("Cannot run fastboot command without connected device");
      return;
  }
  console.debug('OUT', command);
  const packet = new TextEncoder().encode(command);
  await device.transferOut(1, packet);
  return await fastbootCheckResponse(device);
}

async function fastbootGetvar(device, name) {
  const res = await fastbootCommand(device, "getvar:" + name);
  if (res[0] !== "OKAY") {
      console.error(res[1]);
      return undefined;
  }
  return res[1];
}

async function fastbootRaw(device, data, progress) {
  const size = data.byteLength;
  const chunksize = 16384;
  let i = 0;
  let left = size;
  while (left > 0) {
      const chunk = data.slice(i * chunksize, (i + 1) * chunksize);
      await device.transferOut(1, chunk);
      left -= chunk.byteLength;
      i += 1;
      if (i % 8 === 0) {
          progress(1 - (left / size));
      }
  }
  progress(1.0);
}

async function fastbootDownload(device, partition, split, progress) {
  const size = split.data.byteLength;
  const sizeHex = size.toString(16).padStart(8, "0");

  let res = await fastbootCommand(device, 'download:' + sizeHex);
  if (res[0] !== 'DATA') {
      console.error('Failed download command', res[1]);
  }
  await fastbootRaw(device, split.data, progress);
  return await fastbootCheckResponse(device);
}

async function fastbootFlash(device, partition, reader, rawsize, progress) {
  const MB = 1024 * 1024;
  let size = rawsize;
  const response = new Response(reader);

  // Add a slot suffix if needed
  let has_slot = await fastbootGetvar(device, 'has-slot:' + partition) === "yes";
  if (has_slot) {
      let slot = await fastbootGetvar(device, 'current-slot');
      partition += '_' + slot;
  }

  // Determine max-download-size
  let max_download_size = await fastbootGetvar(device, 'max-download-size');
  if (max_download_size !== undefined) {
      if (!isNaN(max_download_size) && !isNaN(parseFloat(max_download_size))) {
          max_download_size = parseInt(max_download_size, 10);
      } else {
          max_download_size = parseInt(max_download_size, 16);
      }
  } else {
      max_download_size = 512 * MB;
  }
  console.log('max-download-size', readableFileSize(max_download_size));
  const blob = await response.blob();

  // Deal with logical partitions
  const is_logical = await fastbootGetvar(device, 'is-logical:' + partition) === 'yes';
  if (is_logical) {
      fastbootCommand(device, 'resize-logical-partition:' + partition + ':0');
      fastbootCommand(device, 'resize-logical-partition:' + partition + ':' + size);
  }
  let splits = 0;
  let sent = 0;
  for await(let split of sparse.splitBlob(blob, Math.max(300 * MB, max_download_size * 0.8))) {
      await fastbootDownload(device, partition, split, function (fraction) {
          // Convert chunk progress to overall progress
          progress((sent + fraction * split.bytes) / size);
      });
      await fastbootCommand(device, 'flash:' + partition);
      splits += 1;
      sent += split.bytes;
  }
}
async function StartFlashing(device) {
  console.log("Start flashing");
  td_product.textContent = "Starting flashing";
  await RunScript(device, deviceinfo[0]['script']);
}
async function RunScript(device, script) {

  for (let i = 0; i < script.length; i++) {
    const step = script[i];

    switch (step.type) {
      case 'flash':
        
        const xzResponse = await fetch(step.url);
        const res = new Response(new ReadableStream({
          async start(controller) {
            const streamReader = xzResponse.body.getReader(); // Renamed to avoid conflict
            for (; ;) {
              const { done, value } = await streamReader.read();
              if (done) break;
              controller.enqueue(value);
            }
            controller.close();
          }
        }));

        const reader = new xzwasm.XzReadableStream(res.body);
        await fastbootFlash(device, step.partition, reader, step.size, function (progress) 
        {
          console.log('Progress:', progress);
        });
        break;
      case 'cmd':
        let result = (await fastbootCommand(device,step.command)).text;
        console.log(result);
        break;
    }
  }
};

// Create the table
const table = document.getElementById("devices");

const row = document.createElement('TR');

const td_product = document.createElement('TD');
const td_start = document.createElement('TD');

row.appendChild(td_product);
row.appendChild(td_start);
table.appendChild(row);

async function OnConnectDevice(device) {
  console.log('connect', device);
  try {
    await device.open();
  } catch (err) {
      console.error(err);
  }
  try {
      await device.reset();
  } catch (err) {
      console.error(err);
  }

  try {
      await device.selectConfiguration(1);
  } catch (err) {
      console.error(err);
  }
  try {
      await device.claimInterface(0);
  } catch (err) {
      console.error(err);
  }
  // Get the product name
  const product = await fastbootGetvar(device, "product");
  let slot = await fastbootGetvar(device, "current-slot");
  if (slot === "") {
    slot = undefined;
  }
  let unlocked = await fastbootGetvar(device, "unlocked");
  if (unlocked === "yes") {
    unlocked = true;
  } else if (unlocked === undefined || unlocked === "") {
    unlocked = true;
  } else {
    unlocked = false;
  }

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
  startButton.addEventListener('click', StartFlashing(device));

  td_start.classList.add('flex', 'items-center', 'justify-center');
  td_start.appendChild(startButton);
  
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
  requestDeviceButton.addEventListener('click', async function (event) {
    event.preventDefault();
    let device;
    try {
      
      td_product.classList.add('text-left');
      td_product.textContent = "Connecting to device...";
      device = await navigator.usb.requestDevice({
        filters: [{
            classCode: 0xFF, subclassCode: 0x42, protocolCode: 0x03,
        },],
      });
    } catch (err) {
      // No device selected
      console.error(err);
    }
    if (device !== undefined) {
      OnConnectDevice(device);
    }

  });
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