const boardContainer = document.querySelector('.container');
const cells = boardContainer.querySelectorAll('.cell');
const cellsArray = Array.from(cells);
const winner = document.querySelector('.winner')
const restartButton = document.querySelector('.restart')

let currentTurn = 1;
const playerOne = 'X';
const playerTwo = 'O';

let board = [];

cellsArray.forEach(cell => {
	cell.addEventListener('click', checkCell)
})

function checkCell(e) {
	const cell = e.target;
	if (currentTurn % 2 !== 0) {
		cell.value = playerOne;
		board[cell.id] = playerOne;
	} else {
		cell.value = playerTwo;
		board[cell.id] = playerTwo;
	}
	currentTurn++;
	checkResult();
	cell.removeEventListener('click', checkCell);
}

function checkResult() {
	const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (board[a] && board[a] === board[b] && board[b] === board[c]) {
			win(a, b, c);
			return;
		}
		if (!board.includes(undefined) && board.length === 9) {
			winner.textContent = 'Ничья'
		}
	}
}

function win(a, b, c) {
	document.getElementById(a).classList.add('win');
	document.getElementById(b).classList.add('win');
	document.getElementById(c).classList.add('win');
	cellsArray.forEach(cell => {
		cell.removeEventListener('click', checkCell)
	})
	winner.textContent = (currentTurn % 2 === 0) ? 'Победил Игрок 1' : 'Победил игрок 2';
}

function restart() {
	board = [];
	cells.forEach(cell => {
		cell.value = '';
		cell.classList.remove('win');
		cell.addEventListener('click', checkCell);
	});
	currentTurn = 1;
	winner.textContent = '';
}

restartButton.addEventListener('click', restart)

