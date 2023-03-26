// Create a new AudioContext object
var context = new AudioContext();

// Set the initial frequency and volume values
var frequency = 440;
var volume = 0.5;

// Create a gain node for the volume control
const volumeControl = context.createGain();
volumeControl.gain.value = volume;

// Add an event listener to the document to capture mouse movement events
document.addEventListener("mousemove", function(event) {
	// Calculate the new frequency and volume values based on the mouse position
	frequency = event.clientX;
	volume = event.clientY / window.innerHeight;

	// Limit the frequency and volume values to reasonable ranges
	if (frequency < 20) {
		frequency = 20;
	}
	if (frequency > 2000) {
		frequency = 2000;
	}
	if (volume < 0) {
		volume = 0;
	}
	if (volume > 1) {
		volume = 1;
	}

	// Generate a new oscillator with the updated frequency and volume values
	var oscillator = context.createOscillator();
	oscillator.type = "square";
	oscillator.frequency.value = frequency;
	volumeControl.gain.value = volume;
	oscillator.connect(volumeControl);
	volumeControl.connect(context.destination);
	oscillator.start();
	oscillator.stop(context.currentTime + 0.1);
});


// Create a waveform visualization
const canvas = document.createElement('canvas');
//canvas.style.backgroundColor = "red";
canvas.width = 400;
canvas.height = 200;
const canvasCtx = canvas.getContext('2d');
canvasCtx.strokeStyle = '#888';

function drawWaveform(buffer) {
  const width = canvas.width;
  const height = canvas.height;
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.beginPath();
  const sliceWidth = width / buffer.length;
  let x = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = buffer[i] / 128.0;
    const y = (v * height) / 2;
    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  canvasCtx.stroke();
}

// Connect the audio nodes
//volumeControl.connect(context.destination);

// Create an analyser node for the waveform visualization
const analyser = context.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);
//analyser.connect(volumeControl);

// Add event listeners to update the waveform visualization
canvas.addEventListener('mousedown', () => {
  context.resume();
});

function updateWaveform() {
  requestAnimationFrame(updateWaveform);
  analyser.getByteTimeDomainData(dataArray);
  drawWaveform(dataArray);
}
updateWaveform();

// Add the canvas to the HTML
document.querySelector('.theremin').appendChild(canvas);