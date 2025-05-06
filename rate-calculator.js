// public/js/rate-calculator.js

function getRateCalculatorHTML() {
    return `
        <div id="rate-calculator-tool" class="tool-content">
            <h2>Calculateur de Taux Horaire</h2>
            <p class="tool-description">Estimez le taux horaire brut que vous devriez facturer pour atteindre vos objectifs de revenus en tenant compte de vos jours non facturables et de vos dépenses professionnelles.</p>
            <form id="rateForm">
                <div>
                    <label for="desiredAnnualIncome">Revenu annuel net souhaité (€) :</label>
                    <input type="number" id="desiredAnnualIncome" value="40000" min="0" required>
                </div>
                <div>
                    <label for="vacationDays">Jours de congé par an (vacances, maladie) :</label>
                    <input type="number" id="vacationDays" value="25" min="0" max="365" required>
                </div>
                <div>
                    <label for="publicHolidays">Jours fériés chômés par an :</label>
                    <input type="number" id="publicHolidays" value="10" min="0" max="30" required>
                </div>
                <div>
                    <label for="trainingDays">Jours de formation / non-facturés :</label>
                    <input type="number" id="trainingDays" value="5" min="0" max="100" required>
                </div>
                <div>
                    <label for="billableHoursPerDay">Heures facturables par jour de travail :</label>
                    <input type="number" id="billableHoursPerDay" value="6" step="0.5" min="1" max="16" required>
                </div>
                <div>
                    <label for="annualExpenses">Dépenses professionnelles annuelles (€) (loyer bureau, logiciels, comptable, etc.) :</label>
                    <input type="number" id="annualExpenses" value="5000" min="0" required>
                </div>
                <div>
                    <label for="taxAndSocialSecurityRate">Taux global de charges et impôts sur le revenu brut (ex: 45 pour 45%) :</label>
                    <input type="number" id="taxAndSocialSecurityRate" value="45" step="1" min="0" max="99" required>
                    <small>Ce taux est une estimation pour couvrir les cotisations sociales, l'impôt sur le revenu, la CFE, etc. Il varie fortement selon votre statut (micro-entreprise, SASU, etc.) et votre situation.</small>
                </div>
                <button type="submit">Calculer mon Taux Horaire</button>
            </form>
            <div id="rateResults" style="display:none;">
                <h3>Résultats de votre Simulation :</h3>
                <p>Jours travaillés facturables par an : <strong id="workableDaysResult">-</strong> jours</p>
                <p>Total d'heures facturables par an : <strong id="totalBillableHoursResult">-</strong> heures</p>
                <p>Revenu brut annuel à facturer (avant charges et impôts) : <strong id="grossAnnualTargetResult">-</strong> €</p>
                <p>Votre taux horaire brut suggéré : <strong id="hourlyRateResult">-</strong> € / heure</p>
                <p><small>Note : Ce calcul est une estimation. Consultez un expert-comptable pour une analyse personnalisée.</small></p>
            </div>
        </div>
    `;
}

function attachRateCalculatorListeners() {
    const rateForm = document.getElementById('rateForm');
    if (rateForm) {
        rateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            calculateHourlyRate();
        });
    }
}

function calculateHourlyRate() {
    const desiredAnnualIncome = parseFloat(document.getElementById('desiredAnnualIncome').value);
    const vacationDays = parseFloat(document.getElementById('vacationDays').value);
    const publicHolidays = parseFloat(document.getElementById('publicHolidays').value);
    const trainingDays = parseFloat(document.getElementById('trainingDays').value); // Nouveaux jours non facturés
    const billableHoursPerDay = parseFloat(document.getElementById('billableHoursPerDay').value);
    const annualExpenses = parseFloat(document.getElementById('annualExpenses').value);
    const taxAndSocialSecurityRateDecimal = parseFloat(document.getElementById('taxAndSocialSecurityRate').value) / 100;

    // Validation simple
    if (isNaN(desiredAnnualIncome) || isNaN(vacationDays) || isNaN(publicHolidays) || isNaN(trainingDays) ||
        isNaN(billableHoursPerDay) || isNaN(annualExpenses) || isNaN(taxAndSocialSecurityRateDecimal)) {
        alert("Veuillez vérifier que tous les champs sont remplis avec des nombres valides.");
        return;
    }
    if (billableHoursPerDay <= 0) {
        alert("Le nombre d'heures facturables par jour doit être positif.");
        return;
    }
    if (taxAndSocialSecurityRateDecimal < 0 || taxAndSocialSecurityRateDecimal >= 1) {
         alert("Le pourcentage pour impôts et charges doit être compris entre 0 et 99.");
        return;
    }

    const totalDaysOff = vacationDays + publicHolidays + trainingDays;
    // On considère une base de jours ouvrés (ex: 5 jours/semaine * 52 semaines = 260)
    // ou 365 si on compte tous les jours et que les congés/fériés sont bien déduits.
    // Pour la simplicité et pour prendre en compte que les freelances ne comptent pas toujours en jours ouvrés standards:
    const workDaysPerYear = Math.max(0, 365 - totalDaysOff);

    if (workDaysPerYear <= 0) {
        alert("Le nombre de jours travaillables par an est nul ou négatif. Vérifiez vos jours non facturés.");
        document.getElementById('rateResults').style.display = 'none';
        return;
    }

    const totalBillableHoursPerYear = workDaysPerYear * billableHoursPerDay;

    if (totalBillableHoursPerYear <= 0) {
        alert("Le nombre total d'heures facturables par an est nul ou négatif.");
        document.getElementById('rateResults').style.display = 'none';
        return;
    }

    const totalNetIncomeAndExpenses = desiredAnnualIncome + annualExpenses;
    // Revenu Brut Annuel = (Net Souhaité + Dépenses) / (1 - Taux_Charges_Impots)
    const grossAnnualTarget = totalNetIncomeAndExpenses / (1 - taxAndSocialSecurityRateDecimal);
    const hourlyRate = grossAnnualTarget / totalBillableHoursPerYear;

    document.getElementById('workableDaysResult').textContent = workDaysPerYear.toFixed(0);
    document.getElementById('totalBillableHoursResult').textContent = totalBillableHoursPerYear.toFixed(0);
    document.getElementById('grossAnnualTargetResult').textContent = grossAnnualTarget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    document.getElementById('hourlyRateResult').textContent = hourlyRate.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

    document.getElementById('rateResults').style.display = 'block';
}
