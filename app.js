const cfg = {
    title: "IA Diagnóstica",
    desc: "Simulador educacional de análise de sintomas",
    accent: "#4f9fff",
    symptoms: [
        "Febre",
        "Dor de cabeça",
        "Tosse",
        "Catarro",
        "Dor abdominal",
        "Vômito",
        "Falta de ar",
        "Dor no peito",
        "Cansaço"
    ],
    rules: [
        {
            id: 1,
            must: ["Febre", "Dor de cabeça", "Cansaço"],
            label: "Infecção viral leve",
            urgency: "Baixa",
            recs: ["Descansar", "Hidratar", "Procurar médico se piorar"]
        },
        {
            id: 2,
            must: ["Tosse", "Febre", "Catarro"],
            label: "Infecção respiratória",
            urgency: "Média",
            recs: ["Beber água", "Evitar esforço", "Consultar médico se persistir"]
        },
        {
            id: 3,
            must: ["Dor abdominal", "Vômito"],
            label: "Gastroenterite",
            urgency: "Média",
            recs: ["Repor líquidos", "Evitar alimentos pesados"]
        },
        {
            id: 4,
            must: ["Falta de ar", "Dor no peito"],
            label: "Quadro urgente",
            urgency: "Alta",
            recs: ["Buscar atendimento imediato"]
        }
    ]
};

document.getElementById("projectTitle").textContent = cfg.title;
document.getElementById("projectDesc").textContent = cfg.desc;

/* Renderiza sintomas */
function renderSymptoms() {
    const box = document.getElementById("symptomList");
    box.innerHTML = "";
    cfg.symptoms.forEach(s => {
        box.innerHTML += `
            <label>
                <input type="checkbox" name="symptom" value="${s}">
                ${s}
            </label>
        `;
    });
}
renderSymptoms();

/* Leitura dos sintomas marcados */
function getSelectedSymptoms() {
    return [...document.querySelectorAll('input[name="symptom"]:checked')]
        .map(i => i.value);
}

/* Aplicação das regras */
function applyRules(selected, rules) {
    return rules
        .map(r => ({
            ...r,
            score: r.must.every(m => selected.includes(m)) ? r.must.length : 0
        }))
        .filter(r => r.score > 0);
}

/* Estilo de urgência */
function urgencyStyle(u) {
    if (u === "Alta") return { bg: "var(--danger)", color: "#fff" };
    if (u === "Média") return { bg: "#f59e0b", color: "#000" };
    return { bg: "#16a34a", color: "#fff" };
}

/* Lógica do formulário */
document.getElementById("symptomForm").addEventListener("submit", e => {
    e.preventDefault();

    const symptoms = getSelectedSymptoms();
    const duration = Number(document.getElementById("duration").value);
    const intensity = Number(document.getElementById("intensity").value);
    const extra = document.getElementById("extra").value.trim();

    const matches = applyRules(symptoms, cfg.rules);

    let final = null;

    if (matches.length > 0) {
        matches.sort((a, b) => b.score - a.score);
        final = matches[0];
    }

    const result = document.getElementById("result");
    const summary = document.getElementById("matchSummary");
    const badge = document.getElementById("urgencyBadge");
    const recs = document.getElementById("recommendations");
    const rulesApplied = document.getElementById("rulesApplied");

    if (!final) {
        summary.textContent = "Nenhuma combinação padrão encontrada.";
        badge.textContent = "Observação";
        badge.style.background = "#94a3b8";
        badge.style.color = "#000";

        recs.innerHTML = `
            <li>Hidratar</li>
            <li>Monitorar sintomas</li>
            <li>Procurar atendimento se houver piora</li>
        `;

        rulesApplied.textContent = "Nenhuma regra aplicada.";
    } else {
        summary.textContent = `Possível indicação: ${final.label}`;
        
        const style = urgencyStyle(final.urgency);
        badge.textContent = final.urgency;
        badge.style.background = style.bg;
        badge.style.color = style.color;

        recs.innerHTML = final.recs.map(r => `<li>${r}</li>`).join("");

        rulesApplied.textContent = `
Regra aplicada: ${final.label}
Sintomas necessários: ${final.must.join(", ")}
        `;
    }

    result.classList.remove("hidden");
});

/* Botão limpar */
document.getElementById("clearBtn").addEventListener("click", () => {
    document.querySelectorAll('input[name="symptom"]').forEach(i => (i.checked = false));
    document.getElementById("duration").value = 1;
    document.getElementById("intensity").value = 2;
    document.getElementById("extra").value = "";
    document.getElementById("result").classList.add("hidden");
});
