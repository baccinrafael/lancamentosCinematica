let tempoComecouTimer = 0;
let timerUp = false;
let comecarAnimacao;
let chaoY = 900;

let escala = 55;
let g = 9.80665;
let canvasWidth = 2200;
let canvasHeight = 1100;

let dElipse = 35;
let massa = 7.26;

let posX;
let posY;

function alcanceHorizontal(velocidade, angle, altura) {
  let angulo = radians(angle);
  let parenteses = velocidade * sin(angulo) + sqrt(pow(velocidade, 2) * pow(sin(angulo), 2) + (2 * g * altura));
  let divisao = (velocidade * cos(angulo)) / g
  let x = parenteses * divisao;
  return x * escala;
}

function velocidade(alcance, angle) {
  let angulo = radians(angle);
  let x = sqrt((alcance * g) / sin((2 * angulo)));
  return x;
}

function tempoDeVoo(velocidade, angle, altura) {
  let angulo = radians(angle);
  let x = (velocidade * sin(angulo) + sqrt(pow((velocidade * sin(angulo)), 2) + 2 * g * altura)) / g
  return x;
}

function posicaoY(posInicial, velocidade, tempo, angle, altura) {
  let angulo = radians(angle);
  let x = altura + ((velocidade * sin(angulo)) * tempo) - ((g * pow(tempo, 2)) / 2);
  return x * escala;
}

function posicaoX(velocidade, tempo, angle, altura) {
  let angulo = radians(angle);
  let x = velocidade * cos(angulo) * tempo;
  return x * escala;
}
let angulo = 180;
let velocidadeSaida = 40;

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  inputAngulo = createInput('45', 'number');
  inputAngulo.position(width - 400, 100);

  inputVelocidade = createInput('14.5', 'number')
  inputVelocidade.position(width - 400, 140);

  inputAlturaInicial = createInput('2.15', 'number')
  inputAlturaInicial.position(width - 400, 180);

  comecarAnimacao = createButton("Iniciar Animação");
  comecarAnimacao.position(20, canvasHeight - 50);
  comecarAnimacao.mousePressed(comecarTimer);

  somJogar = loadSound('assets/simple-whoosh.mp3');

  rastro = []
}

function draw() {
  // let velocidadeCalculada = velocidade();
  let tempoPassado;
  let angulo = 1;
  let velocidadeSaida = 1;
  let alturaInicial = 1;
  angulo = float(inputAngulo.value());
  if (angulo > 180) {
    angulo = 180;
  } else if (angulo < 0) {
    angulo = 0;
  }
  velocidadeSaida = float(inputVelocidade.value());
  alturaInicial = float(inputAlturaInicial.value());

  let marca = (alcanceHorizontal(velocidadeSaida, angulo, alturaInicial) / escala).toFixed(2);
  let tempoLancamento = (tempoDeVoo(velocidadeSaida, angulo, alturaInicial)).toFixed(2);
  let maiorAltura = (alturaInicial + pow((velocidadeSaida * sin(radians(angulo))), 2) / (2 * g)).toFixed(2);

  fill('black');
  background(177, 217, 255)
  textSize(20);
  text("Ângulo (máximo é 180, mínimo é 0):", width - 400, 80);
  text("Velocidade de saída:", width - 400, 125);
  text("Altura inicial:", width - 400, 165);
  noFill();
  circle(100, chaoY - dElipse / 2 - alturaInicial * escala, dElipse)
  fill('black');

  text("Marca: " + marca + "m", width - 400, 300);
  text("Maior altura: " + maiorAltura + "m", width - 400, 320);
  text("Tempo de Voo: " + tempoLancamento + "s", width - 400, 340);
  if (timerUp) {
    tempoPassado = (millis() - tempoComecouTimer) / 1000;
    let tempoTotal = tempoDeVoo(velocidadeSaida, angulo, alturaInicial);
    if (tempoPassado >= tempoTotal) {
      tempoPassado = tempoTotal;
      timerUp = false;
    }
    posY = chaoY - (posicaoY(0, velocidadeSaida, tempoPassado, angulo, alturaInicial)) - dElipse / 2;
    posX = (posicaoX(velocidadeSaida, tempoPassado, angulo)) + 100;

    rastro.push({ x: posX, y: posY });

  }
  fill('black');
  for (let ponto of rastro) {
    circle(ponto.x, ponto.y, 5);
  }
  circle(posX, posY, dElipse);
  fill('green');
  square(0, chaoY, width);

}

function comecarTimer() {
  tempoComecouTimer = millis();
  timerUp = true;
  somJogar.play();
  rastro = []
}
