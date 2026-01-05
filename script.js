function calcularSalario() {
  const bruto = parseFloat(document.getElementById("bruto").value);
  const contrato = document.getElementById("contrato").value;
  const pagas = parseInt(document.getElementById("pagas").value);
  const hijos = parseInt(document.getElementById("hijos").value);
  const situacion = document.getElementById("situacion").value;
  const deducciones = parseFloat(document.getElementById("deducciones").value);
  const comunidad = document.getElementById("comunidad").value;

  if (isNaN(bruto) || bruto <= 0 || hijos < 0 || deducciones < 0) {
    alert("Introduce valores válidos");
    return;
  }

  // Cotización Seguridad Social
  let ssContingencias = 0.047;
  let desempleo = contrato === "indefinido" ? 0.0155 : 0.016;
  let formacion = 0.001;
  const totalSS = bruto * (ssContingencias + desempleo + formacion);

  // Base IRPF
  const baseIRPF = bruto - totalSS - deducciones;

  // Ajustes por comunidad autónoma
  const ajustesComunidad = {
    andalucia: 0.0, aragon: 0.005, asturias: 0.008, baleares: 0.012,
    canarias: -0.005, cantabria: 0.004, castillalamancha: 0.002, castillaleon: 0.001,
    catalunya: 0.015, valencia: 0.008, extremadura: -0.002, galicia: 0.003,
    madrid: -0.01, murcia: 0.001, navarra: 0.012, rioja: 0.005, paisvasco: 0.014,
    ceuta: -0.01, melilla: -0.008
  };
  let ajuste = ajustesComunidad[comunidad] || 0;

  // Tramos IRPF base
  const tramosBase = [
    { limite: 12450, tipo: 0.19 },
    { limite: 20200, tipo: 0.24 },
    { limite: 35200, tipo: 0.30 },
    { limite: 60000, tipo: 0.37 },
    { limite: Infinity, tipo: 0.45 }
  ];

  let restante = baseIRPF;
  let irpfCantidad = 0;
  let limiteAnterior = 0;
  for (let t of tramosBase) {
    const tramo = Math.min(restante, t.limite - limiteAnterior);
    if (tramo > 0) {
      irpfCantidad += tramo * (t.tipo + ajuste);
      restante -= tramo;
      limiteAnterior = t.limite;
    } else break;
  }

  // Reducción por hijos
  let reduccionHijos = Math.min(hijos * 2000, baseIRPF);
  irpfCantidad = Math.max(irpfCantidad - reduccionHijos * 0.19, 0);

  // Reducción por situación personal
  if (situacion === "casado") irpfCantidad *= 0.95;
  else if (situacion === "pareja") irpfCantidad *= 0.97;

  const netoAnual = bruto - totalSS - irpfCantidad - deducciones;
  const netoMensual = netoAnual / pagas;

  // Mostrar resultados en HTML
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.style.display = "block";
  resultadoDiv.innerHTML = `
    <strong>Resultados:</strong><br><br>
    💼 Bruto anual: ${bruto.toFixed(2)} €<br>
    🏛 Seguridad Social: ${totalSS.toFixed(2)} €<br>
    📊 IRPF aproximado: ${irpfCantidad.toFixed(2)} €<br>
    💰 Deducciones adicionales: ${deducciones.toFixed(2)} €<br><br>
    <strong>💰 Neto anual aproximado: ${netoAnual.toFixed(2)} €</strong><br>
    💵 Neto mensual (${pagas} pagas): ${netoMensual.toFixed(2)} €
  `;

  // Gráfico con Chart.js
  const ctx = document.getElementById('grafico').getContext('2d');

  // Borrar gráfico previo si existe
  if (window.miGrafico) window.miGrafico.destroy();

  window.miGrafico = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Seguridad Social', 'IRPF', 'Neto'],
      datasets: [{
        label: 'Distribución del Salario',
        data: [totalSS, irpfCantidad, netoAnual],
        backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}
