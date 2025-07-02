let total = 0;
let intervaloMinutos = null;
let intervaloId = null;
const goal = 2000;
const increment = 200;

// === Seleção dos elementos principais
const mlText = document.getElementById("ml");
const progressCircle = document.querySelector(".ring-progress");
const sound = document.getElementById("sound");

// Obter o raio dinamicamente e calcular o comprimento da borda
const radius = progressCircle.r.baseVal.value;
const circleLength = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circleLength;

// === Funções utilitárias
function updateDisplay() {
  // 💡 MELHORIA 2: Proteção contra valor negativo
  if (total < 0) total = 0;

  mlText.innerText = total;
  const percentage = total / goal;
  const offset = circleLength * (1 - percentage);
  progressCircle.style.strokeDashoffset = offset;
}

//Função separada para salvar no localStorage
function salvarNoStorage() {
  localStorage.setItem("mlTotal", total);
}

function beberAgua() {
  if (total + increment <= goal) {
    total += increment;
    updateDisplay();
    salvarNoStorage();

    new Notification("Hidratada! 💧", {
      body: `Você bebeu +${increment}mL!`,
    });

    sound.play();

    //Efeito visual no botão
    const btn = document.getElementById("drinkBtn");
    btn.classList.add("clicked");
    setTimeout(() => btn.classList.remove("clicked"), 150);
  }
}

function configurarNavegacao() {
  document.getElementById("clockBtn").addEventListener("click", () => {
    document.getElementById("mainScreen").style.display = "none";
    document.getElementById("configScreen").style.display = "block";
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    document.getElementById("configScreen").style.display = "none";
    document.getElementById("mainScreen").style.display = "block";
  });
}

function desfazer() {
  total = Math.max(total - increment, 0);
  updateDisplay();
  salvarNoStorage();
}

window.onload = () => {
  // Restaurar consumo de água salvo antes de fechar o app
  const salvoMl = localStorage.getItem("mlTotal");
  if (salvoMl) {
    total = parseInt(salvoMl, 10);
    updateDisplay();
  }

  // Restaurar intevalo salvo antes de fechar o app
  const salvoIntervalo = localStorage.getItem("intervaloMinutos");
  if (intervaloMinutos) {
    intervaloMinutos = parseInt(salvoIntervalo);
    intervaloId = setInterval(() => {
      new Notification("Hora de beber água! 💧", {
        body: `Lembrete a cada ${intervaloMinutos} minutos.`,
      });
    }, intervaloMinutos * 60 * 1000);
  }

  // Eventos da tela principal
  document.getElementById("drinkBtn").addEventListener("click", beberAgua);
  document.getElementById("undoBtn").addEventListener("click", desfazer);

  configurarNavegacao();

  // Selecionar intervalo de notificação
  const intervalButtons = document.querySelectorAll(".intervalBtn");
  intervalButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      intervalButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      intervaloMinutos = parseInt(btn.dataset.minutes);
    });
  });

  // Confirmar o intervalo
  document.getElementById("confirmBtn").addEventListener("click", () => {
    if(!intervaloMinutos) {
      alert("Escolha um intervalo antes de confirmar.");
      return;
    }

    localStorage.setItem("intervaloMinutos", intervaloMinutos);

    if(intervaloId) clearInterval(intervaloId);

    intervaloId = setInterval(() => {
      new Notification("Hora de beber água! 💧", {
        body: `Lembrete a cada ${intervaloMinutos} minutos.`,
      });
    }, intervaloMinutos * 60 * 1000);

    alert(`Notificações ativadas a cada ${intervaloMinutos} minutos!`);
  });
};
