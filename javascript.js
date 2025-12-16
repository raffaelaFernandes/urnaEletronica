
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

    container.innerHTML = "";

    ordemCategorias.forEach(cat => {
        if (!votos[cat]) return;

        let total = 0;
        let maior = 0;
        let vencedores = [];

        for (const nome in votos[cat]) {
            const qtd = votos[cat][nome];
            total += qtd;

            if (qtd > maior) {
                maior = qtd;
                vencedores = [nome];
            } else if (qtd === maior) {
                vencedores.push(nome);
            }
        }

        const resultado =
            vencedores.length > 1
                ? `Empate entre: ${vencedores.join(", ")}`
                : vencedores[0];

        const bloco = document.createElement("div");
        bloco.innerHTML = `
            <h2>${cat.toUpperCase()}</h2>
            <p><strong>Resultado:</strong> ${resultado}</p>
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
            window.location.href = "filho.html";
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

                window.location.href = "filho.html";
            }
        });
    }
});


