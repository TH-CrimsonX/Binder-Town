const startButton = document.querySelector('#start-button');
const stopButton = document.querySelector('#stop-button');
const testSoundButton = document.querySelector('#test-sound-button');
const templateInput = document.querySelector('#template-input');
const alarmInput = document.querySelector('#alarm-input');
const alarmFileName = document.querySelector('#alarm-file-name');
const alarmModeSelect = document.querySelector('#alarm-mode');
const alarmVolumeInput = document.querySelector('#alarm-volume');
const alarmVolumeValue = document.querySelector('#alarm-volume-value');
const customAlarmAudio = document.querySelector('#custom-alarm-audio');
const targetGallery = document.querySelector('#target-gallery');
const targetCount = document.querySelector('#target-count');
const screenPreview = document.querySelector('#screen-preview');
const previewFrame = document.querySelector('#preview-frame');
const previewPlaceholder = document.querySelector('#preview-placeholder');
const detectionBox = document.querySelector('#detection-box');
const detectionMarker = document.querySelector('#detection-marker');
const cropPreviewCanvas = document.querySelector('#crop-preview-canvas');
const cropPlaceholder = document.querySelector('#crop-placeholder');
const detectionLocation = document.querySelector('#detection-location');
const detectionCoordinates = document.querySelector('#detection-coordinates');
const statusCard = document.querySelector('#status-card');
const statusTitle = document.querySelector('#status-title');
const statusMessage = document.querySelector('#status-message');
const matchBadge = document.querySelector('#match-badge');
const captureCanvas = document.querySelector('#capture-canvas');
const captureContext = captureCanvas.getContext('2d', { willReadFrequently: true });
const cropPreviewContext = cropPreviewCanvas.getContext('2d');

const maxTemplates = 10;
const scaleFactors = [0.35, 0.45, 0.55, 0.7, 0.85, 1, 1.2, 1.45, 1.7, 2];
const sampleRows = 13;
const sampleColumns = 9;
const detectionThreshold = 48;
const candidateThreshold = 56;
const candidatesPerVariant = 2;
const frameInterval = 900;

let templates = [];
let pendingTemplateCount = 0;
let stream = null;
let audioContext = null;
let scanTimer = null;
let isScanning = false;
let iconDetected = false;
let missedFrames = 0;
let alarmObjectUrl = null;
let alarmInterval = null;
let alarmIsPlaying = false;
let oneTimeAlarmPlayed = false;

function getAlarmVolume() {
  return Number(alarmVolumeInput.value) / 100;
}

function setStatus(title, message, state = 'idle') {
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusCard.dataset.state = state;
}

function setMatchBadge(message, found = false) {
  matchBadge.textContent = message;
  matchBadge.dataset.state = found ? 'found' : 'idle';
}

function clearDetectionResult() {
  detectionBox.hidden = true;
  cropPreviewCanvas.hidden = true;
  cropPlaceholder.hidden = false;
  detectionLocation.textContent = 'ยังไม่มีผลตรวจจับ';
  detectionCoordinates.textContent = 'พิกัดจะแสดงเมื่อพบไอคอน';
}

function createVariants(templateCanvas) {
  if (!templateCanvas.width || !templateCanvas.height) {
    throw new Error('ภาพต้นแบบยังโหลดไม่เสร็จ');
  }

  return scaleFactors.map((scale) => {
    const width = Math.max(1, Math.round(templateCanvas.width * scale));
    const height = Math.max(1, Math.round(templateCanvas.height * scale));
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = width;
    scaledCanvas.height = height;
    const context = scaledCanvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(templateCanvas, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height).data;
    const samples = [];
    for (let row = 0; row < sampleRows; row += 1) {
      const y = Math.min(height - 1, Math.floor(((row + 0.5) / sampleRows) * height));
      for (let column = 0; column < sampleColumns; column += 1) {
        const x = Math.min(width - 1, Math.floor(((column + 0.5) / sampleColumns) * width));
        const offset = (y * width + x) * 4;
        samples.push({
          offset,
          red: imageData[offset],
          green: imageData[offset + 1],
          blue: imageData[offset + 2],
        });
      }
    }
    return { width, height, samples, samplesData: imageData };
  });
}

