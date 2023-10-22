const maxNum = document.querySelector('.max-num');
const output = document.querySelector('.output');
const input = document.querySelector('.input');
const form = document.querySelector('.form');
const restartButton = document.querySelector('.restart-button');
const attemptsNum = document.querySelector('.attempts-num');
const hint = document.querySelector('.hint');

let max = parseInt(maxNum.textContent);
let randomNum;
let attempts = 0;

attemptsNum.textContent = attempts;
randomNumber(100)

maxNum.addEventListener('input', () => {
	max = parseInt(maxNum.textContent);
	randomNumber(max);
})

function randomNumber(maxNumber) {
	randomNum = Math.ceil(Math.random() * maxNumber)
}

function handleGuess(num) {
	const answer = document.createElement('li');
	if (num > 0 && num < max) {
		if (num < randomNum) {
			answer.textContent = `Больше ${num}`;
		}
		if (num > randomNum) {
			answer.textContent = `Меньше ${num}`;
		}
		if (num === randomNum) {
			answer.textContent = `Вы угадали - ${num}`;
		}
		output.appendChild(answer);
	} else {
		alert(`Число должно быть в диапазоне от 1 до ${max}`)
	}
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	handleGuess(parseInt(input.value));
	input.value = '';
	countAttempts();
})

restartButton.addEventListener('click', () => {
	restart()
})

function restart() {
	output.innerHTML = '';
	input.value = '';
	randomNumber(max);
	attempts = 0;
	attemptsNum.textContent = attempts;
}

function countAttempts() {
	attempts++
	attemptsNum.textContent = attempts;
	if(attempts === 3) {
		hint.textContent = randomNum%2===0?'Число четное':'Число нечетное';
	}
}