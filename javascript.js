
const ordemCategorias = [
    "filho",
    "neto",
    "bisneto",
    "agregado",
    "fofoca"
];

function votar(categoria, candidato) {
    let votos = JSON.parse(localStorage.getItem("votos")) || {};

    if (!votos[categoria]) votos[categoria] = {};
    if (!votos[categoria][candidato]) votos[categoria][candidato] = 0;

    votos[categoria][candidato]++;

    localStorage.setItem("votos", JSON.stringify(votos));
    localStorage.setItem("ultimaCategoria", categoria);

    window.location.href = "votoRegistrado.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("somUrna");

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
            console.log("Autoplay bloqueado");
        });
    }
});


function continuarVotacao() {
    const ultima = localStorage.getItem("ultimaCategoria");
    const index = ordemCategorias.indexOf(ultima);

    if (index === ordemCategorias.length - 1) {
        window.location.href = "fim.html";
    } else {
        window.location.href = ordemCategorias[index + 1] + ".html";
    }
}


function carregarResultados() {
    const votos = JSON.parse(localStorage.getItem("votos")) || {};
    const container = document.getElementById("resultados");

    ordemCategorias.forEach(cat => {
        if (!votos[cat]) return;

        let total = 0;
        let vencedor = "";
        let maior = 0;

        for (const nome in votos[cat]) {
            total += votos[cat][nome];

            if (votos[cat][nome] > maior) {
                maior = votos[cat][nome];
                vencedor = nome;
            }
        }

        const bloco = document.createElement("div");
        bloco.innerHTML = `
            <h2>${cat.toUpperCase()}</h2>
            <p><strong>Vencedor:</strong> ${vencedor}</p>
            <p><strong>Votos do vencedor:</strong> ${maior}</p>
            <p><strong>Total de votos da categoria:</strong> ${total}</p>
            <hr>
        `;

        container.appendChild(bloco);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.getElementById("inicio");
    const sair = document.getElementById("sair");
    const resetar = document.getElementById("resetar");

    if (inicio) {
        inicio.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (sair) {
        sair.addEventListener("click", () => {
            const senha = prompt("Digite a senha para acessar os resultados:");

            if (senha === "1234") {
                window.location.href = "res.html";
            } else {
                alert("Senha incorreta.");
            }
        });
    }

    if (resetar) {
        resetar.addEventListener("click", () => {
            const confirmar = confirm(
                "Deseja realmente apagar todos os votos e iniciar nova votação?"
            );

            if (confirmar) {
                localStorage.removeItem("votos");
                localStorage.removeItem("ultimaCategoria");
                sessionStorage.removeItem("acessoResultados");

                window.location.href = "index.html";
            }
        });
    }
});


