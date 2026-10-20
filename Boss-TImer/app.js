const state = {
  bosses: [],
  activeCategory: 'Elite',
  soundEnabled: true,
  alertTriggered: new Set(),
  warningTriggered: new Set(),
  channelWarningTriggered: new Set()
};

const WARNING_SOUNDS = {
  'Mini-Boss': './sound/มี Mini Boss กำลังจะเกิดในอีกหนึ่งนาที.mp3',
  'Field Boss': './sound/มี Field Boss กำลังจะเกิดในอีกสามนาที.mp3'
};

const LOCAL_STORAGE_KEY = 'binder-town-boss-timers';
const RECORD_NAME_KEY = 'binder-town-record-name';
const CHANNEL_STORAGE_KEY = 'binder-town-channel-timers';

const elements = {
  bossGrid: document.getElementById('boss-grid'),
  dialog: document.getElementById('update-dialog'),
  form: document.getElementById('update-form'),
  bossName: document.getElementById('boss-name'),
  recordName: document.getElementById('record-name'),
  recordIp: document.getElementById('record-ip'),
  remainingHours: document.getElementById('remaining-hours'),
  remainingMins: document.getElementById('remaining-mins'),
  remainingSecs: document.getElementById('remaining-secs'),
  closeDialog: document.getElementById('close-dialog'),
  detailDialog: document.getElementById('boss-detail-dialog'),
  closeDetailDialog: document.getElementById('close-detail-dialog'),
  detailImage: document.getElementById('detail-image'),
  detailCategory: document.getElementById('detail-category'),
  detailName: document.getElementById('detail-name'),
  detailMeta: document.getElementById('detail-meta'),
  detailOverview: document.getElementById('detail-overview'),
  detailMatchup: document.getElementById('detail-matchup'),
  detailTraits: document.getElementById('detail-traits'),
  tabs: document.querySelectorAll('.tab-btn')
};

let activeBossSlug = null;
let soundContext = null;

function getLocalTimerData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveLocalTimerData(data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to persist local timer data', error);
  }
}

