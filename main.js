// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const toolDisplayArea = document.getElementById('tool-display-area');
    if(toolDisplayArea) { // S'assurer que l'élément existe
        toolDisplayArea.style.display = 'none';
    }

    // Mettre à jour l'année dans le footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Gérer la navigation active (optionnel, pour le style)
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            if (!this.href.endsWith('#')) { // Ne pas marquer comme actifs les liens de section simple
                 // this.classList.add('active'); // Logique d'activation à affiner si outils dans la même page
            }
        });
    });
});

let currentTool = null;

function showTool(toolName) {
    const toolDisplayArea = document.getElementById('tool-display-area');
    if (!toolDisplayArea) {
        console.error("L'élément tool-display-area est introuvable.");
        return;
    }

    let toolHTML = '';
    let attachListenersFunction = null;

    // Masquer les résultats précédents si un autre outil était affiché
    const previousResults = toolDisplayArea.querySelector('#rateResults, #taxResults'); // Ajoutez d'autres ID de résultats ici
    if (previousResults) {
        previousResults.style.display = 'none';
    }

    if (toolName === currentTool) { // Si on clique sur le même outil, on le cache et on réinitialise
        toolDisplayArea.style.display = 'none';
        toolDisplayArea.innerHTML = '';
        currentTool = null;
        return;
    }

    currentTool = toolName; // Met à jour l'outil courant

    switch (toolName) {
        case 'rate-calculator':
            toolHTML = getRateCalculatorHTML(); // Fonction de rate-calculator.js
            attachListenersFunction = attachRateCalculatorListeners;
            break;
        case 'tax-estimator':
            toolHTML = `<div class="tool-content"><h2>Estimateur d'Impôts</h2><p>Cet outil est en cours de développement. Revenez bientôt !</p></div>`;
            // attachListenersFunction = attachTaxEstimatorListeners; // Quand il sera prêt
            break;
        case 'project-budget':
            toolHTML = `<div class="tool-content"><h2>Outil de Budgeting pour Projets</h2><p>Cet outil est en cours de développement. Revenez bientôt !</p></div>`;
            // attachListenersFunction = attachProjectBudgetListeners; // Quand il sera prêt
            break;
        default:
            console.warn("Outil non reconnu:", toolName);
            toolDisplayArea.style.display = 'none';
            return;
    }

    toolDisplayArea.innerHTML = toolHTML;
    toolDisplayArea.style.display = 'block';
    toolDisplayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });


    if (typeof attachListenersFunction === 'function') {
        attachListenersFunction();
    }
}
