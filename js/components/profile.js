// js/components/profile.js — Profile management (CRUD)

import { dbGetAll, dbAdd, dbPut, dbDelete, dbGetByIndex, STORES, dbClear } from '../db.js';
import { createProfile, createCategory } from '../models.js';
import { openModal, showConfirm } from './modal.js';
import { showToast } from './toast.js';

const ACTIVE_PROFILE_KEY = 'tyb_active_profile';
const CURRENCY_KEY = 'tyb_currency';
let onProfileChange = null;

// Common currency options
const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
];

function detectDefaultCurrency() {
  try {
    const locale = navigator.language || navigator.userLanguage || 'en-IN';
    const regionMatch = locale.match(/[-_]([A-Z]{2})$/i);
    if (regionMatch) {
      const region = regionMatch[1].toUpperCase();
      const regionToCurrency = {
        IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR',
        IT: 'EUR', ES: 'EUR', NL: 'EUR', JP: 'JPY', CN: 'CNY', AU: 'AUD',
        CA: 'CAD', SG: 'SGD', AE: 'AED', SA: 'SAR', BR: 'BRL', KR: 'KRW',
        TH: 'THB', MY: 'MYR', ID: 'IDR', PH: 'PHP', ZA: 'ZAR', CH: 'CHF',
        SE: 'SEK',
      };
      if (regionToCurrency[region]) return regionToCurrency[region];
    }
  } catch (e) { /* fallback */ }
  return 'INR';
}

function getCurrency() {
  const stored = localStorage.getItem(CURRENCY_KEY);
  if (stored) return stored;
  const detected = detectDefaultCurrency();
  localStorage.setItem(CURRENCY_KEY, detected);
  return detected;
}

function setCurrency(code) {
  localStorage.setItem(CURRENCY_KEY, code);
}

function getCurrencyInfo() {
  const code = getCurrency();
  return CURRENCY_OPTIONS.find(c => c.code === code) || CURRENCY_OPTIONS[0];
}

function setProfileChangeCallback(cb) {
  onProfileChange = cb;
}

function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

function setActiveProfileId(id) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

async function loadProfileSelector() {
  const profiles = await dbGetAll(STORES.PROFILES);
  const select = document.getElementById('profileSelect');
  const currentId = getActiveProfileId();

  select.innerHTML = '';

  if (profiles.length === 0) {
    select.innerHTML = '<option value="">No profiles</option>';
    return;
  }

  for (const p of profiles) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    if (p.id === currentId) opt.selected = true;
    select.appendChild(opt);
  }

  // Make sure active profile is valid
  if (!currentId || !profiles.find((p) => p.id === currentId)) {
    setActiveProfileId(profiles[0].id);
    select.value = profiles[0].id;
  }
}

function setupProfileSelector() {
  const select = document.getElementById('profileSelect');
  select.addEventListener('change', () => {
    setActiveProfileId(select.value);
    if (onProfileChange) onProfileChange();
  });
}

function setupProfileManager() {
  // No longer using a header button — profiles are a full view now
}

async function openProfileManager() {
  // Kept for backward compat — now renders inline in view
  renderProfiles();
}