function getChannelTimerData() {
  try {
    const raw = localStorage.getItem(CHANNEL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveChannelTimerData(data) {
  try {
    localStorage.setItem(CHANNEL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Unable to persist channel timer data', error);
  }
}

function updateBossTimerInState(slug, timerRecord) {
  state.bosses = state.bosses.map((boss) => {
    if (boss.slug !== slug) {
      return boss;
    }

    return {
      ...boss,
      timer: timerRecord
    };
  });
}

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getTimerRemainingSeconds(timer) {
  if (!timer) {
    return 0;
  }

  const remainingHours = Number(timer.remainingHours ?? 0);
  const remainingMinutes = Number(timer.remainingMinutes ?? 0);
  const remainingSeconds = Number(timer.remainingSeconds ?? 0);

  if (!Number.isFinite(remainingHours) || !Number.isFinite(remainingMinutes) || !Number.isFinite(remainingSeconds)) {
    return 0;
  }

  return Math.max(0, (remainingHours * 3600) + (remainingMinutes * 60) + remainingSeconds);
}

function getEffectiveRemainingSeconds(boss) {
  if (!boss.timer) {
    return boss.respawnMinutes * 60;
  }

  const created = new Date(boss.timer.updatedAt).getTime();
  const elapsedSeconds = (Date.now() - created) / 1000;
  return Math.max(0, getTimerRemainingSeconds(boss.timer) - elapsedSeconds);
}

function playAlertTone() {
  if (!state.soundEnabled) {
    return;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  if (!soundContext) {
    soundContext = new AudioCtx();
  }

  const oscillator = soundContext.createOscillator();
  const gainNode = soundContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(soundContext.destination);
  oscillator.type = 'triangle';
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.04;

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, soundContext.currentTime + 0.3);
  oscillator.stop(soundContext.currentTime + 0.35);
}

function playBossSpawnTone() {
  if (!state.soundEnabled) {
    return;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  if (!soundContext) {
    soundContext = new AudioCtx();
  }

  const oscillator = soundContext.createOscillator();
  const gainNode = soundContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(soundContext.destination);
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(220, soundContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, soundContext.currentTime + 0.12);

  gainNode.gain.setValueAtTime(0.0001, soundContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.06, soundContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, soundContext.currentTime + 0.45);

  oscillator.start();
  oscillator.stop(soundContext.currentTime + 0.5);
}

function playBossWarningSound(boss) {
  if (!state.soundEnabled || !boss || !WARNING_SOUNDS[boss.category]) {
    return;
  }

  const audio = new Audio(encodeURI(WARNING_SOUNDS[boss.category]));
  audio.volume = 1;
  audio.play().catch(() => {});
}

function updateSoundToggleButtons() {
  const enabled = state.soundEnabled;

  const globalButton = document.getElementById('global-sound-toggle');
  if (globalButton) {
    globalButton.textContent = enabled ? '🔊' : '🔇';
    globalButton.classList.toggle('muted', !enabled);
    globalButton.setAttribute('aria-label', enabled ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน');
  }

  document.querySelectorAll('[data-toggle-alert]').forEach((button) => {
    button.textContent = enabled ? '🔊' : '🔇';
    button.classList.toggle('muted', !enabled);
    button.setAttribute('aria-label', enabled ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน');
  });
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  updateSoundToggleButtons();
}

function setAutoIp() {
  fetch('https://api.ipify.org?format=json')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.ip) {
        elements.recordIp.value = data.ip;
        elements.recordIp.readOnly = true;
        elements.recordIp.setAttribute('title', 'IP ถูกกำหนดอัตโนมัติ');
      }
    })
    .catch(() => {
      elements.recordIp.value = 'Auto-detect failed';
      elements.recordIp.readOnly = true;
    });
}

function renderBossCard(boss) {
  const remaining = getEffectiveRemainingSeconds(boss);
  const hasTimer = Boolean(boss.timer);
  const lastNote = !hasTimer
    ? 'ยังไม่มีข้อมูลเวลาใหม่'
    : remaining > 0
      ? 'กำลังนับถอยหลัง'
      : 'การนับถอยหลังเสร็จสิ้น<br>ยังไม่มีข้อมูลเวลาใหม่';
  const detailsLink = boss.detailsUrl || 'https://wiki.bindertowngame.com/bosses';
  const soundButton = boss.category === 'Elite'
    ? ''
    : `
      <button
        class="card-sound-toggle ${state.soundEnabled ? 'enabled' : 'muted'}"
        type="button"
        data-toggle-alert="${boss.slug}"
        aria-label="${state.soundEnabled ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน'}"
      >${state.soundEnabled ? '🔊' : '🔇'}</button>
    `;

  const fieldInlineForm = boss.category === 'Field Boss' ? `
    <div class="field-inline-form">
      <div class="field-inline-grid">
        <label>
          <span>ชั่วโมง</span>
          <input type="number" min="0" max="99" step="1" inputmode="numeric" maxlength="2" value="${boss.timer ? boss.timer.remainingHours ?? 0 : 0}" placeholder="0" data-field-hours="${boss.slug}" />
        </label>
        <label>
          <span>นาที</span>
          <input type="number" min="0" max="59" step="1" inputmode="numeric" maxlength="2" value="${boss.timer ? boss.timer.remainingMinutes : 0}" placeholder="0" data-field-minutes="${boss.slug}" />
        </label>
        <label>
          <span>วินาที</span>
          <input type="number" min="0" max="59" step="1" inputmode="numeric" maxlength="2" value="${boss.timer ? boss.timer.remainingSeconds : 0}" placeholder="0" data-field-seconds="${boss.slug}" />
        </label>
      </div>
      <button class="primary-btn field-inline-save" type="button" data-field-save="${boss.slug}">บันทึกเวลา</button>
    </div>
  ` : '';

  const footerActions = boss.category === 'Field Boss'
    ? `
      <div class="button-group compact-button-group">
        <button class="secondary-btn detail-link" type="button" data-view-details="${boss.slug}">รายละเอียดเพิ่มเติม</button>
      </div>
    `
    : `
      <div class="button-group">
        <button class="secondary-btn detail-link" type="button" data-view-details="${boss.slug}">รายละเอียดเพิ่มเติม</button>
        <button class="secondary-btn" type="button" data-open-update="${boss.slug}">บันทึกเวลา</button>
      </div>
    `;

  return `
    <article class="boss-card" data-slug="${boss.slug}">
      <div class="boss-head">
        <img class="boss-thumb" src="${boss.image}" alt="${boss.name}" onerror="this.onerror=null;this.src='https://wiki.bindertowngame.com/img/ui/logo.png';" />
        <div class="boss-head-main">
          <h3 class="boss-title">${boss.name}</h3>
          <div class="boss-meta">
            <span>Lv ${boss.level}</span>
            <span class="boss-map"><i class="fa-solid fa-location-dot"></i> ${boss.map}</span>
          </div>
        </div>
        ${soundButton}
      </div>

      <div class="countdown-wrap">
        <div>
          <div class="countdown-label">เวลาเกิดใหม่</div>
          <div class="countdown-value" data-countdown="${boss.slug}">${formatCountdown(remaining)}</div>
        </div>
        <span class="countdown-label">${boss.respawnMinutes} นาที</span>
      </div>

      <div class="stats-grid">
        <div class="stat-line"><span>HP</span><strong>${boss.hp}</strong></div>
        <div class="stat-line"><span>DMG</span><strong>${boss.dmg}</strong></div>
        <div class="stat-line"><span>DEF</span><strong>${boss.def}</strong></div>
        <div class="stat-line"><span>MDEF</span><strong>${boss.mdef}</strong></div>
        <div class="stat-line"><span>HIT</span><strong>${boss.hit}</strong></div>
        <div class="stat-line"><span>FLEE</span><strong>${boss.flee}</strong></div>
        <div class="stat-line"><span>Vision</span><strong>${boss.vision}</strong></div>
        <div class="stat-line"><span>Cadence</span><strong>${boss.cadence}</strong></div>
      </div>

      <div class="card-note"><strong>Card 5★:</strong> ${boss.card} — ${boss.cardMaxAbility || boss.cardAbility || 'ข้อมูลการ์ดยังไม่พร้อม'}</div>

      ${fieldInlineForm}

      <div class="card-footer">
        <span class="record-tag">${lastNote}</span>
        ${footerActions}
      </div>
    </article>
  `;
}

function renderMiniBossBoard() {
  const channelTimers = getChannelTimerData();

  const panels = state.bosses
    .filter((boss) => boss.category === 'Mini-Boss')
    .map((boss) => {
      const rows = Array.from({ length: 40 }, (_, index) => {
        const channel = index + 1;
        const key = `${boss.slug}:${channel}`;
        const timer = channelTimers[key] || null;
        const remainingSeconds = timer
          ? getTimerRemainingSeconds(timer) - ((Date.now() - new Date(timer.updatedAt).getTime()) / 1000)
          : 0;
        const display = Math.max(0, remainingSeconds) > 0 ? formatCountdown(Math.max(0, remainingSeconds)) : '00:00';

        const minutesValue = timer ? timer.remainingMinutes : 0;
        const secondsValue = timer ? timer.remainingSeconds : 0;

        return `
          <div class="channel-row">
            <div class="channel-info">
              <span class="channel-number">แชแนล ${channel}</span>
              <span class="channel-name">${boss.map}</span>
            </div>

            <div class="channel-time" data-channel-countdown="${key}">${display}</div>

            <div class="channel-inputs">
              <label>
                <span>นาที</span>
                <input type="number" min="0" max="720" step="1" value="${minutesValue}" data-channel-minutes="${key}" />
              </label>
              <label>
                <span>วินาที</span>
                <input type="number" min="0" max="59" step="1" value="${secondsValue}" data-channel-seconds="${key}" />
              </label>
            </div>

            <div class="channel-actions">
              <button type="button" class="channel-save-btn" data-channel-save="${key}">บันทึกเวลา</button>
              <button type="button" class="quick-kill" data-channel-kill="${key}">เพิ่งถูกสังหาร</button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <section class="mini-boss-panel">
          <div class="mini-boss-header">
            <div class="mini-boss-meta">
              <img class="boss-thumb mini-boss-thumb" src="${boss.image}" alt="${boss.name}" onerror="this.onerror=null;this.src='https://wiki.bindertowngame.com/img/ui/logo.png';" />
              <div class="mini-boss-text">
                <h3>${boss.name}</h3>
                <div class="mini-boss-submeta">
                  <span class="mini-boss-level">Lv ${boss.level}</span>
                  <span class="mini-boss-map"><i class="fa-solid fa-location-dot"></i> ${boss.map}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="mini-boss-badge ${state.soundEnabled ? 'enabled' : 'muted'}"
              data-toggle-alert="${boss.slug}"
              aria-label="${state.soundEnabled ? 'ปิดเสียงแจ้งเตือน' : 'เปิดเสียงแจ้งเตือน'}"
            >${state.soundEnabled ? '🔊' : '🔇'}</button>
          </div>
          <div class="channel-board">
            ${rows}
          </div>
        </section>
      `;
    }).join('');

  return `<div class="mini-boss-board-wrap">${panels}</div>`;
}

function renderDetailDialog(boss) {
  if (!boss) {
    return;
  }

  const matchupText = [
    `${boss.category === 'Elite' ? 'Elite' : 'Boss'} ${boss.name} มีจุดอ่อนต่อความเร็วและสกิลควบคุม`,
    `มีการโจมตีแบบ ${boss.category === 'Elite' ? 'กดพื้นที่ / ผลัก' : 'โจมตีระยะใกล้'} และควรหลีกเลี่ยงการยืนติดในจุดที่มองเห็น`,
    `Card 1★ และ 5★ เสริมพลังยุทธวิธีแบบ ${boss.card || 'คอนโทรลพื้นที่'} ให้ประสิทธิภาพที่ดีขึ้นเมื่อใช้ร่วมกับการกดแผนการรักษา/สกิลควบคุม`
  ];

  const traits = [
    `บทบาท: ${boss.category}`,
    `อยู่ที่: ${boss.map}`,
    `เลเวล: ${boss.level}`,
    `รีสปอน: ${boss.respawnMinutes} นาที`,
    `HP: ${boss.hp}`,
    `DMG: ${boss.dmg}`,
    `DEF / MDEF: ${boss.def} / ${boss.mdef}`,
    `HIT / FLEE: ${boss.hit} / ${boss.flee}`
  ];

  elements.detailImage.src = boss.image;
  elements.detailImage.alt = boss.name;
  elements.detailImage.onerror = function onImageError() {
    this.onerror = null;
    this.src = 'https://wiki.bindertowngame.com/img/ui/logo.png';
  };

  elements.detailCategory.textContent = boss.category;
  elements.detailName.textContent = boss.name;
  elements.detailMeta.innerHTML = `
    <span>Lv ${boss.level}</span>
    <span class="boss-map"><i class="fa-solid fa-location-dot"></i> ${boss.map}</span>
    <span>Respawn ${boss.respawnMinutes} นาที</span>
  `;
  elements.detailOverview.innerHTML = traits.map((item) => `<li>${item}</li>`).join('');
  elements.detailMatchup.innerHTML = matchupText.map((item) => `<li>${item}</li>`).join('');

  elements.detailDialog.showModal();
}

function mergeWithLocalFallback(serverBosses) {
  const savedTimers = getLocalTimerData();

  return serverBosses.map((boss) => {
    const localTimer = savedTimers[boss.slug];
    const serverTimer = boss.timer;

    if (!localTimer) {
      return boss;
    }

    if (!serverTimer) {
      return { ...boss, timer: localTimer };
    }

    const localUpdatedAt = new Date(localTimer.updatedAt || 0).getTime();
    const serverUpdatedAt = new Date(serverTimer.updatedAt || 0).getTime();

    if (localUpdatedAt > serverUpdatedAt) {
      return { ...boss, timer: localTimer };
    }

    return boss;
  });
}

function saveFieldBossTimer(slug, hours, minutes, seconds) {
  const safeHours = Math.max(0, Number(hours) || 0);
  const safeMinutes = Math.max(0, Number(minutes) || 0);
  const safeSeconds = Math.max(0, Math.min(59, Number(seconds) || 0));

  const timerRecord = {
    slug,
    recordedBy: 'Field Boss',
    userIp: 'local-only',
    remainingHours: safeHours,
    remainingMinutes: safeMinutes,
    remainingSeconds: safeSeconds,
    updatedAt: new Date().toISOString()
  };

  const saved = getLocalTimerData();
  saved[slug] = timerRecord;
  saveLocalTimerData(saved);
  updateBossTimerInState(slug, timerRecord);

  try {
    fetch(`./api/bosses/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Field Boss (local)',
        remainingHours: safeHours,
        remainingMinutes: safeMinutes,
        remainingSeconds: safeSeconds
      })
    }).catch(() => {});
  } catch (error) {
    console.warn('Field boss timer could not be synced to server', error);
  }

  renderBosses();
}

function renderBosses() {
  const filtered = state.bosses.filter((boss) => boss.category === state.activeCategory);

  if (state.activeCategory === 'Mini-Boss') {
    elements.bossGrid.innerHTML = renderMiniBossBoard();
  } else {
    elements.bossGrid.innerHTML = filtered.map(renderBossCard).join('');
  }

  updateSoundToggleButtons();

  document.querySelectorAll('[data-toggle-alert]').forEach((button) => {
    button.addEventListener('click', () => {
      toggleSound();
    });
  });

  document.querySelectorAll('[data-open-update]').forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.openUpdate;
      const boss = state.bosses.find((entry) => entry.slug === slug);
      openDialog(boss);
    });
  });

  document.querySelectorAll('[data-view-details]').forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.viewDetails;
      const boss = state.bosses.find((entry) => entry.slug === slug);
      renderDetailDialog(boss);
    });
  });

  document.querySelectorAll('[data-field-save]').forEach((button) => {
    button.addEventListener('click', () => {
      const slug = button.dataset.fieldSave;
      const hoursInput = document.querySelector(`[data-field-hours="${slug}"]`);
      const minutesInput = document.querySelector(`[data-field-minutes="${slug}"]`);
      const secondsInput = document.querySelector(`[data-field-seconds="${slug}"]`);

      if (!hoursInput || !minutesInput || !secondsInput) {
        return;
      }

      saveFieldBossTimer(slug, hoursInput.value, minutesInput.value, secondsInput.value);
    });
  });

  document.querySelectorAll('[data-channel-save]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.channelSave;
      const minutesInput = document.querySelector(`[data-channel-minutes="${key}"]`);
      const secondsInput = document.querySelector(`[data-channel-seconds="${key}"]`);

      if (!minutesInput || !secondsInput) {
        return;
      }

      const minutes = Math.max(0, Number(minutesInput.value || 0));
      const seconds = Math.max(0, Math.min(59, Number(secondsInput.value || 0)));
      const timers = getChannelTimerData();
      const [bossSlug, channelText] = key.split(':');
      timers[key] = {
        bossSlug,
        category: 'Mini-Boss',
        channel: Number(channelText),
        remainingMinutes: minutes,
        remainingSeconds: seconds,
        updatedAt: new Date().toISOString()
      };
      saveChannelTimerData(timers);
      renderBosses();
    });
  });

  document.querySelectorAll('[data-channel-kill]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.channelKill;
      const timers = getChannelTimerData();
      const [bossSlug, channelText] = key.split(':');
      timers[key] = {
        bossSlug,
        category: 'Mini-Boss',
        channel: Number(channelText),
        remainingMinutes: 30,
        remainingSeconds: 0,
        updatedAt: new Date().toISOString()
      };
      saveChannelTimerData(timers);
      renderBosses();
    });
  });

  refreshCountdowns();
}

function resetBossTimer(boss) {
  const saved = getLocalTimerData();
  delete saved[boss.slug];
  saveLocalTimerData(saved);

  const refreshedBoss = {
    ...boss,
    timer: null
  };

  updateBossTimerInState(boss.slug, null);
  state.bosses = state.bosses.map((entry) => entry.slug === boss.slug ? refreshedBoss : entry);
  state.alertTriggered.delete(boss.slug);
  state.warningTriggered.delete(boss.slug);

  playBossSpawnTone();
  renderBosses();
}

function refreshCountdowns() {
  state.bosses.forEach((boss) => {
    const element = document.querySelector(`[data-countdown="${boss.slug}"]`);
    if (!element) {
      return;
    }

    const remaining = getEffectiveRemainingSeconds(boss);
    const warningThreshold = boss.category === 'Mini-Boss'
      ? 60
      : boss.category === 'Field Boss'
        ? 180
        : 0;

    element.textContent = formatCountdown(remaining);
    element.classList.toggle('countdown-danger', remaining <= warningThreshold && remaining > 0);

    if (remaining <= 0) {
      resetBossTimer(boss);
      return;
    }

    const shouldWarn = boss.category === 'Mini-Boss'
      ? remaining <= 60 && remaining > 0
      : boss.category === 'Field Boss'
        ? remaining <= 180 && remaining > 0
        : false;

    if (shouldWarn) {
      if (!state.warningTriggered.has(boss.slug)) {
        playBossWarningSound(boss);
        state.warningTriggered.add(boss.slug);
      }
    } else {
      state.warningTriggered.delete(boss.slug);
    }

    if (remaining <= 10) {
      if (!state.alertTriggered.has(boss.slug)) {
        playAlertTone();
        state.alertTriggered.add(boss.slug);
      }
    } else {
      state.alertTriggered.delete(boss.slug);
    }
  });

  const channelTimers = getChannelTimerData();
  Object.entries(channelTimers).forEach(([key, timer]) => {
    const countdownElement = document.querySelector(`[data-channel-countdown="${key}"]`);
    if (!countdownElement) {
      return;
    }

    const remaining = getTimerRemainingSeconds(timer) - ((Date.now() - new Date(timer.updatedAt).getTime()) / 1000);
    const safe = Math.max(0, remaining);
    countdownElement.textContent = formatCountdown(safe);

    if (safe <= 60 && safe > 0) {
      countdownElement.classList.add('countdown-danger');
    } else {
      countdownElement.classList.remove('countdown-danger');
    }

    if (safe <= 60 && safe > 0) {
      const [bossSlug] = key.split(':');
      const boss = state.bosses.find((entry) => entry.slug === bossSlug);
      if (boss && !state.channelWarningTriggered.has(key)) {
        playBossWarningSound(boss);
        state.channelWarningTriggered.add(key);
      }
    } else {
      state.channelWarningTriggered.delete(key);
    }
  });
}

function openDialog(boss) {
  activeBossSlug = boss.slug;
  elements.bossName.value = boss.name;
  const savedRecordName = localStorage.getItem(RECORD_NAME_KEY) || '';
  elements.recordName.value = savedRecordName;
  elements.recordIp.value = elements.recordIp.value || 'Auto-detect failed';
  elements.remainingHours.value = 0;
  elements.remainingMins.value = 0;
  elements.remainingSecs.value = 0;
  elements.dialog.showModal();
}

async function loadBosses() {
  try {
    const response = await fetch('./api/bosses');
    if (!response.ok) {
      throw new Error('API unavailable');
    }

    const payload = await response.json();
    state.bosses = mergeWithLocalFallback(payload.bosses || []);
    renderBosses();
    return;
  } catch (error) {
    console.warn('Using static boss catalogue fallback', error);
  }

  try {
    const fallbackResponse = await fetch('./bosses.json');
    const payload = await fallbackResponse.json();
    const fallbackBosses = Array.isArray(payload.bosses) ? payload.bosses : payload;
    const savedTimers = getLocalTimerData();
    state.bosses = fallbackBosses.map((boss) => ({
      ...boss,
      timer: savedTimers[boss.slug] || null
    }));
    renderBosses();
  } catch (fallbackError) {
    console.error('Failed to load boss data from both API and static catalogue', fallbackError);
  }
}

async function refreshBossesFromServer() {
  try {
    const response = await fetch('./api/bosses');
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    const nextBosses = mergeWithLocalFallback(payload.bosses || []);
    const hasChanged = JSON.stringify(state.bosses) !== JSON.stringify(nextBosses);

    if (hasChanged) {
      state.bosses = nextBosses;
      renderBosses();
    }
  } catch (error) {
    // Ignore polling failures; fallback state stays in place.
  }
}

async function submitTimer(event) {
  event.preventDefault();

  if (!activeBossSlug) {
    return;
  }

  const recordName = elements.recordName.value.trim();
  const remainingHours = Number(elements.remainingHours.value || 0);
  const remainingMinutes = Number(elements.remainingMins.value || 0);
  const remainingSeconds = Number(elements.remainingSecs.value || 0);

  if (!recordName) {
    window.alert('กรุณากรอกชื่อคนบันทึกก่อนส่งข้อมูล');
    return;
  }

  localStorage.setItem(RECORD_NAME_KEY, recordName);

  const localTimer = {
    slug: activeBossSlug,
    recordedBy: recordName,
    userIp: (elements.recordIp.value || 'local-storage').trim() || 'local-storage',
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    updatedAt: new Date().toISOString()
  };

  const timerRecord = {
    ...localTimer,
    remainingHours: Math.max(0, Number(localTimer.remainingHours) || 0),
    remainingSeconds: Math.max(0, Number(localTimer.remainingSeconds) || 0),
    remainingMinutes: Math.max(0, Number(localTimer.remainingMinutes) || 0)
  };

  try {
    const response = await fetch(`./api/bosses/${activeBossSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: recordName,
        remainingHours,
        remainingMinutes,
        remainingSeconds
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Unable to save timer');
    }

    updateBossTimerInState(activeBossSlug, payload.timer || timerRecord);
    window.alert(`อัปเดตเวลา ${payload.boss} แล้ว`);
    playAlertTone();
    elements.dialog.close();
    renderBosses();
    return;
  } catch (error) {
    const saved = getLocalTimerData();
    saved[activeBossSlug] = timerRecord;
    saveLocalTimerData(saved);
    updateBossTimerInState(activeBossSlug, timerRecord);
    window.alert('บันทึกข้อมูลบนเบราว์เซอร์สำเร็จ (GitHub Pages fallback)');
    playAlertTone();
    elements.dialog.close();
    renderBosses();
  }
}

function bindEvents() {
  const globalSoundToggle = document.getElementById('global-sound-toggle');

  if (globalSoundToggle) {
    globalSoundToggle.addEventListener('click', toggleSound);
  }

  elements.form.addEventListener('submit', submitTimer);
  elements.closeDialog.addEventListener('click', () => elements.dialog.close());
  elements.closeDetailDialog.addEventListener('click', () => elements.detailDialog.close());

  elements.tabs.forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.category;
      elements.tabs.forEach((tab) => tab.classList.toggle('active', tab === button));
      renderBosses();
    });
  });

  elements.remainingHours.addEventListener('input', () => {
    const hours = Number(elements.remainingHours.value || 0);
    const clamped = Math.min(Math.max(hours, 0), 99);
    elements.remainingHours.value = clamped;
  });

  elements.remainingMins.addEventListener('input', () => {
    const minutes = Number(elements.remainingMins.value || 0);
    const clamped = Math.min(Math.max(minutes, 0), 59);
    elements.remainingMins.value = clamped;
  });

  elements.remainingSecs.addEventListener('input', () => {
    const secs = Number(elements.remainingSecs.value || 0);
    const clamped = Math.min(Math.max(secs, 0), 59);
    elements.remainingSecs.value = clamped;
  });
}

bindEvents();
setAutoIp();
loadBosses();
setInterval(refreshCountdowns, 1000);
setInterval(refreshBossesFromServer, 5000);
