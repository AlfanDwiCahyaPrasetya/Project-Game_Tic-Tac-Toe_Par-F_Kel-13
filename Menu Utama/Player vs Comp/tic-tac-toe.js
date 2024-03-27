class TicTacToe {
    constructor(selector) {
        this.parrentElement = document.querySelector(selector);
        this.PlayerList = ['x', 'o'];
        this.GameBoards = Array(9).fill('');
        this.currentPlayer = 0;
        this.isGameOver = false;

        this.init();

        console.log(selector, this.parrentElement);
    }

    init() {
        this.buildGameUI();
        this.gameReset();
    }

    getPlayerLabel() {
        return this.PlayerList[this.currentPlayer];
    }

    buildCardPlayer(playerName, playerNumber) {
        let playerNameText;
        if (playerNumber === 1) {
            playerNameText = 'Kamu';
        } else {
            playerNameText = 'Komputer';
        }
        return `<div class="box-player">
                    <p class="player-label ${playerName}">
                        ${playerName}
                    </p>
                    <p class="player-name">
                        ${playerNameText}
                    </p>
                </div>`;
    }
    
    

    buildGameUI() {
        //game info
        const gameInfoEl = document.createElement('div');
        gameInfoEl.className = 'game-info';

        let playerCards = '';
        this.PlayerList.forEach((player, i) => {
            playerCards += this.buildCardPlayer(player, i + 1);
        });

        gameInfoEl.innerHTML = playerCards;

        //button reset
        const gameControl = document.createElement('div');
        gameControl.className = 'game-control';

        const btnReset = document.createElement('button');
        btnReset.className = 'btn btn-reset';
        btnReset.innerText = 'Reset Game';
        btnReset.addEventListener('click', () => this.gameReset());

        gameControl.appendChild(btnReset);
        gameInfoEl.appendChild(gameControl);

        //gameplay
        const gamePlayEl = document.createElement('div');
        gamePlayEl.className = 'game-play';

        for (let i = 0; i < 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'btn-tic-tac-tow';
            btn.addEventListener('click', (e) => this.onCellclick(e, i));
            gamePlayEl.appendChild(btn);
        }

        // append to parent element
        this.parrentElement.append(gameInfoEl, gamePlayEl);
        this.gamePlayEl = gamePlayEl;
    }

    onCellclick(event, index) {
        if (this.isGameOver) return;
        
        const btn = event.target;
        if (btn.innerText !== '') return;
    
        btn.innerText = 'X'; // Setiap langkah pemain selalu menggunakan X
        btn.disabled = true;
        btn.classList.add('x');
        this.GameBoards[index] = 'x'; // Simpan langkah pemain di papan permainan
        this.checkWinner();
        if (!this.isGameOver) {
            this.switchPlayer();
            this.computerPlay();
            this.checkWinner();
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer == 1 ? 0 : 1;
    }

    computerPlay() {
        let emptyCells = [];
        for (let i = 0; i < this.GameBoards.length; i++) {
            if (this.GameBoards[i] === '') {
                emptyCells.push(i);
            }
        }
    
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellIndex = emptyCells[randomIndex];
            const btn = this.gamePlayEl.children[cellIndex];
            btn.innerText = 'O'; // Setiap langkah komputer selalu menggunakan O
            btn.disabled = true;
            btn.classList.add('o');
            this.GameBoards[cellIndex] = 'o'; // Simpan langkah komputer di papan permainan
        }
    }

    gameReset() {
        console.log('reset game');
        this.GameBoards = Array(9).fill('');
        this.isGameOver = false;
        for (const btn of this.gamePlayEl.children) {
            btn.innerHTML = '';
            btn.classList.remove(...this.PlayerList);
            btn.disabled = false;
        }
    }

    checkWinner() {
        const winConditions = [
            [0, 1, 2], // horizontal
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6], // vertical
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8], // diagonal left to bottom right
            [2, 4, 6], // diagonal right to bottom left
        ];

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];

            if (
                this.GameBoards[a] !== '' &&
                this.GameBoards[a] === this.GameBoards[b] &&
                this.GameBoards[a] === this.GameBoards[c]
            ) {
                const winningPlayer = this.GameBoards[a]; // Get the winning player
                let message;
                let title = 'Good Job';

                if (winningPlayer === 'x') {
                    message = 'Kamu memenangkan permainan!';
                } else {
                    message = 'Komputer memenangkan permainan.';
                    title = 'Sayang sekali';
                }

                this.isGameOver = true;

                Swal.fire({
                    title: title,
                    text: message,
                    showDenyButton: true,
                    denyButtonText: 'Main Lagi'
                }).then((result) => {
                    if (result.isDenied) {
                        this.gameReset();
                        Swal.fire('Permainan telah dimulai kembali, Mari Bermain Lagi', '', 'info');
                    }
                });
                break; // Exit the loop after finding a winner
            }
        }

        // Check for a tie
        if (!this.GameBoards.includes('') && !this.isGameOver) {
            this.isGameOver = true;
            Swal.fire({
                title: 'Permainan Seri!',
                text: 'Tidak ada yang menang, coba lagi!',
                showDenyButton: true,
                denyButtonText: 'Main Lagi'
            }).then((result) => {
                if (result.isDenied) {
                    this.gameReset();
                    Swal.fire('Permainan telah dimulai kembali, Mari Bermain Lagi', '', 'info');
                }
            });
        }
    }
}
