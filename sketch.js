let thresh = 210;
let inverted = 0;

let raw;
function setup() {
  createCanvas(windowWidth, windowHeight);
  inp = createFileInput(handle);
  inp.position(0,0);
  inp.size(width,height);
  
  noStroke();
  fill(0);
  for (let i = 0; i < 64 * 64; i++) {
    pix.push(1);
    screen.push(1);
  }
  c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ=-";
}
let c;
let pix = [];
let ppix = [];
let data = "";
let frames = 0;
let a = 0;
let i = 0;
let printed = false;
let screen = [];
let cp = false;
let inputed = false;
function handle(file) {
  raw = createVideo(file.data);
  raw.loop();
  raw.size(128, 64);
  raw.hide();
  
  vid = createVideo(file.data);
  vid.loop();
  vid.position(0, 5*64);
  
  inputed=true;
  inp.hide();
}
function draw() {
  if (!printed && frameCount % 2 === 0 && inputed) {
    raw.loadPixels();
    ppix = pix;
    pix = [];
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 128; x+=2) {
        let i = (x/2+128*y)*4;
        let a = raw.pixels[i] + raw.pixels[i + 1] + raw.pixels[i + 2];
        if (abs(a) / 3 < thresh) {
          pix.push(abs(inverted - 1));
        } else {
          pix.push(inverted);
        }
      }
    }
    if (frames > 1) {
      i = 0;
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          if (pix[i] !== ppix[i]) {
            data += c[x] + c[y];
            b = i;
            screen[b] = abs(screen[b] - 1);
          }
          i++;
        }
      }
    }
    background(20);
    i = 0;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        noStroke();
        if (screen[i] === 1) {
          fill(2, 3, 2);
        } else {
          fill(130, 155, 145);
        }
        rect(x * 10, y * 5, 10, 5);
        i++;
      }
    }

    frames++;
  }
  if (mouseIsPressed && !printed && inputed) {
    saveTextAsBin(data, "video.bin");
    printed = true;
  }
  fill(255, 0, 0);
  textSize(20);
  text(data.length, 20, 20);
}
function saveTextAsBin(text, filename) {
  // Convert the text to a Blob
  let blob = new Blob([text], { type: "text" });

  // Create a link element
  let link = document.createElement("a");

  // Set the download attribute with the filename
  link.download = filename;

  // Create a URL for the Blob and set it as the href attribute
  link.href = window.URL.createObjectURL(blob);

  // Append the link to the body
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}
