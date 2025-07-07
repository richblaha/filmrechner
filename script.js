
    // Referenzen zu den Inputs
    const dumpingWarning = document.getElementById("dumping-warning");

    const projectType = document.getElementById("project-type");
    const budgetInput = document.getElementById("budget");
    const percentageInput = document.getElementById("percentage");
    const flatRateInput = document.getElementById("flat-rate");
    const calculatedBudgetOutput = document.getElementById("calculated-budget");
    const gemaEstimateOutput = document.getElementById("gema-estimate");
    const totalEstimateOutput = document.getElementById("total-estimate");
    const gemaBreakdown = document.getElementById("gema-breakdown");
const gemaMediaBreakdown = document.getElementById("gema-media-breakdown");

    const serieEpisodesContainer = document.getElementById("serie-episodes-container");
    const episodesCountInput = document.getElementById("episodes-count");
    const seriePricingModel = document.getElementById("serie-pricing-model");
    const episodeRateContainer = document.getElementById("serie-episode-rate-container");
    const episodeRateInput = document.getElementById("episode-rate");

    const pricingModelSelect = document.getElementById("pricing-model");
    const pricingModelContainer = document.getElementById("pricing-model-container");

    const percentInput = document.getElementById("percent-input");
    const flatInput = document.getElementById("flat-input");
    const musicMinutesInput = document.getElementById("music-minutes");
    const expectedAiringsInput = document.getElementById("expected-airings");

    // Multi-Select Dropdown
    const senderDropdown = document.getElementById("sender-dropdown");
    const senderOptions = document.getElementById("sender-options");
    const selectedSendersDisplay = document.getElementById("selected-senders");
    const senderCheckboxes = document.querySelectorAll(".sender-checkbox");

    // Warnings
    const streamingWarning = document.getElementById("streaming-warning");
    const dokumentarfilmWarning = document.getElementById("dokumentarfilm-warning");
    const arteWarning = document.getElementById("arte-warning");

    // Aktualisierte GEMA-Werte (€ Gesamtbetrag pro Sender)
const gemaRatesPerMinute = {
  ard: 79,
  arte: 16,
  bayerischerRundfunk: 14,
  deutscheWelle: 5,
  dmax: 2,
  disneyChannel: 1,
  hessischerRundfunk: 6,
  kabel1: 8,
  kabelEinsDoku: 1,
  kinderkanal: 7,
  mdr: 9,
  n24Doku: 1,
  nationalGeographic: 1,
  norddeutscherRundfunk: 19,
  ntv: 2,
  pro7: 17,
  pro7Maxx: 2,
  radioBremen: 32,
  rtl: 28,
  rtl2: 6,
  rtlCrime: 0,
  rtlNitro: 3,
  rtlNow: 0,
  rtlUp: 1,
  rbb: 7,
  sat1: 14,
  sixx: 2,
  skyAtlantic: 2,
  skyCinema: 1,
  swrSr3: 14,
  superRtl: 3,
  tagesschau24: 2,
  tele5: 3,
  togoPlus: 1,
  universalTv: 1,
  vox: 12,
  wdr: 15,
  zdf: 62,
  zdfInfo: 1,
  zdfNeo: 3
};

const toggleIndividualAirings = document.getElementById('toggle-individual-airings');
const totalAiringsInput = document.getElementById('expected-airings');
const senderAiringsContainer = document.getElementById('sender-airings-container');
const senderCheckboxes = document.querySelectorAll('.sender-checkbox');

const senderNames = {
  ard: "ARD",
  arte: "ARTE",
  zdf: "ZDF",
  // ggf. alle weiteren
};

function updateSenderAiringsInputs() {
  senderAiringsContainer.innerHTML = "";
  senderCheckboxes.forEach(cb => {
    if (cb.checked) {
      const id = cb.value;
      const name = senderNames[id] || id;
      const div = document.createElement('div');
      div.classList.add('sender-airings-input');
      div.innerHTML = `
        <label for="airings-${id}">Erwartete Ausstrahlungen für ${name}</label>
        <input type="number" id="airings-${id}" name="airings-${id}" min="1" step="1" placeholder="z. B. 3">
      `;
      senderAiringsContainer.appendChild(div);
    }
  });
}

function toggleAiringsMode() {
  const individual = toggleIndividualAirings.checked;
  senderAiringsContainer.style.display = individual ? 'block' : 'none';
  totalAiringsInput.disabled = individual;

  if (individual) {
    updateSenderAiringsInputs();
  }
}