function createTemplate(file, image, objectUrl) {
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  const longestSide = Math.max(sourceWidth, sourceHeight);
  const resizeRatio = Math.min(1, 80 / longestSide);
  const templateCanvas = document.createElement('canvas');
  templateCanvas.width = Math.max(1, Math.round(sourceWidth * resizeRatio));
  templateCanvas.height = Math.max(1, Math.round(sourceHeight * resizeRatio));
  const context = templateCanvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(
    image,
    0,
    0,
    sourceWidth,
    sourceHeight,
    0,
    0,
    templateCanvas.width,
    templateCanvas.height,
  );
  return {
    id: crypto.randomUUID(),
    name: file.name || 'ภาพจากคลิปบอร์ด',
    objectUrl,
    variants: createVariants(templateCanvas),
  };
}

function addTemplate(file) {
  if (!file.type.startsWith('image/')) {
    setStatus('เพิ่มภาพไม่ได้', 'กรุณาเลือกไฟล์รูปภาพ', 'error');
    return;
  }
  if (templates.length + pendingTemplateCount >= maxTemplates) {
    setStatus('เพิ่มภาพไม่ได้', `เพิ่มภาพได้สูงสุด ${maxTemplates} รูป`, 'error');
    return;
  }

  pendingTemplateCount += 1;
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.onload = () => {
    try {
      const template = createTemplate(file, image, objectUrl);
      templates.push(template);
      renderTemplates();
      setStatus('เพิ่มภาพเป้าหมายแล้ว', `กำลังค้นหาจากภาพทั้งหมด ${templates.length} รูป`);
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      setStatus('เพิ่มภาพไม่ได้', error.message, 'error');
    } finally {
      pendingTemplateCount -= 1;
    }
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    pendingTemplateCount -= 1;
    setStatus('เพิ่มภาพไม่ได้', 'อ่านไฟล์รูปภาพไม่สำเร็จ', 'error');
  };
  image.src = objectUrl;
}

function renderTemplates() {
  targetGallery.replaceChildren();
  targetCount.textContent = templates.length
    ? `${templates.length} / ${maxTemplates} รูป`
    : `เพิ่มภาพได้สูงสุด ${maxTemplates} รูป`;
  for (const template of templates) {
    const card = document.createElement('div');
    card.className = 'target-thumbnail';

    const image = document.createElement('img');
    image.src = template.objectUrl;
    image.alt = template.name;
    image.title = template.name;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-template-button';
    removeButton.type = 'button';
    removeButton.dataset.templateId = template.id;
    removeButton.setAttribute('aria-label', `ลบภาพ ${template.name}`);
    removeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

    card.append(image, removeButton);
    targetGallery.append(card);
  }
}

function getAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    throw new Error('เบราว์เซอร์นี้ไม่รองรับเสียงแจ้งเตือน');
  }
  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }
  return audioContext;
}

async function playAlert() {
  const volume = getAlarmVolume();
  if (volume === 0) {
    return;
  }

  const context = getAudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }

  [880, 660].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime + index * 0.22;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.22 * volume), startAt + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.19);
  });
}

function playTone() {
  return playAlert();
}

async function playCustomAlarm(loop = false) {
  customAlarmAudio.pause();
  customAlarmAudio.currentTime = 0;
  customAlarmAudio.loop = loop;
  customAlarmAudio.volume = getAlarmVolume();
  await customAlarmAudio.play();
}

function stopAlarm() {
  window.clearInterval(alarmInterval);
  alarmInterval = null;
  alarmIsPlaying = false;
  customAlarmAudio.pause();
  customAlarmAudio.currentTime = 0;
  customAlarmAudio.loop = false;
}

