class TicTacToe {
    constructor(selector) {
        this.parrentElement = document.querySelector(selector);
        this.PlayerList = ['x', 'o'];
        this.GameBoards = Array(9).fill('');
        this.currentPlayer = 0;

        this.init();

        console.log(selector, this.parrentElement);
    }

    init() {
        this.buildGameUI();
    }

    getPlayerLabel() {
        return this.PlayerList[this.currentPlayer];
    }

    buildCardPlayer(playerName, playerNumber) {
        return `<div class="box-player">
                    <p class="player-label ${playerName}">
                        ${playerName}
                    </p>
                    <p class="player-name">
                        Player ${playerNumber}
                    </p>
                    <p class="turn">Giliranmu</p>
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
        const btn = event.target;
        btn.innerText = this.getPlayerLabel();
        btn.disabled = true;
        btn.classList.add(btn.innerText);
        this.GameBoards[index] = btn.innerText;
        this.switchPlayer();
        this.checkWinner();
        this.checkDraw();
    }

    switchPlayer(currentPlayer = undefined) {
        if (currentPlayer != undefined) {
            this.currentPlayer = currentPlayer;
        } else {
            this.currentPlayer = this.currentPlayer == 1 ? 0 : 1;
        }

        const BoxPlayers = document.querySelectorAll('.box-player');

        BoxPlayers.forEach((box, i) => {
            if (this.currentPlayer === i) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });
    }

    gameReset() {
        console.log('reset game');
        this.GameBoards = Array(9).fill('');
        this.switchPlayer(0);

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
                const winningPlayerIndex = this.PlayerList.indexOf(winningPlayer) + 1; // Get the index of the winning player
    
                Swal.fire({
                    title: "Good Job",
                    text: `Selamat Player ${winningPlayerIndex} Telah Memenangkan Permainan!`,
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Good Job!!",
                    denyButtonText: "Main Lagi"
                }).then((result) => {
                    // Disable other buttons
                    for (const btn of this.gamePlayEl.children) {
                        btn.disabled = true;
                    }
                    if (result.isDenied) {
                        this.gameReset();
                        Swal.fire("Permainan telah dimulai kembali, Mari Bermain Lagi", "", "info");
                    }
                });
                return; // Exit the function after finding a winner
            }
        }
    }

    checkDraw() {
        // Check if all cells are filled and there is no winner
        if (this.GameBoards.every(cell => cell !== '')) {
            Swal.fire({
                title: "Permainan Berakhir Seri",
                text: "Tidak ada pemenang dalam permainan ini. Silakan mulai permainan baru!",
                icon: "info",
                confirmButtonText: "OK"
            }).then(() => {
                this.gameReset();
            });
        }
    }
}