// Event-Listener für Umschaltung
toggleIndividualAirings.addEventListener('change', toggleAiringsMode);
// Auch Sender-Auswahl beobachten
senderCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    if (toggleIndividualAirings.checked) {
      updateSenderAiringsInputs();
    }
  });
});


    // Multiplikatoren für Nutzungsrechte
    const usageMultipliers = {
      territory: {
        deutschland: 1,
        deufra: 1.2,
        dach: 1.4,
        europa: 2.3,
        asien: 2.6,
        weltweit: 3.1,
      },
      exclusivity: {
        "non-exclusive": 0.85,
        exclusive: 1,
      },
      additionalMedia: {
        streaming: 0.15,
        mediathek: 0.10,
        online: 0.08,
        kino: 0.13,
        dvd: 0.12,
      }
    };

    // Multi-Select Dropdown Funktionalität
    senderDropdown.addEventListener("click", () => {
      const isVisible = senderOptions.style.display === "block";
      senderOptions.style.display = isVisible ? "none" : "block";
    });

    // Schließen wenn außerhalb geklickt wird
    document.addEventListener("click", (e) => {
      if (!senderDropdown.contains(e.target)) {
        senderOptions.style.display = "none";
      }
    });

    // Update der Anzeige bei Checkbox-Änderung
    function updateSelectedSendersDisplay() {
      const selected = Array.from(senderCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.nextElementSibling.textContent.split(' (')[0]);
      
      selectedSendersDisplay.textContent = selected.length > 0 
        ? selected.join(", ") 
        : "Sender auswählen...";
    }

    senderCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        updateSelectedSendersDisplay();
        calculateMusicBudget();
      });
    });

    // Button-Event: Auswahl aller Sender zurücksetzen
document.getElementById("clear-senders-button").addEventListener("click", () => {
  senderCheckboxes.forEach(cb => cb.checked = false);
  updateSelectedSendersDisplay();
  calculateMusicBudget();
});


    // GEMA-Schätzung basierend auf ausgewählten Sendern
    function calculateRealisticGemaEstimate() {
      const selectedSenders = Array.from(senderCheckboxes).filter(cb => cb.checked);
      const musicMinutes = parseFloat(musicMinutesInput.value) || 15;
      const expectedAirings = parseInt(expectedAiringsInput.value) || 3;
      const territory = document.getElementById("usage-territory").value;

      if (selectedSenders.length === 0) return { total: 0, breakdown: "Keine Sender ausgewählt" };

      let totalGema = 0;
      let breakdownParts = [];

      selectedSenders.forEach(sender => {
        const baseRate = gemaRatesPerMinute[sender.value] || 0.5;
        let senderGema = baseRate * musicMinutes * expectedAirings;

        // Territory-Faktor
        const territoryFactor = territory === 'deutschland' ? 1 : 
                              territory === 'europa' ? 0.4 : 0.15;
        senderGema *= territoryFactor;

        totalGema += senderGema;
        
        const senderName = sender.nextElementSibling.textContent.split(' (')[0];
        breakdownParts.push(`${senderName}: ${baseRate.toFixed(2)}€/Min × ${musicMinutes} Min × ${expectedAirings} Ausstr. = ${senderGema.toFixed(2)}€`);
      });

      const breakdown = breakdownParts.join('<br>') + 
                       `<br><strong>Gesamt: ${totalGema.toFixed(2)}€</strong>` +
                       (territory !== 'deutschland' ? `<br><em>(reduziert um Auslandsfaktor)</em>` : '');

      return { total: totalGema, breakdown: breakdown };
    }

    // Nutzungs-Multiplikator berechnen
    