async function startAlarm() {
  const mode = alarmModeSelect.value;
  if (mode === 'once' && oneTimeAlarmPlayed) {
    return;
  }

  if (mode === 'repeat' && alarmIsPlaying) {
    return;
  }

  if (mode === 'once') {
    oneTimeAlarmPlayed = true;
  }

  try {
    if (mode === 'repeat') {
      alarmIsPlaying = true;
      if (alarmObjectUrl) {
        await playCustomAlarm(true);
      } else {
        if (getAlarmVolume() > 0) {
          await playTone();
        }
        alarmInterval = window.setInterval(() => {
          if (getAlarmVolume() === 0) {
            return;
          }
          playTone().catch((error) => {
            stopAlarm();
            setStatus('เล่นเสียงแจ้งเตือนไม่ได้', error.message, 'error');
          });
        }, 1800);
      }
      return;
    }

    if (alarmObjectUrl) {
      await playCustomAlarm();
    } else if (getAlarmVolume() > 0) {
      await playTone();
    }
  } catch (error) {
    alarmIsPlaying = false;
    window.clearInterval(alarmInterval);
    alarmInterval = null;
    if (mode === 'once') {
      oneTimeAlarmPlayed = false;
    }
    throw error;
  }
}

function findTemplate(frameData, frameWidth, frameHeight) {
  const candidates = [];

  for (const template of templates) {
    for (const variant of template.variants) {
      if (variant.width > frameWidth || variant.height > frameHeight) {
        continue;
      }

      const maxX = frameWidth - variant.width;
      const maxY = frameHeight - variant.height;
      const variantCandidates = [];
      for (let y = 0; y <= maxY; y += 4) {
        for (let x = 0; x <= maxX; x += 4) {
          let totalDifference = 0;
          let sampled = 0;
          for (const sample of variant.samples) {
            const frameOffset = ((y + Math.floor(sample.offset / 4 / variant.width)) * frameWidth
              + x
              + (sample.offset / 4) % variant.width) * 4;
            const redDifference = Math.abs(frameData[frameOffset] - sample.red);
            const greenDifference = Math.abs(frameData[frameOffset + 1] - sample.green);
            const blueDifference = Math.abs(frameData[frameOffset + 2] - sample.blue);
            totalDifference += redDifference + greenDifference + blueDifference;
            sampled += 3;
            if (totalDifference / (variant.samples.length * 3) > candidateThreshold) {
              break;
            }
          }

          if (sampled === variant.samples.length * 3) {
            const score = totalDifference / sampled;
            if (score <= candidateThreshold) {
              const candidate = { coarseScore: score, x, y, variant, template };
              if (variantCandidates.length < candidatesPerVariant) {
                variantCandidates.push(candidate);
              } else {
                let worstIndex = 0;
                for (let index = 1; index < variantCandidates.length; index += 1) {
                  if (variantCandidates[index].coarseScore > variantCandidates[worstIndex].coarseScore) {
                    worstIndex = index;
                  }
                }
                if (score < variantCandidates[worstIndex].coarseScore) {
                  variantCandidates[worstIndex] = candidate;
                }
              }
            }
          }
        }
      }
      candidates.push(...variantCandidates);
    }
  }

  candidates.sort((left, right) => left.coarseScore - right.coarseScore);
  let best = null;
  for (const candidate of candidates) {
    const { variant } = candidate;
    const minX = Math.max(0, candidate.x - 4);
    const minY = Math.max(0, candidate.y - 4);
    const maxX = Math.min(frameWidth - variant.width, candidate.x + 4);
    const maxY = Math.min(frameHeight - variant.height, candidate.y + 4);

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        let totalDifference = 0;
        let sampled = 0;
        for (let templateY = 0; templateY < variant.height; templateY += 2) {
          for (let templateX = 0; templateX < variant.width; templateX += 2) {
            const templateOffset = (templateY * variant.width + templateX) * 4;
            const frameOffset = ((y + templateY) * frameWidth + x + templateX) * 4;
            totalDifference += Math.abs(frameData[frameOffset] - variant.samplesData[templateOffset]);
            totalDifference += Math.abs(frameData[frameOffset + 1] - variant.samplesData[templateOffset + 1]);
            totalDifference += Math.abs(frameData[frameOffset + 2] - variant.samplesData[templateOffset + 2]);
            sampled += 3;
          }
        }

        const score = totalDifference / sampled;
        if (!best || score < best.score) {
          best = {
            score,
            x,
            y,
            width: variant.width,
            height: variant.height,
            name: candidate.template.name,
          };
        }
      }
    }
  }

  return best && best.score <= detectionThreshold ? best : null;
}

