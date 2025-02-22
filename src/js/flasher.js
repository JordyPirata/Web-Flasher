
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

async function onConnectDevice(device) {

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
  else {
    const div = document.getElementById('notsupported');

    div.style.display = 'none';
  }
  
  let devices = await navigator.usb.getDevices();
  for (let i = 0; i < devices.length; i++) {
    onConnectDevice(devices[i]);
  }
  
  const requestDeviceButton = document.getElementById('request-device');
  requestDeviceButton.addEventListener('click', async function(event) {
    event.preventDefault();
    let device;
    try {
      device = await navigator.usb.requestDevice({
        filters: [{
          classCode: 0xFF,
          subclassCode: 0x42,
          protocolCode: 0x03,
        }, ],
      });
    } catch (err) {
      // No device selected
      console.error(err);
    }
    if (device !== undefined) {
      onConnectDevice(device);
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