function calculateMediaGemaEstimate() {
  const musicMinutes = parseFloat(musicMinutesInput.value) || 15;
  const expectedAirings = parseInt(expectedAiringsInput.value) || 1;
  const territory = document.getElementById("usage-territory").value;
  const mediaCheckboxes = document.querySelectorAll(".usage-media:checked");

  if (mediaCheckboxes.length === 0) return { total: 0, breakdown: "Keine weiteren Medien ausgewählt" };

  let total = 0;
  let breakdownParts = [];

  mediaCheckboxes.forEach(cb => {
    const gemaRate = 0.5; 
    let gema = gemaRate * musicMinutes * expectedAirings;

    const territoryFactor = territory === 'deutschland' ? 1 : territory === 'europa' ? 0.4 : 0.15;
    gema *= territoryFactor;

    total += gema;
    const label = cb.parentElement.textContent.trim();
    breakdownParts.push(`${label}: ${gemaRate.toFixed(2)}€/Min × ${musicMinutes} Min × ${expectedAirings} = ${gema.toFixed(2)}€`);
  });

  const breakdown = breakdownParts.join('<br>') + `<br><strong>Gesamt (Medien): ${total.toFixed(2)}€</strong>`;
  return { total, breakdown };
}
function calculateUsageMultiplier() {
      const territory = document.getElementById("usage-territory").value;
      const exclusivity = document.getElementById("usage-exclusivity").value;
      const additionalMediaCheckboxes = document.querySelectorAll(".usage-media:checked");

      let multiplier = 1;
      multiplier *= usageMultipliers.territory[territory] || 1;
      multiplier *= usageMultipliers.exclusivity[exclusivity] || 1;

      additionalMediaCheckboxes.forEach((box) => {
        multiplier += usageMultipliers.additionalMedia[box.value] || 0;
      });

      return multiplier;
    }

    // Eingabefelder anzeigen/verstecken
    function showInputForModel(model) {
      percentInput.style.display = model === "percent" ? "block" : "none";
      flatInput.style.display = model === "flat" ? "block" : "none";
    }

    // Warnungen anzeigen
    function showWarnings() {
      const selectedSenders = Array.from(senderCheckboxes).filter(cb => cb.checked);
      const hasStreaming = selectedSenders.some(s => ['netflix', 'amazon', 'disney'].includes(s.value));
      const hasArte = selectedSenders.some(s => s.value === 'arte');
      const isDoku = projectType.value === 'dokumentarfilm';
      const inlineDumpingWarning = document.getElementById("inline-dumping-warning");
// ...
inlineDumpingWarning.style.display = showDumping ? "block" : "none";


      streamingWarning.style.display = hasStreaming ? "block" : "none";
      arteWarning.style.display = hasArte ? "block" : "none";
      dokumentarfilmWarning.style.display = isDoku ? "block" : "none";
// Dumpingpreis-Warnung anzeigen bei fester Pauschale unter 5000 €
let showDumping = false;
if (pricingModelSelect.value === "flat" && !isNaN(flatRateInput.value)) {
  const flatValue = parseFloat(flatRateInput.value);
  if (flatValue > 0 && flatValue < 5000) {
    showDumping = true;
  }
}
dumpingWarning.style.display = showDumping ? "block" : "none";

      
    }

    // Hauptberechnung
function calculateOptimalHonorar(baseHonorar, gemaTotal) {
  // 🎯 Sehr niedrige GEMA = starkes Plus beim Honorar
  if (gemaTotal < 1000) return baseHonorar * 1.9;
  if (gemaTotal < 2000) return baseHonorar * 1.75;
  if (gemaTotal < 3000) return baseHonorar * 1.6;
  if (gemaTotal < 5000) return baseHonorar * 1.5;
  if (gemaTotal < 8000) return baseHonorar * 1.3;
  if (gemaTotal < 10000) return baseHonorar * 1.2;

  // 🎯 Sehr hohe GEMA = starkes Minus beim Honorar
  if (gemaTotal > 250000) return baseHonorar * 0.4;
  if (gemaTotal > 100000) return baseHonorar * 0.5;
  if (gemaTotal > 60000) return baseHonorar * 0.7;

  // 🎯 Bereich ohne Anpassung
  return baseHonorar;
}



   // 💡 Intelligente Honorar-Anpassung basierend auf GEMA
function calculateOptimalHonorar(baseHonorar, gemaTotal) {
  if (gemaTotal > 10000) {
    return baseHonorar * 0.9; // -10 % bei hoher GEMA
  }

  if (gemaTotal < 4000) {
    return baseHonorar * 1.2; // +20 % bei niedriger GEMA
  }

  return baseHonorar;
}

// Hauptberechnung für Musikbudget & GEMA
// Realistische Honorar-Korrektur basierend auf GEMA-Kompensation
function calculateOptimalHonorar(baseHonorar, gemaTotal) {
  const gesamtEinnahmen = baseHonorar + gemaTotal;

  // Sehr niedrige Pauschalen (unter 8000) benötigen Aufschlag
  if (baseHonorar <= 8000) {
    if (gemaTotal <= 8000) {
      return baseHonorar + 5000;
    } else if (gemaTotal <= 12000) {
      return baseHonorar + 3000;
    } else {
      return baseHonorar + 1000;
    }
  }

  // Mittlere Pauschalen (8000–20000): kleine Anpassungen
  if (baseHonorar <= 20000) {
    if (gemaTotal <= 6000) {
      return baseHonorar + 2000;
    } else if (gemaTotal <= 10000) {
      return baseHonorar + 1000;
    }
    return baseHonorar;
  }

  // Hohe Pauschalen (über 20000): beibehalten
  return baseHonorar;
}