function updateDetection(result) {
  if (result) {
    missedFrames = 0;
    setMatchBadge('พบไอคอน', true);
    detectionBox.hidden = false;
    positionDetectionBox(result);
    showDetectionResult(result);
    if (!iconDetected) {
      iconDetected = true;
      setStatus('พบไอคอนเป้าหมาย', 'กำลังส่งเสียงแจ้งเตือน', 'active');
      startAlarm().catch((error) => {
        setStatus('พบไอคอน แต่เล่นเสียงไม่ได้', error.message, 'error');
      });
    } else {
      setStatus('พบไอคอนเป้าหมาย', 'ระบบกำลังตรวจจับต่อเนื่อง', 'active');
    }
    return;
  }

  setMatchBadge('กำลังค้นหา');
  detectionBox.hidden = true;
  if (iconDetected) {
    missedFrames += 1;
    if (missedFrames < 3) {
      return;
    }
    iconDetected = false;
    if (alarmModeSelect.value === 'repeat') {
      stopAlarm();
    }
  }
  setStatus('กำลังตรวจจับ', 'ยังไม่พบไอคอนเป้าหมาย', 'active');
}

function positionDetectionBox(result) {
  const frameWidth = previewFrame.clientWidth;
  const frameHeight = previewFrame.clientHeight;
  const scale = Math.min(frameWidth / captureCanvas.width, frameHeight / captureCanvas.height);
  const contentWidth = captureCanvas.width * scale;
  const contentHeight = captureCanvas.height * scale;
  const offsetX = (frameWidth - contentWidth) / 2;
  const offsetY = (frameHeight - contentHeight) / 2;

  detectionBox.style.left = `${((offsetX + result.x * scale) / frameWidth) * 100}%`;
  detectionBox.style.top = `${((offsetY + result.y * scale) / frameHeight) * 100}%`;
  detectionBox.style.width = `${((result.width * scale) / frameWidth) * 100}%`;
  detectionBox.style.height = `${((result.height * scale) / frameHeight) * 100}%`;
}

function showDetectionResult(result) {
  const padding = Math.max(8, Math.round(Math.min(result.width, result.height) * 0.2));
  const sourceX = Math.max(0, result.x - padding);
  const sourceY = Math.max(0, result.y - padding);
  const sourceRight = Math.min(captureCanvas.width, result.x + result.width + padding);
  const sourceBottom = Math.min(captureCanvas.height, result.y + result.height + padding);
  const sourceWidth = sourceRight - sourceX;
  const sourceHeight = sourceBottom - sourceY;

  cropPreviewCanvas.width = sourceWidth;
  cropPreviewCanvas.height = sourceHeight;
  cropPreviewContext.drawImage(
    captureCanvas,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    sourceWidth,
    sourceHeight,
  );
  cropPreviewCanvas.hidden = false;
  cropPlaceholder.hidden = true;

  const scaleX = screenPreview.videoWidth / captureCanvas.width;
  const scaleY = screenPreview.videoHeight / captureCanvas.height;
  const screenX = Math.round(result.x * scaleX);
  const screenY = Math.round(result.y * scaleY);
  const screenWidth = Math.round(result.width * scaleX);
  const screenHeight = Math.round(result.height * scaleY);
  detectionLocation.textContent = `พบภาพ: ${result.name}`;
  detectionCoordinates.textContent =
    `ซ้าย ${screenX}, บน ${screenY} · ขนาด ${screenWidth} × ${screenHeight} พิกเซล`;
}

