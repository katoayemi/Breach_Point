(() => {
  const storageKey = "breachpoint.settings.v1";
  const defaults = {
    profileName: "Kato Aye",
    profileEmail: "",
    analysisType: "Automatic detection",
    sensitivity: "Balanced",
    showDetails: true,
    highRiskAlerts: true,
    scanCompletion: true,
    weeklySummary: false,
    saveHistory: true,
    includeContent: true,
    profilePhoto: ""
  };

  function readSettings() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { ...defaults };
    }
  }

  function getInitials(name) {
    return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "BP";
  }

  function renderProfile(settings) {
    document.querySelectorAll("[data-profile-name]").forEach((element) => {
      element.textContent = settings.profileName;
    });
    document.querySelectorAll("[data-profile-initials]").forEach((element) => {
      element.textContent = getInitials(settings.profileName);
      element.hidden = Boolean(settings.profilePhoto);
    });
    document.querySelectorAll("[data-profile-avatar-image]").forEach((image) => {
      if (settings.profilePhoto) {
        image.src = settings.profilePhoto;
        image.hidden = false;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
      }
    });
    document.querySelectorAll("[data-profile-control]").forEach((element) => {
      element.setAttribute("aria-label", `Open ${settings.profileName} profile`);
    });
  }

  function setInputValue(id, value) {
    const input = document.getElementById(id);
    if (input) input.value = value;
  }

  function setCheckbox(id, value) {
    const input = document.getElementById(id);
    if (input) input.checked = Boolean(value);
  }

  const historyResults = document.getElementById("history-results");
  if (historyResults) {
    const historyKey = "breachpoint.search-history.v1";
    const filterButtons = document.querySelectorAll("[data-history-filter]");
    const searchInput = document.getElementById("history-search");
    const clearButton = document.getElementById("clear-history");
    let activeFilter = "all";

    function readHistory() {
      try {
        const entries = JSON.parse(localStorage.getItem(historyKey) || "[]");
        return Array.isArray(entries) ? entries : [];
      } catch {
        return [];
      }
    }

    function entryType(entry) {
      const type = String(entry.type || entry.kind || "link").toLowerCase();
      if (type.includes("image") || type.includes("photo")) return "image";
      if (type.includes("message") || type.includes("email") || type.includes("text")) return "message";
      return "link";
    }

    function renderHistory() {
      const entries = readHistory().sort((first, second) => {
        return new Date(second.searchedAt || second.timestamp || second.createdAt || 0)
          - new Date(first.searchedAt || first.timestamp || first.createdAt || 0);
      });
      const query = searchInput.value.trim().toLowerCase();
      const filtered = entries.filter((entry) => {
        const type = entryType(entry);
        const content = String(entry.query || entry.url || entry.name || entry.title || "");
        return (activeFilter === "all" || activeFilter === type) && content.toLowerCase().includes(query);
      });
      historyResults.replaceChildren();
      clearButton.hidden = entries.length === 0;

      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "history-empty";
        const icon = document.createElement("span");
        icon.className = "history-empty-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "↻";
        const heading = document.createElement("h2");
        heading.textContent = entries.length ? "No matching searches" : "No recent searches";
        const description = document.createElement("p");
        description.textContent = entries.length
          ? "Try another filter or search term."
          : "Links, images, and messages you search will appear here.";
        empty.append(icon, heading, description);
        historyResults.append(empty);
        return;
      }

      filtered.forEach((entry) => {
        const type = entryType(entry);
        const title = String(entry.query || entry.url || entry.name || entry.title || "Untitled search");
        const dateValue = entry.searchedAt || entry.timestamp || entry.createdAt;
        const date = dateValue ? new Date(dateValue) : null;
        const article = document.createElement("article");
        article.className = "history-item";
        const icon = document.createElement("span");
        icon.className = "history-kind-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = type === "image" ? "IMG" : type === "message" ? "MSG" : "URL";
        const copy = document.createElement("div");
        copy.className = "history-item-copy";
        const label = document.createElement("strong");
        label.textContent = title;
        const detail = document.createElement("small");
        detail.textContent = String(entry.status || entry.result || "Searched");
        copy.append(label, detail);
        const meta = document.createElement("div");
        meta.className = "history-item-meta";
        const typeLabel = document.createElement("span");
        typeLabel.className = "history-item-type";
        typeLabel.textContent = type;
        const time = document.createElement("time");
        if (date && !Number.isNaN(date.valueOf())) {
          time.dateTime = date.toISOString();
          time.textContent = date.toLocaleString();
        } else {
          time.textContent = "Recently";
        }
        meta.append(typeLabel, time);
        article.append(icon, copy, meta);
        historyResults.append(article);
      });
    }

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.historyFilter;
        filterButtons.forEach((filter) => {
          const selected = filter === button;
          filter.classList.toggle("active", selected);
          filter.setAttribute("aria-pressed", String(selected));
        });
        renderHistory();
      });
    });
    searchInput.addEventListener("input", renderHistory);
    clearButton.addEventListener("click", () => {
      localStorage.removeItem(historyKey);
      renderHistory();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === historyKey) renderHistory();
    });
    renderHistory();
  }

  function previewPhoto(dataUrl) {
    const image = document.querySelector(".settings-avatar [data-profile-avatar-image]");
    const initials = document.querySelector(".settings-avatar [data-profile-initials]");
    if (!image || !initials) return;
    image.src = dataUrl;
    image.hidden = false;
    initials.hidden = true;
  }

  async function compressPhoto(file) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 256 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  const settings = readSettings();
  renderProfile(settings);

  const scanModeButtons = document.querySelectorAll("[data-scan-mode]");
  if (scanModeButtons.length) {
    const scanTitle = document.getElementById("scanner-title");
    const scanActionLabel = document.querySelector("[data-scan-action-label]");
    const imageInput = document.getElementById("image-input");
    const imageFileName = document.getElementById("image-file-name");
    const modeCopy = {
      link: { title: "Scan Link", action: "Scan URL" },
      image: { title: "Scan Image", action: "Scan Image" },
      message: { title: "Scan Message", action: "Scan Message" }
    };

    scanModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.scanMode;
        scanModeButtons.forEach((option) => {
          const selected = option === button;
          option.classList.toggle("active", selected);
          option.setAttribute("aria-selected", String(selected));
        });
        document.querySelectorAll("[data-scan-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.scanPanel !== mode;
        });
        scanTitle.textContent = modeCopy[mode].title;
        scanActionLabel.textContent = modeCopy[mode].action;
      });
    });

    imageInput.addEventListener("change", () => {
      imageFileName.textContent = imageInput.files?.[0]?.name || "PNG, JPG, or other image formats";
    });
  }

  const form = document.getElementById("settings-form");
  if (!form) return;

  setInputValue("profile-name", settings.profileName);
  setInputValue("profile-email", settings.profileEmail);
  setInputValue("analysis-type", settings.analysisType);
  setInputValue("detection-sensitivity", settings.sensitivity);
  setCheckbox("show-details", settings.showDetails);
  setCheckbox("high-risk-alerts", settings.highRiskAlerts);
  setCheckbox("scan-completion", settings.scanCompletion);
  setCheckbox("weekly-summary", settings.weeklySummary);
  setCheckbox("save-history", settings.saveHistory);
  setCheckbox("include-content", settings.includeContent);
  if (settings.profilePhoto) previewPhoto(settings.profilePhoto);

  let pendingPhoto = settings.profilePhoto;
  const photoInput = document.getElementById("profile-photo");
  const status = document.getElementById("settings-status");

  photoInput.addEventListener("change", async () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      status.textContent = "Choose an image file.";
      photoInput.value = "";
      return;
    }
    try {
      pendingPhoto = await compressPhoto(file);
      previewPhoto(pendingPhoto);
      status.textContent = "Photo preview updated. Save changes to apply it everywhere.";
    } catch {
      status.textContent = "This image could not be loaded. Try another photo.";
    }
  });

  document.getElementById("remove-photo").addEventListener("click", () => {
    pendingPhoto = "";
    photoInput.value = "";
    const image = document.querySelector(".settings-avatar [data-profile-avatar-image]");
    const initials = document.querySelector(".settings-avatar [data-profile-initials]");
    image.removeAttribute("src");
    image.hidden = true;
    initials.hidden = false;
    status.textContent = "Photo removed from preview. Save changes to apply it everywhere.";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const updated = {
      profileName: document.getElementById("profile-name").value.trim(),
      profileEmail: document.getElementById("profile-email").value.trim(),
      analysisType: document.getElementById("analysis-type").value,
      sensitivity: document.getElementById("detection-sensitivity").value,
      showDetails: document.getElementById("show-details").checked,
      highRiskAlerts: document.getElementById("high-risk-alerts").checked,
      scanCompletion: document.getElementById("scan-completion").checked,
      weeklySummary: document.getElementById("weekly-summary").checked,
      saveHistory: document.getElementById("save-history").checked,
      includeContent: document.getElementById("include-content").checked,
      profilePhoto: pendingPhoto
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      renderProfile(updated);
      status.textContent = "Settings saved on this device.";
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey, newValue: JSON.stringify(updated) }));
    } catch {
      status.textContent = "Could not save settings in this browser.";
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) renderProfile(readSettings());
  });
})();
