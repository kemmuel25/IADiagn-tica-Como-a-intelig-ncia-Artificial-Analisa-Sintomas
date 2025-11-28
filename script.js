// --- LISTA DE SINTOMAS ---
const symptoms = [
    "Febre", "Dor de cabeça", "Cansaço", "Tosse", "Catarro",
    "Dor abdominal", "Vômito", "Falta de ar", "Dor no peito",
    "Tontura", "Mal-estar", "Calafrios", "Náusea", "Diarreia",
    "Nariz entupido", "Dor nas articulações"
];

// --- REGRAS DE DIAGNÓSTICO ---
const rules = [
    {
        id: 1,
        must: ["Febre", "Dor de cabeça", "Cansaço"],
        label: "Infecção viral leve",
        urgency: "Baixa",
        recs: ["Descansar", "Hidratar", "Evitar esforço físico", "Sono adequado"]
    },
    {
        id: 2,
        must: ["Tosse", "Febre", "Catarro"],
        label: "Infecção respiratória",
        urgency: "Média",
        recs: ["Beber água", "Umidificar o ambiente", "Evitar poeira", "Consultar médico se persistir"]
    },
    {
        id: 3,
        must: ["Dor abdominal", "Vômito"],
        label: "Gastroenterite",
        urgency: "Média",
        recs: ["Repor líquidos", "Evitar alimentos pesados", "Soro de reidratação", "Repouso"]
    },
    {
        id: 4,
        must: ["Falta de ar", "Dor no peito"],
        label: "Quadro urgente",
        urgency: "Alta",
        recs: ["Buscar atendimento médico imediato"]
    },
    {
        id: 5,
        must: ["Febre", "Calafrios", "Dor no corpo"],
        label: "Estado gripal",
        urgency: "Baixa",
        recs: ["Hidratar", "Banho morno", "Analgesico leve (se necessário)"]
    },
    {
        id: 6,
        must: ["Diarreia", "Dor abdominal", "Náusea"],
        label: "Infecção intestinal",
        urgency: "Média",
        recs: ["Soro de reidratação", "Evitar alimentos gordurosos", "Higienizar bem os alimentos"]
    },
    {
        id: 7,
        must: ["Tontura", "Mal-estar", "Cansaço"],
        label: "Queda de pressão",
        urgency: "Média",
        recs: ["Beber água", "Sentar ou deitar imediatamente", "Evitar levantar rápido"]
    }
];

// --- GERAR CHECKBOXES ---
const symptomList = document.getElementById("symptomList");
symptoms.forEach(sym => {
    const div = document.createElement("label");
    div.innerHTML = `
        <input type="checkbox" value="${sym}">
        <span>${sym}</span>
    `;
    symptomList.appendChild(div);
});

// --- FUNÇÃO DE ANÁLISE ---
function analisar() {
    const selected = [...document.querySelectorAll("input:checked")].map(i => i.value);
    let bestMatch = null;
    let bestScore = 0;

    rules.forEach(rule => {
        const matches = rule.must.filter(s => selected.includes(s)).length;
        const score = matches / rule.must.length;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = rule;
        }
    });

    const result = document.getElementById("result");
    const diagnosis = document.getElementById("diagnosis");
    const probability = document.getElementById("probability");
    const urgency = document.getElementById("urgency");
    const recsList = document.getElementById("recsList");

    if (!bestMatch || bestScore < 0.3) {
        result.classList.remove("hidden");
        diagnosis.innerHTML = "⚠️ Nenhum diagnóstico provável encontrado.";
        probability.innerHTML = "";
        urgency.innerHTML = "";
        recsList.innerHTML = "";
        return;
    }

    result.classList.remove("hidden");

    diagnosis.innerHTML = `🔍 Possível condição: <strong>${bestMatch.label}</strong>`;
    probability.innerHTML = `🎯 Probabilidade estimada: <strong>${Math.round(bestScore * 100)}%</strong>`;
    urgency.innerHTML = `🚨 Urgência: <strong>${bestMatch.urgency}</strong>`;

    recsList.innerHTML = "";
    bestMatch.recs.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        recsList.appendChild(li);
    });
}

// --- BOTÃO DE ANÁLISE ---
document.getElementById("analyzeBtn").onclick = analisar;

// --- THEME SWITCH ---
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