function scanFrame() {
  if (!isScanning || screenPreview.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return;
  }

  const videoWidth = screenPreview.videoWidth;
  const videoHeight = screenPreview.videoHeight;
  const ratio = Math.min(1, 960 / videoWidth);
  const width = Math.max(1, Math.round(videoWidth * ratio));
  const height = Math.max(1, Math.round(videoHeight * ratio));
  captureCanvas.width = width;
  captureCanvas.height = height;
  captureContext.drawImage(screenPreview, 0, 0, width, height);
  const frameData = captureContext.getImageData(0, 0, width, height).data;
  updateDetection(findTemplate(frameData, width, height));
}

function stopDetection(message = 'หยุดตรวจจับแล้ว') {
  isScanning = false;
  window.clearInterval(scanTimer);
  scanTimer = null;
  if (stream) {
    const activeStream = stream;
    stream = null;
    activeStream.getTracks().forEach((track) => track.stop());
  }
  screenPreview.srcObject = null;
  previewFrame.classList.remove('is-live');
  previewPlaceholder.hidden = false;
  clearDetectionResult();
  iconDetected = false;
  missedFrames = 0;
  oneTimeAlarmPlayed = false;
  stopAlarm();
  startButton.disabled = false;
  stopButton.disabled = true;
  setMatchBadge('รอแชร์หน้าจอ');
  setStatus('ยังไม่ได้เริ่ม', message);
}

async function startDetection() {
  if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) {
    setStatus(
      'แชร์หน้าจอไม่ได้',
      'เปิดผ่าน HTTPS หรือ localhost ด้วยเบราว์เซอร์ที่รองรับ',
      'error',
    );
    return;
  }

  startButton.disabled = true;
  setStatus('กำลังเตรียมระบบ', 'รอเลือกหน้าจอที่ต้องการแชร์', 'active');

  try {
    if (templates.length === 0) {
      throw new Error('วางหรือเลือกภาพเป้าหมายก่อนเริ่มตรวจจับ');
    }
    const context = getAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }
    const selectedStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 8, max: 12 } },
      audio: false,
    });
    stream = selectedStream;
    screenPreview.srcObject = selectedStream;
    await screenPreview.play();
    previewFrame.classList.add('is-live');
    previewPlaceholder.hidden = true;
    isScanning = true;
    iconDetected = false;
    missedFrames = 0;
    oneTimeAlarmPlayed = false;
    stopAlarm();
    clearDetectionResult();
    stopButton.disabled = false;
    setStatus('กำลังตรวจจับ', 'ยังไม่พบไอคอนเป้าหมาย', 'active');
    setMatchBadge('กำลังค้นหา');
    selectedStream.getVideoTracks()[0].addEventListener('ended', () => {
      if (isScanning) {
        stopDetection('การแชร์หน้าจอสิ้นสุดแล้ว');
      }
    }, { once: true });
    scanTimer = window.setInterval(scanFrame, frameInterval);
    scanFrame();
  } catch (error) {
    stopDetection('เริ่มแชร์หน้าจอไม่สำเร็จ');
    setStatus('เริ่มตรวจจับไม่ได้', error.message || 'คุณอาจยกเลิกการแชร์หน้าจอ', 'error');
  }
}

function handlePaste(event) {
  const items = Array.from(event.clipboardData?.items || []);
  const imageFiles = items
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .filter(Boolean);
  if (imageFiles.length === 0) {
    return;
  }

  event.preventDefault();
  imageFiles.forEach(addTemplate);
}