async function renderProfiles() {
  const container = document.getElementById('profilesViewContainer');
  if (!container) return;

  const profiles = await dbGetAll(STORES.PROFILES);

  const listHTML = profiles
    .map(
      (p) => `
    <li class="profile-list__item" data-id="${p.id}">
      <span class="profile-list__name">${escapeHTML(p.name)}</span>
      <button class="btn-icon" data-action="rename" title="Rename">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button class="btn-icon btn-icon--danger" data-action="delete" title="Delete">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </li>
  `
    )
    .join('');

  container.innerHTML = `
    <div class="data-section">
      <div class="data-section__title">Profiles</div>
      <ul class="profile-list">${listHTML || '<li class="empty-state__desc" style="padding:16px;text-align:center;">No profiles yet — tap + to create one</li>'}</ul>
    </div>
  `;

  // Rename & Delete handlers
  container.querySelectorAll('.profile-list__item').forEach((li) => {
    const id = li.dataset.id;

    li.querySelector('[data-action="rename"]').addEventListener('click', async () => {
      const nameEl = li.querySelector('.profile-list__name');
      const currentName = nameEl.textContent;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentName;
      input.className = 'profile-list__name';
      input.style.padding = '4px 8px';
      input.style.fontWeight = '600';
      nameEl.replaceWith(input);
      input.focus();
      input.select();

      const save = async () => {
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
          const profile = { id, name: newName };
          await dbPut(STORES.PROFILES, profile);
          await loadProfileSelector();
          showToast(`Renamed to "${newName}"`, 'success');
        }
        const span = document.createElement('span');
        span.className = 'profile-list__name';
        span.textContent = newName || currentName;
        input.replaceWith(span);
      };

      input.addEventListener('blur', save);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
      });
    });

    li.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      const confirmed = await showConfirm(
        'Delete Profile',
        'This will permanently delete this profile and ALL its categories, items, and transactions. This cannot be undone.',
        { danger: true, okText: 'Delete' }
      );
      if (!confirmed) return;

      // Delete all related data
      const categories = await dbGetByIndex(STORES.CATEGORIES, 'profileId', id);
      const items = await dbGetByIndex(STORES.BUDGET_ITEMS, 'profileId', id);
      const txns = await dbGetByIndex(STORES.TRANSACTIONS, 'profileId', id);

      for (const c of categories) await dbDelete(STORES.CATEGORIES, c.id);
      for (const i of items) await dbDelete(STORES.BUDGET_ITEMS, i.id);
      for (const t of txns) await dbDelete(STORES.TRANSACTIONS, t.id);
      await dbDelete(STORES.PROFILES, id);

      // Select another profile or clear
      const remaining = await dbGetAll(STORES.PROFILES);
      if (remaining.length > 0) {
        setActiveProfileId(remaining[0].id);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }

      await loadProfileSelector();
      if (onProfileChange) onProfileChange();
      showToast('Profile deleted', 'success');
      renderProfiles();
    });
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initProfilesView() {
  document.getElementById('fabAddProfile').addEventListener('click', () => {
    openProfileForm();
  });
}

function openProfileForm() {
  const contentHTML = `
    <form id="profileForm">
      <div class="form-group">
        <label for="newProfileName">Profile Name *</label>
        <input type="text" id="newProfileName" required maxlength="50" placeholder="e.g. Personal, Family">
      </div>
      <button type="submit" class="btn btn--primary">Create Profile</button>
    </form>
  `;

  const modal = openModal('New Profile', contentHTML);

  modal.overlay.querySelector('#profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = modal.overlay.querySelector('#newProfileName').value.trim();
    if (!name) {
      showToast('Please enter a profile name', 'error');
      return;
    }
    const profile = createProfile(name);
    await dbAdd(STORES.PROFILES, profile);
    setActiveProfileId(profile.id);
    await loadProfileSelector();
    if (onProfileChange) onProfileChange();
    showToast(`Profile "${name}" created`, 'success');
    modal.close();
    renderProfiles();
  });

  setTimeout(() => modal.overlay.querySelector('#newProfileName').focus(), 100);
}

// Ensure at least one default profile exists
async function ensureDefaultProfile() {
  const profiles = await dbGetAll(STORES.PROFILES);
  if (profiles.length === 0) {
    const profile = createProfile('Personal');
    await dbAdd(STORES.PROFILES, profile);
    setActiveProfileId(profile.id);

    // Auto-create a "General" default category
    const category = createCategory({
      profileId: profile.id,
      name: 'General',
      description: 'Default category',
    });
    await dbAdd(STORES.CATEGORIES, category);
  }
}

export {
  loadProfileSelector,
  setupProfileSelector,
  setupProfileManager,
  getActiveProfileId,
  setActiveProfileId,
  setProfileChangeCallback,
  ensureDefaultProfile,
  initProfilesView,
  renderProfiles,
  getCurrency,
  setCurrency,
  getCurrencyInfo,
  CURRENCY_OPTIONS,
};