function calculateMusicBudget() {
    const type = projectType.value;
    let baseHonorar = 0;
    
    // Basis-Honorar berechnen
    if (type === "serie") {
        const model = seriePricingModel.value;
        const episodes = parseInt(episodesCountInput.value) || 1;
        if (model === "per-episode") {
            const ratePerEpisode = parseFloat(episodeRateInput.value) || 0;
            baseHonorar = episodes * ratePerEpisode;
        } else if (model === "flat-total") {
            baseHonorar = parseFloat(flatRateInput.value) || 0;
        }
    } else {
        const model = pricingModelSelect.value;
        if (model === "percent") {
            const budget = parseFloat(budgetInput.value) || 0;
            const percent = parseFloat(percentageInput.value) || 0;
            baseHonorar = budget * (percent / 100);
        } else if (model === "flat") {
            baseHonorar = parseFloat(flatRateInput.value) || 0;
        }
    }
    
    // Nutzungsrechte-Multiplikator berechnen
    const usageMultiplier = calculateUsageMultiplier();
    let preAdjustedHonorar = baseHonorar * usageMultiplier;
    
    // GEMA-Schätzungen berechnen
    const gemaResult = calculateRealisticGemaEstimate();
    const gemaMediaResult = calculateMediaGemaEstimate();
    let totalGema = gemaResult.total + gemaMediaResult.total;
    
    // Verlag abziehen, wenn Checkbox aktiv
    const hasPublisher = document.getElementById("with-publisher").checked;
    if (hasPublisher) {
        totalGema *= 0.64; // Komponist:in erhält nur 64 %
    }

    // TFS-Faktor anwenden, wenn Fremdproduktion-Checkbox aktiv
const isFremdproduktion = document.getElementById("fremdproduktion").checked;
if (isFremdproduktion) {
    totalGema *= 0.44; // TFS-Faktor für Fremdproduktionen
}

    
    // Intelligente Honorar-Anpassung anwenden
    const finalHonorar = calculateOptimalHonorar(preAdjustedHonorar, totalGema);
    
    // Gesamteinnahmen (Honorar + GEMA)
    const totalEstimate = finalHonorar + totalGema;
    
    // Ergebnisse in UI schreiben
    calculatedBudgetOutput.textContent = Math.round(finalHonorar).toLocaleString('de-DE');
    gemaEstimateOutput.textContent = Math.round(totalGema).toLocaleString('de-DE');
    totalEstimateOutput.textContent = Math.round(totalEstimate).toLocaleString('de-DE');
    gemaBreakdown.innerHTML = `<strong>Berechnung:</strong><br>${gemaResult.breakdown}`;
    gemaMediaBreakdown.innerHTML = `<strong>Medien-GEMA:</strong><br>${gemaMediaResult.breakdown}`;
    
    // Warnhinweise anzeigen
    showWarnings();
}


    // Event Listeners
    // Korrigiert:
function initializeApp() {
    // Referenzierung erst nach dem Laden
    const dumpingWarning = document.getElementById("dumping-warning");
    // ... weitere Elemente ...
}

document.addEventListener('DOMContentLoaded', initializeApp);
      // Initiale Sichtbarkeit
      if (projectType.value === "serie") {
        serieEpisodesContainer.style.display = "block";
        pricingModelContainer.style.display = "none";
        episodeRateContainer.style.display = seriePricingModel.value === "per-episode" ? "block" : "none";
        flatInput.style.display = seriePricingModel.value === "flat-total" ? "block" : "none";
        percentInput.style.display = "none";
      } else {
        serieEpisodesContainer.style.display = "none";
        pricingModelContainer.style.display = "block";
        showInputForModel(pricingModelSelect.value);
      }

      calculateMusicBudget();
    });

    projectType.addEventListener("change", () => {
      const isSerie = projectType.value === "serie";
      serieEpisodesContainer.style.display = isSerie ? "block" : "none";
      pricingModelContainer.style.display = isSerie ? "none" : "block";

      if (isSerie) {
        const model = seriePricingModel.value;
        episodeRateContainer.style.display = model === "per-episode" ? "block" : "none";
        flatInput.style.display = model === "flat-total" ? "block" : "none";
        percentInput.style.display = "none";
      } else {
        showInputForModel(pricingModelSelect.value);
      }

      calculateMusicBudget();
    });

    seriePricingModel.addEventListener("change", () => {
      const model = seriePricingModel.value;
      episodeRateContainer.style.display = model === "per-episode" ? "block" : "none";
      flatInput.style.display = model === "flat-total" ? "block" : "none";
      percentInput.style.display = "none";
      calculateMusicBudget();
    });

    pricingModelSelect.addEventListener("change", (e) => {
      showInputForModel(e.target.value);
      calculateMusicBudget();
    });

    // Alle Input-Events
    [
      budgetInput, percentageInput, flatRateInput, episodesCountInput,
      episodeRateInput, musicMinutesInput, expectedAiringsInput
    ].forEach(el => el && el.addEventListener("input", calculateMusicBudget));

    document.getElementById("usage-territory").addEventListener("change", calculateMusicBudget);
    document.getElementById("usage-exclusivity").addEventListener("change", calculateMusicBudget);
    document.getElementById("with-publisher").addEventListener("change", calculateMusicBudget);
    document.getElementById("fremdproduktion").addEventListener("change", calculateMusicBudget);

    document.querySelectorAll(".usage-media").forEach(cb => cb.addEventListener("change", calculateMusicBudget));