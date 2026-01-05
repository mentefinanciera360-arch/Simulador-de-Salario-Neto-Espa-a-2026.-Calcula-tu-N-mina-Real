document.addEventListener("DOMContentLoaded", () => {
    const resultadoDiv = document.getElementById("resultado");

    const observer = new MutationObserver(() => {
        const texto = resultadoDiv.innerHTML;

        const bruto = parseFloat(texto.match(/Bruto anual: ([\d.]+)/)?.[1] || 0);
        const ss = parseFloat(texto.match(/Seguridad Social: ([\d.]+)/)?.[1] || 0);
        const irpf = parseFloat(texto.match(/IRPF aproximado: ([\d.]+)/)?.[1] || 0);
        const deducciones = parseFloat(texto.match(/Deducciones adicionales: ([\d.]+)/)?.[1] || 0);
        const neto = parseFloat(texto.match(/Neto anual aproximado: ([\d.]+)/)?.[1] || 0);

        if (bruto > 0) {
            let canvas = document.getElementById("graficoSalario");
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.id = "graficoSalario";
                resultadoDiv.insertAdjacentElement("afterend", canvas);
            }

            const ctx = canvas.getContext("2d");

            if (window.myChart) window.myChart.destroy();

            window.myChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Seguridad Social", "IRPF", "Deducciones", "Neto"],
                    datasets: [{
                        data: [ss, irpf, deducciones, neto],
                        backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56", "#4bc0c0"]
                    }]
                },
                options: {
                    plugins: {
                        legend: { position: "bottom" },
                        tooltip: { enabled: true }
                    }
                }
            });
        }
    });

    observer.observe(resultadoDiv, { childList: true });
});