function loadCustomAlarm(file) {
  if (!file.type.startsWith('audio/')) {
    setStatus('เลือกเสียงไม่ได้', 'กรุณาเลือกไฟล์เสียง', 'error');
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const probe = new Audio();
  probe.preload = 'metadata';
  probe.onloadedmetadata = () => {
    stopAlarm();
    if (alarmObjectUrl) {
      URL.revokeObjectURL(alarmObjectUrl);
    }
    alarmObjectUrl = objectUrl;
    customAlarmAudio.src = objectUrl;
    alarmFileName.textContent = file.name;
    setStatus('เพิ่มไฟล์เสียงแล้ว', 'กด “ทดสอบเสียงแจ้งเตือน” เพื่อทดลองฟัง');
    if (isScanning && iconDetected && alarmModeSelect.value === 'repeat') {
      startAlarm().catch((error) => {
        setStatus('เล่นเสียงแจ้งเตือนไม่ได้', error.message, 'error');
      });
    }
  };
  probe.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    setStatus('โหลดไฟล์เสียงไม่ได้', 'ไฟล์อาจเสียหรือเบราว์เซอร์ไม่รองรับรูปแบบนี้', 'error');
  };
  probe.src = objectUrl;
}

startButton.addEventListener('click', startDetection);
stopButton.addEventListener('click', () => stopDetection());
alarmVolumeInput.addEventListener('input', () => {
  const percentage = Number(alarmVolumeInput.value);
  alarmVolumeValue.value = `${percentage}%`;
  alarmVolumeValue.textContent = `${percentage}%`;
  customAlarmAudio.volume = percentage / 100;
});
testSoundButton.addEventListener('click', () => {
  const testPlayback = alarmObjectUrl
    ? (() => {
      const previewAudio = new Audio(alarmObjectUrl);
      previewAudio.volume = getAlarmVolume();
      return previewAudio.play();
    })()
    : getAlarmVolume() > 0
      ? playTone()
      : Promise.resolve();
  testPlayback.then(() => {
    setStatus(
      'กำลังทดสอบเสียง',
      alarmObjectUrl ? 'กำลังเล่นไฟล์เสียงที่เลือก' : 'หากไม่ได้ยิน ให้ตรวจสอบระดับเสียงของอุปกรณ์',
    );
  }).catch((error) => {
    setStatus('เล่นเสียงไม่ได้', error.message, 'error');
  });
});
alarmModeSelect.addEventListener('change', () => {
  stopAlarm();
  if (iconDetected) {
    startAlarm().catch((error) => {
      setStatus('เล่นเสียงแจ้งเตือนไม่ได้', error.message, 'error');
    });
  }
});
customAlarmAudio.addEventListener('error', () => {
  if (alarmObjectUrl) {
    stopAlarm();
    setStatus('โหลดไฟล์เสียงไม่ได้', 'เลือกไฟล์เสียงอื่นที่เบราว์เซอร์รองรับ', 'error');
  }
});
customAlarmAudio.addEventListener('ended', () => {
  if (!customAlarmAudio.loop) {
    alarmIsPlaying = false;
  }
});
alarmInput.addEventListener('change', () => {
  const file = alarmInput.files[0];
  if (file) {
    loadCustomAlarm(file);
  }
  alarmInput.value = '';
});
templateInput.addEventListener('change', () => {
  Array.from(templateInput.files).forEach(addTemplate);
  templateInput.value = '';
});
targetGallery.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.remove-template-button');
  if (!removeButton) {
    return;
  }

  const templateIndex = templates.findIndex((template) => template.id === removeButton.dataset.templateId);
  if (templateIndex === -1) {
    return;
  }

  const [removedTemplate] = templates.splice(templateIndex, 1);
  URL.revokeObjectURL(removedTemplate.objectUrl);
  renderTemplates();
  setStatus(
    templates.length ? 'ลบภาพเป้าหมายแล้ว' : 'ยังไม่มีภาพเป้าหมาย',
    templates.length ? `กำลังค้นหาจากภาพทั้งหมด ${templates.length} รูป` : 'เพิ่มภาพได้สูงสุด 10 รูป',
  );
});
document.addEventListener('paste', handlePaste);

alarmVolumeInput.dispatchEvent(new Event('input'));
