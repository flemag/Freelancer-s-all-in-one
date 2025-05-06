// public/js/tax-estimator.js

/**
 * Returns the HTML structure for the Tax Estimator tool.
 */
function getTaxEstimatorHTML() {
    return `
        <div id="tax-estimator-tool" class="tool-content">
            <h2>Estimateur d'Impôts Simplifié</h2>
            <p class="tool-description">
                Cet outil vous donne une estimation très simplifiée de vos charges et impôts basés sur votre chiffre d'affaires brut annuel estimé et un taux global.
                <strong>Il ne remplace PAS l'avis d'un expert-comptable et ne prend pas en compte toutes les spécificités fiscales.</strong>
            </p>
            <form id="taxForm">
                <div>
                    <label for="estimatedAnnualRevenue">Chiffre d'Affaires Annuel Brut estimé (€) :</label>
                    <input type="number" id="estimatedAnnualRevenue" value="40000" min="0" required>
                </div>
                <div>
                    <label for="globalTaxRate">Taux Global estimé de Charges & Impôts (% du CA) :</label>
                    <input type="number" id="globalTaxRate" value="25" step="0.1" min="0" max="100" required>
                    <small>
                        Ce taux est une **estimation globale** pour couvrir cotisations sociales, impôt sur le revenu (ou VLI), CFE, etc.
                        Il varie considérablement selon votre statut juridique (Micro-entreprise, SASU, etc.), votre type d'activité (vente, service, libéral) et votre situation fiscale personnelle.
                        <br>
                        *Exemples très approximatifs pour Micro-entreprise : env. 24-26% (service, VLI), env. 14-15% (vente, VLI), peut être plus élevé avec le régime classique IR.*
                    </small>
                </div>
                <button type="submit">Estimer Charges & Impôts</button>
            </form>
            <div id="taxResults" style="display:none;">
                <h3>Résultats de l'Estimation :</h3>
                <p>Chiffre d'Affaires Annuel Brut utilisé : <strong id="revenueUsedResult">-</strong> €</p>
                <p>Taux Global Appliqué : <strong id="rateAppliedResult">-</strong> %</p>
                <p>Montant Total Estimé des Charges & Impôts : <strong id="estimatedTotalCharges">-</strong> €</p>
                <p>Revenu Net Estimé (après ces charges) : <strong id="estimatedNetIncome">-</strong> €</p>
                <p><small>Cette estimation est très simplifiée. Consultez toujours un expert pour une analyse précise.</small></p>
            </div>
        </div>
    `;
}

/**
 * Attaches event listeners for the Tax Estimator form.
 */
function attachTaxEstimatorListeners() {
    const taxForm = document.getElementById('taxForm');
    if (taxForm) {
        taxForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload
            calculateTax();
        });
    } else {
        console.error("Tax form element not found!");
    }
}

/**
 * Performs the simplified tax calculation based on inputs.
 */
function calculateTax() {
    const estimatedAnnualRevenue = parseFloat(document.getElementById('estimatedAnnualRevenue').value);
    const globalTaxRate = parseFloat(document.getElementById('globalTaxRate').value);
    const taxResultsDiv = document.getElementById('taxResults');

    // --- Basic Validation ---
    if (isNaN(estimatedAnnualRevenue) || estimatedAnnualRevenue < 0) {
        alert("Veuillez saisir un Chiffre d'Affaires Annuel Brut valide.");
        taxResultsDiv.style.display = 'none';
        return;
    }
     if (isNaN(globalTaxRate) || globalTaxRate < 0 || globalTaxRate > 100) {
        alert("Veuillez saisir un Taux Global valide entre 0 et 100.");
        taxResultsDiv.style.display = 'none';
        return;
    }
    // --- End Validation ---


    const globalTaxRateDecimal = globalTaxRate / 100;

    const estimatedTotalCharges = estimatedAnnualRevenue * globalTaxRateDecimal;
    const estimatedNetIncome = estimatedAnnualRevenue - estimatedTotalCharges;

    // --- Display Results ---
    document.getElementById('revenueUsedResult').textContent = estimatedAnnualRevenue.toLocaleString('fr-FR'); // Format number
    document.getElementById('rateAppliedResult').textContent = globalTaxRate.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }); // Format rate
    document.getElementById('estimatedTotalCharges').textContent = estimatedTotalCharges.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('estimatedNetIncome').textContent = estimatedNetIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

    taxResultsDiv.style.display = 'block';
    // --- End Display Results ---
}
