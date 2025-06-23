let total = 0;
const goal = 2000;
const increment = 200;

const mlText = document.getElementById("ml");
const progressCircle = document.querySelector(".ring-progress");
const sound = document.getElementById("sound");

//Obter o raio dinamicamente e calcular o comprimento da borda
const radius = progressCircle.r.baseVal.value;
const circleLength = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = circleLength;

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

window.onload = () => {
  const salvo = localStorage.getItem("mlTotal");
  if (salvo) {
    total = parseInt(salvo, 10);
    updateDisplay();
  }

  document.getElementById("drinkBtn").addEventListener("click", beberAgua);
  
  document.getElementById("undoBtn").addEventListener("click", () => {
    if (total - increment >= 0) {
      total -= increment;
    } else {
      total = 0;
    }
    updateDisplay();
    localStorage.setItem("mlTotal", total);
  });
};
